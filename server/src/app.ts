import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes.js";
import { membersRouter } from "./routes/members.routes.js";
import { organizationsRouter } from "./routes/organizations.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export function createApp() {
  const app = express();
  app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000" }));
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/auth", authRouter);
  app.use("/members", membersRouter);
  app.use("/organizations", organizationsRouter);

  app.use(errorHandler);

  return app;
}
