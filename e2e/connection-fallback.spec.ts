import { test, expect } from "@playwright/test";
import { BASE_URL, SEED_LEADER_EMAIL } from "./helpers/config.ts";
import { loginAs } from "./helpers/auth.ts";

test("a network failure while restoring a session shows 'Can't connect', not a logout", async ({
  page,
  context,
}) => {
  await loginAs(page, SEED_LEADER_EMAIL);
  const storageState = await context.storageState();

  const freshContext = await page.context().browser()!.newContext({
    ignoreHTTPSErrors: true,
    storageState,
  });
  const freshPage = await freshContext.newPage();
  await freshPage.route("**/auth/me", (route) => route.abort("connectionrefused"));

  await freshPage.goto(BASE_URL);
  await expect(freshPage.locator("text=Can't connect")).toBeVisible({ timeout: 10000 });

  const tokenStillStored = await freshPage.evaluate(() =>
    Boolean(localStorage.getItem("authToken")),
  );
  expect(tokenStillStored).toBe(true);

  await freshContext.close();
});

test("a failed member/organization fetch shows a retryable banner, not a silent empty map", async ({
  page,
}) => {
  await page.route("**/members", (route) => route.abort("connectionrefused"));
  await page.route("**/organizations", (route) => route.abort("connectionrefused"));

  await loginAs(page, SEED_LEADER_EMAIL);
  await expect(page.locator("text=Couldn't load data")).toBeVisible({ timeout: 5000 });

  await page.unroute("**/members");
  await page.unroute("**/organizations");
  await page.click('button:has-text("Retry")');
  await expect(page.locator("text=Couldn't load data")).toHaveCount(0, { timeout: 5000 });
});
