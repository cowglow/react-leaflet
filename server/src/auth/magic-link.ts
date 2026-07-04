import { randomBytes, createHash } from "node:crypto";
import { prisma } from "../db/prisma.js";

const TOKEN_TTL_MS = 15 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createMagicLinkToken(accountId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await prisma.magicLinkToken.create({
    data: {
      accountId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });
  return token;
}

export async function consumeMagicLinkToken(token: string) {
  const tokenHash = hashToken(token);
  const record = await prisma.magicLinkToken.findUnique({
    where: { tokenHash },
    include: { account: true },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return null;
  }

  await prisma.magicLinkToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return record.account;
}
