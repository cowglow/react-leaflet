import { describe, expect, test } from "vitest";
import { canonicalJson } from "./canonical-json.js";

describe("canonicalJson", () => {
  test("key order does not affect the result", () => {
    const a = canonicalJson({ b: 1, a: 2 });
    const b = canonicalJson({ a: 2, b: 1 });
    expect(a).toBe(b);
  });

  test("nested objects are sorted recursively", () => {
    const a = canonicalJson({ outer: { z: 1, y: 2 }, id: "x" });
    const b = canonicalJson({ id: "x", outer: { y: 2, z: 1 } });
    expect(a).toBe(b);
  });

  test("arrays preserve order (not sorted as sets)", () => {
    const a = canonicalJson({ items: [1, 2, 3] });
    const b = canonicalJson({ items: [3, 2, 1] });
    expect(a).not.toBe(b);
  });

  test("differing values produce differing output", () => {
    const a = canonicalJson({ a: 1 });
    const b = canonicalJson({ a: 2 });
    expect(a).not.toBe(b);
  });
});
