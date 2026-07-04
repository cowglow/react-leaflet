import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { createMagicLinkToken, consumeMagicLinkToken } from "../auth/magic-link.js";
import { consoleMailer } from "../auth/mailer.js";
import { signSession } from "../auth/jwt.js";
import { requireAuth, requireRole } from "../auth/middleware.js";
import { asyncHandler } from "../lib/async-handler.js";

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:3000";

export const authRouter = Router();

authRouter.post(
  "/magic-link",
  asyncHandler(async (req, res) => {
    const { email } = req.body as { email?: string };
    if (!email) {
      res.status(400).json({ error: "email is required" });
      return;
    }

    const account = await prisma.account.findUnique({ where: { email } });
    if (account) {
      const token = await createMagicLinkToken(account.id);
      const url = `${CLIENT_ORIGIN}/?token=${token}`;
      await consoleMailer.sendMagicLink(email, url);
    }

    // Always respond the same way regardless of whether the account exists,
    // so this endpoint can't be used to enumerate registered emails.
    res.json({ message: "If that email has an account, a login link has been sent." });
  }),
);

authRouter.post(
  "/verify",
  asyncHandler(async (req, res) => {
    const { token } = req.body as { token?: string };
    if (!token) {
      res.status(400).json({ error: "token is required" });
      return;
    }

    const account = await consumeMagicLinkToken(token);
    if (!account) {
      res.status(400).json({ error: "Invalid or expired token" });
      return;
    }

    const session = signSession({ accountId: account.id, email: account.email, role: account.role });
    res.json({
      token: session,
      account: { id: account.id, email: account.email, role: account.role },
    });
  }),
);

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ account: req.account });
});

authRouter.post(
  "/invite",
  requireAuth,
  requireRole("leader"),
  asyncHandler(async (req, res) => {
    const { email, role } = req.body as { email?: string; role?: "member" | "leader" };
    if (!email || !role) {
      res.status(400).json({ error: "email and role are required" });
      return;
    }

    const existing = await prisma.account.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: "An account with that email already exists" });
      return;
    }

    const account = await prisma.account.create({ data: { email, role } });
    res.status(201).json({ account: { id: account.id, email: account.email, role: account.role } });
  }),
);
