/*
  Warnings:

  - You are about to drop the column `session_id` on the `Logs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_session_id_fkey";

-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "session_id",
ADD COLUMN     "user_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
