-- DropForeignKey
ALTER TABLE "reservation" DROP CONSTRAINT "reservation_userId_fkey";

-- AlterTable
ALTER TABLE "reservation" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
