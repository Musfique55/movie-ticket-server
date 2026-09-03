/*
  Warnings:

  - You are about to drop the column `showSeatId` on the `ticket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ticket" DROP CONSTRAINT "ticket_showSeatId_fkey";

-- DropIndex
DROP INDEX "showSeat_showTimeId_status_idx";

-- DropIndex
DROP INDEX "ticket_reservationId_showSeatId_idx";

-- AlterTable
ALTER TABLE "showSeat" ADD COLUMN     "reservationId" TEXT;

-- AlterTable
ALTER TABLE "ticket" DROP COLUMN "showSeatId";

-- CreateIndex
CREATE INDEX "showSeat_showTimeId_status_reservationId_idx" ON "showSeat"("showTimeId", "status", "reservationId");

-- CreateIndex
CREATE INDEX "ticket_reservationId_idx" ON "ticket"("reservationId");

-- AddForeignKey
ALTER TABLE "showSeat" ADD CONSTRAINT "showSeat_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
