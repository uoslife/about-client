'use client';
import { useState } from 'react';
import { FAQbutton } from './FAQbutton';

export function Section05() {
  const [q1, setQ1] = useState(true);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);
  const [q4, setQ4] = useState(false);
  const [q5, setQ5] = useState(false);
  return (
    <div className="flex flex-col items-start w-[80rem] gap-20">
      <h3 className="text-[#222227] font-bold text-[4.5rem] leading-[120%] self-stretch">
        자주 묻는 질문
      </h3>
      <FAQbutton
        question="Q. 시대생 앱은 어떻게 생겨 났나요?"
        open={q1}
        setOpen={setQ1}
      />
      {q1 && <div>11111111111111</div>}
      <FAQbutton
        question="Q. 정기 모임은 언제, 어디서 하나요?"
        open={q2}
        setOpen={setQ2}
      />
      {q2 && <div>22222222222222222222</div>}
      <FAQbutton
        question="Q. 졸업생도 지원이 가능한가요?"
        open={q3}
        setOpen={setQ3}
      />
      {q3 && <div>3</div>}
      <FAQbutton
        question="Q. 실력이 뛰어난 사람만 지원할 수 있나요?"
        open={q4}
        setOpen={setQ4}
      />
      {q4 && <div>4</div>}
      <FAQbutton
        question="Q. UOSLIFE Alumni(졸업생 및 동문)도 함께 활동하나요?"
        open={q5}
        setOpen={setQ5}
      />
      {q5 && <div>5</div>}
    </div>
  );
}
