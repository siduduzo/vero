"use client";

import { useState } from "react";

interface Candidate {
  id: string;
  name: string;
  role: string;
  score: number;
  scoreBreakdown: { label: string; value: number }[];
  skills: string[];
  experience: string;
  education: string;
  status: string;
  email: string;
  cvSummary: string;
  availability: string;
}

const SHORTLISTED: Candidate[] = [
  {
    id: "s1",
    name: "Amara Nwosu",
    role: "Senior React Developer",
    score: 94,
    scoreBreakdown: [
      { label: "Technical skills", value: 96 },
      { label: "Experience match", value: 92 },
      { label: "Culture fit", value: 94 },
    ],
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Jest"],
    experience: "5 years",
    education: "B.Sc. Computer Science, University of Lagos",
    status: "Interview scheduled",
    email: "amara@example.com",
    cvSummary:
      "Senior frontend engineer with 5 years building high-traffic React applications. Led the frontend re-architecture at FinTech startup Paystack (acquired by Stripe), improving core web vitals by 40%. Deep TypeScript expertise and a track record of mentoring junior engineers. Open to hybrid roles.",
    availability: "Available in 2 weeks",
  },
  {
    id: "s2",
    name: "Kwame Mensah",
    role: "Senior React Developer",
    score: 87,
    scoreBreakdown: [
      { label: "Technical skills", value: 89 },
      { label: "Experience match", value: 85 },
      { label: "Culture fit", value: 87 },
    ],
    skills: ["Vue.js", "JavaScript", "Docker", "React", "Python", "PostgreSQL"],
    experience: "6 years",
    education: "M.Sc. Software Engineering, University of Ghana",
    status: "Under review",
    email: "kwame@example.com",
    cvSummary:
      "Full-stack engineer who has spent 6 years building SaaS products across fintech and e-commerce. Strong Vue.js background transitioning to React; shipped production apps serving 200k+ daily active users. Comfortable across the full stack, including containerised backends with Docker and PostgreSQL.",
    availability: "Available in 4 weeks",
  },
  {
    id: "s3",
    name: "Liam Okonkwo",
    role: "Product Manager",
    score: 91,
    scoreBreakdown: [
      { label: "Strategic thinking", value: 94 },
      { label: "Experience match", value: 90 },
      { label: "Communication", value: 89 },
    ],
    skills: ["Agile", "Figma", "Jira", "SQL", "OKRs", "User Research"],
    experience: "7 years",
    education: "MBA, Lagos Business School",
    status: "Interview scheduled",
    email: "liam@example.com",
    cvSummary:
      "Product leader with 7 years taking 0-to-1 products from concept to launch. Most recently PM at Interswitch where he owned the merchant-facing dashboard (R2bn GMV). Deep experience running discovery sprints, writing tight PRDs, and collaborating with engineering and design. Thrives in high-growth environments.",
    availability: "Available in 3 weeks",
  },
  {
    id: "s4",
    name: "Siyanda Dlamini",
    role: "Data Scientist",
    score: 88,
    scoreBreakdown: [
      { label: "Technical skills", value: 90 },
      { label: "Domain knowledge", value: 87 },
      { label: "Communication", value: 87 },
    ],
    skills: ["Python", "TensorFlow", "SQL", "Spark", "dbt", "Tableau"],
    experience: "4 years",
    education: "M.Sc. Data Science, University of Cape Town",
    status: "Awaiting feedback",
    email: "siyanda@example.com",
    cvSummary:
      "Data scientist specialising in predictive modelling and ML pipelines for financial services. Built credit risk models at Standard Bank that reduced default rates by 18%. Published research on anomaly detection in transactional data. Strong communicator who can translate complex findings for non-technical stakeholders.",
    availability: "Available immediately",
  },
  {
    id: "s5",
    name: "Fatima Al-Hassan",
    role: "UX Designer",
    score: 85,
    scoreBreakdown: [
      { label: "Design quality", value: 88 },
      { label: "Research depth", value: 84 },
      { label: "Collaboration", value: 83 },
    ],
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Usability Testing"],
    experience: "3 years",
    education: "B.A. Interaction Design, AAU",
    status: "Under review",
    email: "fatima@example.com",
    cvSummary:
      "UX designer focused on complex B2B products. Redesigned the onboarding flow for a fintech app resulting in a 31% improvement in activation. Strong research background — conducts user interviews, synthesises insights, and delivers validated prototypes. Currently building out a comprehensive design system at her current role.",
    availability: "Available in 2 weeks",
  },
];

const STATUS_COLORS: Record<string, string> = {
  "Interview scheduled": "bg-purple-500/20 text-purple-400",
  "Under review": "bg-blue-500/20 text-blue-400",
  "Awaiting feedback": "bg-yellow-500/20 text-yellow-400",
};

function ScoreBar({ score, color }: { score: number; color?: string }) {
  const c = color ?? (score >= 90 ? "#0F7B6C" : score >= 80 ? "#f59e0b" : "#6b7280");
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#2D3F4A] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: c }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color: c, minWidth: "2.5rem", textAlign: "right" }}>
        {score}%
      </span>
    </div>
  );
}

