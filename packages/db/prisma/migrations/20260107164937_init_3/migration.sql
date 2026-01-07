/*
  Warnings:

  - Added the required column `WinnerId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "WinnerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_WinnerId_fkey" FOREIGN KEY ("WinnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
