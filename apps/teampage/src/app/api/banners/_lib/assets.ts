import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { ASSET_PREFIX } from '@/entities/banners/config';

/**
 * 배너 이미지 키 규칙.
 *
 * 문서에는 CDN 상대 경로(`assets/banners/...`)를 저장하고, S3 키는 그 앞에
 * `public/` 을 붙인 것이다. 이 변환은 여기서만 한다 — 문서에 `public/` 이 섞여
 * 들어가면 앱이 CDN 에서 한 단계 깊은 경로를 찾게 된다.
 */
export const toAssetObjectKey = (cdnKey: string) => `public/${cdnKey}`;

/** 내용 해시가 키다. 같은 이미지를 다시 올려도 오브젝트가 늘지 않는다. */
export const buildAssetKey = (bytes: Uint8Array, extension: string) => {
  const digest = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  return `${ASSET_PREFIX}${digest}.${extension}`;
};

/**
 * 실제 픽셀 크기.
 *
 * 클라이언트가 보낸 값을 믿지 않는다 — 비율 검증이 통째로 무력해지고, 앱은
 * 문서의 width/height 로 레이아웃을 잡으므로 틀리면 화면이 밀린다.
 */
export const readImageSize = async (bytes: Uint8Array) => {
  const metadata = await sharp(Buffer.from(bytes)).metadata();
  if (!metadata.width || !metadata.height) return null;
  return { width: metadata.width, height: metadata.height };
};
