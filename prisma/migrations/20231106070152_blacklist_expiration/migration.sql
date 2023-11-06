-- AlterTable
ALTER TABLE "Blacklist" ADD COLUMN     "exp" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Blacklist_exp_idx" ON "Blacklist"("exp" ASC);
