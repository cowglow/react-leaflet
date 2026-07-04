import { execSync } from "node:child_process";

const MAX_ATTEMPTS = 10;
const RETRY_DELAY_MS = 300;

function findToken(logs: string, email: string): string | null {
  const pattern = new RegExp(`magic link for ${email}: \\S*[?&]token=([a-f0-9]+)`, "g");
  const matches = [...logs.matchAll(pattern)];
  return matches.at(-1)?.[1] ?? null;
}

function readLogs(): string {
  return execSync("docker compose logs api --no-color", {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 20,
  });
}

// The backend logs magic links to its own console rather than sending real email
// (no provider is wired up yet — see docs/PHASE_3_REPORT.md). Against the
// docker-compose stack this suite requires, that console output is `docker compose
// logs api`, so we grep the most recent matching token out of there. Retries with a
// short delay since there's a small gap between the frontend's "sent" confirmation
// and the log line actually being flushed/visible.
export async function getLatestMagicLinkToken(email: string): Promise<string> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const token = findToken(readLogs(), email);
    if (token) {
      return token;
    }
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
  }

  throw new Error(
    `No magic link found in \`docker compose logs api\` for ${email} after ` +
      `${MAX_ATTEMPTS} attempts. Make sure the account exists (seeded, or invited ` +
      "by a leader) and the magic-link request actually reached the API.",
  );
}
