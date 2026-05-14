"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/client/dashboard",
    label: "Overview",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/client/shortlist",
    label: "Shortlist",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="23 11 18 6 16 8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/client/feedback",
    label: "Feedback",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function ClientSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <aside className="w-64 bg-[#2D3F4A] flex flex-col h-full flex-shrink-0">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0F7B6C] flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-5 h-5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-white text-xl font-semibold tracking-tight">vero</span>
        </div>
      </div>

      <div className="px-3 mb-2">
        <p className="text-[#5a7a8a] text-xs font-medium uppercase tracking-wider px-3">Client Portal</p>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                active
                  ? "bg-[#0F7B6C] text-white"
                  : "text-[#8fa8b8] hover:text-white hover:bg-[#3a5060]"
              }`}
            >
              <span className={active ? "text-white" : "text-[#6a8a9a] group-hover:text-white"}>
                {item.icon}
              </span>
              <span className="flex-1 text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#3a5060]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#0F7B6C]/50 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">TC</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">TechCorp SA</p>
            <p className="text-[#5a7a8a] text-xs truncate">Client account</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#8fa8b8] hover:text-white hover:bg-[#3a5060] transition-all text-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );
}
