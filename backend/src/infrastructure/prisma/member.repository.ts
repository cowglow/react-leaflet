import type { Member as PrismaMember, Prisma } from "@prisma/client";
import type { DepartmentType, OrganizationType } from "../../domain/shared/types.js";
import type { Member, MemberInput } from "../../domain/member/member.types.js";
import type { MemberRepository } from "../../application/member/member.repository.js";
import { prisma } from "./prisma-client.js";
import { appendAuditLog } from "./audit-log.js";

// The API's Member shape mirrors the frontend's own domain/member/member.types.ts
// directly, so this is the only place either side's flat Prisma columns leak in.
function toDomainMember(member: PrismaMember): Member {
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
      ? { level: member.responsibilityLevel as OrganizationType, type: member.responsibilityType as DepartmentType }
      : undefined,
    organizationId: member.organizationId ?? undefined,
    signupDate: member.signupDate.toISOString(),
    status:
      member.statusKind === "lost_contact"
        ? { kind: "lost-contact" as const, lastActiveDate: member.lastActiveDate?.toISOString() ?? "" }
        : { kind: "active" as const },
    incomplete: member.incomplete,
  };
}

function fromMemberInput(input: MemberInput) {
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
    incomplete: input.incomplete ?? false,
  };
}

export const prismaMemberRepository: MemberRepository = {
  async findAll() {
    const members = await prisma.member.findMany({ orderBy: { createdAt: "asc" } });
    return members.map(toDomainMember);
  },

  async findById(id) {
    const member = await prisma.member.findUnique({ where: { id } });
    return member ? toDomainMember(member) : null;
  },

  async create(input, actorAccountId) {
    const data = fromMemberInput(input);
    const created = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const created = await tx.member.create({ data: { ...data, ...(input.id ? { id: input.id } : {}) } });
      await appendAuditLog(tx, {
        actorAccountId,
        entity: "member",
        entityId: created.id,
        diff: { type: "create", after: data },
      });
      return created;
    });
    return toDomainMember(created);
  },

  async update(id, input, actorAccountId) {
    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }
    const data = fromMemberInput(input);
    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.member.update({ where: { id }, data });
      await appendAuditLog(tx, {
        actorAccountId,
        entity: "member",
        entityId: id,
        diff: { type: "update", before: existing, after: data },
      });
      return updated;
    });
    return toDomainMember(updated);
  },

  async delete(id, actorAccountId) {
    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) {
      return false;
    }
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.member.delete({ where: { id } });
      await appendAuditLog(tx, {
        actorAccountId,
        entity: "member",
        entityId: id,
        diff: { type: "delete", before: existing },
      });
    });
    return true;
  },
};
