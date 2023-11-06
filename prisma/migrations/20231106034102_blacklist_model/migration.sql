-- CreateTable
CREATE TABLE "Blacklist" (
    "token" VARCHAR(512) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Blacklist_token_key" ON "Blacklist"("token");
