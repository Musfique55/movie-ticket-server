/*
  Warnings:

  - The values [LOCKED,BOOKED] on the enum `SeatStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `showSeat` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ShowSeatStatus" AS ENUM ('LOCKED', 'AVAILABLE', 'BOOKED');

-- Drop old column referencing old SeatStatus enum
ALTER TABLE "showSeat" DROP COLUMN "status";

-- Drop old SeatStatus enum
DROP TYPE "SeatStatus";

-- Create new SeatStatus enum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- AlterTable seat
ALTER TABLE "seat" ADD COLUMN "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable showSeat
ALTER TABLE "showSeat" ADD COLUMN "status" "ShowSeatStatus" NOT NULL DEFAULT 'AVAILABLE';
