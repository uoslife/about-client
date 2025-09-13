export function CardASkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl max-w-screen-lg w-full overflow-hidden ${className || ''}`}
    >
      {/* 썸네일 */}
      <div className="h-[324px] w-full bg-[#e1e1e1] relative animate-shimmer before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#e1e1e1] before:via-[#f5f5f5] before:to-[#e1e1e1] before:bg-[length:200%_100%] before:animate-shimmer rounded-t-3xl" />
      {/* 태그 */}
      <div className="absolute top-5 left-5 h-7 w-20 rounded-full bg-[#ebebeb] opacity-80 animate-shimmer" />
      {/* 내용 */}
      <div className="bg-grey-50 box-border flex flex-col rounded-b-3xl h-[240px] p-8 items-start justify-between w-full">
        <div className="flex flex-col gap-2 w-full">
          <div className="h-8 w-3/4 bg-[#e1e1e1] rounded-md animate-shimmer" />{' '}
          {/* title */}
          <div className="h-6 w-full bg-[#ececec] rounded-md animate-shimmer" />{' '}
          {/* summary */}
        </div>
        <div className="flex gap-3 items-center justify-start relative mt-8">
          <div className="h-5 w-16 bg-[#e1e1e1] rounded-md animate-shimmer" />
          <div className="h-3 w-px bg-grey-200" />
          <div className="h-5 w-32 bg-[#ececec] rounded-md animate-shimmer" />
          <div className="h-5 w-24 bg-[#e1e1e1] rounded-md animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function CardBSkeleton({ className }: CardBSkeletonProps) {
  return (
    <div
      className={`bg-grey-50 flex gap-10 items-start justify-start p-6 rounded-[24px] w-full ${className || ''}`}
    >
      {/* 왼쪽 콘텐츠 */}
      <div className="flex flex-col gap-6 flex-grow">
        <div className="flex flex-col gap-3 w-full">
          {/* 태그 */}
          <div className="h-7 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-full" />

          {/* 제목과 요약 */}
          <div className="flex flex-col gap-2 w-full">
            {/* 제목 */}
            <div className="h-8 w-4/5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md" />
            {/* 요약 */}
            <div className="h-6 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md" />
          </div>
        </div>

        {/* 하단 메타 정보 */}
        <div className="flex gap-2 items-center">
          <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md" />
          <div className="h-2.5 w-px bg-grey-200" />
          <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md" />
          <div className="h-2.5 w-px bg-grey-200" />
          <div className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-md" />
        </div>
      </div>

      {/* 오른쪽 썸네일 */}
      <div className="h-36 w-60 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-[12px] flex-shrink-0" />
    </div>
  );
}

export function CardASkeletonList({ className }: { className?: string }) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-6 max-w-pc w-full ${className || ''}`}
    >
      <CardASkeleton />
      <CardASkeleton />
    </div>
  );
}
export function CardBSkeletonList({ className }: { className?: string }) {
  return (
    <div
      className={`grid grid-cols-1 gap-y-6 max-w-pc w-full ${className || ''}`}
    >
      <CardBSkeleton />
      <CardBSkeleton />
    </div>
  );
}
