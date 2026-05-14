const PIPELINE_FUNNEL = [
  { stage: "Applications", count: 248, color: "#3b82f6" },
  { stage: "Screened", count: 187, color: "#8b5cf6" },
  { stage: "Interviewed", count: 92, color: "#f59e0b" },
  { stage: "Offered", count: 31, color: "#0F7B6C" },
  { stage: "Hired", count: 24, color: "#10b981" },
];

const MONTHLY_PLACEMENTS = [
  { month: "Dec", value: 8 },
  { month: "Jan", value: 12 },
  { month: "Feb", value: 9 },
  { month: "Mar", value: 15 },
  { month: "Apr", value: 18 },
  { month: "May", value: 24 },
];

const TOP_SKILLS = [
  { skill: "React / Next.js", count: 63, pct: 85 },
  { skill: "Python", count: 51, pct: 69 },
  { skill: "Product Management", count: 44, pct: 59 },
  { skill: "Data Science", count: 38, pct: 51 },
  { skill: "UX Design", count: 29, pct: 39 },
  { skill: "DevOps / Cloud", count: 22, pct: 30 },
];

const AI_STATS = [
  { label: "CVs Parsed by AI", value: "1,204", delta: "+42 this week" },
  { label: "Average Match Score", value: "81%", delta: "+3% vs last month" },
  { label: "AI Shortlisting Accuracy", value: "94%", delta: "Based on recruiter feedback" },
  { label: "Time Saved per Role", value: "6.2h", delta: "vs manual process" },
];

export default function AnalyticsPage() {
  const maxMonthly = Math.max(...MONTHLY_PLACEMENTS.map((m) => m.value));
  const maxFunnel = PIPELINE_FUNNEL[0].count;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-[#5a7a8a] mt-1">Recruitment performance and AI insights</p>
      </div>

      {/* AI stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {AI_STATS.map((s) => (
          <div key={s.label} className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-5">
            <p className="text-[#5a7a8a] text-xs mb-2">{s.label}</p>
            <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
            <p className="text-[#0F7B6C] text-xs">{s.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly placements bar chart */}
        <div className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-6">Monthly Placements</h2>
          <div className="flex items-end gap-3 h-40">
            {MONTHLY_PLACEMENTS.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-white text-xs font-semibold">{m.value}</span>
                <div
                  className="w-full bg-[#0F7B6C] rounded-t-md transition-all hover:bg-[#12a090]"
                  style={{ height: `${(m.value / maxMonthly) * 100}%`, minHeight: "4px" }}
                />
                <span className="text-[#5a7a8a] text-xs">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline funnel */}
        <div className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-6">Hiring Funnel</h2>
          <div className="space-y-3">
            {PIPELINE_FUNNEL.map((stage) => {
              const pct = (stage.count / maxFunnel) * 100;
              const conversionFrom =
                PIPELINE_FUNNEL.indexOf(stage) > 0
                  ? Math.round((stage.count / PIPELINE_FUNNEL[PIPELINE_FUNNEL.indexOf(stage) - 1].count) * 100)
                  : 100;
              return (
                <div key={stage.stage}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#8fa8b8] text-sm">{stage.stage}</span>
                    <div className="flex items-center gap-3">
                      {PIPELINE_FUNNEL.indexOf(stage) > 0 && (
                        <span className="text-[#5a7a8a] text-xs">{conversionFrom}% conversion</span>
                      )}
                      <span className="text-white font-semibold text-sm">{stage.count}</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-[#2D3F4A] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: stage.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top skills */}
      <div className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-6">Top Candidate Skills in Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOP_SKILLS.map((s) => (
            <div key={s.skill}>
              <div className="flex justify-between mb-1.5">
                <span className="text-[#8fa8b8] text-sm">{s.skill}</span>
                <span className="text-white font-semibold text-sm">{s.count}</span>
              </div>
              <div className="h-2 bg-[#2D3F4A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F7B6C] rounded-full"
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
