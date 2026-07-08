import { Router } from "express";
import type { Member as PrismaMember, DepartmentType, OrganizationType } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { requireAuth, requireRole } from "../auth/middleware.js";
import { appendAuditLog } from "../audit/audit-log.js";
import { asyncHandler } from "../lib/async-handler.js";

export const membersRouter = Router();

// API responses/requests mirror the frontend's domain/member/member.types.ts shape
// directly, so the client's existing domain types and form logic don't need to change
// just because the data now round-trips through a REST API instead of local state.
function toApiMember(member: PrismaMember) {
  const hasAddress = Boolean(
    member.street || member.number || member.zip !== null || member.city || member.lat !== null || member.lng !== null,
  );
  const hasContact = Boolean(member.telephone || member.email);
  const hasResponsibility = Boolean(member.responsibilityLevel && member.responsibilityType);

  return {
    id: member.id,
    name: { firstName: member.firstName, lastName: member.lastName },
    address: hasAddress
      ? {
          street: member.street ?? "",
          number: member.number ?? "",
          zip: member.zip ?? 0,
          city: member.city ?? "",
          coordinates: { lat: member.lat ?? 0, lng: member.lng ?? 0 },
        }
      : undefined,
    contact: hasContact
      ? {
          ...(member.telephone ? { telephone: member.telephone } : {}),
          ...(member.email ? { email: member.email } : {}),
        }
      : undefined,
    responsibility: hasResponsibility
      ? { level: member.responsibilityLevel, type: member.responsibilityType }
      : undefined,
    organizationId: member.organizationId ?? undefined,
    signupDate: member.signupDate.toISOString(),
    status:
      member.statusKind === "lost_contact"
        ? { kind: "lost-contact" as const, lastActiveDate: member.lastActiveDate?.toISOString() ?? "" }
        : { kind: "active" as const },
  };
}

interface ApiMemberInput {
  id?: string;
  name: { firstName: string; lastName: string };
  address?: {
    street: string;
    number: string;
    zip: number;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  contact?: { telephone?: string; email?: string };
  responsibility?: { level: OrganizationType; type: DepartmentType };
  organizationId?: string;
  status: { kind: "active" } | { kind: "lost-contact"; lastActiveDate: string };
}

function fromApiMember(input: ApiMemberInput) {
  return {
    firstName: input.name.firstName,
    lastName: input.name.lastName,
    street: input.address?.street ?? null,
    number: input.address?.number ?? null,
    zip: input.address?.zip ?? null,
    city: input.address?.city ?? null,
    lat: input.address?.coordinates.lat ?? null,
    lng: input.address?.coordinates.lng ?? null,
    telephone: input.contact?.telephone ?? null,
    email: input.contact?.email ?? null,
    responsibilityLevel: input.responsibility?.level ?? null,
    responsibilityType: input.responsibility?.type ?? null,
    organizationId: input.organizationId ?? null,
    statusKind: input.status.kind === "lost-contact" ? ("lost_contact" as const) : ("active" as const),
    lastActiveDate: input.status.kind === "lost-contact" ? new Date(input.status.lastActiveDate) : null,
  };
}

membersRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (_req, res) => {
    const members = await prisma.member.findMany({ orderBy: { createdAt: "asc" } });
    res.json({ members: members.map(toApiMember) });
  }),
);

membersRouter.post(
  "/",
  requireAuth,
  requireRole("leader"),
  asyncHandler(async (req, res) => {
    const input = req.body as ApiMemberInput;
    const data = fromApiMember(input);

    const member = await prisma.$transaction(async (tx) => {
      const created = await tx.member.create({
        data: { ...data, ...(input.id ? { id: input.id } : {}) },
      });
      await appendAuditLog(tx, {
        actorAccountId: req.account!.accountId,
        entity: "member",
        entityId: created.id,
        diff: { type: "create", after: data },
      });
      return created;
    });

    res.status(201).json({ member: toApiMember(member) });
  }),
);

membersRouter.put(
  "/:id",
  requireAuth,
  requireRole("leader"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const input = req.body as ApiMemberInput;
    const data = fromApiMember(input);

    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Member not found" });
      return;
    }

    const member = await prisma.$transaction(async (tx) => {
      const updated = await tx.member.update({ where: { id }, data });
      await appendAuditLog(tx, {
        actorAccountId: req.account!.accountId,
        entity: "member",
        entityId: id,
        diff: { type: "update", before: existing, after: data },
      });
      return updated;
    });

    res.json({ member: toApiMember(member) });
  }),
);

membersRouter.delete(
  "/:id",
  requireAuth,
  requireRole("leader"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Member not found" });
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.member.delete({ where: { id } });
      await appendAuditLog(tx, {
        actorAccountId: req.account!.accountId,
        entity: "member",
        entityId: id,
        diff: { type: "delete", before: existing },
      });
    });

    res.status(204).send();
  }),
);
