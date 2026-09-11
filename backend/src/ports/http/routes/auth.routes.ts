import { Router, type RequestHandler } from "express";
import type { Role } from "../../../domain/shared/types.js";
import {
  createInviteAccountUseCase,
  createRequestMagicLinkUseCase,
  createVerifyMagicLinkUseCase,
  type InviteAccountDeps,
  type RequestMagicLinkDeps,
  type VerifyMagicLinkDeps,
} from "../../../application/auth/auth.use-cases.js";
import {
  DuplicateAccountError,
  MailDeliveryError,
  MemberAlreadyLinkedError,
  MemberNotFoundError,
} from "../../../application/auth/auth.errors.js";
import { requireRole } from "../middleware/require-role.js";
import { asyncHandler } from "../lib/async-handler.js";

export type AuthRouterDeps = RequestMagicLinkDeps & VerifyMagicLinkDeps & InviteAccountDeps & {
  requireAuth: RequestHandler;
};

export function createAuthRouter(deps: AuthRouterDeps): Router {
  const router = Router();
  const requestMagicLink = createRequestMagicLinkUseCase(deps);
  const verifyMagicLink = createVerifyMagicLinkUseCase(deps);
  const inviteAccount = createInviteAccountUseCase(deps);

  router.post(
    "/magic-link",
    asyncHandler(async (req, res) => {
      const { email } = req.body as { email?: string };
      if (!email) {
        res.status(400).json({ error: "email is required" });
        return;
      }

      try {
        res.json(await requestMagicLink(email));
      } catch (err) {
        if (err instanceof MailDeliveryError) {
          res.status(502).json({ error: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.post(
    "/verify",
    asyncHandler(async (req, res) => {
      const { token } = req.body as { token?: string };
      if (!token) {
        res.status(400).json({ error: "token is required" });
        return;
      }

      const result = await verifyMagicLink(token);
      if (!result) {
        res.status(400).json({ error: "Invalid or expired token" });
        return;
      }
      res.json(result);
    }),
  );

  router.get("/me", deps.requireAuth, (req, res) => {
    res.json({ account: req.account });
  });

  router.post(
    "/invite",
    deps.requireAuth,
    requireRole("leader"),
    asyncHandler(async (req, res) => {
      const { email, role, memberId } = req.body as { email?: string; role?: Role; memberId?: string };
      if (!email || !role) {
        res.status(400).json({ error: "email and role are required" });
        return;
      }

      try {
        const account = await inviteAccount({ email, role, memberId });
        res.status(201).json({ account });
      } catch (err) {
        if (err instanceof DuplicateAccountError || err instanceof MemberAlreadyLinkedError) {
          res.status(409).json({ error: err.message });
          return;
        }
        if (err instanceof MemberNotFoundError) {
          res.status(404).json({ error: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  return router;
}
