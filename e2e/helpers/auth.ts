import { expect, type Page } from "@playwright/test";
import { BASE_URL } from "./config.ts";

// Drives the full magic-link flow: request a link for `email` and land on the
// authenticated map view. Outside production, the API returns a `devToken` alongside
// its response and LoginForm.tsx auto-verifies with it immediately (skipping the
// "login link has been sent" message) rather than requiring a human to go dig the
// link out of an email/console — see server/src/routes/auth.routes.ts.
export async function loginAs(page: Page, email: string): Promise<void> {
  await page.goto(BASE_URL);
  await expect(page.locator("text=Sign in")).toBeVisible({ timeout: 15000 });
  await page.fill("#login-email", email);
  await page.click('button:has-text("Send login link")');
  await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 15000 });
}

export async function logout(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.removeItem("authToken"));
}
