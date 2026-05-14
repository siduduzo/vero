import ClientSidebar from "./client-sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0d1821] overflow-hidden">
      <ClientSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
