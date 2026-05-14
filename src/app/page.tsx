"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function VeroLogo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#0F7B6C] flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-6 h-6">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className={`text-2xl font-semibold tracking-tight ${dark ? "text-[#2D3F4A]" : "text-white"}`}>
        vero
      </span>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"recruiter" | "client">("recruiter");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    router.push(role === "client" ? "/client/dashboard" : "/dashboard");
  }

  return (
    <div className="flex h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[#2D3F4A] flex-col justify-between p-12">
        <VeroLogo />

        <div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            True hiring,
            <br />
            powered by AI
          </h2>
          <p className="text-[#8fa8b8] text-lg mb-12">
            Match the right candidates to the right roles — faster than ever before.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "81%", label: "Match accuracy" },
              { value: "3x", label: "Faster shortlist" },
              { value: "248", label: "Active candidates" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#243540] rounded-2xl p-5">
                <p className="text-[#0F7B6C] text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-[#8fa8b8] text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#4a6070] text-sm">© 2026 Vero. True hiring, powered by AI.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <VeroLogo dark />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Sign in</h1>
          <p className="text-gray-500 mb-8">Welcome back to Vero</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F7B6C] focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F7B6C] focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["recruiter", "client"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                      role === r
                        ? "border-[#0F7B6C] bg-[#0F7B6C]/10 text-[#0F7B6C]"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0F7B6C] hover:bg-[#0a6659] disabled:opacity-60 text-white font-semibold rounded-xl transition-colors mt-2"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
