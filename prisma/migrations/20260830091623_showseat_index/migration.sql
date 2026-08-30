-- DropIndex
DROP INDEX "showSeat_seatId_showTimeId_idx";

-- CreateIndex
CREATE INDEX "showSeat_showTimeId_status_idx" ON "showSeat"("showTimeId", "status");
