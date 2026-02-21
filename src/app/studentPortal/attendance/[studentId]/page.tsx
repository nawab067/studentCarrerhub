'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import StudentPortalSidebar from '@/components/student-portal/student-sidebar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Classroom {
  _id: string;
  classroom_name: string;
}

export default function StudentAttendancePage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem('studentId');

    if (!id) {
      router.replace('/login');
      return;
    }

    setStudentId(id);
    fetchClassrooms(id);
  }, []);

  const fetchClassrooms = async (studentId: string) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/classes/student/${studentId}`
      );
      setClassrooms(res.data);
    } catch (err) {
      console.error('Error fetching classrooms:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <StudentPortalSidebar />

      <main className="ml-64">

        <div className="border-b bg-background px-8 py-6">
          <h1 className="text-3xl font-semibold">
            Attendance
          </h1>
        </div>

        <div className="p-8">

          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[120px] rounded-xl" />
              ))}
            </div>
          )}

          {!loading && classrooms.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {classrooms.map((classroom) => (
                <Card
                  key={classroom._id}
                  onClick={() =>
                    router.push(
                      `/studentPortal/attendance/showAttendence/${classroom._id}`
                    )
                  }
                  className="cursor-pointer hover:shadow-md transition"
                >
                  <CardHeader>
                    <CardTitle>
                      {classroom.classroom_name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Click to view attendance details
                    </p>
                  </CardContent>

                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
