-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "stripeEventId" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_stripeEventId_key" ON "payment"("stripeEventId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactionId_key" ON "payment"("transactionId");

-- CreateIndex
CREATE INDEX "payment_id_userId_email_idx" ON "payment"("id", "userId", "email");
