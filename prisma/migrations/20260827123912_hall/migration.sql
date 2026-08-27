/*
  Warnings:

  - You are about to drop the column `theatreId` on the `showTime` table. All the data in the column will be lost.
  - Added the required column `hallId` to the `showTime` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "showTime" DROP CONSTRAINT "showTime_theatreId_fkey";

-- AlterTable
ALTER TABLE "showTime" DROP COLUMN "theatreId",
ADD COLUMN     "hallId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "hall" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "theatreId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hall_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hall_id_name_theatreId_idx" ON "hall"("id", "name", "theatreId");

-- AddForeignKey
ALTER TABLE "showTime" ADD CONSTRAINT "showTime_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "hall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hall" ADD CONSTRAINT "hall_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "theatre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
