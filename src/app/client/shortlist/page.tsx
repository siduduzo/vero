const SHORTLISTED = [
  { id: "s1", name: "Amara Nwosu", role: "Senior React Developer", score: 94, skills: ["React", "TypeScript", "Node.js"], experience: "5 years", status: "Interview scheduled", email: "amara@example.com" },
  { id: "s2", name: "Kwame Mensah", role: "Senior React Developer", score: 87, skills: ["Vue.js", "JavaScript", "Docker"], experience: "6 years", status: "Under review", email: "kwame@example.com" },
  { id: "s3", name: "Liam Okonkwo", role: "Product Manager", score: 91, skills: ["Agile", "Figma", "Jira"], experience: "7 years", status: "Interview scheduled", email: "liam@example.com" },
  { id: "s4", name: "Siyanda Dlamini", role: "Data Scientist", score: 88, skills: ["Python", "TensorFlow", "SQL"], experience: "4 years", status: "Awaiting feedback", email: "siyanda@example.com" },
  { id: "s5", name: "Fatima Al-Hassan", role: "UX Designer", score: 85, skills: ["Figma", "Research", "Prototyping"], experience: "3 years", status: "Under review", email: "fatima@example.com" },
];

const statusColors: Record<string, string> = {
  "Interview scheduled": "bg-purple-500/20 text-purple-400",
  "Under review": "bg-blue-500/20 text-blue-400",
  "Awaiting feedback": "bg-yellow-500/20 text-yellow-400",
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? "#0F7B6C" : score >= 80 ? "#f59e0b" : "#6b7280";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#2D3F4A] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-sm font-bold" style={{ color }}>{score}%</span>
    </div>
  );
}

export default function ShortlistPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Shortlist</h1>
        <p className="text-[#5a7a8a] mt-1">
          {SHORTLISTED.length} candidates shortlisted for your open roles
        </p>
      </div>

      <div className="space-y-4">
        {SHORTLISTED.map((c) => (
          <div
            key={c.id}
            className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-5 hover:border-[#0F7B6C]/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#2D3F4A] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0F7B6C] font-bold text-lg">{c.name[0]}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{c.name}</h3>
                  <p className="text-[#5a7a8a] text-sm">{c.role} · {c.experience}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusColors[c.status] || "bg-gray-500/20 text-gray-400"}`}>
                  {c.status}
                </span>
                <a
                  href={`mailto:${c.email}`}
                  className="text-xs bg-[#2D3F4A] hover:bg-[#3a5060] text-[#8fa8b8] hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[#5a7a8a] text-xs mb-2">AI Match Score</p>
                <ScoreBar score={c.score} />
              </div>
              <div>
                <p className="text-[#5a7a8a] text-xs mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.skills.map((s) => (
                    <span key={s} className="text-xs bg-[#2D3F4A] text-[#8fa8b8] px-2.5 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
