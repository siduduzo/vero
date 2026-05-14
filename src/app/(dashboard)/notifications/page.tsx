async function getNotifications() {
  try {
    const { prisma } = await import("@/lib/prisma");
    return await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
  } catch {
    return [];
  }
}

const MOCK_NOTIFICATIONS = [
  { id: "n1", type: "success", title: "New Match Found", message: "Amara Nwosu has a 94% match with the Senior React Developer role at TechCorp SA.", read: false, createdAt: new Date(Date.now() - 5 * 60000) },
  { id: "n2", type: "info", title: "Interview Scheduled", message: "Interview for Liam Okonkwo at Fintech Hub confirmed for tomorrow at 10:00 AM.", read: false, createdAt: new Date(Date.now() - 2 * 3600000) },
  { id: "n3", type: "warning", title: "Candidate Unresponsive", message: "No response from Kwame Mensah in 7 days. Consider following up or moving on.", read: false, createdAt: new Date(Date.now() - 24 * 3600000) },
  { id: "n4", type: "success", title: "Offer Accepted", message: "Siyanda Dlamini accepted the Data Engineer offer at Analytics Co. Placement complete!", read: true, createdAt: new Date(Date.now() - 2 * 24 * 3600000) },
  { id: "n5", type: "info", title: "New Job Posted", message: "TechCorp SA added a new role: Senior DevOps Engineer. 12 candidates match.", read: true, createdAt: new Date(Date.now() - 3 * 24 * 3600000) },
];

const typeConfig: Record<string, { icon: string; border: string; bg: string }> = {
  success: { icon: "✓", border: "border-[#0F7B6C]/30", bg: "bg-[#0F7B6C]/10" },
  info: { icon: "i", border: "border-blue-500/30", bg: "bg-blue-500/10" },
  warning: { icon: "!", border: "border-yellow-500/30", bg: "bg-yellow-500/10" },
  error: { icon: "✕", border: "border-red-500/30", bg: "bg-red-500/10" },
};

const typeIconColors: Record<string, string> = {
  success: "bg-[#0F7B6C] text-white",
  info: "bg-blue-500 text-white",
  warning: "bg-yellow-500 text-white",
  error: "bg-red-500 text-white",
};

function timeAgo(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default async function NotificationsPage() {
  const dbNotifs = await getNotifications();
  const notifications =
    dbNotifs.length > 0
      ? dbNotifs.map((n) => ({ ...n, createdAt: n.createdAt }))
      : MOCK_NOTIFICATIONS;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-[#5a7a8a] mt-1">
            {unreadCount} unread · {notifications.length} total
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="bg-[#0F7B6C] text-white text-sm font-semibold px-3 py-1.5 rounded-full">
            {unreadCount} New
          </span>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => {
          const cfg = typeConfig[n.type] || typeConfig.info;
          const iconColor = typeIconColors[n.type] || typeIconColors.info;
          return (
            <div
              key={n.id}
              className={`border rounded-2xl p-5 transition-all ${
                n.read
                  ? "bg-[#1a2830] border-[#2D3F4A] opacity-60"
                  : `${cfg.bg} ${cfg.border} border`
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${iconColor}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-semibold text-sm ${n.read ? "text-[#8fa8b8]" : "text-white"}`}>
                      {n.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!n.read && <span className="w-2 h-2 bg-[#0F7B6C] rounded-full" />}
                      <span className="text-[#5a7a8a] text-xs">{timeAgo(new Date(n.createdAt))}</span>
                    </div>
                  </div>
                  <p className={`text-sm mt-1 ${n.read ? "text-[#5a7a8a]" : "text-[#8fa8b8]"}`}>
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-12 text-center">
            <p className="text-4xl mb-3">🔔</p>
            <p className="text-[#5a7a8a]">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
