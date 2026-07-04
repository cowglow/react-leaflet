import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_LEADER_EMAIL;
  if (!email) {
    throw new Error("SEED_LEADER_EMAIL must be set to seed the first leader account");
  }

  const account = await prisma.account.upsert({
    where: { email },
    update: {},
    create: { email, role: "leader" },
  });

  console.log(`Seeded leader account: ${account.email} (${account.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
