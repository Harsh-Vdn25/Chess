/*
  Warnings:

  - You are about to drop the column `WinnerId` on the `Verdict` table. All the data in the column will be lost.
  - Added the required column `loserId` to the `Verdict` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerId` to the `Verdict` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Verdict" DROP CONSTRAINT "Verdict_WinnerId_fkey";

-- AlterTable
ALTER TABLE "Verdict" DROP COLUMN "WinnerId",
ADD COLUMN     "loserId" INTEGER NOT NULL,
ADD COLUMN     "winnerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Verdict" ADD CONSTRAINT "Verdict_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verdict" ADD CONSTRAINT "Verdict_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
