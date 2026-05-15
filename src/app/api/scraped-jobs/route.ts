import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const layer = request.nextUrl.searchParams.get("layer") ?? undefined;
  const jobs = await prisma.scrapedJob.findMany({
    where: layer ? { layer } : undefined,
    orderBy: { scrapedAt: "desc" },
    take: 150,
  });
  return NextResponse.json(jobs);
}
