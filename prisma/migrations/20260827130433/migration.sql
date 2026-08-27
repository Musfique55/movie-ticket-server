/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `hall` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `movie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `seat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `showSeat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `showTime` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `theatre` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `ticket` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "hall_id_name_theatreId_idx";

-- DropIndex
DROP INDEX "movie_id_name_idx";

-- DropIndex
DROP INDEX "payment_id_userId_idx";

-- DropIndex
DROP INDEX "reservation_id_userId_idx";

-- DropIndex
DROP INDEX "seat_id_type_idx";

-- DropIndex
DROP INDEX "showSeat_id_seatId_showTimeId_idx";

-- DropIndex
DROP INDEX "showTime_id_movieId_startTime_idx";

-- DropIndex
DROP INDEX "theatre_id_name_location_city_idx";

-- DropIndex
DROP INDEX "ticket_id_reservationId_showSeatId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "hall_id_key" ON "hall"("id");

-- CreateIndex
CREATE INDEX "hall_name_theatreId_idx" ON "hall"("name", "theatreId");

-- CreateIndex
CREATE UNIQUE INDEX "movie_id_key" ON "movie"("id");

-- CreateIndex
CREATE INDEX "movie_name_idx" ON "movie"("name");

-- CreateIndex
CREATE UNIQUE INDEX "payment_id_key" ON "payment"("id");

-- CreateIndex
CREATE INDEX "payment_userId_idx" ON "payment"("userId");

-- CreateIndex
CREATE INDEX "reservation_userId_idx" ON "reservation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "seat_id_key" ON "seat"("id");

-- CreateIndex
CREATE INDEX "seat_type_idx" ON "seat"("type");

-- CreateIndex
CREATE UNIQUE INDEX "showSeat_id_key" ON "showSeat"("id");

-- CreateIndex
CREATE INDEX "showSeat_seatId_showTimeId_idx" ON "showSeat"("seatId", "showTimeId");

-- CreateIndex
CREATE UNIQUE INDEX "showTime_id_key" ON "showTime"("id");

-- CreateIndex
CREATE INDEX "showTime_movieId_startTime_idx" ON "showTime"("movieId", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "theatre_id_key" ON "theatre"("id");

-- CreateIndex
CREATE INDEX "theatre_name_location_city_idx" ON "theatre"("name", "location", "city");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_id_key" ON "ticket"("id");

-- CreateIndex
CREATE INDEX "ticket_reservationId_showSeatId_idx" ON "ticket"("reservationId", "showSeatId");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");
