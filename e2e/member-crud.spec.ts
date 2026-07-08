import { test, expect } from "@playwright/test";
import { SEED_LEADER_EMAIL } from "./helpers/config.ts";
import { loginAs } from "./helpers/auth.ts";
import { uniqueName } from "./helpers/test-data.ts";

test.beforeEach(async ({ page }) => {
  await loginAs(page, SEED_LEADER_EMAIL);
});

// The backend Postgres is persistent across runs (not wiped between test suite
// invocations), and the map auto-fits its viewport to all members once there are
// more than a handful (MapBounds.tsx) — so the pixel a member was placed at won't
// necessarily still show that marker later, and ".leaflet-marker-icon.last()" isn't
// reliable either once markers accumulate. Member markers render an `alt` attribute
// with the member's name (Marker.Member.tsx), so locating by that is stable
// regardless of pan/zoom or how many other markers exist.
test("leader can add a member by clicking the map", async ({ page }) => {
  const firstName = uniqueName("Alice");
  const fullName = `${firstName} Johnson`;

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

  await page.locator(`img[alt="${fullName}"]`).dispatchEvent("click");
  await expect(page.locator(`text=${fullName}`)).toBeVisible({ timeout: 5000 });
});

test("leader can edit a member and mark them lost contact", async ({ page }) => {
  const firstName = uniqueName("Bob");
  const fullName = `${firstName} Smith`;

  const mapContainer = page.locator(".leaflet-container");
  const box = await mapContainer.boundingBox();
  if (!box) throw new Error("map container has no bounding box");

  await page.mouse.click(box.x + box.width * 0.55, box.y + box.height * 0.45);
  await expect(page.locator("text=Add Member")).toBeVisible({ timeout: 5000 });
  await page.fill("#member-first-name", firstName);
  await page.fill("#member-last-name", "Smith");
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(500);

  await page.locator(`img[alt="${fullName}"]`).dispatchEvent("click");
  await expect(page.locator(`text=${fullName}`)).toBeVisible({ timeout: 5000 });
  await page.click('button:has-text("Edit")');
  await expect(page.locator("text=Edit Member")).toBeVisible({ timeout: 5000 });

  await page.click('label[for="member-lost-contact"]');
  await page.fill("#member-last-active-date", "2026-01-01");
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(500);

  await page.locator(`img[alt="${fullName}"]`).dispatchEvent("click");
  await expect(page.locator("text=Lost contact since 2026-01-01")).toBeVisible({ timeout: 5000 });
});

test("leader can remove a member", async ({ page }) => {
  const firstName = uniqueName("Carol");
  const fullName = `${firstName} Davis`;

  const mapContainer = page.locator(".leaflet-container");
  const box = await mapContainer.boundingBox();
  if (!box) throw new Error("map container has no bounding box");

  await page.mouse.click(box.x + box.width * 0.45, box.y + box.height * 0.55);
  await expect(page.locator("text=Add Member")).toBeVisible({ timeout: 5000 });
  await page.fill("#member-first-name", firstName);
  await page.fill("#member-last-name", "Davis");
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(500);

  await page.locator(`img[alt="${fullName}"]`).dispatchEvent("click");
  await expect(page.locator(`text=${fullName}`)).toBeVisible({ timeout: 5000 });
  await page.click('button:has-text("Remove")');
  await page.waitForTimeout(500);

  await expect(page.locator(`img[alt="${fullName}"]`)).toHaveCount(0);
});
