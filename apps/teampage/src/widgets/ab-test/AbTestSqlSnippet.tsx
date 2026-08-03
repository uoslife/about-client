'use client';
import { useState } from 'react';
import { Text } from '@/shared/component/Text';
import type { SqlTokenKind, Variant } from '@/entities/flags';
import { buildSqlTokens, sqlTokensToText } from '@/entities/flags';

interface AbTestSqlSnippetProps {
  experimentId: string;
  variants: Variant[];
}

/**
 * 설정에서 파생된 자리를 강조한다.
 *
 * 평문 한 덩어리로 보여주면 "어디가 이 실험 고유값이고 어디부터가 앱과 동일하게
 * 고정된 규칙인지" 알 수 없다. 강조된 곳만 위 설정을 따라 바뀌므로, 비율을
 * 조정하면 어디가 달라지는지 눈으로 확인할 수 있다.
 */
const TOKEN_CLASS: Record<SqlTokenKind, string> = {
  static: '',
  experimentId: 'rounded bg-primary-lighter-alt px-[3px] font-bold text-primary-ui',
  variant: 'rounded bg-grey-200 px-[3px] font-bold text-grey-900',
};

const PLACEHOLDER_ID = '{실험 ID}';

export function AbTestSqlSnippet({ experimentId, variants }: AbTestSqlSnippetProps) {
  const [copied, setCopied] = useState(false);
  const tokens = buildSqlTokens(experimentId || PLACEHOLDER_ID, variants);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sqlTokensToText(tokens));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    // min-w-0 이 없으면 flex/grid 자식의 기본 min-width:auto 때문에 pre 가 콘텐츠
    // 폭 아래로 줄지 않아 패널을 넘어 삐져나온다.
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-grey-200 bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <Text variant="body-18-b" color="grey-900">
          분석용 SQL
        </Text>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!experimentId}
          title={experimentId ? undefined : '실험 ID를 입력하면 복사할 수 있습니다.'}
          className="shrink-0 rounded-lg border border-grey-300 px-2.5 py-1 text-body-12-m text-grey-700 transition-colors hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? '복사됨' : '복사하기'}
        </button>
      </div>

      {/* 어떤 강조가 무엇에서 오는지 먼저 알려준다 */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="h-2.5 w-2.5 rounded-sm bg-primary-lighter-alt ring-1 ring-primary-ui" />
          <span className="text-body-12-m text-grey-600">실험 ID</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="h-2.5 w-2.5 rounded-sm bg-grey-200 ring-1 ring-grey-300" />
          <span className="text-body-12-m text-grey-600">구간 · 그룹 키</span>
        </span>
      </div>

      {/* 줄바꿈하지 않는다. 코드는 토큰 중간이 끊기면(bit(2 / 8)::int) 읽을 수
          없게 되므로, 넘치면 가로로 스크롤한다. 본문 폭(880px)에서는 가장 긴
          해시 계산식 줄도 대체로 한 줄에 들어온다. */}
      <pre className="min-w-0 max-w-full overflow-x-auto rounded-lg bg-grey-50 p-4 font-mono text-[12px] leading-[1.8] text-grey-700">
        {tokens.map((token, index) => (
          <span key={`${index}-${token.kind}`} className={TOKEN_CLASS[token.kind]}>
            {token.text}
          </span>
        ))}
      </pre>

      <Text variant="body-12-m" color="grey-600">
        강조된 값만 위 설정에서 채워집니다. 해시 계산식은 앱과 동일하게 고정되어 있어 같은 유저는 앱과 SQL에서 같은
        그룹으로 계산됩니다.
      </Text>
    </div>
  );
}
