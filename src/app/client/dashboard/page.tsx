import Link from "next/link";

const OPEN_ROLES = [
  { id: "r1", title: "Senior React Developer", location: "Cape Town", applicants: 23, shortlisted: 5, status: "Interviewing" },
  { id: "r2", title: "Product Manager", location: "Johannesburg", applicants: 18, shortlisted: 4, status: "Shortlisting" },
  { id: "r3", title: "Data Scientist", location: "Remote", applicants: 15, shortlisted: 3, status: "Reviewing" },
  { id: "r4", title: "UX Designer", location: "Cape Town", applicants: 11, shortlisted: 2, status: "New" },
];

const TIMELINE = [
  { event: "CV reviewed: Amara Nwosu", time: "2h ago", type: "review" },
  { event: "Interview scheduled: Liam Okonkwo", time: "5h ago", type: "interview" },
  { event: "4 new shortlisted candidates", time: "Yesterday", type: "shortlist" },
  { event: "Job posted: UX Designer", time: "2 days ago", type: "job" },
];

const timelineColors: Record<string, string> = {
  review: "bg-blue-500",
  interview: "bg-purple-500",
  shortlist: "bg-[#0F7B6C]",
  job: "bg-yellow-500",
};

export default function ClientDashboardPage() {
  const totalApplicants = OPEN_ROLES.reduce((sum, r) => sum + r.applicants, 0);
  const totalShortlisted = OPEN_ROLES.reduce((sum, r) => sum + r.shortlisted, 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Client Overview</h1>
        <p className="text-[#5a7a8a] mt-1">TechCorp SA — your open roles and recruitment progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Open Roles", value: OPEN_ROLES.length },
          { label: "Total Applicants", value: totalApplicants },
          { label: "Shortlisted", value: totalShortlisted },
          { label: "Interviews Booked", value: 3 },
        ].map((s) => (
          <div key={s.label} className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-5">
            <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
            <p className="text-[#5a7a8a] text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Open roles */}
        <div className="lg:col-span-2 bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Open Roles</h2>
            <Link href="/client/shortlist" className="text-[#0F7B6C] text-xs hover:underline">
              View shortlists
            </Link>
          </div>
          <div className="space-y-3">
            {OPEN_ROLES.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between bg-[#2D3F4A] rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-white font-medium text-sm">{role.title}</p>
                  <p className="text-[#5a7a8a] text-xs">{role.location}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-white text-sm font-semibold">{role.applicants}</p>
                    <p className="text-[#5a7a8a] text-xs">applicants</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#0F7B6C] text-sm font-semibold">{role.shortlisted}</p>
                    <p className="text-[#5a7a8a] text-xs">shortlisted</p>
                  </div>
                  <span className="text-xs bg-[#1a2830] text-[#8fa8b8] px-2.5 py-1 rounded-lg">
                    {role.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {TIMELINE.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${timelineColors[t.type]}`} />
                <div>
                  <p className="text-[#8fa8b8] text-sm">{t.event}</p>
                  <p className="text-[#5a7a8a] text-xs mt-0.5">{t.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
