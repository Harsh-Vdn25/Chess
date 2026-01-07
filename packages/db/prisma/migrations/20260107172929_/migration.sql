/*
  Warnings:

  - You are about to drop the column `WinnerId` on the `Game` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_WinnerId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "WinnerId";

-- CreateTable
CREATE TABLE "Verdict" (
    "id" SERIAL NOT NULL,
    "gameId" TEXT NOT NULL,
    "WinnerId" INTEGER NOT NULL,

    CONSTRAINT "Verdict_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Verdict_gameId_key" ON "Verdict"("gameId");

-- AddForeignKey
ALTER TABLE "Verdict" ADD CONSTRAINT "Verdict_WinnerId_fkey" FOREIGN KEY ("WinnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verdict" ADD CONSTRAINT "Verdict_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
