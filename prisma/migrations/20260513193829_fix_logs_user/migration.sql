/*
  Warnings:

  - You are about to drop the column `user_id` on the `Logs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_user_id_fkey";

-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "user_id",
ADD COLUMN     "session_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
