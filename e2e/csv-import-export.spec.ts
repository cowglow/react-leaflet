import { test, expect } from "@playwright/test";
import { SEED_LEADER_EMAIL } from "./helpers/config.ts";
import { loginAs } from "./helpers/auth.ts";
import { uniqueName } from "./helpers/test-data.ts";

test("exporting and re-importing the same CSV skips the already-existing rows", async ({
  page,
}, testInfo) => {
  await loginAs(page, SEED_LEADER_EMAIL);
  const firstName = uniqueName("Grace");

  const mapContainer = page.locator(".leaflet-container");
  const box = await mapContainer.boundingBox();
  if (!box) throw new Error("map container has no bounding box");
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await expect(page.locator("text=Add Member")).toBeVisible({ timeout: 5000 });
  await page.fill("#member-first-name", firstName);
  await page.fill("#member-last-name", "Import");
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(500);

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator(".leaflet-bottom.leaflet-right button.btn").first().click(),
  ]);
  const downloadPath = testInfo.outputPath("exported-members.csv");
  await download.saveAs(downloadPath);

  let dialogMessage = "";
  page.once("dialog", async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });

  await page.locator("#input-file-button").setInputFiles(downloadPath);
  await page.waitForTimeout(1000);

  expect(dialogMessage).toMatch(/failed/i);
});
