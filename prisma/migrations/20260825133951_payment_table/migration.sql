-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'PENDING', 'FAILED');

-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';
