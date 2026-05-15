-- CreateTable
CREATE TABLE "ScrapedJob" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT 'Remote',
    "url" TEXT NOT NULL,
    "salary" TEXT,
    "type" TEXT NOT NULL DEFAULT 'full-time',
    "source" TEXT NOT NULL,
    "layer" TEXT NOT NULL DEFAULT 'hidden',
    "description" TEXT,
    "postedAt" TIMESTAMP(3),
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrapedJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedJob_url_key" ON "ScrapedJob"("url");
