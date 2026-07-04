import { API_URL, SEED_LEADER_EMAIL } from "./helpers/config.ts";

// The E2E suite deliberately does not manage the backend itself (Postgres + API) —
// it requires the docker-compose stack to already be running, migrated, and seeded,
// matching the real deployment shape (see docs/HETZNER_DEPLOY.md). This fails fast
// with a clear message instead of letting every test time out mysteriously if that
// setup step was skipped.
export default async function globalSetup() {
  let reachable = false;
  try {
    const response = await fetch(`${API_URL}/health`);
    reachable = response.ok;
  } catch {
    reachable = false;
  }

  if (!reachable) {
    throw new Error(
      `\nE2E setup: could not reach the API at ${API_URL}/health.\n\n` +
        "The E2E suite requires the backend already running via docker-compose:\n" +
        "  docker compose up -d db api\n" +
        "  docker compose exec api pnpm prisma:deploy\n" +
        `  docker compose exec api sh -c "SEED_LEADER_EMAIL=${SEED_LEADER_EMAIL} pnpm seed"\n\n` +
        `Set E2E_API_URL if the API isn't on the default ${API_URL}, and ` +
        `E2E_SEED_LEADER_EMAIL if you seeded a different leader email than ${SEED_LEADER_EMAIL}.\n`,
    );
  }
}
