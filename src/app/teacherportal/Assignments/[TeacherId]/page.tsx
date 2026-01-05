'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Users } from "lucide-react";

export interface AssignedClass {
  _id: string;
  classroom_name: string;
  students: string[];
  teacherId: string;
}


export default function TeacherClassesPage() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [assignedClasses, setAssignedClasses] = useState<AssignedClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ 1️⃣ READ teacherId from localStorage
  useEffect(() => {
    const id = localStorage.getItem("teacherId");
    console.log("Teacher ID from localStorage:", id);

    if (!id) {
      setError("Teacher ID not found. Please login again.");
      setLoading(false);
      return;
    }

    setTeacherId(id);
  }, []);

  // ✅ 2️⃣ FETCH classes once teacherId exists
  useEffect(() => {
    if (!teacherId) return;

    const fetchClasses = async () => {
      try {
        setLoading(true);

        console.log(teacherId);
        

        const response = await axios.get(
          `http://127.0.0.1:8000/classes/assigned/${teacherId}`
        );

        console.log("FULL API RESPONSE:", response.data);

        setAssignedClasses(response.data.data || []);

      } catch (err) {
        console.error("API ERROR:", err);
        setError("Failed to load classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [teacherId]);

  return (
    <div className="flex min-h-screen">
      <TeacherPortalSidebar />

      <main className="flex-1 p-6 ml-0 md:ml-64">
        <h1 className="text-2xl font-bold mb-6">Assesments</h1>

        {loading && <p>Loading classes...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && assignedClasses.length === 0 && (
          <p className="text-gray-500">No classes assigned yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedClasses.map((cls) => (
            <Card key={cls._id} className="bg-sky-100 border-sky-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">
                  {cls.classroom_name}
                </CardTitle>
                <BookOpen className="h-5 w-5 text-sky-600" />
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Users className="h-4 w-4 text-sky-600" />
                <p className="text-md font-medium text-sky-700">
                  {cls.students.length} Students
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
