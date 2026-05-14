import Link from "next/link";

async function getStats() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const [totalCandidates, openJobs, activeClients, unreadNotifications, recentApplications] =
      await Promise.all([
        prisma.candidate.count({ where: { status: "active" } }),
        prisma.job.count({ where: { status: "open" } }),
        prisma.client.count({ where: { status: "active" } }),
        prisma.notification.count({ where: { read: false } }),
        prisma.application.findMany({
          take: 8,
          orderBy: { createdAt: "desc" },
          include: { candidate: true, job: { include: { client: true } } },
        }),
      ]);
    return { totalCandidates, openJobs, activeClients, unreadNotifications, recentApplications };
  } catch {
    return {
      totalCandidates: 0,
      openJobs: 0,
      activeClients: 0,
      unreadNotifications: 0,
      recentApplications: [],
    };
  }
}

const PIPELINE_STAGES = [
  { label: "Screening", color: "bg-blue-500", count: 14 },
  { label: "Interview", color: "bg-purple-500", count: 8 },
  { label: "Offer", color: "bg-yellow-500", count: 3 },
  { label: "Hired", color: "bg-[#0F7B6C]", count: 11 },
];

const TOP_MATCHES = [
  { name: "Amara Nwosu", role: "Senior Frontend Dev", score: 94, tags: ["React", "TypeScript"] },
  { name: "Liam Okonkwo", role: "Product Manager", score: 91, tags: ["Agile", "Figma"] },
  { name: "Siyanda Dlamini", role: "Data Engineer", score: 88, tags: ["Python", "Spark"] },
  { name: "Fatima Al-Hassan", role: "UX Designer", score: 85, tags: ["Figma", "Research"] },
];

const HOT_JOBS = [
  { title: "Senior React Developer", company: "TechCorp SA", applicants: 23, daysOld: 2 },
  { title: "Product Manager", company: "Fintech Hub", applicants: 18, daysOld: 4 },
  { title: "Data Scientist", company: "Analytics Co", applicants: 15, daysOld: 1 },
];

const statusColors: Record<string, string> = {
  applied: "bg-blue-500/20 text-blue-400",
  screening: "bg-yellow-500/20 text-yellow-400",
  interview: "bg-purple-500/20 text-purple-400",
  offer: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
  hired: "bg-[#0F7B6C]/20 text-[#0F7B6C]",
};

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-[#5a7a8a] mt-1">Good morning — here is your recruitment overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Candidates", value: stats.totalCandidates || 248, href: "/candidates", icon: "👥" },
          { label: "Open Jobs", value: stats.openJobs || 12, href: "/jobs", icon: "💼" },
          { label: "Active Clients", value: stats.activeClients || 7, href: "/clients", icon: "🏢" },
          { label: "Unread Alerts", value: stats.unreadNotifications || 3, href: "/notifications", icon: "🔔" },
        ].map((s) => (
          <Link key={s.label} href={s.href}>
            <div className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-5 hover:border-[#0F7B6C]/50 transition-colors cursor-pointer">
              <p className="text-2xl mb-3">{s.icon}</p>
              <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-[#5a7a8a] text-sm">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Pipeline */}
        <div className="lg:col-span-2 bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-5">Hiring Pipeline</h2>
          <div className="space-y-4">
            {PIPELINE_STAGES.map((stage) => (
              <div key={stage.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#8fa8b8] text-sm">{stage.label}</span>
                  <span className="text-white font-semibold text-sm">{stage.count}</span>
                </div>
                <div className="h-2 bg-[#2D3F4A] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stage.color} rounded-full`}
                    style={{ width: `${(stage.count / 36) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-[#2D3F4A]">
            <h3 className="text-white font-semibold mb-4">Recent Applications</h3>
            {stats.recentApplications.length > 0 ? (
              <div className="space-y-2">
                {stats.recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-white text-sm font-medium">{app.candidate.name}</span>
                      <span className="text-[#5a7a8a] text-sm"> → {app.job.title}</span>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${statusColors[app.status] || "bg-gray-500/20 text-gray-400"}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#5a7a8a] text-sm">No applications yet — add candidates to get started.</p>
            )}
          </div>
        </div>

        {/* Top matches */}
        <div className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Top Matches</h2>
            <Link href="/candidates" className="text-[#0F7B6C] text-xs hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {TOP_MATCHES.map((m) => (
              <div key={m.name} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#2D3F4A] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0F7B6C] text-sm font-bold">{m.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{m.name}</p>
                  <p className="text-[#5a7a8a] text-xs truncate">{m.role}</p>
                  <div className="flex gap-1 mt-1">
                    {m.tags.map((t) => (
                      <span key={t} className="text-[10px] bg-[#0F7B6C]/20 text-[#0F7B6C] px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-[#0F7B6C] font-bold text-sm">{m.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hot jobs */}
      <div className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Hot Jobs</h2>
          <Link href="/jobs" className="text-[#0F7B6C] text-xs hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HOT_JOBS.map((job) => (
            <div key={job.title} className="bg-[#2D3F4A] rounded-xl p-4 hover:bg-[#334a57] transition-colors">
              <p className="text-white font-medium text-sm mb-1">{job.title}</p>
              <p className="text-[#5a7a8a] text-xs mb-3">{job.company}</p>
              <div className="flex items-center justify-between">
                <span className="text-[#0F7B6C] text-xs font-semibold">{job.applicants} applicants</span>
                <span className="text-[#4a6070] text-xs">{job.daysOld}d ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
