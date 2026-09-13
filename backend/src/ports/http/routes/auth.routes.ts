import { Router, type RequestHandler } from "express";
import type { Role } from "../../../domain/shared/types.js";
import {
  createInviteAccountUseCase,
  createRequestMagicLinkUseCase,
  createUpdateAccountUseCase,
  createVerifyMagicLinkUseCase,
  type InviteAccountDeps,
  type RequestMagicLinkDeps,
  type UpdateAccountDeps,
  type VerifyMagicLinkDeps,
} from "../../../application/auth/auth.use-cases.js";
import {
  AccountNotFoundError,
  DuplicateAccountError,
  MailDeliveryError,
  MemberAlreadyLinkedError,
  MemberNotFoundError,
} from "../../../application/auth/auth.errors.js";
import { requireRole } from "../middleware/require-role.js";
import { asyncHandler } from "../lib/async-handler.js";

export type AuthRouterDeps = RequestMagicLinkDeps & VerifyMagicLinkDeps & InviteAccountDeps & UpdateAccountDeps & {
  requireAuth: RequestHandler;
};

export function createAuthRouter(deps: AuthRouterDeps): Router {
  const router = Router();
  const requestMagicLink = createRequestMagicLinkUseCase(deps);
  const verifyMagicLink = createVerifyMagicLinkUseCase(deps);
  const inviteAccount = createInviteAccountUseCase(deps);
  const updateAccount = createUpdateAccountUseCase(deps);

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

  router.get(
    "/accounts",
    deps.requireAuth,
    requireRole("leader"),
    asyncHandler(async (_req, res) => {
      const accounts = await deps.accountRepository.findAll();
      res.json({ accounts });
    }),
  );

  router.patch(
    "/accounts/:id",
    deps.requireAuth,
    requireRole("leader"),
    asyncHandler(async (req, res) => {
      const { role, memberId } = req.body as { role?: Role; memberId?: string | null };
      if (!role) {
        res.status(400).json({ error: "role is required" });
        return;
      }

      try {
        const account = await updateAccount(
          { accountId: req.params.id, role, memberId },
          req.account!.accountId,
        );
        res.json({ account });
      } catch (err) {
        if (err instanceof MemberAlreadyLinkedError) {
          res.status(409).json({ error: err.message });
          return;
        }
        if (err instanceof MemberNotFoundError || err instanceof AccountNotFoundError) {
          res.status(404).json({ error: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  return router;
}
