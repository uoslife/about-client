'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from '@/entities/auth/useAuth';
import { ContentEditor } from '@/features/editor';
import { TabButton } from '@/shared/component/TabButton';
import { Text } from '@/shared/component/Text';
import {
  CategoryEnum,
  CategoryKorean,
  type CategoryType,
  SpaceIdEnum,
  type SpaceType,
} from '@/shared/const/category';
import { type CreateArticleInput, processArticle } from './processArticle';
import { useAnalytics } from '@/entities/analytics/useAnalytics';
import { match } from 'ts-pattern';
import { TabName } from '@/entities/analytics/AmplitudePropertyType';
import { getSearchArticlesQueryKey, useCreateArticle } from '@uoslife/api';
import { useQueryClient } from '@tanstack/react-query';
import { twMerge } from 'tailwind-merge';

const CATEGORY_MAP: { [key: string]: string } = {
  TECH: 'UOSLIFE Tech',
  CAREER: 'UOSLIFE CAREER',
  MOMENTS: 'UOSLIFE Moments',
};

const getTabName = (space: SpaceType) => {
  return match<SpaceType, TabName>(space)
    .with('TECH', () => 'tech')
    .with('CAREER', () => 'career')
    .with('MOMENTS', () => 'moments')
    .exhaustive();
};

const TITLE_MAX_LENGTH = 56;
const SUMMARY_MAX_LENGTH = 88;

