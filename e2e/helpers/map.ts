import { expect, type Page } from "@playwright/test";

// The Map window is auto-launched on load (App.tsx). react-maplibre renders one
// <canvas class="maplibregl-canvas"> — that's the click target for "click the
// map to add a member," replacing the old .leaflet-container.
export async function mapCanvasBox(page: Page) {
  const canvas = page.locator(".maplibregl-canvas").first();
  await canvas.waitFor({ state: "visible", timeout: 10000 });
  const box = await canvas.boundingBox();
  if (!box) throw new Error("map canvas has no bounding box");
  return box;
}

export async function clickMap(
  page: Page,
  xRatio: number,
  yRatio: number,
): Promise<void> {
  const box = await mapCanvasBox(page);
  await page.mouse.click(
    box.x + box.width * xRatio,
    box.y + box.height * yRatio,
  );
}

interface AddMemberOptions {
  firstName: string;
  lastName: string;
  xRatio?: number;
  yRatio?: number;
  street?: string;
  number?: string;
  zip?: string;
  city?: string;
}

// Plain click on the map = "add a member here" (MembersMap.tsx); fills and
// saves the form that opens, and waits for it to close.
export async function addMemberViaMap(
  page: Page,
  options: AddMemberOptions,
): Promise<void> {
  const {
    firstName,
    lastName,
    xRatio = 0.5,
    yRatio = 0.5,
    street,
    number,
    zip,
    city,
  } = options;
  await clickMap(page, xRatio, yRatio);
  // Not "text=Add Member" — that string also matches the Organization menu's
  // own "Add Member" item (present in the DOM even while the menu is closed).
  await expect(page.locator("#member-first-name")).toBeVisible({
    timeout: 5000,
  });
  await page.fill("#member-first-name", firstName);
  await page.fill("#member-last-name", lastName);
  if (street) await page.fill("#member-street", street);
  if (number) await page.fill("#member-number", number);
  if (zip) await page.fill("#member-zip", zip);
  if (city) await page.fill("#member-city", city);
  await page.click('button[type="submit"]:has-text("Save")');
  await expect(page.locator("#member-first-name")).toHaveCount(0, {
    timeout: 5000,
  });
}

// Opens the Organizations window from the menu bar (the "Organization" menu's
// "Open Organizations" item), if it isn't open already.
export async function openOrganizationsTree(page: Page): Promise<void> {
  if (
    await page
      .locator(".org-tree")
      .isVisible()
      .catch(() => false)
  ) {
    return;
  }
  await page
    .locator('ul[role="menu-bar"] > li[role="menu-item"]', {
      hasText: "Organization",
    })
    .click();
  await page.click("text=Open Organizations");
  await expect(page.locator(".org-tree")).toBeVisible({ timeout: 5000 });
}

// Selects a member by full name in the Organizations tree (a single click — not
// the double-click-an-org-name gesture, which selects everyone in that org).
// Selecting drives the map to center on and auto-open that member's marker
// popup (SelectionCamera + Marker.Member's autoOpen), and shows the single-
// member preview panel used by editSelectedMemberFromPreview/previewField.
export async function selectMemberInTree(
  page: Page,
  fullName: string,
): Promise<void> {
  await openOrganizationsTree(page);

  // A member's own organization (or the Unassigned bucket) may start collapsed
  // — a plain click can't reach content inside a closed <details> at all, since
  // the browser removes it from layout entirely, not just hides it visually.
  const collapsedSummaries = page.locator(
    ".org-tree details:not([open]) > summary",
  );
  while ((await collapsedSummaries.count()) > 0) {
    await collapsedSummaries.first().click();
  }

  await page.locator(".org-tree-member", { hasText: fullName }).click();
  await expect(page.locator(".org-preview-card")).toContainText(fullName, {
    timeout: 5000,
  });
}

// Reads a labeled field's value out of the single-member preview panel (e.g.
// "Coordinates", "Telephone") — the panel is a flat <dl> of dt/dd pairs.
export function previewField(page: Page, label: string) {
  return page.locator(`.org-preview-fields dt:has-text("${label}") + dd`);
}

export async function editSelectedMemberFromPreview(page: Page): Promise<void> {
  await page.locator(".org-preview-card button:has-text('Edit')").click();
  await expect(page.locator("#member-first-name")).toBeVisible({
    timeout: 5000,
  });
}

// Clicks "Move" on the currently-open marker popup, then drags whichever
// marker is closest to the map's center by (dx, dy) pixels. Selecting a member
// always centers the map on it first (SelectionCamera), so the marker being
// moved is reliably the one nearest the canvas center — there's no other way
// to identify "which marker is this member's" since MapLibre markers carry no
// text of their own, unlike the old Leaflet <img alt="Full Name"> icons.
export async function moveSelectedMemberMarker(
  page: Page,
  dx: number,
  dy: number,
): Promise<void> {
  // The Organizations window (opened by selectMemberInTree) can visually overlap
  // the Map window's auto-centered popup — bring Map back to front by clicking
  // its title bar (not the canvas, which would register as "add a member here").
  await page
    .locator('.title-bar:has-text("Map")')
    .click({ position: { x: 5, y: 5 } });
  await page.locator('.maplibregl-popup button:has-text("Move")').click();

  const box = await mapCanvasBox(page);
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;

  // Markers anchor at their bottom tip (Map.Marker.tsx's anchor="bottom"), so the
  // point that actually sits on the member's coordinate — and that SelectionCamera
  // centers the map on — is the bounding box's bottom-center, not its middle. Using
  // the box's geometric center here can be closer to the canvas center for some
  // unrelated, larger/smaller marker nearby than for the real (moving) one, especially
  // once several members share a small area — picking the wrong, non-draggable marker
  // and silently panning the map instead of dragging anything.
  const markers = page.locator(".maplibregl-marker");
  const count = await markers.count();
  let closestIndex = 0;
  let closestDistance = Infinity;
  for (let i = 0; i < count; i++) {
    const markerBox = await markers.nth(i).boundingBox();
    if (!markerBox) continue;
    const distance = Math.hypot(
      markerBox.x + markerBox.width / 2 - centerX,
      markerBox.y + markerBox.height - centerY,
    );
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }

  const markerBox = await markers.nth(closestIndex).boundingBox();
  if (!markerBox) throw new Error("could not locate the draggable marker");
  const startX = markerBox.x + markerBox.width / 2;
  const startY = markerBox.y + markerBox.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + dx, startY + dy, { steps: 10 });
  await page.mouse.up();
}
