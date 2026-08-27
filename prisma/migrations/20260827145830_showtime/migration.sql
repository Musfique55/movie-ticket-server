/*
  Warnings:

  - Made the column `theatreId` on table `showTime` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "showTime" ALTER COLUMN "theatreId" SET NOT NULL;
