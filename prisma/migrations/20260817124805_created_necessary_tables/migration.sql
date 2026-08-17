/*
  Warnings:

  - The values [HELD] on the enum `SeatStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Reservation` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('STANDARD', 'PREMIUM', 'VIP');

-- DropTable (must happen before AlterEnum to free the SeatStatus type dependency)
DROP TABLE "Reservation";

-- AlterEnum
BEGIN;
CREATE TYPE "SeatStatus_new" AS ENUM ('LOCKED', 'AVAILABLE', 'BOOKED');
ALTER TYPE "SeatStatus" RENAME TO "SeatStatus_old";
ALTER TYPE "SeatStatus_new" RENAME TO "SeatStatus";
DROP TYPE "SeatStatus_old";
COMMIT;

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'CONFIRMED',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seat" (
    "id" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "type" "SeatType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "showSeat" (
    "id" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "showTimeId" TEXT NOT NULL,
    "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "showSeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "showTime" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "showTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "showSeatId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_id_email_idx" ON "user"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "reservation_id_key" ON "reservation"("id");

-- CreateIndex
CREATE INDEX "reservation_id_userId_idx" ON "reservation"("id", "userId");

-- CreateIndex
CREATE INDEX "seat_id_type_idx" ON "seat"("id", "type");

-- CreateIndex
CREATE INDEX "showSeat_id_seatId_showTimeId_idx" ON "showSeat"("id", "seatId", "showTimeId");

-- CreateIndex
CREATE INDEX "showTime_id_movieId_startTime_endTime_idx" ON "showTime"("id", "movieId", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "ticket_id_reservationId_showSeatId_idx" ON "ticket"("id", "reservationId", "showSeatId");

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "showSeat" ADD CONSTRAINT "showSeat_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "showSeat" ADD CONSTRAINT "showSeat_showTimeId_fkey" FOREIGN KEY ("showTimeId") REFERENCES "showTime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_showSeatId_fkey" FOREIGN KEY ("showSeatId") REFERENCES "showSeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
