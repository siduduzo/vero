import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchAllJobs } from "@/lib/scraper";

// Requires Vercel Pro for the full 60 s window; Hobby tier caps at 10 s.
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret");
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const jobs = await fetchAllJobs();
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

    return NextResponse.json({ ok: true, upserted, total: jobs.length });
  } catch (err) {
    console.error("[scrape] error:", err);
    return NextResponse.json({ error: "Scrape failed" }, { status: 500 });
  }
}
