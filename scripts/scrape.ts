import { config } from "dotenv";
config({ path: ".env.local", override: true });
config({ path: ".env" });

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { fetchAllJobs } from "../src/lib/scraper";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const jobs = await fetchAllJobs();
  console.log(`\nSaving ${jobs.length} jobs to database…`);

  let upserted = 0;
  for (const job of jobs) {
    if (!job.url || !job.title) continue;
    await prisma.scrapedJob.upsert({
      where: { url: job.url },
      update: {
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary ?? null,
        type: job.type ?? "full-time",
        description: job.description ?? null,
        postedAt: job.postedAt ?? null,
        scrapedAt: new Date(),
      },
      create: {
        externalId: job.externalId ?? null,
        title: job.title,
        company: job.company,
        location: job.location,
        url: job.url,
        salary: job.salary ?? null,
        type: job.type ?? "full-time",
        source: job.source,
        layer: job.layer,
        description: job.description ?? null,
        postedAt: job.postedAt ?? null,
      },
    });
    upserted++;
  }

  console.log(`✓ ${upserted} jobs upserted`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
