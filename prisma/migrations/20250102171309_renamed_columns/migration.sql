/*
  Warnings:

  - You are about to drop the column `userA` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `userB` on the `Match` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userAId,userBId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userAId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userBId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_userA_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_userB_fkey";

-- DropIndex
DROP INDEX "Match_userA_userB_key";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "userA",
DROP COLUMN "userB",
ADD COLUMN     "userAId" INTEGER NOT NULL,
ADD COLUMN     "userBId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Match_userAId_userBId_key" ON "Match"("userAId", "userBId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
