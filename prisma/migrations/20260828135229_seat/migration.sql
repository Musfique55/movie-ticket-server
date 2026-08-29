/*
  Warnings:

  - Made the column `columnPosition` on table `seat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `seat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rowPosition` on table `seat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "seat" ALTER COLUMN "columnPosition" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "rowPosition" SET NOT NULL;
