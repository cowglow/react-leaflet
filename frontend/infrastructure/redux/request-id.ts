// Correlates a dispatched mutation request with the succeeded/failed action the
// saga eventually reports back, so a component only reacts to the outcome of the
// specific request *it* made — not any other request against the same slice (e.g.
// two member markers can each drag-move independently without cross-firing alerts).
export function createRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
