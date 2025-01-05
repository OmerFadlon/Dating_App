/*
  Warnings:

  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `matchId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `userAId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userBId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_matchId_fkey";

-- DropIndex
DROP INDEX "Match_userAId_userBId_key";

-- AlterTable
ALTER TABLE "Match" DROP CONSTRAINT "Match_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Match_pkey" PRIMARY KEY ("userAId", "userBId");

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "matchId",
ADD COLUMN     "userAId" INTEGER NOT NULL,
ADD COLUMN     "userBId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Match_userAId_idx" ON "Match"("userAId");

-- CreateIndex
CREATE INDEX "Match_userBId_idx" ON "Match"("userBId");

-- CreateIndex
CREATE INDEX "Message_userAId_userBId_idx" ON "Message"("userAId", "userBId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userAId_userBId_fkey" FOREIGN KEY ("userAId", "userBId") REFERENCES "Match"("userAId", "userBId") ON DELETE RESTRICT ON UPDATE CASCADE;
