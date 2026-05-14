async function getClients() {
  try {
    const { prisma } = await import("@/lib/prisma");
    return await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: { jobs: { where: { status: "open" } } },
    });
  } catch {
    return [];
  }
}

const MOCK_CLIENTS = [
  { id: "c1", company: "TechCorp SA", name: "John Smith", email: "john@techcorp.co.za", phone: "+27 21 555 0100", status: "active", openJobs: 4, totalHires: 12 },
  { id: "c2", company: "Fintech Hub", name: "Sarah Jones", email: "sarah@fintechhub.co.za", phone: "+27 11 555 0200", status: "active", openJobs: 2, totalHires: 8 },
  { id: "c3", company: "Analytics Co", name: "Mike Brown", email: "mike@analytics.co.za", phone: null, status: "active", openJobs: 3, totalHires: 5 },
  { id: "c4", company: "Design Studio", name: "Anna Lee", email: "anna@designstudio.co.za", phone: "+27 21 555 0300", status: "prospect", openJobs: 1, totalHires: 0 },
  { id: "c5", company: "CloudBase", name: "Pete Wilson", email: "pete@cloudbase.co.za", phone: "+27 31 555 0400", status: "active", openJobs: 1, totalHires: 7 },
  { id: "c6", company: "GrowthCo", name: "Lisa Chen", email: "lisa@growthco.co.za", phone: null, status: "inactive", openJobs: 0, totalHires: 3 },
];

const statusConfig: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-[#0F7B6C]/20", text: "text-[#0F7B6C]" },
  prospect: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  inactive: { bg: "bg-gray-500/20", text: "text-gray-400" },
};

export default async function ClientsPage() {
  const dbClients = await getClients();

  const clients =
    dbClients.length > 0
      ? dbClients.map((c) => ({
          id: c.id,
          company: c.company,
          name: c.name,
          email: c.email,
          phone: c.phone,
          status: c.status,
          openJobs: c.jobs.length,
          totalHires: 0,
        }))
      : MOCK_CLIENTS;

  const activeCount = clients.filter((c) => c.status === "active").length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <p className="text-[#5a7a8a] mt-1">
          {activeCount} active · {clients.length} total
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clients.map((client) => {
          const sc = statusConfig[client.status] || { bg: "bg-gray-500/20", text: "text-gray-400" };
          return (
            <div
              key={client.id}
              className="bg-[#1a2830] border border-[#2D3F4A] rounded-2xl p-5 hover:border-[#0F7B6C]/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#2D3F4A] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#0F7B6C] font-bold text-lg">{client.company[0]}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{client.company}</h3>
                    <p className="text-[#5a7a8a] text-sm">{client.name}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${sc.bg} ${sc.text}`}>
                  {client.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#8fa8b8]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {client.email}
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm text-[#8fa8b8]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.28-1.28a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {client.phone}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#2D3F4A]">
                <div className="text-center">
                  <p className="text-[#0F7B6C] font-bold text-xl">{client.openJobs}</p>
                  <p className="text-[#5a7a8a] text-xs">Open roles</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-xl">{client.totalHires}</p>
                  <p className="text-[#5a7a8a] text-xs">Total hires</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
