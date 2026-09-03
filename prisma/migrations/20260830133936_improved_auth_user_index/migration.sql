-- DropIndex
DROP INDEX "auth_user_email_idx";

-- AlterTable
ALTER TABLE "login_history" ALTER COLUMN "ipAddress" DROP NOT NULL,
ALTER COLUMN "userAgent" DROP NOT NULL;
