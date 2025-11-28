/*
  Warnings:

  - You are about to drop the column `userId` on the `Game` table. All the data in the column will be lost.
  - Added the required column `userId1` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId2` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_userId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "userId",
ADD COLUMN     "userId1" INTEGER NOT NULL,
ADD COLUMN     "userId2" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_userId1_fkey" FOREIGN KEY ("userId1") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
