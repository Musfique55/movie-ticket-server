-- DropIndex
DROP INDEX "email_to_idx";

-- CreateIndex
CREATE INDEX "email_to_type_idx" ON "email"("to", "type");
