import type { RequestHandler } from "express";
import type { SessionPayload } from "../../../application/token-signer.js";
import type { TokenSigner } from "../../../application/token-signer.js";
import type { AccountRepository } from "../../../application/account/account.repository.js";
import { asyncHandler } from "../lib/async-handler.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      account?: SessionPayload;
    }
  }
}

export function createRequireAuth(tokenSigner: TokenSigner, accountRepository: AccountRepository): RequestHandler {
  return asyncHandler(async (req, res, next) => {
    const header = req.header("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

    if (!token) {
      res.status(401).json({ error: "Missing or invalid Authorization header" });
      return;
    }

    let payload: SessionPayload;
    try {
      payload = tokenSigner.verify(token);
    } catch {
      res.status(401).json({ error: "Invalid or expired session" });
      return;
    }

    // The token can be structurally valid (right signature, not expired) but
    // still point at an account that's since been deleted — e.g. a dev database
    // reset — or had its role/member link changed. Re-checking against the
    // database on every request, rather than trusting whatever the token
    // cached when it was issued, turns what would otherwise be a confusing
    // downstream failure (a foreign-key violation the first time this account
    // tries to write something, since the audit log references actorAccountId)
    // into a clean 401, and picks up a role/member-link change immediately
    // instead of waiting up to 7 days for the token to expire.
    const account = await accountRepository.findById(payload.accountId);
    if (!account) {
      res.status(401).json({ error: "Invalid or expired session" });
      return;
    }

    req.account = { accountId: account.id, email: account.email, role: account.role, memberId: account.memberId };
    next();
  });
}
