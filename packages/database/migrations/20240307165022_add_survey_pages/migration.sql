/*
  Warnings:

  - You are about to drop the column `questions` on the `Survey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "questions",
ADD COLUMN     "pages" JSONB NOT NULL DEFAULT '[]';
