'use client';
import { TabButton } from '@/shared/component/TabButton';
interface TabProps {
  tabs: string[];
  selectedIdx: number;
  onChange: (idx: number) => void;
}

export default function Tab({ tabs, selectedIdx, onChange }: TabProps) {
  return (
    <div className="flex items-center gap-2 mb-7">
      {tabs.map((tab, idx) => (
        <TabButton
          key={idx}
          clicked={selectedIdx === idx}
          onClick={() => onChange(idx)}
        >
          {tab}
        </TabButton>
      ))}
    </div>
  );
}
