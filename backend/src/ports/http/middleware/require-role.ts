import type { NextFunction, Request, Response } from "express";
import type { Role } from "../../../domain/shared/types.js";

export function requireRole(role: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.account?.role !== role) {
      res.status(403).json({ error: `Requires ${role} role` });
      return;
    }
    next();
  };
}
