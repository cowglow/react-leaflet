import { test, expect } from "@playwright/test";
import { SEED_LEADER_EMAIL } from "./helpers/config.ts";
import { loginAs, logout } from "./helpers/auth.ts";
import { uniqueEmail, uniqueName } from "./helpers/test-data.ts";

test("a member linked to their own record can edit it but not others, and cannot delete it", async ({ page }) => {
  const ownFirstName = uniqueName("Alex");
  const ownFullName = `${ownFirstName} Rivera`;
  const otherFirstName = uniqueName("Jordan");
  const otherFullName = `${otherFirstName} Kim`;
  const selfEmail = uniqueEmail("selfedit");

  await test.step("leader logs in", async () => {
    await loginAs(page, SEED_LEADER_EMAIL);
  });

  const mapContainer = page.locator(".leaflet-container");
  const box = await mapContainer.boundingBox();
  if (!box) throw new Error("map container has no bounding box");

  await test.step("leader creates the member the invitee will be linked to", async () => {
    await page.mouse.click(box.x + box.width * 0.4, box.y + box.height * 0.4);
    await expect(page.locator("text=Add Member")).toBeVisible({ timeout: 5000 });
    await page.fill("#member-first-name", ownFirstName);
    await page.fill("#member-last-name", "Rivera");
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(500);
  });

  await test.step("leader creates a second, unrelated member", async () => {
    await page.mouse.click(box.x + box.width * 0.6, box.y + box.height * 0.6);
    await expect(page.locator("text=Add Member")).toBeVisible({ timeout: 5000 });
    await page.fill("#member-first-name", otherFirstName);
    await page.fill("#member-last-name", "Kim");
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(500);
  });

  await test.step("leader invites a member-role account linked to the first member", async () => {
    await page.locator('ul[role="menu-bar"] >> text=Actions').click();
    await page.click('button:has-text("Invite Account")');
    await expect(page.locator("#invite-email")).toBeVisible({ timeout: 5000 });
    await page.fill("#invite-email", selfEmail);
    await page.selectOption("#invite-role", "member");
    await page.selectOption("#invite-member", { label: `${ownFirstName} Rivera` });
    await page.click('button:has-text("Send invite")');
    await expect(page.locator(`text=Invited ${selfEmail}`)).toBeVisible({ timeout: 5000 });
  });

  await test.step("invited account logs in", async () => {
    await logout(page);
    await loginAs(page, selfEmail);
  });

  await test.step("own record: Edit is available, Remove is not", async () => {
    await page.locator(`img[alt="${ownFullName}"]`).dispatchEvent("click");
    await expect(page.locator(`text=${ownFullName}`)).toBeVisible({ timeout: 5000 });
    await page.click('button:has-text("Edit")');
    await expect(page.locator("#member-first-name")).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button:has-text("Remove")')).toHaveCount(0);
    await page.fill("#member-telephone", "555-0100");
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(500);
  });

  await test.step("the edit persisted", async () => {
    await page.locator(`img[alt="${ownFullName}"]`).dispatchEvent("click");
    await page.click('button:has-text("Edit")');
    await expect(page.locator("#member-telephone")).toHaveValue("555-0100");
    await page.click('button:has-text("Cancel")');
  });

  await test.step("someone else's record: no Edit button at all", async () => {
    await page.locator(`img[alt="${otherFullName}"]`).dispatchEvent("click");
    await expect(page.locator(`text=${otherFullName}`)).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button:has-text("Edit")')).toHaveCount(0);
  });
});
