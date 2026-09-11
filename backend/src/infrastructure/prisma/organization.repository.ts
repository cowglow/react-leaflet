import type { Organization as PrismaOrganization, Prisma } from "@prisma/client";
import type { Organization, OrganizationInput } from "../../domain/organization/organization.types.js";
import type { OrganizationRepository } from "../../application/organization/organization.repository.js";
import { prisma } from "./prisma-client.js";
import { appendAuditLog } from "./audit-log.js";

// Membership is tracked on Member.organizationId, not an embedded list here, so
// `members` is always empty in API responses — matching how the frontend's
// organization Redux slice already stores these.
function toDomainOrganization(organization: PrismaOrganization): Organization {
  return {
    id: organization.id,
    name: organization.name,
    type: organization.type,
    parentId: organization.parentId ?? undefined,
    members: [],
  };
}

export const prismaOrganizationRepository: OrganizationRepository = {
  async findAll() {
    const organizations = await prisma.organization.findMany({ orderBy: { createdAt: "asc" } });
    return organizations.map(toDomainOrganization);
  },

  async findById(id) {
    const organization = await prisma.organization.findUnique({ where: { id } });
    return organization ? toDomainOrganization(organization) : null;
  },

  async create(input: OrganizationInput, actorAccountId) {
    const created = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const created = await tx.organization.create({
        data: {
          name: input.name,
          type: input.type,
          parentId: input.parentId ?? null,
          ...(input.id ? { id: input.id } : {}),
        },
      });
      await appendAuditLog(tx, {
        actorAccountId,
        entity: "organization",
        entityId: created.id,
        diff: { type: "create", after: { name: input.name, type: input.type, parentId: input.parentId } },
      });
      return created;
    });
    return toDomainOrganization(created);
  },

  async update(id, input, actorAccountId) {
    const existing = await prisma.organization.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }
    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.organization.update({
        where: { id },
        data: { name: input.name, type: input.type, parentId: input.parentId ?? null },
      });
      await appendAuditLog(tx, {
        actorAccountId,
        entity: "organization",
        entityId: id,
        diff: {
          type: "update",
          before: existing,
          after: { name: input.name, type: input.type, parentId: input.parentId },
        },
      });
      return updated;
    });
    return toDomainOrganization(updated);
  },

  async delete(id, actorAccountId) {
    const existing = await prisma.organization.findUnique({ where: { id } });
    if (!existing) {
      return false;
    }
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.organization.delete({ where: { id } });
      await appendAuditLog(tx, {
        actorAccountId,
        entity: "organization",
        entityId: id,
        diff: { type: "delete", before: existing },
      });
    });
    return true;
  },
};
