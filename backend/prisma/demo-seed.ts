import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { demoOrganizations, demoMembers } from "./demo-data.js";

const prisma = new PrismaClient();

function dbHost(): string {
  try {
    return new URL(process.env.DATABASE_URL ?? "").host || "(no DATABASE_URL)";
  } catch {
    return "(unparseable DATABASE_URL)";
  }
}

async function main() {
  const leaderEmail = process.env.SEED_LEADER_EMAIL;
  const orgCount = await prisma.organization.count();
  const memberCount = await prisma.member.count();

  console.log(`demo-seed → ${dbHost()}`);
  console.log(`  wiping ${orgCount} organisations + ${memberCount} members, then inserting`);
  console.log(`  ${demoOrganizations.length} organisations, ${demoMembers.length} members`);
  console.log(`  accounts and the audit log are left untouched`);

  await prisma.$transaction(
    async (tx) => {
      // Member ids are referenced by Account.memberId — unlink before deleting.
      await tx.account.updateMany({ data: { memberId: null } });
      await tx.member.deleteMany();
      await tx.organization.deleteMany();

      const orgIdByKey = new Map<string, string>();
      for (const org of demoOrganizations) {
        const created = await tx.organization.create({
          data: { name: org.name, type: org.type },
        });
        orgIdByKey.set(org.key, created.id);
      }
      // Parent links are set in a second pass — a parent's id isn't known
      // until it's been created, and the tree is declared parent-before-child
      // but that's not guaranteed to hold as demo-data.ts is extended.
      for (const org of demoOrganizations) {
        if (!org.parent) continue;
        const parentId = orgIdByKey.get(org.parent);
        if (!parentId) {
          throw new Error(`Organization "${org.key}" references unknown parent key "${org.parent}"`);
        }
        await tx.organization.update({ where: { id: orgIdByKey.get(org.key)! }, data: { parentId } });
      }

      let leaderLinkId: string | null = null;
      for (const member of demoMembers) {
        if (member.org && !orgIdByKey.has(member.org)) {
          throw new Error(
            `Member ${member.firstName} ${member.lastName} references unknown org key "${member.org}"`,
          );
        }
        const lostContact = member.status && member.status !== "active" ? member.status : null;
        const created = await tx.member.create({
          data: {
            firstName: member.firstName,
            lastName: member.lastName,
            organizationId: member.org ? orgIdByKey.get(member.org)! : null,
            street: member.address?.street ?? null,
            number: member.address?.number ?? null,
            zip: member.address?.zip ?? null,
            city: member.address?.city ?? null,
            lat: member.address?.lat ?? null,
            lng: member.address?.lng ?? null,
            telephone: member.telephone ?? null,
            email: member.email ?? null,
            responsibilityLevel: member.responsibility?.level ?? null,
            responsibilityType: member.responsibility?.type ?? null,
            statusKind: lostContact ? "lost_contact" : "active",
            lastActiveDate: lostContact ? new Date(lostContact.lostContactSince) : null,
            incomplete: member.incomplete ?? false,
            signupDate: member.signupDate ? new Date(member.signupDate) : new Date(),
          },
        });
        if (member.linkToLeaderAccount) {
          leaderLinkId = created.id;
        }
      }

      if (leaderLinkId) {
        if (!leaderEmail) {
          console.log("  linkToLeaderAccount set but SEED_LEADER_EMAIL is unset — skipped");
        } else {
          const account = await tx.account.findUnique({ where: { email: leaderEmail } });
          if (account) {
            await tx.account.update({ where: { id: account.id }, data: { memberId: leaderLinkId } });
            console.log(`  linked ${leaderEmail} to its member record`);
          } else {
            console.log(`  no account for ${leaderEmail} yet — run \`pnpm seed\` first, then re-run`);
          }
        }
      }
    },
    { timeout: 30_000 },
  );

  const orgs = await prisma.organization.count();
  const members = await prisma.member.count();
  console.log(`done — ${orgs} organisations, ${members} members`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
