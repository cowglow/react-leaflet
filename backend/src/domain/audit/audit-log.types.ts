import { createHash } from "node:crypto";
import { canonicalJson } from "./canonical-json.js";

export const GENESIS_HASH = "0".repeat(64);

export type AuditLogInput = {
  actorAccountId: string;
  entity: string;
  entityId: string;
  diff: unknown;
};

export type AuditLogEntry = AuditLogInput & {
  timestamp: Date;
  prevHash: string;
  hash: string;
};

// The core tamper-evidence rule: `hash = sha256(prevHash + canonicalJson(entry))`.
// A pure, deterministic function of its inputs — the business rule that makes the
// audit log hash-chained, independent of how entries are actually persisted.
// Changing this breaks verification of every prior chain entry; treat it as
// frozen once anything has been written against it.
export function computeAuditHash(prevHash: string, timestamp: Date, input: AuditLogInput): string {
  return createHash("sha256")
    .update(
      prevHash +
        canonicalJson({
          timestamp: timestamp.toISOString(),
          actorAccountId: input.actorAccountId,
          entity: input.entity,
          entityId: input.entityId,
          diff: input.diff,
        }),
    )
    .digest("hex");
}
