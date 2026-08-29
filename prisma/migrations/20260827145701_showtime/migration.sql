-- AlterTable
ALTER TABLE "showTime" ADD COLUMN     "theatreId" TEXT;

-- AddForeignKey
ALTER TABLE "showTime" ADD CONSTRAINT "showTime_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "theatre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
