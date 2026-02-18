'use client';

import StudentPortalSidebar from '@/components/student-portal/student-sidebar';

export default function StudentAttendancePage() {
  return (
    <div className="flex">
      <StudentPortalSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Attendance Page
        </h1>
        <p className="text-center">
          This is where the attendance information will be displayed.
        </p>
      </div>
    </div>
  );
}
