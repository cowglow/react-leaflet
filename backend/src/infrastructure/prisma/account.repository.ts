import type { Account as PrismaAccount, Prisma } from "@prisma/client";
import type { Account } from "../../domain/account/account.types.js";
import type { AccountRepository } from "../../application/account/account.repository.js";
import { prisma } from "./prisma-client.js";
import { appendAuditLog } from "./audit-log.js";

function toDomainAccount(account: PrismaAccount): Account {
  return { id: account.id, email: account.email, role: account.role, memberId: account.memberId };
}

export const prismaAccountRepository: AccountRepository = {
  async findAll() {
    const accounts = await prisma.account.findMany({ orderBy: { email: "asc" } });
    return accounts.map(toDomainAccount);
  },

  async findById(id) {
    const account = await prisma.account.findUnique({ where: { id } });
    return account ? toDomainAccount(account) : null;
  },

  async findByEmail(email) {
    const account = await prisma.account.findUnique({ where: { email } });
    return account ? toDomainAccount(account) : null;
  },

  async findByMemberId(memberId) {
    const account = await prisma.account.findUnique({ where: { memberId } });
    return account ? toDomainAccount(account) : null;
  },

  async create(input) {
    const account = await prisma.account.create({
      data: { email: input.email, role: input.role, memberId: input.memberId },
    });
    return toDomainAccount(account);
  },

  async update(id, input, actorAccountId) {
    const existing = await prisma.account.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }
    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.account.update({ where: { id }, data: input });
      await appendAuditLog(tx, {
        actorAccountId,
        entity: "account",
        entityId: id,
        diff: { type: "update", before: { role: existing.role, memberId: existing.memberId }, after: input },
      });
      return updated;
    });
    return toDomainAccount(updated);
  },
};
