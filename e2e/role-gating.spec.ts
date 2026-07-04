import { test, expect } from "@playwright/test";
import { SEED_LEADER_EMAIL } from "./helpers/config.ts";
import { loginAs, logout } from "./helpers/auth.ts";
import { uniqueEmail, uniqueName } from "./helpers/test-data.ts";

test("a member-role account can read data but has no write UI", async ({ page }) => {
  const firstName = uniqueName("Dana");
  const fullName = `${firstName} Lee`;
  const memberEmail = uniqueEmail("readonly");

  // Leader: add a member to have something visible, then invite a member-role account
  await loginAs(page, SEED_LEADER_EMAIL);

  const mapContainer = page.locator(".leaflet-container");
  const box = await mapContainer.boundingBox();
  if (!box) throw new Error("map container has no bounding box");
  await page.mouse.click(box.x + box.width * 0.4, box.y + box.height * 0.6);
  await expect(page.locator("text=Add Member")).toBeVisible({ timeout: 5000 });
  await page.fill("#member-first-name", firstName);
  await page.fill("#member-last-name", "Lee");
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(500);

  await page.locator('ul[role="menu-bar"] >> text=Actions').click();
  await page.click('button:has-text("Invite Account")');
  await expect(page.locator("#invite-email")).toBeVisible({ timeout: 5000 });
  await page.fill("#invite-email", memberEmail);
  await page.selectOption("#invite-role", "member");
  await page.click('button:has-text("Send invite")');
  await expect(page.locator(`text=Invited ${memberEmail}`)).toBeVisible({ timeout: 5000 });

  // Switch to the member-role account
  await logout(page);
  await loginAs(page, memberEmail);

  await expect(page.locator('ul[role="menu-bar"] >> text=Actions')).toHaveCount(0);

  await page.locator(`img[alt="${fullName}"]`).dispatchEvent("click");
  await expect(page.locator(`text=${fullName}`)).toBeVisible({ timeout: 5000 });
  await expect(page.locator('button:has-text("Edit")')).toHaveCount(0);
  await expect(page.locator('button:has-text("Remove")')).toHaveCount(0);

  await page.mouse.click(box.x + box.width * 0.2, box.y + box.height * 0.2);
  await page.waitForTimeout(500);
  await expect(page.locator("text=Add Member")).toHaveCount(0);
});
