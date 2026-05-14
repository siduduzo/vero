"use client";

import { useState } from "react";

interface AgentResult {
  name: string;
  status: "idle" | "running" | "done" | "error";
  output: string;
}

const AGENTS = [
  { id: "cv-analyst", name: "CV Analyst", description: "Extracts structured data from raw CV text", icon: "📄" },
  { id: "match-scorer", name: "Match Scorer", description: "Scores candidate against job requirements", icon: "🎯" },
  { id: "interview-planner", name: "Interview Planner", description: "Generates tailored interview questions", icon: "🗓️" },
  { id: "outreach-agent", name: "Outreach Agent", description: "Drafts a personalised candidate message", icon: "✉️" },
  { id: "similar-finder", name: "Similar Finder", description: "Suggests similar profiles to consider", icon: "🔍" },
  { id: "report-writer", name: "Report Writer", description: "Produces a full recruitment summary report", icon: "📊" },
];

export default function AgentsPage() {
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState<AgentResult[]>(
    AGENTS.map((a) => ({ name: a.name, status: "idle", output: "" }))
  );
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);

  async function runPipeline() {
    if (!cvText.trim()) return;
    setRunning(true);
    setCurrentStep(0);
    setResults(AGENTS.map((a) => ({ name: a.name, status: "idle", output: "" })));

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobDescription }),
      });

      if (!res.ok) throw new Error("Pipeline failed");
      const data = await res.json();

      // Animate results step by step
      for (let i = 0; i < AGENTS.length; i++) {
        setCurrentStep(i);
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "running" } : r
          )
        );
        await new Promise((r) => setTimeout(r, 400));
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i
              ? { ...r, status: "done", output: data.results?.[AGENTS[i].id] || "" }
              : r
          )
        );
      }
    } catch {
      setResults((prev) =>
        prev.map((r, idx) =>
          idx === currentStep ? { ...r, status: "error", output: "Agent failed" } : r
        )
      );
    } finally {
      setRunning(false);
      setCurrentStep(-1);
    }
  }

  function reset() {
    setCvText("");
    setJobDescription("");
    setResults(AGENTS.map((a) => ({ name: a.name, status: "idle", output: "" })));
    setCurrentStep(-1);
  }

  const allDone = results.every((r) => r.status === "done");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">AI Agent Pipeline</h1>
        <p className="text-[#5a7a8a] mt-1">6 AI agents working in sequence — each passes its output to the next</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Pipeline Input</h2>
            <div className="mb-4">
              <label className="block text-xs font-medium text-[#5a7a8a] mb-2 uppercase tracking-wider">
                Candidate CV *
              </label>
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                rows={8}
                placeholder="Paste the candidate's CV or resume here…"
                className="w-full bg-[#0d1821] border border-[#2D3F4A] rounded-xl px-4 py-3 text-white placeholder-[#5a7a8a] text-sm focus:outline-none focus:border-[#0F7B6C] resize-none"
              />
            </div>
            <div className="mb-5">
              <label className="block text-xs font-medium text-[#5a7a8a] mb-2 uppercase tracking-wider">
                Job Description (optional)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
                placeholder="Paste the job description for better matching…"
                className="w-full bg-[#0d1821] border border-[#2D3F4A] rounded-xl px-4 py-3 text-white placeholder-[#5a7a8a] text-sm focus:outline-none focus:border-[#0F7B6C] resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={runPipeline}
                disabled={!cvText.trim() || running}
                className="flex-1 py-3 bg-[#0F7B6C] hover:bg-[#0a6659] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {running ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Running…
                  </>
                ) : (
                  "Run Pipeline"
                )}
              </button>
              {(allDone || results.some((r) => r.output)) && (
                <button
                  onClick={reset}
                  className="px-4 py-3 bg-[#2D3F4A] hover:bg-[#3a5060] text-[#8fa8b8] rounded-xl transition-colors text-sm"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Pipeline flow */}
          <div className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4">Pipeline Flow</h3>
            <div className="space-y-2">
              {AGENTS.map((agent, i) => {
                const result = results[i];
                return (
                  <div key={agent.id} className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                        result.status === "done"
                          ? "bg-[#0F7B6C] text-white"
                          : result.status === "running"
                          ? "bg-yellow-500 text-white"
                          : result.status === "error"
                          ? "bg-red-500 text-white"
                          : "bg-[#2D3F4A] text-[#5a7a8a]"
                      }`}
                    >
                      {result.status === "done" ? "✓" : result.status === "running" ? "…" : i + 1}
                    </div>
                    <span
                      className={`text-sm ${
                        result.status === "done"
                          ? "text-white"
                          : result.status === "running"
                          ? "text-yellow-400"
                          : "text-[#5a7a8a]"
                      }`}
                    >
                      {agent.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Agent cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
          {AGENTS.map((agent, i) => {
            const result = results[i];
            return (
              <div
                key={agent.id}
                className={`bg-[#1a2830] border rounded-2xl p-5 transition-all ${
                  result.status === "running"
                    ? "border-yellow-500/50"
                    : result.status === "done"
                    ? "border-[#0F7B6C]/40"
                    : result.status === "error"
                    ? "border-red-500/40"
                    : "border-[#2D3F4A]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{agent.icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{agent.name}</p>
                      <p className="text-[#5a7a8a] text-xs">{agent.description}</p>
                    </div>
                  </div>
                  <StatusBadge status={result.status} />
                </div>

                <div className="mt-3 min-h-[80px]">
                  {result.status === "running" && (
                    <div className="flex items-center gap-2 text-yellow-400 text-sm">
                      <span className="w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                      Processing…
                    </div>
                  )}
                  {result.status === "done" && result.output && (
                    <div className="text-[#8fa8b8] text-xs leading-relaxed line-clamp-5">
                      {result.output}
                    </div>
                  )}
                  {result.status === "error" && (
                    <p className="text-red-400 text-xs">{result.output}</p>
                  )}
                  {result.status === "idle" && (
                    <p className="text-[#4a6070] text-xs italic">Waiting for pipeline to start…</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; color: string }> = {
    idle: { label: "Idle", color: "bg-[#2D3F4A] text-[#5a7a8a]" },
    running: { label: "Running", color: "bg-yellow-500/20 text-yellow-400" },
    done: { label: "Done", color: "bg-[#0F7B6C]/20 text-[#0F7B6C]" },
    error: { label: "Error", color: "bg-red-500/20 text-red-400" },
  };
  const { label, color } = cfg[status] || cfg.idle;
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full ${color} font-medium`}>{label}</span>
  );
}
