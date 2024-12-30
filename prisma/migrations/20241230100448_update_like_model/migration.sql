/*
  Warnings:

  - Added the required column `direction` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LikeDirection" AS ENUM ('LIKE', 'DISLIKE');

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "direction" "LikeDirection" NOT NULL;
