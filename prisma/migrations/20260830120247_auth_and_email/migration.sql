/*
  Warnings:

  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authUserId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authUserId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmailType" AS ENUM ('ACTIVATION', 'EMAIL_CHANGE', 'PASSWORD_RESET', 'BOOKING_CONFIRMATION', 'REFUND_CONFIRMATION');

-- DropIndex
DROP INDEX "user_email_idx";

-- DropIndex
DROP INDEX "user_email_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "password",
DROP COLUMN "phone",
DROP COLUMN "role",
ADD COLUMN     "authUserId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "auth_user" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_history" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email" (
    "id" TEXT NOT NULL,
    "type" "EmailType" NOT NULL,
    "from" VARCHAR(100) NOT NULL,
    "to" VARCHAR(100) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_id_key" ON "auth_user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_email_key" ON "auth_user"("email");

-- CreateIndex
CREATE INDEX "auth_user_email_idx" ON "auth_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "login_history_id_key" ON "login_history"("id");

-- CreateIndex
CREATE INDEX "login_history_email_idx" ON "login_history"("email");

-- CreateIndex
CREATE UNIQUE INDEX "email_id_key" ON "email"("id");

-- CreateIndex
CREATE INDEX "email_to_idx" ON "email"("to");

-- CreateIndex
CREATE UNIQUE INDEX "user_authUserId_key" ON "user"("authUserId");

-- CreateIndex
CREATE INDEX "user_authUserId_idx" ON "user"("authUserId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_authUserId_fkey" FOREIGN KEY ("authUserId") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
