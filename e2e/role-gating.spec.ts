import { test, expect } from "@playwright/test";
import { SEED_LEADER_EMAIL } from "./helpers/config.ts";
import { loginAs, logout } from "./helpers/auth.ts";
import { uniqueEmail, uniqueName } from "./helpers/test-data.ts";
import { addMemberViaMap, clickMap, selectMemberInTree } from "./helpers/map.ts";

test("a member-role account can read data but has no write UI", async ({ page }) => {
  const firstName = uniqueName("Dana");
  const fullName = `${firstName} Lee`;
  const memberEmail = uniqueEmail("readonly");

  // Leader: add a member to have something visible, then invite a member-role account
  await loginAs(page, SEED_LEADER_EMAIL);
  await addMemberViaMap(page, { firstName, lastName: "Lee", xRatio: 0.4, yRatio: 0.6 });

  await page.locator('ul[role="menu-bar"] > li[role="menu-item"]', { hasText: "Organization" }).click();
  await page.click('button:has-text("Invite Account")');
  await expect(page.locator("#invite-email")).toBeVisible({ timeout: 5000 });
  await page.fill("#invite-email", memberEmail);
  await page.selectOption("#invite-role", "member");
  await page.click('button:has-text("Send invite")');
  await expect(page.locator(`text=Invited ${memberEmail}`)).toBeVisible({ timeout: 5000 });

  // Switch to the member-role account
  await logout(page);
  await loginAs(page, memberEmail);

  await page.locator('ul[role="menu-bar"] > li[role="menu-item"]', { hasText: "Organization" }).click();
  await expect(page.locator('button:has-text("Add Organization")')).toHaveCount(0);
  await expect(page.locator('button:has-text("Add Member")')).toHaveCount(0);
  await expect(page.locator('button:has-text("Invite Account")')).toHaveCount(0);
  await page.keyboard.press("Escape");

  await selectMemberInTree(page, fullName);
  await expect(page.locator(".org-preview-card button:has-text('Edit')")).toHaveCount(0);

  await clickMap(page, 0.2, 0.2);
  await page.waitForTimeout(500);
  await expect(page.locator("#member-first-name")).toHaveCount(0);
});
