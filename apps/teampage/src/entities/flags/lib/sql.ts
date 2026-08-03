import { type Variant } from '../model';

/**
 * 분석 쿼리를 토큰으로 쪼개 반환한다.
 *
 * 문자열 하나로 넘기면 "어디가 이 실험 고유값이고 어디부터가 불변 규칙인지"를
 * 화면에서 구분할 수 없다. 분석하는 사람이 무엇을 신뢰하고 무엇을 확인해야
 * 하는지 알아야 하므로, 설정에서 파생된 자리를 표시해 둔다.
 *
 *   experimentId  해시 시드. 이 값이 바뀌면 전원이 다른 그룹으로 재배정된다
 *   variant       구간 경계와 그룹 키. 비율을 바꾸면 함께 바뀐다
 *   static        해시 계산식 등 앱과 동일하게 고정된 부분
 */
export type SqlTokenKind = 'static' | 'experimentId' | 'variant';

export interface SqlToken {
  text: string;
  kind: SqlTokenKind;
}

export const buildSqlTokens = (experimentId: string, variants: Variant[]): SqlToken[] => {
  const tokens: SqlToken[] = [];
  const fixed = (text: string) => tokens.push({ text, kind: 'static' });

  fixed("WITH assigned AS (\n  SELECT u.id AS user_id,\n    ('x' || substr(encode(sha256(('");
  tokens.push({ text: experimentId, kind: 'experimentId' });
  fixed(":' || u.id)::bytea), 'hex'), 1, 7))::bit(28)::int % 10000 AS bucket\n  FROM users u\n)\nSELECT CASE ");

  variants.forEach((variant, index) => {
    if (index > 0) fixed('\n    ');
    fixed('WHEN bucket >= ');
    tokens.push({ text: String(variant.range[0]), kind: 'variant' });
    fixed(' AND bucket < ');
    tokens.push({ text: String(variant.range[1]), kind: 'variant' });
    fixed(" THEN '");
    tokens.push({ text: variant.key, kind: 'variant' });
    fixed("'");
  });

  fixed(" ELSE 'unassigned' END AS variant, count(*)\nFROM assigned GROUP BY 1;");
  return tokens;
};

export const sqlTokensToText = (tokens: SqlToken[]) => tokens.map((token) => token.text).join('');

/** 복사·전달용 평문. */
export const buildSqlSnippet = (experimentId: string, variants: Variant[]) =>
  sqlTokensToText(buildSqlTokens(experimentId, variants));

/* ------------------------------------------------------------------ */
/* 변경 diff / 재배정 영향                                                */
/* ------------------------------------------------------------------ */
