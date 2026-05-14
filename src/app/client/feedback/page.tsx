"use client";

import { useState } from "react";

const CANDIDATES_TO_RATE = [
  { id: "f1", name: "Amara Nwosu", role: "Senior React Developer", interviewDate: "2026-05-13" },
  { id: "f2", name: "Liam Okonkwo", role: "Product Manager", interviewDate: "2026-05-12" },
  { id: "f3", name: "Siyanda Dlamini", role: "Data Scientist", interviewDate: "2026-05-10" },
];

type Rating = "strong_yes" | "yes" | "maybe" | "no";

interface Feedback {
  rating: Rating;
  notes: string;
  submitted: boolean;
}

const RATING_OPTIONS: { value: Rating; label: string; color: string }[] = [
  { value: "strong_yes", label: "Strong Yes", color: "border-[#0F7B6C] bg-[#0F7B6C]/20 text-[#0F7B6C]" },
  { value: "yes", label: "Yes", color: "border-green-500 bg-green-500/20 text-green-400" },
  { value: "maybe", label: "Maybe", color: "border-yellow-500 bg-yellow-500/20 text-yellow-400" },
  { value: "no", label: "No", color: "border-red-500 bg-red-500/20 text-red-400" },
];

const defaultFeedback = (): Feedback => ({ rating: "yes", notes: "", submitted: false });

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Record<string, Feedback>>(
    Object.fromEntries(CANDIDATES_TO_RATE.map((c) => [c.id, defaultFeedback()]))
  );

  function updateFeedback(id: string, update: Partial<Feedback>) {
    setFeedbacks((prev) => ({ ...prev, [id]: { ...prev[id], ...update } }));
  }

  function submit(id: string) {
    updateFeedback(id, { submitted: true });
  }

  const submittedCount = Object.values(feedbacks).filter((f) => f.submitted).length;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Interview Feedback</h1>
        <p className="text-[#5a7a8a] mt-1">
          {submittedCount}/{CANDIDATES_TO_RATE.length} feedback submitted
        </p>
      </div>

      <div className="space-y-5">
        {CANDIDATES_TO_RATE.map((candidate) => {
          const fb = feedbacks[candidate.id];
          if (fb.submitted) {
            const ratingOpt = RATING_OPTIONS.find((r) => r.value === fb.rating)!;
            return (
              <div key={candidate.id} className="bg-[#1a2830] border border-[#0F7B6C]/30 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2D3F4A] flex items-center justify-center">
                      <span className="text-[#0F7B6C] font-bold">{candidate.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{candidate.name}</p>
                      <p className="text-[#5a7a8a] text-sm">{candidate.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm px-3 py-1.5 rounded-full border font-medium ${ratingOpt.color}`}>
                      {ratingOpt.label}
                    </span>
                    <div className="w-7 h-7 bg-[#0F7B6C] rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
                {fb.notes && (
                  <p className="mt-3 text-[#8fa8b8] text-sm bg-[#2D3F4A] rounded-xl px-4 py-3">{fb.notes}</p>
                )}
              </div>
            );
          }

          return (
            <div key={candidate.id} className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#2D3F4A] flex items-center justify-center">
                  <span className="text-[#0F7B6C] font-bold">{candidate.name[0]}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{candidate.name}</p>
                  <p className="text-[#5a7a8a] text-sm">
                    {candidate.role} · Interviewed {candidate.interviewDate}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[#5a7a8a] text-xs font-medium uppercase tracking-wider mb-3">Your decision</p>
                <div className="grid grid-cols-4 gap-2">
                  {RATING_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateFeedback(candidate.id, { rating: opt.value })}
                      className={`py-2 px-1 rounded-xl border-2 text-xs font-medium text-center transition-all ${
                        fb.rating === opt.value
                          ? opt.color
                          : "border-[#2D3F4A] text-[#5a7a8a] hover:border-[#3a5060]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[#5a7a8a] text-xs font-medium uppercase tracking-wider mb-2">Notes (optional)</p>
                <textarea
                  value={fb.notes}
                  onChange={(e) => updateFeedback(candidate.id, { notes: e.target.value })}
                  rows={3}
                  placeholder="What stood out? Any concerns or highlights from the interview…"
                  className="w-full bg-[#0d1821] border border-[#2D3F4A] rounded-xl px-4 py-3 text-white placeholder-[#5a7a8a] text-sm focus:outline-none focus:border-[#0F7B6C] resize-none"
                />
              </div>

              <button
                onClick={() => submit(candidate.id)}
                className="w-full py-2.5 bg-[#0F7B6C] hover:bg-[#0a6659] text-white font-semibold rounded-xl text-sm transition-colors"
              >
                Submit Feedback
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
