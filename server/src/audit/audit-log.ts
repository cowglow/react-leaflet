import { createHash } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { canonicalJson } from "../lib/canonical-json.js";

const GENESIS_HASH = "0".repeat(64);

export interface AuditLogInput {
  actorAccountId: string;
  entity: string;
  entityId: string;
  diff: unknown;
}

// Appends a tamper-evident audit log entry. Must be called with a transaction
// client so the write and the audit entry commit atomically together.
export async function appendAuditLog(tx: Prisma.TransactionClient, input: AuditLogInput) {
  const latest = await tx.auditLogEntry.findFirst({ orderBy: { sequence: "desc" } });
  const prevHash = latest?.hash ?? GENESIS_HASH;
  const timestamp = new Date();

  const hash = createHash("sha256")
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

  return tx.auditLogEntry.create({
    data: {
      timestamp,
      actorAccountId: input.actorAccountId,
      entity: input.entity,
      entityId: input.entityId,
      diff: input.diff as Prisma.InputJsonValue,
      prevHash,
      hash,
    },
  });
}
