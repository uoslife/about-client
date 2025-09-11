import { Text } from '@shared/component/Text';

export function Section05() {
  return (
    <div className="flex flex-col items-center justify-center gap-28 py-28">
      <div className="z-10 flex flex-col items-center text-center gap-8">
        <div className="flex flex-col gap-2">
          <Text as="h2" variant="title-28-m" color="primary-ui">
            Curriculum
          </Text>
          <Text as="h2" variant="title-40-b" className="whitespace-pre-line">
            {`정기 커리큘럼으로 함께 배우고 성장해요. 매 기수마다\n다양한 활동 속에서 IT 역량과 팀워크를 쌓을 수 있습니다.`}
          </Text>
        </div>
      </div>
      {/* TODO: Fill content */}
    </div>
  );
}
