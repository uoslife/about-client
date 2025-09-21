import { Text } from './Text';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

export const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-[400px] w-full h-[95vh]">
      <div className="flex flex-col gap-4 items-center">
        <div className="w-16 h-16 bg-grey-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-grey-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-2 items-center text-center">
          <Text variant="title-24-b" color="grey-900">
            문제가 발생했습니다
          </Text>
          <Text variant="body-16-m" color="grey-500">
            페이지를 불러오는 중 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해 주세요.
          </Text>
        </div>
      </div>

      {resetError && (
        <button
          onClick={resetError}
          className="bg-grey-900 text-white px-6 py-3 rounded-[12px] hover:bg-grey-800 transition-colors duration-200"
        >
          <Text variant="body-16-m" color="white">
            다시 시도
          </Text>
        </button>
      )}

      {process.env.NODE_ENV === 'development' && error && (
        <details className="w-full max-w-2xl">
          <summary className="cursor-pointer text-grey-500 text-sm mb-2">
            개발자 정보 (개발 모드에서만 표시)
          </summary>
          <pre className="bg-grey-50 p-4 rounded-lg text-xs overflow-auto text-grey-700">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
    </div>
  );
};
