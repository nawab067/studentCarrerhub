import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      {/* Add dynamic padding - will need to be adjusted based on collapse state */}
      <div className="md:pl-64 transition-all duration-300">
        <main className="container mx-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}