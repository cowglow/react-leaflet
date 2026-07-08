// The E2E suite runs against a persistent docker-compose Postgres (not a throwaway
// per-run database), so generated test data needs to be unique across runs rather
// than assuming a clean slate.
const runId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

export function uniqueEmail(prefix: string): string {
  return `${prefix}-${runId}@example.com`;
}

export function uniqueName(prefix: string): string {
  return `${prefix}-${runId}`;
}
