"use client";

import { useState, useEffect } from "react";

const TABS = [
  { id: "visible", label: "Layer 1 · Visible", description: "Jobs from public job boards and APIs" },
  { id: "early", label: "Layer 2 · Early Access", description: "Scraped before appearing on LinkedIn" },
  { id: "hidden", label: "Layer 3 · Hidden", description: "Direct from company career pages — not on LinkedIn" },
];

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  postedMinsAgo?: number;
  isGhostJob?: boolean;
  repostCount?: number;
  source?: string;
  layer: string;
}

const JOBS: Job[] = [
  { id: "v1", title: "Frontend Engineer", company: "Standard Bank", location: "Johannesburg", type: "Full-time", salary: "R85k–R110k/mo", source: "Indeed", layer: "visible" },
  { id: "v2", title: "Data Analyst", company: "Naspers", location: "Cape Town", type: "Full-time", salary: "R60k–R80k/mo", source: "LinkedIn", layer: "visible", isGhostJob: true, repostCount: 4 },
  { id: "v3", title: "DevOps Engineer", company: "Discovery", location: "Remote", type: "Remote", salary: "R90k–R120k/mo", source: "Careers24", layer: "visible" },
  { id: "v4", title: "Product Designer", company: "Takealot", location: "Cape Town", type: "Full-time", salary: "R70k–R90k/mo", source: "Glassdoor", layer: "visible", isGhostJob: true, repostCount: 2 },
  { id: "e1", title: "ML Engineer", company: "Absa", location: "Johannesburg", type: "Full-time", salary: "R100k–R130k/mo", postedMinsAgo: 14, layer: "early" },
  { id: "e2", title: "Senior Backend Dev", company: "Investec", location: "Cape Town", type: "Full-time", salary: "R95k–R125k/mo", postedMinsAgo: 31, layer: "early" },
  { id: "e3", title: "Head of Engineering", company: "Capitec Bank", location: "Stellenbosch", type: "Full-time", salary: "R150k–R200k/mo", postedMinsAgo: 52, layer: "early" },
  { id: "h1", title: "Staff Software Engineer", company: "Stitch", location: "Remote / Cape Town", type: "Full-time", salary: "R120k–R160k/mo", postedMinsAgo: 7, layer: "hidden" },
  { id: "h2", title: "Growth Lead", company: "Peach Payments", location: "Cape Town", type: "Full-time", salary: "R80k–R110k/mo", postedMinsAgo: 18, layer: "hidden" },
  { id: "h3", title: "Senior Data Engineer", company: "Planet42", location: "Johannesburg", type: "Full-time", salary: "R90k–R115k/mo", postedMinsAgo: 3, layer: "hidden" },
  { id: "h4", title: "Principal Product Manager", company: "Entersekt", location: "Stellenbosch", type: "Full-time", salary: "R130k–R170k/mo", postedMinsAgo: 42, layer: "hidden" },
];

export default function HiddenJobsPage() {
  const [activeTab, setActiveTab] = useState("visible");
  const [ghostFilter, setGhostFilter] = useState(false);
  const [nowMins, setNowMins] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setNowMins((p) => p + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const filtered = JOBS.filter((j) => {
    if (j.layer !== activeTab) return false;
    if (ghostFilter && !j.isGhostJob) return false;
    return true;
  });

  const ghostCount = JOBS.filter((j) => j.layer === activeTab && j.isGhostJob).length;
  const tab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Hidden Jobs</h1>
        <p className="text-[#5a7a8a] mt-1">
          Discover opportunities before they are widely advertised — 3 layers of job intelligence
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-[#1a2830] rounded-2xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); setGhostFilter(false); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === t.id
                ? "bg-[#0F7B6C] text-white"
                : "text-[#8fa8b8] hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab description + controls */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <p className="text-[#8fa8b8] text-sm">{tab.description}</p>
          <p className="text-[#5a7a8a] text-xs mt-0.5">{filtered.length} jobs found</p>
        </div>
        {ghostCount > 0 && (
          <button
            onClick={() => setGhostFilter(!ghostFilter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              ghostFilter
                ? "border-red-500/50 bg-red-500/10 text-red-400"
                : "border-[#2D3F4A] text-[#8fa8b8] hover:border-red-500/30"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            {ghostFilter ? "Showing ghost jobs only" : `Show ghost jobs (${ghostCount})`}
          </button>
        )}
      </div>

      {/* Job grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((job) => (
          <div
            key={job.id}
            className={`bg-[#1a2830] border rounded-2xl p-5 hover:border-[#0F7B6C]/40 transition-colors ${
              job.isGhostJob ? "border-red-500/30" : "border-[#2D3F4A]"
            }`}
          >
            {/* Company + ghost badge */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold">{job.title}</h3>
                <p className="text-[#5a7a8a] text-sm">{job.company}</p>
              </div>
              {job.isGhostJob && (
                <span className="flex items-center gap-1 bg-red-500/20 text-red-400 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Ghost ×{job.repostCount}
                </span>
              )}
            </div>

            {/* Layer 3 badge */}
            {job.layer === "hidden" && job.postedMinsAgo !== undefined && (
              <div className="bg-[#0F7B6C]/20 border border-[#0F7B6C]/30 rounded-lg px-3 py-2 mb-3">
                <p className="text-[#0F7B6C] text-xs font-semibold">
                  Found {job.postedMinsAgo + nowMins} mins ago · Not on LinkedIn
                </p>
              </div>
            )}

            {job.layer === "early" && job.postedMinsAgo !== undefined && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 mb-3">
                <p className="text-yellow-400 text-xs font-semibold">
                  {job.postedMinsAgo + nowMins} mins before LinkedIn
                </p>
              </div>
            )}

            {job.source && (
              <div className="mb-3">
                <span className="text-xs text-[#5a7a8a] bg-[#2D3F4A] px-2 py-0.5 rounded">
                  via {job.source}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="flex items-center gap-1 text-[#8fa8b8] text-xs">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {job.location}
              </span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md">{job.type}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#2D3F4A]">
              {job.salary && <span className="text-[#0F7B6C] text-sm font-semibold">{job.salary}</span>}
              <button className="ml-auto text-xs bg-[#0F7B6C] hover:bg-[#0a6659] text-white px-3 py-1.5 rounded-lg transition-colors">
                Match Candidates
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-12 text-center">
          <p className="text-[#5a7a8a]">No jobs found for the current filter</p>
        </div>
      )}
    </div>
  );
}
