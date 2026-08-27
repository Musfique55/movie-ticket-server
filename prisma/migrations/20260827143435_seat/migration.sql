/*
  Warnings:

  - Made the column `hallId` on table `seat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `theatreId` on table `seat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "seat" ALTER COLUMN "hallId" SET NOT NULL,
ALTER COLUMN "theatreId" SET NOT NULL;
