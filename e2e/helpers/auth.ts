import { expect, type Page } from "@playwright/test";
import { BASE_URL } from "./config.ts";
import { getLatestMagicLinkToken } from "./magic-link.ts";

// Drives the full magic-link flow: request a link for `email`, pull the token out of
// the API's console log, and exchange it, ending on the authenticated map view.
export async function loginAs(page: Page, email: string): Promise<void> {
  await page.goto(BASE_URL);
  await expect(page.locator("text=Sign in")).toBeVisible({ timeout: 15000 });
  await page.fill("#login-email", email);
  await page.click('button:has-text("Send login link")');
  await expect(page.locator("text=login link has been sent")).toBeVisible({ timeout: 5000 });

  const token = await getLatestMagicLinkToken(email);
  await page.goto(`${BASE_URL}?token=${token}`);
  await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 15000 });
}

export async function logout(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.removeItem("authToken"));
}
