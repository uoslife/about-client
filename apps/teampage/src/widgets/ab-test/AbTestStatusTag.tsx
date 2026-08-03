import { Tag } from '@/shared/component/Tag';
import { EXPERIMENT_STATUS_LABEL, type ExperimentStatus } from '@/entities/flags';

interface AbTestStatusTagProps {
  status: ExperimentStatus;
  isDraft: boolean;
}

export function AbTestStatusTag({ status, isDraft }: AbTestStatusTagProps) {
  if (isDraft) {
    return <Tag color="white">미발행 초안</Tag>;
  }
  return <Tag color={status === 'running' ? 'black' : 'white'}>{EXPERIMENT_STATUS_LABEL[status]}</Tag>;
}
