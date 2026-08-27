/*
  Warnings:

  - You are about to drop the column `endTime` on the `showTime` table. All the data in the column will be lost.
  - Added the required column `theatreId` to the `showTime` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "payment_id_userId_email_idx";

-- DropIndex
DROP INDEX "showTime_id_movieId_startTime_endTime_idx";

-- AlterTable
ALTER TABLE "showTime" DROP COLUMN "endTime",
ADD COLUMN     "theatreId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "movie" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theatre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theatre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "movie_id_name_idx" ON "movie"("id", "name");

-- CreateIndex
CREATE INDEX "theatre_id_name_location_city_idx" ON "theatre"("id", "name", "location", "city");

-- CreateIndex
CREATE INDEX "payment_id_userId_idx" ON "payment"("id", "userId");

-- CreateIndex
CREATE INDEX "showTime_id_movieId_startTime_idx" ON "showTime"("id", "movieId", "startTime");

-- AddForeignKey
ALTER TABLE "showTime" ADD CONSTRAINT "showTime_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "showTime" ADD CONSTRAINT "showTime_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "theatre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
