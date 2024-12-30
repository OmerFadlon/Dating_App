/*
  Warnings:

  - The values [man,woman] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - The values [LIKE,DISLIKE] on the enum `LikeDirection` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `preference` on the `User` table. All the data in the column will be lost.
  - Added the required column `City` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genderPreference` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxAgePreference` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minAgePreference` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GenderPreference" AS ENUM ('men', 'women', 'both');

-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('male', 'female', 'other');
ALTER TABLE "User" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "LikeDirection_new" AS ENUM ('like', 'dislike');
ALTER TABLE "Like" ALTER COLUMN "direction" TYPE "LikeDirection_new" USING ("direction"::text::"LikeDirection_new");
ALTER TYPE "LikeDirection" RENAME TO "LikeDirection_old";
ALTER TYPE "LikeDirection_new" RENAME TO "LikeDirection";
DROP TYPE "LikeDirection_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "preference",
ADD COLUMN     "City" TEXT NOT NULL,
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "genderPreference" "GenderPreference" NOT NULL,
ADD COLUMN     "maxAgePreference" INTEGER NOT NULL,
ADD COLUMN     "minAgePreference" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "Preference";
