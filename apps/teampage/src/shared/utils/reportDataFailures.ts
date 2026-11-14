import crypto from 'crypto';

export type RowFailure = {
  index: number;
  name?: string;
  issues: string[];
};

const recent = new Map<string, number>();
const WINDOW_MS = 30 * 60 * 1000;

export async function reportDataFailures(
  source: string,
  failures: RowFailure[],
  successCount: number,
) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;

  const fingerprint = crypto
    .createHash('sha1')
    .update(JSON.stringify(failures.map((f) => [f.name, f.issues])))
    .digest('hex');

  const now = Date.now();
  const last = recent.get(fingerprint);
  if (last && now - last < WINDOW_MS) return;
  recent.set(fingerprint, now);

  const lines = failures
    .slice(0, 10)
    .map((f) => `• *${f.name ?? `#${f.index}`}* — ${f.issues.join(', ')}`)
    .join('\n');

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text:
        `:warning: *${source}* 데이터 검증 실패 ${failures.length}건 ` +
        `(정상 ${successCount}건)\n${lines}` +
        (failures.length > 10 ? `\n_외 ${failures.length - 10}건_` : ''),
    }),
  }).catch(() => {});
}