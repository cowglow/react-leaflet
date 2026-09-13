import type { WindowsSliceState } from "infrastructure/redux/windows/windows.slice.ts";

const STORAGE_KEY = "visual-directory:windows";

// Wrapped in try/catch throughout: localStorage can throw (private browsing,
// blocked site data) or simply be unavailable, and a corrupt/foreign value
// under this key must never crash the app - just fall back to no persisted
// state, same as a first-ever visit.
export function loadWindowsState(): WindowsSliceState | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return undefined;
    return parsed as WindowsSliceState;
  } catch {
    return undefined;
  }
}

export function saveWindowsState(state: WindowsSliceState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore - persistence is a nicety, not a requirement.
  }
}
