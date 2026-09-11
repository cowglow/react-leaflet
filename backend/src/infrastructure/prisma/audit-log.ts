import type { Prisma } from "@prisma/client";
import { computeAuditHash, GENESIS_HASH, type AuditLogInput } from "../../domain/audit/audit-log.types.js";

// Appends a tamper-evident audit log entry. Must be called with a transaction
// client so the write and the audit entry commit atomically together — every
// repository's create/update/delete does exactly that (see member.repository.ts /
// organization.repository.ts).
export async function appendAuditLog(tx: Prisma.TransactionClient, input: AuditLogInput) {
  const latest = await tx.auditLogEntry.findFirst({ orderBy: { sequence: "desc" } });
  const prevHash = latest?.hash ?? GENESIS_HASH;
  const timestamp = new Date();
  const hash = computeAuditHash(prevHash, timestamp, input);

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
