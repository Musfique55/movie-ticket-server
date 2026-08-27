-- AlterTable
ALTER TABLE "seat" ADD COLUMN     "hallId" TEXT,
ADD COLUMN     "theatreId" TEXT;

-- AddForeignKey
ALTER TABLE "seat" ADD CONSTRAINT "seat_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "theatre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat" ADD CONSTRAINT "seat_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "hall"("id") ON DELETE CASCADE ON UPDATE CASCADE;
