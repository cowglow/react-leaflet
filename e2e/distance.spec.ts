import { test, expect } from "@playwright/test";
import { SEED_LEADER_EMAIL } from "./helpers/config.ts";
import { loginAs } from "./helpers/auth.ts";
import { uniqueName } from "./helpers/test-data.ts";

test("distance panel lists other members sorted by distance from a chosen origin", async ({
  page,
}) => {
  await loginAs(page, SEED_LEADER_EMAIL);
  const originName = uniqueName("Erin");
  const otherName = uniqueName("Frank");

  const mapContainer = page.locator(".leaflet-container");
  const box = await mapContainer.boundingBox();
  if (!box) throw new Error("map container has no bounding box");

  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await expect(page.locator("text=Add Member")).toBeVisible({ timeout: 5000 });
  await page.fill("#member-first-name", originName);
  await page.fill("#member-last-name", "Origin");
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(500);

  await page.mouse.click(box.x + box.width * 0.7, box.y + box.height * 0.3);
  await expect(page.locator("text=Add Member")).toBeVisible({ timeout: 5000 });
  await page.fill("#member-first-name", otherName);
  await page.fill("#member-last-name", "Target");
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(500);

  await page.locator(".leaflet-top.leaflet-right button.btn").nth(1).click();
  await expect(page.locator("#distance-origin")).toBeVisible({ timeout: 5000 });
  await page.selectOption("#distance-origin", { label: `${originName} Origin` });
  await page.waitForTimeout(300);

  const listItems = await page
    .locator("#distance-origin ~ ul li")
    .allTextContents();
  const match = listItems.find((item) => item.includes(`${otherName} Target`));
  expect(match).toBeTruthy();
  expect(match).toMatch(/\d+(\.\d+)? km/);
});
