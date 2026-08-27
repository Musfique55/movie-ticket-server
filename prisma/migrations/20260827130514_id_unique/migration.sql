-- DropIndex
DROP INDEX "user_id_email_idx";

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");
