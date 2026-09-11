import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { SessionPayload } from "../../../application/token-signer.js";
import type { TokenSigner } from "../../../application/token-signer.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      account?: SessionPayload;
    }
  }
}

export function createRequireAuth(tokenSigner: TokenSigner): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

    if (!token) {
      res.status(401).json({ error: "Missing or invalid Authorization header" });
      return;
    }

    try {
      req.account = tokenSigner.verify(token);
      next();
    } catch {
      res.status(401).json({ error: "Invalid or expired session" });
    }
  };
}
