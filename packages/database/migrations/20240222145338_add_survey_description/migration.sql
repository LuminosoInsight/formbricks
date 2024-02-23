-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "brandColor" SET DEFAULT '#0396C2';

-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "onboardingCompleted" SET DEFAULT true;