function CandidateModal({
  candidate,
  onClose,
}: {
  candidate: Candidate;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState<"approve" | "info" | null>(null);
  const [done, setDone] = useState<"approve" | "info" | null>(null);
  const [error, setError] = useState("");

  async function sendNotification(action: "approve" | "info") {
    setLoading(action);
    setError("");
    const isApprove = action === "approve";
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: isApprove
            ? `Client approved ${candidate.name} for interview`
            : `Client requested more info on ${candidate.name}`,
          message: isApprove
            ? `The client has approved ${candidate.name} (${candidate.role}) for interview. Please proceed with scheduling.`
            : `The client would like more information about ${candidate.name} (${candidate.role}) before making a decision.`,
          type: isApprove ? "success" : "info",
        }),
      });
      if (!res.ok) throw new Error("Failed to send notification");
      setDone(action);
    } catch {
      setError("Could not send notification. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  const scoreColor =
    candidate.score >= 90 ? "#0F7B6C" : candidate.score >= 80 ? "#f59e0b" : "#6b7280";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#1a2830] border border-[#2D3F4A] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a2830] border-b border-[#2D3F4A] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2D3F4A] flex items-center justify-center flex-shrink-0">
              <span className="text-[#0F7B6C] font-bold text-xl">{candidate.name[0]}</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">{candidate.name}</h2>
              <p className="text-[#5a7a8a] text-sm">{candidate.role} · {candidate.experience}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5a7a8a] hover:text-white hover:bg-[#2D3F4A] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status + availability */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${STATUS_COLORS[candidate.status] ?? "bg-gray-500/20 text-gray-400"}`}>
              {candidate.status}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#8fa8b8] bg-[#2D3F4A] px-3 py-1.5 rounded-full">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
                <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {candidate.availability}
            </span>
          </div>

          {/* AI Match Score */}
          <div className="bg-[#0d1821] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#8fa8b8] text-sm font-medium">AI Match Score</p>
              <span className="text-2xl font-bold" style={{ color: scoreColor }}>
                {candidate.score}%
              </span>
            </div>
            <div className="space-y-2.5">
              {candidate.scoreBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#5a7a8a] text-xs">{item.label}</span>
                  </div>
                  <ScoreBar score={item.value} />
                </div>
              ))}
            </div>
          </div>

          {/* CV Summary */}
          <div>
            <p className="text-[#5a7a8a] text-xs font-medium uppercase tracking-wider mb-2">CV Summary</p>
            <p className="text-[#c8d8e0] text-sm leading-relaxed">{candidate.cvSummary}</p>
          </div>

          {/* Skills */}
          <div>
            <p className="text-[#5a7a8a] text-xs font-medium uppercase tracking-wider mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((s) => (
                <span key={s} className="text-xs bg-[#2D3F4A] text-[#8fa8b8] px-3 py-1 rounded-lg">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Experience + Education */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0d1821] rounded-xl p-4">
              <p className="text-[#5a7a8a] text-xs uppercase tracking-wider mb-1">Experience</p>
              <p className="text-white font-semibold">{candidate.experience}</p>
            </div>
            <div className="bg-[#0d1821] rounded-xl p-4">
              <p className="text-[#5a7a8a] text-xs uppercase tracking-wider mb-1">Education</p>
              <p className="text-white font-semibold text-sm">{candidate.education}</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* Action buttons */}
          {done ? (
            <div className="flex items-center gap-3 bg-[#0F7B6C]/10 border border-[#0F7B6C]/30 rounded-xl px-4 py-3">
              <div className="w-7 h-7 bg-[#0F7B6C] rounded-full flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[#0F7B6C] text-sm font-medium">
                {done === "approve"
                  ? "Approved for interview — recruiter notified."
                  : "More info requested — recruiter notified."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => sendNotification("info")}
                disabled={!!loading}
                className="py-3 px-4 rounded-xl border-2 border-[#2D3F4A] hover:border-[#3a5060] text-[#8fa8b8] hover:text-white text-sm font-semibold transition-all disabled:opacity-50"
              >
                {loading === "info" ? "Sending…" : "Request more info"}
              </button>
              <button
                onClick={() => sendNotification("approve")}
                disabled={!!loading}
                className="py-3 px-4 rounded-xl bg-[#0F7B6C] hover:bg-[#0a6659] text-white text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {loading === "approve" ? "Sending…" : "Approve for interview"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShortlistPage() {
  const [selected, setSelected] = useState<Candidate | null>(null);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Shortlist</h1>
        <p className="text-[#5a7a8a] mt-1">
          {SHORTLISTED.length} candidates shortlisted for your open roles — click any card to review
        </p>
      </div>

      <div className="space-y-4">
        {SHORTLISTED.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            className="w-full text-left bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-5 hover:border-[#0F7B6C]/50 hover:bg-[#1e2f38] transition-all group cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#2D3F4A] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0F7B6C] font-bold text-lg">{c.name[0]}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-[#0F7B6C] transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-[#5a7a8a] text-sm">{c.role} · {c.experience}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${STATUS_COLORS[c.status] ?? "bg-gray-500/20 text-gray-400"}`}>
                  {c.status}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#5a7a8a] group-hover:text-[#0F7B6C] transition-colors">
                  View profile
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
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
                  {c.skills.slice(0, 4).map((s) => (
                    <span key={s} className="text-xs bg-[#2D3F4A] text-[#8fa8b8] px-2.5 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                  {c.skills.length > 4 && (
                    <span className="text-xs text-[#5a7a8a] px-1 py-0.5">
                      +{c.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <CandidateModal candidate={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