export default function WritePage() {
  const { trackEvent } = useAnalytics();
  const session = useAuth();
  const searchParams = useSearchParams();
  const from = (searchParams.get('from') as SpaceType) || 'TECH';
  const [space, setSpace] = useState<SpaceType>(from);
  const isEditMode = searchParams.get('edit') === 'true';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CategoryType | null>();
  const [summary, setSummary] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isCareer = space === 'CAREER';
  const isMoments = space === 'MOMENTS';

  const categories = useMemo(() => {
    switch (space) {
      case 'TECH':
        return [
          CategoryEnum.DEVELOP,
          CategoryEnum.DESIGN,
          CategoryEnum.MARKETING,
          CategoryEnum.PM,
        ];
      case 'CAREER':
        return [CategoryEnum.EMPLOYMENT, CategoryEnum.EXTERNAL_ACTIVITY];
      default:
        return [
          CategoryEnum.DEVELOP,
          CategoryEnum.DESIGN,
          CategoryEnum.MARKETING,
          CategoryEnum.PM,
        ];
    }
  }, [space]);

  useEffect(() => {
    if (isEditMode) {
      const savedPost = sessionStorage.getItem('editPost');
      if (savedPost) {
        const post = JSON.parse(savedPost);
        const processedContent = post.content?.replace(/\\n/g, '\n');
        setTitle(post.title || '');
        setContent(processedContent || '');
        setCategory(post.category || '');
        setSummary(post.summary || '');
        if (post.thumbnailUrl) {
          setThumbnailPreview(post.thumbnailUrl);
        }
        sessionStorage.removeItem('editPost');
      }
    }
  }, [isEditMode]);

  const isDisabledSubmitButton = useMemo(() => {
    const isEmpty = (value?: string | null) => value?.trim() === '';
    const isOverMaxLength = (value: string) =>
      value?.length > SUMMARY_MAX_LENGTH;

    if (isEmpty(title) || isEmpty(content)) return true;

    if (isMoments) {
      return thumbnailFile === null;
    }

    if (isCareer) {
      return isEmpty(category) || isEmpty(summary) || isOverMaxLength(summary);
    }

    return isEmpty(category) || isEmpty(summary) || thumbnailFile === null;
  }, [title, summary, content, category, thumbnailFile, isCareer, isMoments]);

  const handleFileSelect = (file: File) => {
    if (file?.type.startsWith('image/')) {
      setThumbnailFile(file);
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    } else {
      alert('이미지 파일만 업로드 가능합니다.');
    }
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const { mutate: createArticleMutate } = useCreateArticle();
  const queryClient = useQueryClient();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!session.session || !category) return;

    const accessToken = session.session.accessToken;
    console.log({ title, content, category, summary, thumbnailFile });
    const data: CreateArticleInput = {
      spaceId: SpaceIdEnum[space],
      title,
      content,
      category,
      summary,
      thumbnailFile,
    };
    processArticle(data, accessToken).subscribe({
      next: async (data) => {
        createArticleMutate(
          { data },
          {
            onSuccess: (res) => {
              queryClient.invalidateQueries({
                queryKey: getSearchArticlesQueryKey(),
              });
              trackEvent('POST_ARTICLE', {
                tab_name: getTabName(space),
              });
              alert('게시글 등록이 완료되었어요.');
              window.location.href = `/${space.toLowerCase()}/${res.id}`;
            },
            onError: (error) => {
              throw new Error(
                `Thumbnail upload failed: ${error.status} ${error.message}`,
              );
            },
          },
        );
      },
      error: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto py-12 px-4 flex flex-col gap-12"
    >
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <Text variant="title-36-b">
            {isEditMode ? '게시글 수정' : '게시글 작성'}
          </Text>
          <div className="flex flex-row items-center gap-4">
            {space && CATEGORY_MAP[space] && (
              <Text variant="body-18-m" color="grey-500">
                {`'${CATEGORY_MAP[space]}' 공간에 글을 작성하고 있어요.`}
              </Text>
            )}
            <div className="group relative">
              <div className="flex items-center gap-1.5 py-2 w-32 cursor-pointer">
                <Image
                  src="/svg/switch.svg"
                  alt="switch"
                  width={24}
                  height={24}
                />
              </div>
              <div className="z-10 hidden group-hover:block absolute top-full bg-white box-border flex-col gap-2 items-start justify-start p-[12px] rounded-2xl left-1/2 -translate-x-1/2 w-full px-2 shadow-[0px_0px_12px_0px_rgba(18,18,18,0.1)]">
                <button
                  type="button"
                  className="w-full group/career"
                  onClick={() => setSpace('CAREER')}
                >
                  <div className="box-border content-stretch flex flex-row gap-2.5 h-11 items-center justify-center px-4 py-1.5 relative rounded-[40px] w-full hover:bg-gray-100">
                    <Text
                      variant="body-18-m"
                      className={twMerge(
                        isCareer && 'text-primary-brand',
                        'group-hover/career:text-primary-ui',
                      )}
                    >
                      Career
                    </Text>
                  </div>
                </button>
                <button
                  type="button"
                  className="w-full group/career"
                  onClick={() => setSpace('MOMENTS')}
                >
                  <div className="box-border content-stretch flex flex-row gap-2.5 h-11 items-center justify-center px-4 py-1.5 relative rounded-[40px] w-full hover:bg-gray-100">
                    <Text
                      variant="body-18-m"
                      className={twMerge(
                        isMoments && 'text-primary-brand',
                        'group-hover/career:text-primary-ui',
                      )}
                    >
                      Moments
                    </Text>
                  </div>
                </button>
                <button
                  type="button"
                  className="w-full group/career"
                  onClick={() => setSpace('TECH')}
                >
                  <div className="box-border content-stretch flex flex-row gap-2.5 h-11 items-center justify-center px-4 py-1.5 relative rounded-[40px] w-full hover:bg-gray-100">
                    <Text
                      variant="body-18-m"
                      className={twMerge(
                        !(isCareer || isMoments) && 'text-primary-brand',
                        'group-hover/career:text-primary-ui',
                      )}
                    >
                      Tech
                    </Text>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full bg-transparent text-3xl font-bold outline-none border-b-2 border-grey-200 focus:border-grey-900 transition-colors py-2"
          required
          maxLength={TITLE_MAX_LENGTH}
        />
      </div>

      <div className="flex flex-col gap-4">
        <Text variant="title-24-b">내용</Text>
        <ContentEditor initialValue={content} onChange={setContent} />
      </div>

      {!isMoments && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <Text variant="title-24-b">카테고리</Text>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <TabButton
                  key={cat}
                  type="button"
                  color={category === cat ? 'dark' : 'light'}
                  onClick={() => setCategory(cat)}
                  clicked={false}
                >
                  {CategoryKorean[cat]}
                </TabButton>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Text variant="title-24-b">요약</Text>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={`게시글을 요약해주세요. (최대 ${SUMMARY_MAX_LENGTH}자)`}
              maxLength={SUMMARY_MAX_LENGTH}
              className="w-full h-32 p-4 bg-grey-50 rounded-lg outline-none focus:ring-2 focus:ring-grey-900 transition-all resize-none disabled:bg-grey-100 disabled:text-grey-400"
              required={!isMoments}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <Text variant="title-24-b">
          썸네일 이미지{' '}
          {isCareer && <span className="text-grey-500">(선택)</span>}
        </Text>
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full h-64 border-2 border-dashed border-grey-200 rounded-lg flex items-center justify-center relative transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : ''
          }`}
        >
          {thumbnailPreview ? (
            <>
              <Image
                src={thumbnailPreview}
                alt="Thumbnail preview"
                fill
                className="object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setThumbnailFile(null);
                  setThumbnailPreview(null);
                }}
                className="absolute top-2 right-2 bg-grey-600/70 text-white w-12 h-12 rounded-full text-lg"
              >
                X
              </button>
            </>
          ) : (
            <label className="cursor-pointer text-grey-500 hover:text-grey-900 transition-colors flex flex-col items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                required={!isCareer}
              />
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Upload Image</title>
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 8h.01" />
                <path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" />
                <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" />
                <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l2 2" />
              </svg>
              <span>+ 이미지 업로드 또는 드래그</span>
            </label>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          type="submit"
          disabled={isDisabledSubmitButton}
          className="px-8 py-3 bg-grey-900 text-white rounded-full font-bold hover:bg-grey-700 transition-colors disabled:bg-grey-300 disabled:cursor-not-allowed"
        >
          게시글 등록
        </button>
      </div>
    </form>
  );
}
