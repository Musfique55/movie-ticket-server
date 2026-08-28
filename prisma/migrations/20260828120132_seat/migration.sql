/*
  Warnings:

  - You are about to drop the column `number` on the `seat` table. All the data in the column will be lost.
  - You are about to drop the column `row` on the `seat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "showSeat" DROP CONSTRAINT "showSeat_seatId_fkey";

-- DropForeignKey
ALTER TABLE "showSeat" DROP CONSTRAINT "showSeat_showTimeId_fkey";

-- DropIndex
DROP INDEX "seat_type_idx";

-- DropIndex
DROP INDEX "showTime_movieId_startTime_idx";

-- AlterTable
ALTER TABLE "seat" DROP COLUMN "number",
DROP COLUMN "row",
ADD COLUMN     "columnPosition" INTEGER,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "rowPosition" TEXT;

-- CreateIndex
CREATE INDEX "seat_type_theatreId_hallId_idx" ON "seat"("type", "theatreId", "hallId");

-- CreateIndex
CREATE INDEX "showTime_movieId_hallId_theatreId_startTime_idx" ON "showTime"("movieId", "hallId", "theatreId", "startTime");

-- AddForeignKey
ALTER TABLE "showSeat" ADD CONSTRAINT "showSeat_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "seat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "showSeat" ADD CONSTRAINT "showSeat_showTimeId_fkey" FOREIGN KEY ("showTimeId") REFERENCES "showTime"("id") ON DELETE CASCADE ON UPDATE CASCADE;
