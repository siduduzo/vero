"use client";

import { useState, useMemo } from "react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  skills: string;
  status: string;
  experience: string | null;
  matchScore: number;
  applications: Array<{ id: string; status: string; job: { title: string } }>;
}

const statusColors: Record<string, string> = {
  active: "bg-[#0F7B6C]/20 text-[#0F7B6C]",
  inactive: "bg-gray-500/20 text-gray-400",
  placed: "bg-blue-500/20 text-blue-400",
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 85 ? "#0F7B6C" : score >= 70 ? "#f59e0b" : "#6b7280";
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
        style={{ borderColor: color }}
      >
        <span className="text-xs font-bold" style={{ color }}>
          {score}%
        </span>
      </div>
      <span className="text-[10px] text-[#5a7a8a] mt-0.5">match</span>
    </div>
  );
}

const MOCK_CANDIDATES: Candidate[] = [
  { id: "m1", name: "Amara Nwosu", email: "amara@example.com", skills: "React,TypeScript,Node.js,GraphQL", status: "active", experience: "5 years", matchScore: 94, applications: [] },
  { id: "m2", name: "Liam Okonkwo", email: "liam@example.com", skills: "Product,Agile,Figma,Jira", status: "active", experience: "7 years", matchScore: 91, applications: [] },
  { id: "m3", name: "Siyanda Dlamini", email: "siyanda@example.com", skills: "Python,Spark,SQL,Airflow", status: "active", experience: "4 years", matchScore: 88, applications: [{ id: "a1", status: "interview", job: { title: "Data Engineer" } }] },
  { id: "m4", name: "Fatima Al-Hassan", email: "fatima@example.com", skills: "Figma,UX Research,Prototyping", status: "active", experience: "3 years", matchScore: 85, applications: [] },
  { id: "m5", name: "Kwame Mensah", email: "kwame@example.com", skills: "Java,Spring Boot,Kubernetes,Docker", status: "active", experience: "6 years", matchScore: 82, applications: [{ id: "a2", status: "screening", job: { title: "Backend Engineer" } }] },
  { id: "m6", name: "Zoe Ndlovu", email: "zoe@example.com", skills: "Marketing,SEO,Content,HubSpot", status: "inactive", experience: "4 years", matchScore: 74, applications: [] },
];

export default function CandidatesClient({
  candidates,
  initialSearch,
}: {
  candidates: Candidate[];
  initialSearch: string;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("all");

  const source = candidates.length > 0 ? candidates : MOCK_CANDIDATES;

  const filtered = useMemo(() => {
    return source.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.skills.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [source, search, statusFilter]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Candidates</h1>
        <p className="text-[#5a7a8a] mt-1">{filtered.length} candidates matched</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5a7a8a]"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, skill, or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a2830] border border-[#2D3F4A] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#5a7a8a] text-sm focus:outline-none focus:border-[#0F7B6C]"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "inactive", "placed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                statusFilter === s
                  ? "bg-[#0F7B6C] text-white"
                  : "bg-[#1a2830] border border-[#2D3F4A] text-[#8fa8b8] hover:border-[#0F7B6C]/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-5 hover:border-[#0F7B6C]/40 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#2D3F4A] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0F7B6C] font-bold">{c.name[0]}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{c.name}</p>
                  <p className="text-[#5a7a8a] text-xs">{c.email}</p>
                </div>
              </div>
              <ScoreRing score={c.matchScore} />
            </div>

            {c.experience && (
              <p className="text-[#8fa8b8] text-xs mb-3">{c.experience} experience</p>
            )}

            <div className="flex flex-wrap gap-1.5 mb-3">
              {c.skills
                .split(",")
                .slice(0, 4)
                .map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-[#2D3F4A] text-[#8fa8b8] px-2 py-0.5 rounded-md"
                  >
                    {skill.trim()}
                  </span>
                ))}
              {c.skills.split(",").length > 4 && (
                <span className="text-xs text-[#5a7a8a]">+{c.skills.split(",").length - 4} more</span>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#2D3F4A]">
              <span
                className={`text-xs px-2.5 py-1 rounded-full capitalize ${statusColors[c.status] || "bg-gray-500/20 text-gray-400"}`}
              >
                {c.status}
              </span>
              {c.applications.length > 0 && (
                <span className="text-xs text-[#5a7a8a]">
                  {c.applications.length} application{c.applications.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-12 text-center">
          <p className="text-[#5a7a8a]">No candidates match your search</p>
        </div>
      )}
    </div>
  );
}
