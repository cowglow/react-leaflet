import { test, expect } from "@playwright/test";
import { SEED_LEADER_EMAIL } from "./helpers/config.ts";
import { loginAs } from "./helpers/auth.ts";
import { uniqueName } from "./helpers/test-data.ts";

test.beforeEach(async ({ page }) => {
  await loginAs(page, SEED_LEADER_EMAIL);
});

test("leader can add a member by clicking the map", async ({ page }) => {
  const firstName = uniqueName("Alice");

  const mapContainer = page.locator(".leaflet-container");
  const box = await mapContainer.boundingBox();
  if (!box) throw new Error("map container has no bounding box");

  await page.mouse.click(box.x + box.width * 0.6, box.y + box.height * 0.6);
  await expect(page.locator("text=Add Member")).toBeVisible({ timeout: 5000 });

  await page.fill("#member-first-name", firstName);
  await page.fill("#member-last-name", "Johnson");
  await page.fill("#member-street", "Hauptstrasse");
  await page.fill("#member-number", "12");
  await page.fill("#member-zip", "80331");
  await page.fill("#member-city", "Munich");
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(500);

  await page.locator(".leaflet-marker-icon").last().click();
  await expect(page.locator(`text=${firstName} Johnson`)).toBeVisible({ timeout: 5000 });
});

test("leader can edit a member and mark them lost contact", async ({ page }) => {
  const firstName = uniqueName("Bob");

  const mapContainer = page.locator(".leaflet-container");
  const box = await mapContainer.boundingBox();
  if (!box) throw new Error("map container has no bounding box");

  await page.mouse.click(box.x + box.width * 0.55, box.y + box.height * 0.45);
  await expect(page.locator("text=Add Member")).toBeVisible({ timeout: 5000 });
  await page.fill("#member-first-name", firstName);
  await page.fill("#member-last-name", "Smith");
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(500);

  await page.locator(".leaflet-marker-icon").last().click();
  await expect(page.locator(`text=${firstName} Smith`)).toBeVisible({ timeout: 5000 });
  await page.click('button:has-text("Edit")');
  await expect(page.locator("text=Edit Member")).toBeVisible({ timeout: 5000 });

  await page.click('label[for="member-lost-contact"]');
  await page.fill("#member-last-active-date", "2026-01-01");
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(500);

  await page.locator(".leaflet-marker-icon").last().click();
  await expect(page.locator("text=Lost contact since 2026-01-01")).toBeVisible({ timeout: 5000 });
});

test("leader can remove a member", async ({ page }) => {
  const firstName = uniqueName("Carol");

  const mapContainer = page.locator(".leaflet-container");
  const box = await mapContainer.boundingBox();
  if (!box) throw new Error("map container has no bounding box");

  await page.mouse.click(box.x + box.width * 0.45, box.y + box.height * 0.55);
  await expect(page.locator("text=Add Member")).toBeVisible({ timeout: 5000 });
  await page.fill("#member-first-name", firstName);
  await page.fill("#member-last-name", "Davis");
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(500);

  await page.locator(".leaflet-marker-icon").last().click();
  await expect(page.locator(`text=${firstName} Davis`)).toBeVisible({ timeout: 5000 });
  await page.click('button:has-text("Remove")');
  await page.waitForTimeout(500);

  await expect(page.locator(`text=${firstName} Davis`)).toHaveCount(0);
});
