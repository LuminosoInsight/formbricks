-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "questions" JSONB NOT NULL DEFAULT '[]';
