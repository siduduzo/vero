async function getJobs() {
  try {
    const { prisma } = await import("@/lib/prisma");
    return await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true, applications: true },
    });
  } catch {
    return [];
  }
}

const MOCK_JOBS = [
  { id: "j1", title: "Senior React Developer", description: "Build scalable frontend applications", location: "Cape Town", type: "full-time", status: "open", salary: "R80k–R110k/mo", applicationCount: 23, company: "TechCorp SA", contact: "John Smith", createdAt: "2026-05-10" },
  { id: "j2", title: "Product Manager", description: "Lead product strategy and roadmap", location: "Johannesburg", type: "full-time", status: "open", salary: "R90k–R120k/mo", applicationCount: 18, company: "Fintech Hub", contact: "Sarah Jones", createdAt: "2026-05-08" },
  { id: "j3", title: "Data Scientist", description: "Build ML models for business insights", location: "Remote", type: "full-time", status: "open", salary: "R75k–R100k/mo", applicationCount: 15, company: "Analytics Co", contact: "Mike Brown", createdAt: "2026-05-12" },
  { id: "j4", title: "UX Designer", description: "Design intuitive user experiences", location: "Cape Town", type: "contract", status: "open", salary: "R50k–R70k/mo", applicationCount: 11, company: "Design Studio", contact: "Anna Lee", createdAt: "2026-05-06" },
  { id: "j5", title: "DevOps Engineer", description: "Manage CI/CD and cloud infrastructure", location: "Remote", type: "full-time", status: "paused", salary: "R85k–R115k/mo", applicationCount: 9, company: "CloudBase", contact: "Pete Wilson", createdAt: "2026-05-03" },
  { id: "j6", title: "Marketing Manager", description: "Drive growth through marketing campaigns", location: "Durban", type: "full-time", status: "filled", salary: "R60k–R80k/mo", applicationCount: 31, company: "GrowthCo", contact: "Lisa Chen", createdAt: "2026-04-20" },
];

const statusConfig: Record<string, { bg: string; text: string }> = {
  open: { bg: "bg-[#0F7B6C]/20", text: "text-[#0F7B6C]" },
  paused: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  filled: { bg: "bg-blue-500/20", text: "text-blue-400" },
  closed: { bg: "bg-red-500/20", text: "text-red-400" },
};

const typeColors: Record<string, string> = {
  "full-time": "bg-indigo-500/20 text-indigo-300",
  "part-time": "bg-purple-500/20 text-purple-300",
  contract: "bg-orange-500/20 text-orange-300",
  freelance: "bg-cyan-500/20 text-cyan-300",
};

export default async function JobsPage() {
  const dbJobs = await getJobs();

  const jobs =
    dbJobs.length > 0
      ? dbJobs.map((j) => ({
          id: j.id,
          title: j.title,
          description: j.description,
          location: j.location,
          type: j.type,
          status: j.status,
          salary: j.salary || null,
          applicationCount: j.applications.length,
          company: j.client.company,
          contact: j.client.name,
          createdAt: j.createdAt.toISOString().split("T")[0],
        }))
      : MOCK_JOBS;

  const openCount = jobs.filter((j) => j.status === "open").length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Jobs</h1>
        <p className="text-[#5a7a8a] mt-1">
          {openCount} open · {jobs.length} total
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {jobs.map((job) => {
          const sc = statusConfig[job.status] || { bg: "bg-gray-500/20", text: "text-gray-400" };
          return (
            <div
              key={job.id}
              className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-5 hover:border-[#0F7B6C]/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold">{job.title}</h3>
                  <p className="text-[#5a7a8a] text-sm mt-0.5">{job.company}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${sc.bg} ${sc.text}`}>
                  {job.status}
                </span>
              </div>

              <p className="text-[#8fa8b8] text-sm line-clamp-2 mb-4">{job.description}</p>

              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="flex items-center gap-1 text-[#8fa8b8] text-xs">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {job.location}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-md capitalize ${typeColors[job.type] || "bg-gray-500/20 text-gray-400"}`}>
                  {job.type}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#2D3F4A]">
                <div>
                  <span className="text-[#0F7B6C] font-bold">{job.applicationCount}</span>
                  <span className="text-[#5a7a8a] text-sm"> applicants</span>
                </div>
                {job.salary && <span className="text-[#8fa8b8] text-xs">{job.salary}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
