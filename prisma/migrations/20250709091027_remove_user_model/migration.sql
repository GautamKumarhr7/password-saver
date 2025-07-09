/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `userId` on the `PasswordEntry` table. All the data in the column will be lost.

*/

-- DropForeignKey
ALTER TABLE "PasswordEntry" DROP CONSTRAINT IF EXISTS "PasswordEntry_userId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "PasswordEntry_userId_idx";

-- AlterTable
ALTER TABLE "PasswordEntry" DROP COLUMN IF EXISTS "userId";

-- DropTable
DROP TABLE IF EXISTS "User";

-- CreateIndex
CREATE INDEX "PasswordEntry_title_idx" ON "PasswordEntry"("title");

-- CreateIndex
CREATE INDEX "PasswordEntry_createdAt_idx" ON "PasswordEntry"("createdAt");
