'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // <-- import router
import axios from "axios";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

// Interface
export interface AssignedClass {
  _id: string;
  classroom_name: string;
  students: string[];
  teacherId: string;
}

interface AttendanceState {
  [studentId: string]: "P" | "A" | null;
}

export default function TeacherClassesPage() {
  const router = useRouter(); // <-- initialize router

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [assignedClasses, setAssignedClasses] = useState<AssignedClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedClass, setSelectedClass] = useState<AssignedClass | null>(null);
  const [attendance, setAttendance] = useState<AttendanceState>({});

  // Load teacherId
  useEffect(() => {
    const id = localStorage.getItem("teacherId");
    if (!id) {
      setError("Teacher ID not found. Please login again.");
      setLoading(false);
      return;
    }
    setTeacherId(id);
  }, []);

  // Fetch classes
  useEffect(() => {
    if (!teacherId) return;

    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/classes/assigned/${teacherId}`);
        setAssignedClasses(response.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [teacherId]);

  // Navigate to attendance page
  const handleOpenAttendance = (cls: AssignedClass) => {
    router.push(`/teacherportal/attendence/${cls._id}/AttendenceSheet`); // <-- navigate to dynamic attendance page
  };

  return (
    <div className="flex min-h-screen">
      <TeacherPortalSidebar />
      <main className="flex-1 p-6 ml-0 md:ml-64">
        <h1 className="text-2xl font-bold mb-6">Attendance Overview</h1>

        {loading && <p>Loading classes...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && assignedClasses.length === 0 && (
          <p className="text-gray-500">No classes assigned yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedClasses.map((cls) => (
            <Card key={cls._id} className="bg-sky-100 border-sky-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">{cls.classroom_name}</CardTitle>
                <BookOpen className="h-5 w-5 text-sky-600" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-sky-600" />
                  <p className="text-md font-medium text-sky-700">
                    {cls.students.length} Students
                  </p>
                </div>

                <Button
                  className="w-full bg-sky-500 hover:bg-sky-600"
                  onClick={() => handleOpenAttendance(cls)}
                >
                  View Attendance
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
