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
import { ContentEditor } from '@/features/editor';
import { TabButton } from '@/shared/component/TabButton';
import { Text } from '@/shared/component/Text';

const CATEGORIES = ['tech', 'career', 'moments'];
const CATEGORY_MAP: { [key: string]: string } = {
  tech: 'UOSLIFE Tech',
  career: 'UOSLIFE Career',
  moments: 'UOSLIFE Moments',
};

const TITLE_MAX_LENGTH = 56;
const SUMMARY_MAX_LENGTH = 88;

export default function WritePage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || undefined;
  const isEditMode = searchParams.get('edit') === 'true';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const isCareer = from === 'career';
  const isMoments = from === 'moments';

  const isDisabledSubmitButton = useMemo(() => {
    const isEmpty = (value: string) => value?.trim() === '';

    if (isEmpty(title) || isEmpty(content)) return true;

    if (isMoments) {
      return thumbnailFile === null;
    }

    if (isCareer) {
      return isEmpty(category) || isEmpty(summary);
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isEditMode) {
      alert('게시글이 수정되었습니다.');
    } else {
      alert('게시글이 등록되었습니다.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto py-12 px-4 flex flex-col gap-12"
    >
      <div className="flex flex-col gap-12">
        <div>
          <Text variant="title-36-b">
            {isEditMode ? '게시글 수정' : '게시글 작성'}
          </Text>
          {from && CATEGORY_MAP[from] && (
            <Text variant="body-18-m" color="grey-500" className="mt-1">
              {`'${CATEGORY_MAP[from]}' 카테고리에 글을 작성하고 있어요.`}
            </Text>
          )}
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
            <div className="flex gap-2">
              {CATEGORIES.map((cat) => (
                <TabButton
                  key={cat}
                  type="button"
                  color={category === cat ? 'dark' : 'light'}
                  onClick={() => setCategory(cat)}
                  clicked={false}
                >
                  {cat}
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
