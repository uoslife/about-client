import type { CreateArticleRequest } from '@uoslife/api';
import {
  catchError,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
// import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export type CreateArticleInput = Omit<CreateArticleRequest, 'thumbnailUrl'> & {
  thumbnailFile?: File | null;
};

const base64ToFile = (dataUrl: string): Observable<File> => {
  try {
    // data:image/png;base64,iVBORw0KGgo... 형태에서 base64 부분만 추출
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];

    if (!mime) {
      throw new Error('Invalid data URL format');
    }

    const bstr = atob(arr[1]); // base64 디코딩
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    // 바이너리 데이터를 Uint8Array로 변환
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    // File 객체 생성
    return new Observable((observer) => {
      observer.next(new File([u8arr], uuidv4(), { type: mime }));
      observer.complete();
    });
  } catch (error) {
    console.error('Failed to convert base64 to file:', error);
    throw new Error(`Base64 to File conversion failed: ${error}`);
  }
};

const extractImageString = (content: string): string[] => {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const matches = Array.from(content.matchAll(imageRegex));

  return matches
    .map((match) => match[2])
    .filter((url) => url.startsWith('data:image'));
};

const uploadSingleImageToServer = (
  imageFile: File,
  accessToken: string,
  spaceId: number,
): Observable<string> => {
  return new Observable((observer) => {
    // const arrayBuffer = await imageFile.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);

    // sharp(buffer)
    //   .resize({ width: 720 })
    //   .toFormat('webp', { quality: 80 })
    //   .toFile('output.webp');
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('spaceId', spaceId.toString());

    fetch('https://apis.uoslife.team/articles/uploadImage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Upload failed: ${response.status} ${response.statusText}`,
          );
        }
        return response.json();
      })
      .then((result) => {
        if (result.url) {
          observer.next(result.url);
          observer.complete();
        } else {
          observer.error('No URL in response');
        }
      })
      .catch((error) => {
        console.error(`Image upload failed for ${imageFile}:`, error);
        observer.error(error);
      });
  });
};

// 썸네일 업로드 함수 (Observable 반환)
const uploadThumbnailToServer = (
  imageFile: File,
  accessToken: string,
  spaceId: number,
): Observable<string> => {
  return new Observable((observer) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('spaceId', spaceId.toString());

    fetch('https://apis.uoslife.team/articles/uploadThumbnailImage', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Thumbnail upload failed: ${response.status} ${response.statusText}`,
          );
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        if (result.url) {
          observer.next(result.url);
          observer.complete();
        } else {
          observer.error('No thumbnail URL in response');
        }
      })
      .catch((error) => {
        console.error('Thumbnail upload failed:', error);
        observer.error(error);
      });
  });
};

const replaceAllImageUrls = (
  content: string,
  fileMappings: Array<{ oldString: string; newUrl: string }>,
): string => {
  let updatedContent = content;

  fileMappings.forEach(({ oldString, newUrl }) => {
    const imagePattern = `![](${oldString.trim()})`;
    const replacement = `![](${newUrl})`;
    updatedContent = updatedContent.replaceAll(imagePattern, replacement);
  });

  return updatedContent;
};

// 이미지가 없을 때 썸네일만 처리하는 헬퍼 함수
const processOnlyThumbnail = (
  articleData: CreateArticleInput,
  accessToken: string,
): Observable<CreateArticleRequest> => {
  const { thumbnailFile, ...restData } = articleData;
  if (!thumbnailFile) {
    return of({
      ...restData,
      thumbnailUrl: undefined,
    });
  }

  return uploadThumbnailToServer(
    thumbnailFile,
    accessToken,
    articleData.spaceId,
  ).pipe(
    map((thumbnailUrl) => ({
      ...restData,
      thumbnailUrl,
    })),
  );
};

export const processArticle = (
  data: CreateArticleInput,
  accessToken: string,
) => {
  return from([data]).pipe(
    switchMap((articleData) => {
      const imageStrings = extractImageString(articleData.content);

      if (imageStrings.length === 0) {
        return processOnlyThumbnail(articleData, accessToken);
      }

      const imageFiles$ = imageStrings.map((url) => {
        return base64ToFile(url).pipe(
          map((file) => ({
            oldString: url,
            file: file,
          })),
        );
      });

      // 모든 이미지를 병렬로 업로드
      const imageUploads$ = forkJoin(imageFiles$).pipe(
        switchMap((files) => {
          const uploadObservables = files.map((file) =>
            uploadSingleImageToServer(
              file.file,
              accessToken,
              data.spaceId,
            ).pipe(
              map((serverImageUrl) => ({
                oldString: file.oldString,
                newUrl: serverImageUrl,
              })),
            ),
          );

          return forkJoin(uploadObservables);
        }),
      );

      // 썸네일 업로드
      const thumbnailUpload$ = articleData.thumbnailFile
        ? uploadThumbnailToServer(
            articleData.thumbnailFile,
            accessToken,
            data.spaceId,
          ).pipe(
            catchError((error) => {
              console.error('Thumbnail upload failed:', error);
              return of(undefined);
            }),
          )
        : of(undefined);

      // 이미지 업로드들과 썸네일 업로드를 병렬로 실행
      return forkJoin({
        fileMappings: imageUploads$,
        thumbnailUrl: thumbnailUpload$,
      }).pipe(
        map(
          ({ fileMappings, thumbnailUrl }) =>
            ({
              spaceId: articleData.spaceId,
              title: articleData.title,
              content: replaceAllImageUrls(articleData.content, fileMappings),
              category: articleData.category,
              summary: articleData.summary,
              thumbnailUrl,
            }) as CreateArticleRequest,
        ),
      );
    }),
  );
};
