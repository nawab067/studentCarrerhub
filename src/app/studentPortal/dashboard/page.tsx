'use client';

import StudentPortalSidebar from '@/components/student-portal/student-sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('studentId');

    if (!id) {
      router.replace('/login');
      return;
    }

    setStudentId(id);
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }
   return (
    <div className="min-h-screen">
      <StudentPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Content */}
       <main
            className={`p-6 lg:p-10 transition-all duration-300 ${
              collapsed ? "ml-20" : "ml-64"
            }`}
          >
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your dashboard
        </p>
      </main>
    </div>
  );
}

