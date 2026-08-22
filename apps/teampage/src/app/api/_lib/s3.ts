import {
  GetObjectCommand,
  ListObjectVersionsCommand,
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';

/**
 * S3 접근 헬퍼. flags·banners 등 route handler 들이 공유한다.
 *
 * 자격증명은 아무 것도 설정하지 않는다.
 * SDK 기본 자격증명 체인이 환경변수를 알아서 집는다 — 현재는 Vault에서
 * external-secrets가 주입한 `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`
 * (IAM 사용자 uoslife-about-client-{prod,dev}).
 * 나중에 IRSA로 옮겨도 이 파일은 바뀌지 않는다.
 *
 * 키 규칙과 Cache-Control 은 여기서 정하지 않는다. 어느 경로에 무슨 TTL 로
 * 올릴지는 도메인 지식이라 각 entity 의 config 가 소유하고, 호출부가 넘긴다.
 */

const REGION = 'ap-northeast-2';

/** flags·banners 가 같은 버킷을 쓴다. */
export const S3_BUCKET = process.env.FLAGS_BUCKET || 'uoslife-v2026--flags';

let client: S3Client | null = null;

export const getS3 = () => {
  if (!client) client = new S3Client({ region: REGION });
  return client;
};

export class PreconditionFailedError extends Error {}

/**
 * "아직 오브젝트가 없음" 판정.
 *
 * 403 도 포함하는 이유: 이 사용자는 오브젝트 단위 GetObject 만 갖고 ListBucket 은
 * 없다. 그런 주체가 존재하지 않는 키를 읽으면 S3 는 404 가 아니라 403 을 준다 —
 * 키의 존재 여부 자체를 숨기기 위해서다. 404 만 보면 최초 실행(빈 버킷)에서 항상
 * 500 이 난다.
 *
 * 권한이 정말 없는 경우와 구분되지 않는 한계가 있지만, 그 경우는 쓰기에서 명확히
 * 실패하므로 실사용에서 혼동될 여지는 작다.
 */
const isNoSuchKey = (error: unknown) => {
  const name = (error as { name?: string; Code?: string })?.name ?? (error as { Code?: string })?.Code;
  const status = (error as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode;
  return (
    name === 'NoSuchKey' ||
    name === 'NotFound' ||
    name === 'AccessDenied' ||
    name === 'Forbidden' ||
    status === 404 ||
    status === 403
  );
};

const isPreconditionFailed = (error: unknown) => {
  const name = (error as { name?: string; Code?: string })?.name ?? (error as { Code?: string })?.Code;
  const status = (error as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode;
  return name === 'PreconditionFailed' || status === 412;
};

const JSON_CONTENT_TYPE = 'application/json';

export interface ReadResult<T> {
  data: T | null;
  etag: string | null;
  lastModified: string | null;
}

export const readJson = async <T>(key: string, versionId?: string): Promise<ReadResult<T>> => {
  try {
    const response = await getS3().send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key, VersionId: versionId }));
    const body = await response.Body?.transformToString();
    return {
      data: body ? (JSON.parse(body) as T) : null,
      etag: response.ETag ?? null,
      lastModified: response.LastModified ? response.LastModified.toISOString() : null,
    };
  } catch (error) {
    if (isNoSuchKey(error)) return { data: null, etag: null, lastModified: null };
    throw error;
  }
};

/**
 * 조건부 쓰기.
 * - etag가 있으면 `IfMatch`  : 내가 읽은 버전이 그대로일 때만 덮어쓴다.
 * - etag가 없으면 `IfNoneMatch: '*'` : 아직 오브젝트가 없을 때만 생성한다.
 *
 * 412(PreconditionFailed)면 `PreconditionFailedError`를 던진다 → 호출부에서 409로 변환.
 */
export const writeJsonConditional = async (
  key: string,
  value: unknown,
  etag: string | null,
  cacheControl: string,
): Promise<string | null> => {
  const input: PutObjectCommandInput = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: JSON.stringify(value, null, 2),
    ContentType: JSON_CONTENT_TYPE,
    CacheControl: cacheControl,
    ...(etag ? { IfMatch: etag } : { IfNoneMatch: '*' }),
  };

  try {
    const response = await getS3().send(new PutObjectCommand(input));
    return response.ETag ?? null;
  } catch (error) {
    if (isPreconditionFailed(error)) {
      throw new PreconditionFailedError('다른 사람이 먼저 저장했습니다.');
    }
    throw error;
  }
};

/** 롤백 시에는 이미 조건 검사를 마친 뒤이므로 조건 없이 쓴다. */
export const writeJson = async (key: string, body: string, cacheControl: string) => {
  const response = await getS3().send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: JSON_CONTENT_TYPE,
      CacheControl: cacheControl,
    }),
  );
  return response.ETag ?? null;
};

/** 이미지 등 바이너리. 콘텐츠 주소 키(내용 해시)라 조건부 쓰기가 필요 없다. */
export const putBinary = async (key: string, body: Uint8Array, contentType: string, cacheControl: string) => {
  const response = await getS3().send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: cacheControl,
    }),
  );
  return response.ETag ?? null;
};

export const listVersions = async (key: string) => {
  const response = await getS3().send(
    new ListObjectVersionsCommand({ Bucket: S3_BUCKET, Prefix: key, MaxKeys: 50 }),
  );

  return (response.Versions ?? [])
    .filter((version) => version.Key === key)
    .map((version) => ({
      versionId: version.VersionId ?? '',
      lastModified: version.LastModified ? version.LastModified.toISOString() : null,
      isLatest: Boolean(version.IsLatest),
    }))
    .sort((a, b) => (b.lastModified ?? '').localeCompare(a.lastModified ?? ''));
};

/** 원본 텍스트. 다운로드와 요약 생성에 함께 쓴다. */
export const readRaw = async (key: string, versionId?: string): Promise<string | null> => {
  try {
    const response = await getS3().send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key, VersionId: versionId }));
    return (await response.Body?.transformToString()) ?? null;
  } catch (error) {
    if (isNoSuchKey(error)) return null;
    throw error;
  }
};
