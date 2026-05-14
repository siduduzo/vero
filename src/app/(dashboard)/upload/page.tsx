"use client";

import { useState, useRef } from "react";

interface ParsedCV {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  summary?: string;
  rawText?: string;
}

export default function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedCV | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function handleFile(f: File) {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setCvText(ev.target?.result as string || "");
    reader.readAsText(f);
  }

  async function handleParse() {
    const text = cvText.trim();
    if (!text) return;
    setLoading(true);
    setError("");
    setParsed(null);
    try {
      const res = await fetch("/api/parse-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Parse failed");
      setParsed(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CV");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Upload CV</h1>
        <p className="text-[#5a7a8a] mt-1">Parse candidate CVs with AI — extract skills, experience, and more</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload area */}
        <div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-4 ${
              dragging
                ? "border-[#0F7B6C] bg-[#0F7B6C]/10"
                : "border-[#2D3F4A] hover:border-[#0F7B6C]/50 bg-[#1a2830]"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="w-14 h-14 bg-[#2D3F4A] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0F7B6C" strokeWidth="1.8" className="w-7 h-7">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" />
                <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
              </svg>
            </div>
            {file ? (
              <p className="text-[#0F7B6C] font-medium">{file.name}</p>
            ) : (
              <>
                <p className="text-white font-medium mb-1">Drop a CV here or click to browse</p>
                <p className="text-[#5a7a8a] text-sm">Supports .txt, .pdf, .doc, .docx</p>
              </>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#8fa8b8] mb-2">Or paste CV text directly</label>
            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              rows={10}
              placeholder="Paste the candidate's CV or resume text here…"
              className="w-full bg-[#1a2830] border border-[#2D3F4A] rounded-xl px-4 py-3 text-white placeholder-[#5a7a8a] text-sm focus:outline-none focus:border-[#0F7B6C] resize-none"
            />
          </div>

          <button
            onClick={handleParse}
            disabled={!cvText.trim() || loading}
            className="w-full py-3 bg-[#0F7B6C] hover:bg-[#0a6659] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Parsing with AI…
              </>
            ) : (
              "Parse CV with AI"
            )}
          </button>

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          {parsed ? (
            <div className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-[#0F7B6C] rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-white font-semibold">Parsed Profile</h2>
              </div>

              {parsed.name && (
                <Field label="Name" value={parsed.name} />
              )}
              {parsed.email && (
                <Field label="Email" value={parsed.email} />
              )}
              {parsed.phone && (
                <Field label="Phone" value={parsed.phone} />
              )}
              {parsed.experience && (
                <Field label="Experience" value={parsed.experience} />
              )}
              {parsed.education && (
                <Field label="Education" value={parsed.education} />
              )}
              {parsed.skills && parsed.skills.length > 0 && (
                <div>
                  <p className="text-[#5a7a8a] text-xs font-medium uppercase tracking-wider mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {parsed.skills.map((s) => (
                      <span key={s} className="text-sm bg-[#0F7B6C]/20 text-[#0F7B6C] px-3 py-1 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {parsed.summary && (
                <div>
                  <p className="text-[#5a7a8a] text-xs font-medium uppercase tracking-wider mb-2">AI Summary</p>
                  <p className="text-[#8fa8b8] text-sm leading-relaxed">{parsed.summary}</p>
                </div>
              )}

              <div className="pt-4 border-t border-[#2D3F4A]">
                <button className="w-full py-2.5 bg-[#0F7B6C] hover:bg-[#0a6659] text-white font-medium rounded-xl text-sm transition-colors">
                  Add to Candidates
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-10 text-center">
              <div className="w-16 h-16 bg-[#2D3F4A] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="#5a7a8a" strokeWidth="1.5" className="w-8 h-8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <p className="text-white font-medium mb-1">No CV parsed yet</p>
              <p className="text-[#5a7a8a] text-sm">Upload or paste a CV to see the AI-extracted profile here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[#5a7a8a] text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white text-sm">{value}</p>
    </div>
  );
}
