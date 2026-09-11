import type { Account as PrismaAccount } from "@prisma/client";
import type { Account } from "../../domain/account/account.types.js";
import type { AccountRepository } from "../../application/account/account.repository.js";
import { prisma } from "./prisma-client.js";

function toDomainAccount(account: PrismaAccount): Account {
  return { id: account.id, email: account.email, role: account.role, memberId: account.memberId };
}

export const prismaAccountRepository: AccountRepository = {
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
};
