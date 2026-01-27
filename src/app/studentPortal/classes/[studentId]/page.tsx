'use client';

import StudentPortalSidebar from '@/components/student-portal/student-sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/* =======================
   Types (match API)
======================= */

interface Classroom {
  _id: string;
  classroom_name: string;
  teacherId: string;
}

interface Teacher {
  _id: string;
  name: string;
}

interface ClassroomWithTeacher{
  _id: string;
  classroom_name: string;
  teacherId: string;
  teacherName: Teacher['name'];
}

/* =======================
   Component
======================= */

export default function StudentDashboardPage() {
  const router = useRouter();

  const [studentId, setStudentId] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassroomWithTeacher[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     Get studentId
  ======================= */
  useEffect(() => {
    const id = localStorage.getItem('studentId');

    if (!id) {
      router.replace('/login');
      return;
    }

    setStudentId(id);
  }, [router]);

  /* =======================
     Fetch classes + teachers
  ======================= */
  useEffect(() => {
    if (!studentId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch classes
        const classRes = await axios.get<
          Classroom | Classroom[]
        >(`http://127.0.0.1:8000/classes/student/${studentId}`);

        const classArray: Classroom[] = Array.isArray(classRes.data)
          ? classRes.data
          : [classRes.data];

        // 2️⃣ Fetch teachers for each class
        const classesWithTeachers: ClassroomWithTeacher[] = await Promise.all(
          classArray.map(async (cls) => {
            try {
              const teacherRes = await axios.get<
                Teacher | Teacher[]
              >(`http://127.0.0.1:8000/classes/teacher/${cls.teacherId}`);
              console.log(teacherRes.data);

              const teacher = Array.isArray(teacherRes.data)
                ? teacherRes.data[0]
                : teacherRes.data;

              return {
                ...cls,
                teacherName: teacher?.name ?? 'Unknown',
              };
            } catch {
              return {
                ...cls,
                teacherName: 'Unknown',
              };
            }
          })
        );

        setClasses(classesWithTeachers);
      } catch (error) {
        console.error('Fetch error:', error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  /* =======================
     UI
  ======================= */

  return (
    <div className="min-h-screen">
      <StudentPortalSidebar />

      <main className="p-6 md:ml-64">
        <h1 className="text-2xl font-bold">Student Classes</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your assigned classes
        </p>

        {loading ? (
          <p className="mt-6 text-gray-500">Loading classes...</p>
        ) : (
          <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <Card
                key={cls._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg capitalize">
                    {cls.classroom_name}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Teacher Name
                  </p>
                  <p className="font-medium">
                    {cls.teacherName}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
