import type { MagicLinkTokenRepository } from "../../application/magic-link/magic-link-token.repository.js";
import { prisma } from "./prisma-client.js";

export const prismaMagicLinkTokenRepository: MagicLinkTokenRepository = {
  async create(accountId, tokenHash, expiresAt) {
    await prisma.magicLinkToken.create({ data: { accountId, tokenHash, expiresAt } });
  },

  async findByHash(tokenHash) {
    const record = await prisma.magicLinkToken.findUnique({ where: { tokenHash }, include: { account: true } });
    if (!record) {
      return null;
    }
    return {
      record: { id: record.id, expiresAt: record.expiresAt, usedAt: record.usedAt },
      account: {
        id: record.account.id,
        email: record.account.email,
        role: record.account.role,
        memberId: record.account.memberId,
      },
    };
  },

  async markUsed(id) {
    await prisma.magicLinkToken.update({ where: { id }, data: { usedAt: new Date() } });
  },
};
