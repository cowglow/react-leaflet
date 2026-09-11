-- AlterEnum
ALTER TYPE "OrganizationType" ADD VALUE 'Group';

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "Organization_parentId_idx" ON "Organization"("parentId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
