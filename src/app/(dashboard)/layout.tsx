import Sidebar from "./sidebar";

async function getUnreadCount() {
  try {
    const { prisma } = await import("@/lib/prisma");
    return await prisma.notification.count({ where: { read: false } });
  } catch {
    return 0;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unreadCount = await getUnreadCount();

  return (
    <div className="flex h-screen bg-[#0d1821] overflow-hidden">
      <Sidebar unreadCount={unreadCount} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
