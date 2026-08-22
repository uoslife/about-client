import { NextResponse, type NextRequest } from 'next/server';
import { authorize, toErrorResponse } from '@/app/api/_lib/authorize';
import { putBinary, readJson } from '@/app/api/_lib/s3';
import { privateDocSchema, type BannerAsset } from '@/entities/banners';
import {
  ASPECT_RATIO_TOLERANCE,
  ASSET_CACHE_CONTROL,
  ASSET_MIME_EXTENSIONS,
  PRIVATE_KEY,
} from '@/entities/banners/config';
import { buildAssetKey, readImageSize, toAssetObjectKey } from '../_lib/assets';

export const dynamic = 'force-dynamic';

const badRequest = (message: string) => NextResponse.json({ message }, { status: 400 });

/**
 * 배너 이미지 업로드.
 *
 * 오브젝트는 문서와 별개로 먼저 올라간다 — 발행 전에 미리보기가 되어야 하고,
 * 키가 내용 해시라 문서에서 참조되지 않는 오브젝트가 남아도 해롭지 않다.
 * 크기·비율 제한은 구좌 정의(`placements[*]`)에서 읽는다.
 */
export async function POST(request: NextRequest) {
  try {
    await authorize();

    const form = await request.formData().catch(() => null);
    const file = form?.get('file');
    const placementId = form?.get('placement');

    if (!(file instanceof File) || typeof placementId !== 'string') {
      return badRequest('이미지와 구좌를 함께 보내주세요.');
    }

    const extension = ASSET_MIME_EXTENSIONS[file.type];
    if (!extension) {
      return badRequest(`허용되지 않는 이미지 형식입니다. (${Object.keys(ASSET_MIME_EXTENSIONS).join(', ')})`);
    }

    const stored = await readJson<unknown>(PRIVATE_KEY);
    const doc = stored.data ? privateDocSchema.safeParse(stored.data) : null;
    const placement = doc?.success ? doc.data.placements[placementId] : undefined;
    if (!placement) {
      return badRequest('없는 구좌입니다.');
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (bytes.byteLength > placement.maxBytes) {
      return badRequest(
        `이미지가 너무 큽니다. (${Math.round(bytes.byteLength / 1024)}KB / 최대 ${Math.round(placement.maxBytes / 1024)}KB)`,
      );
    }

    const size = await readImageSize(bytes).catch(() => null);
    if (!size) {
      return badRequest('이미지를 읽을 수 없습니다.');
    }

    const expected = placement.recommendedSize.width / placement.recommendedSize.height;
    const actual = size.width / size.height;
    if (Math.abs(actual - expected) / expected > ASPECT_RATIO_TOLERANCE) {
      return badRequest(
        `이미지 비율이 권장(${placement.recommendedSize.width}×${placement.recommendedSize.height})과 다릅니다. (${size.width}×${size.height})`,
      );
    }

    const key = buildAssetKey(bytes, extension);
    await putBinary(toAssetObjectKey(key), bytes, file.type, ASSET_CACHE_CONTROL);

    const body: BannerAsset = {
      key,
      width: size.width,
      height: size.height,
      bytes: bytes.byteLength,
      originalName: file.name,
    };

    return NextResponse.json(body);
  } catch (error) {
    return toErrorResponse(error);
  }
}
