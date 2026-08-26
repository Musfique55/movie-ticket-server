-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "invoiceUrl" TEXT,
ADD COLUMN     "paymentGatewayData" JSONB;
