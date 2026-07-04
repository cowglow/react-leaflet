import { Router } from "express";
import type { Organization as PrismaOrganization, OrganizationType } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { requireAuth, requireRole } from "../auth/middleware.js";
import { appendAuditLog } from "../audit/audit-log.js";
import { asyncHandler } from "../lib/async-handler.js";

export const organizationsRouter = Router();

// Membership is tracked on Member.organizationId, not as an embedded list here, so
// `members` is always empty in API responses — matching how the frontend's
// organization Redux slice already stores these (see domain/organization/
// organization.factory.ts's createOrganization, which also defaults members to []).
function toApiOrganization(organization: PrismaOrganization) {
  return {
    id: organization.id,
    name: organization.name,
    type: organization.type,
    members: [] as never[],
  };
}

organizationsRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (_req, res) => {
    const organizations = await prisma.organization.findMany({ orderBy: { createdAt: "asc" } });
    res.json({ organizations: organizations.map(toApiOrganization) });
  }),
);

organizationsRouter.post(
  "/",
  requireAuth,
  requireRole("leader"),
  asyncHandler(async (req, res) => {
    const { id, name, type } = req.body as { id?: string; name: string; type: OrganizationType };

    const organization = await prisma.$transaction(async (tx) => {
      const created = await tx.organization.create({
        data: { name, type, ...(id ? { id } : {}) },
      });
      await appendAuditLog(tx, {
        actorAccountId: req.account!.accountId,
        entity: "organization",
        entityId: created.id,
        diff: { type: "create", after: { name, type } },
      });
      return created;
    });

    res.status(201).json({ organization: toApiOrganization(organization) });
  }),
);

organizationsRouter.put(
  "/:id",
  requireAuth,
  requireRole("leader"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, type } = req.body as { name: string; type: OrganizationType };

    const existing = await prisma.organization.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Organization not found" });
      return;
    }

    const organization = await prisma.$transaction(async (tx) => {
      const updated = await tx.organization.update({ where: { id }, data: { name, type } });
      await appendAuditLog(tx, {
        actorAccountId: req.account!.accountId,
        entity: "organization",
        entityId: id,
        diff: { type: "update", before: existing, after: { name, type } },
      });
      return updated;
    });

    res.json({ organization: toApiOrganization(organization) });
  }),
);

organizationsRouter.delete(
  "/:id",
  requireAuth,
  requireRole("leader"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await prisma.organization.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Organization not found" });
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.organization.delete({ where: { id } });
      await appendAuditLog(tx, {
        actorAccountId: req.account!.accountId,
        entity: "organization",
        entityId: id,
        diff: { type: "delete", before: existing },
      });
    });

    res.status(204).send();
  }),
);
