import CandidatesClient from "./candidates-client";

async function getCandidates(search?: string) {
  try {
    const { prisma } = await import("@/lib/prisma");
    return await prisma.candidate.findMany({
      orderBy: { createdAt: "desc" },
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { skills: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : undefined,
      include: {
        applications: { include: { job: true } },
      },
    });
  } catch {
    return [];
  }
}

const MOCK_SCORES: Record<number, number> = {};
function getScore(idx: number) {
  if (!MOCK_SCORES[idx]) MOCK_SCORES[idx] = 60 + Math.floor((idx * 37 + 13) % 40);
  return MOCK_SCORES[idx];
}

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const candidates = await getCandidates(search);

  const enriched = candidates.map((c, i) => ({
    ...c,
    matchScore: getScore(i),
    skills: c.skills || "",
    createdAt: c.createdAt.toISOString(),
    applications: c.applications.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
      job: { ...a.job, createdAt: a.job.createdAt.toISOString() },
    })),
  }));

  return <CandidatesClient candidates={enriched} initialSearch={search || ""} />;
}
