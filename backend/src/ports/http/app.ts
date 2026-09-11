import express from "express";
import cors from "cors";
import { createAuthRouter, type AuthRouterDeps } from "./routes/auth.routes.js";
import { createMemberRouter, type MemberRouterDeps } from "./routes/member.routes.js";
import { createOrganizationRouter, type OrganizationRouterDeps } from "./routes/organization.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export type AppDeps = AuthRouterDeps & MemberRouterDeps & OrganizationRouterDeps;

export function createApp(deps: AppDeps) {
  const app = express();
  app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000" }));
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/auth", createAuthRouter(deps));
  app.use("/members", createMemberRouter(deps));
  app.use("/organizations", createOrganizationRouter(deps));

  app.use(errorHandler);

  return app;
}
