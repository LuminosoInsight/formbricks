-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "projects" TEXT[] DEFAULT ARRAY[]::TEXT[];
