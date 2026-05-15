"use client";

import { useState, useEffect, useCallback } from "react";

const TABS = [
  {
    id: "visible",
    label: "Layer 1 · Visible",
    description: "Jobs pulled from Greenhouse & other ATS APIs",
  },
  {
    id: "early",
    label: "Layer 2 · Early Access",
    description: "Lever ATS + RSS feeds — syncs to LinkedIn with a delay",
  },
  {
    id: "hidden",
    label: "Layer 3 · Hidden",
    description: "Scraped directly from company career pages — not on LinkedIn",
  },
];

interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  salary: string | null;
  type: string;
  source: string;
  layer: string;
  description: string | null;
  postedAt: string | null;
  scrapedAt: string;
}

function minsAgo(iso: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60_000));
}

function hoursAgo(iso: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000));
}

function relativeTime(iso: string) {
  const mins = minsAgo(iso);
  if (mins < 60) return `${mins}m ago`;
  const hrs = hoursAgo(iso);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function HiddenJobsPage() {
  const [activeTab, setActiveTab] = useState("visible");
  const [jobs, setJobs] = useState<ScrapedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/scraped-jobs");
      if (!res.ok) throw new Error("Failed to load jobs");
      const data: ScrapedJob[] = await res.json();
      setJobs(data);
      if (data.length > 0) {
        setLastRefreshed(new Date(Math.max(...data.map((j) => new Date(j.scrapedAt).getTime()))));
      }
    } catch {
      setError("Could not load jobs. Run a scrape first.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  async function handleRefresh() {
    setRefreshing(true);
    setError("");
    try {
      const res = await fetch("/api/cron/scrape", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Scrape failed");
      await fetchJobs();
      setLastRefreshed(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scrape failed");
    } finally {
      setRefreshing(false);
    }
  }

  const filtered = jobs.filter((j) => j.layer === activeTab);
  const tab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Hidden Jobs</h1>
          <p className="text-[#5a7a8a] mt-1">
            3 layers of job intelligence — from public APIs to direct career-page scrapes
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefreshed && (
            <span className="text-[#5a7a8a] text-xs">
              Last scraped {relativeTime(lastRefreshed.toISOString())}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F7B6C] hover:bg-[#0a6659] disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            >
              <path d="M23 4v6h-6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1 20v-6h6" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {refreshing ? "Scraping…" : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-[#1a2830] rounded-2xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
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

      {/* Tab description */}
      <div className="mb-5">
        <p className="text-[#8fa8b8] text-sm">{tab.description}</p>
        <p className="text-[#5a7a8a] text-xs mt-0.5">
          {loading ? "Loading…" : `${filtered.length} jobs found`}
        </p>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-[#2D3F4A] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[#2D3F4A] rounded w-1/2 mb-4" />
              <div className="h-3 bg-[#2D3F4A] rounded w-full mb-2" />
              <div className="h-3 bg-[#2D3F4A] rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Job grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-5 hover:border-[#0F7B6C]/40 transition-colors flex flex-col"
            >
              {/* Company + title */}
              <div className="mb-3">
                <h3 className="text-white font-semibold leading-snug">{job.title}</h3>
                <p className="text-[#5a7a8a] text-sm mt-0.5">{job.company}</p>
              </div>

              {/* Layer badge */}
              {job.layer === "hidden" && (
                <div className="bg-[#0F7B6C]/20 border border-[#0F7B6C]/30 rounded-lg px-3 py-2 mb-3">
                  <p className="text-[#0F7B6C] text-xs font-semibold">
                    Scraped {relativeTime(job.scrapedAt)} · Not on LinkedIn
                  </p>
                </div>
              )}
              {job.layer === "early" && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 mb-3">
                  <p className="text-yellow-400 text-xs font-semibold">
                    Found {relativeTime(job.scrapedAt)} before LinkedIn sync
                  </p>
                </div>
              )}
              {job.layer === "visible" && (
                <div className="mb-3">
                  <span className="text-xs text-[#5a7a8a] bg-[#2D3F4A] px-2 py-0.5 rounded">
                    via {job.source}
                  </span>
                </div>
              )}

              {/* Meta */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="flex items-center gap-1 text-[#8fa8b8] text-xs">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {job.location}
                </span>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md capitalize">
                  {job.type}
                </span>
              </div>

              {/* Description snippet */}
              {job.description && (
                <p className="text-[#5a7a8a] text-xs leading-relaxed mb-3 line-clamp-2">
                  {job.description}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#2D3F4A] mt-auto">
                {job.salary ? (
                  <span className="text-[#0F7B6C] text-sm font-semibold">{job.salary}</span>
                ) : (
                  <span className="text-[#3a5060] text-xs">Salary TBC</span>
                )}
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-[#0F7B6C] hover:bg-[#0a6659] text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  View Job →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-12 text-center">
          <p className="text-[#8fa8b8] font-medium mb-1">No jobs scraped yet for this layer</p>
          <p className="text-[#5a7a8a] text-sm">
            Click <strong className="text-white">Refresh</strong> to run the scraper
          </p>
        </div>
      )}
    </div>
  );
}
