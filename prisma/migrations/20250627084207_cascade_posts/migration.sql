-- DropForeignKey
ALTER TABLE "PostedVideo" DROP CONSTRAINT "PostedVideo_userId_fkey";

-- AddForeignKey
ALTER TABLE "PostedVideo" ADD CONSTRAINT "PostedVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
