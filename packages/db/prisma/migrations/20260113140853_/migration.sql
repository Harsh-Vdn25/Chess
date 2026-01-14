/*
  Warnings:

  - You are about to drop the column `loss` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "loss",
ADD COLUMN     "Avatar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "losses" INTEGER NOT NULL DEFAULT 0;
