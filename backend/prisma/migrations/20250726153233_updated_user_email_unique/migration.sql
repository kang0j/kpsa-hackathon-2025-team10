/*
  Warnings:

  - You are about to drop the column `isHealthy` on the `transaction_items` table. All the data in the column will be lost.
  - You are about to drop the column `birthdate` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transaction_items" DROP COLUMN "isHealthy",
ADD COLUMN     "commentByAI" TEXT,
ADD COLUMN     "healthyScore" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "birthdate",
DROP COLUMN "gender";
