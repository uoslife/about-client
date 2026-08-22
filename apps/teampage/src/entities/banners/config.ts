/**
 * banners 저장소의 키 규칙.
 *
 * 버킷·환경은 flags 와 같은 것을 쓴다(`FLAGS_BUCKET` / `FLAGS_ENV`). 배너 때문에
 * 새 버킷을 파면 IAM 정책과 CDN 오리진을 하나 더 관리해야 한다.
 * S3 접근 자체는 `app/api/_lib/s3.ts` 에 있다 — 서버 전용이라 이 entity 로
 * 재export 하면 클라이언트 번들에 AWS SDK 가 딸려온다.
 */

const BANNERS_ENV = process.env.FLAGS_ENV ?? 'alpha';

/** 백오피스만 읽는 단일 진실. 발행 이력·운영 필드가 전부 여기 있다. */
export const PRIVATE_KEY = `private/banners/v1/${BANNERS_ENV}.json`;

/** CDN 이 서빙하는 투영. 발행할 때마다 private 에서 새로 만든다. */
export const PUBLIC_KEY = `public/banners/v1/${BANNERS_ENV}.json`;

/**
 * 이미지의 CDN 상대 경로 접두사. 문서에는 이 형태로 저장한다.
 * 실제 S3 키는 `public/` 을 앞에 붙인 것 — 변환은 `app/api/banners/_lib/assets.ts` 에서만 한다.
 */
export const ASSET_PREFIX = 'assets/banners/';

/** 문서 TTL. 앱이 배너 교체를 1분 안에 받아본다. */
export const DOC_CACHE_CONTROL = 'max-age=60';

/** 에셋은 내용 해시가 키라서 같은 키의 내용이 바뀌지 않는다. */
export const ASSET_CACHE_CONTROL = 'max-age=31536000, immutable';

/** 업로드 허용 타입과 확장자. 키 확장자를 클라이언트 파일명이 아니라 여기서 정한다. */
export const ASSET_MIME_EXTENSIONS = {
  'image/webp': 'webp',
  'image/png': 'png',
  'image/jpeg': 'jpg',
} as const satisfies Record<string, string>;

/** 권장 비율 대비 허용 오차. 리사이즈 반올림으로 1px 씩 어긋나는 것까지 막지 않는다. */
export const ASPECT_RATIO_TOLERANCE = 0.02;

/**
 * 에셋을 서빙하는 CDN 오리진. 문서에는 상대 경로만 저장되므로 화면이 붙인다.
 *
 * 환경변수로 열지 않는다 — 매니페스트와 같은 배포를 쓰므로 채널별로 갈릴 값이
 * 아니고, 비워 두면 썸네일이 조용히 사라진다. 앱 쪽(client `entities/banner/config.ts`)
 * 도 같은 값을 하드코딩한다.
 */
export const ASSET_BASE_URL = 'https://flags.uoslife.com';

export const bannerImageUrl = (key: string) => (key ? `${ASSET_BASE_URL}/${key}` : '');
