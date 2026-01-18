'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, GraduationCap, Users, Notebook } from "lucide-react";

export interface AssignedClass {
  _id: string;
  classroom_name: string;
  students: string[];
  teacherId: string;
}


export default function TeacherDashboardPage() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [assignedClasses, setAssignedClasses] = useState<AssignedClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalClasses = assignedClasses.length;
  const [totalAssessments, setTotalAssessments] = useState<number>(0);


  const totalStudents = Array.from(
  new Set(
    assignedClasses.flatMap((cls) => cls.students)
  )
).length;

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
        await fetchAssessments(teacherId);

      } catch (err) {
        console.error("API ERROR:", err);
        setError("Failed to load classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [teacherId]);

 const fetchAssessments = async (teacherId: string) => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/all_assesments/${teacherId}`
    );

    const assessments = res.data.data || [];
    setTotalAssessments(assessments.length);

  } catch (err) {
    console.error("Assessment API error:", err);
    setError("Failed to load assessments.");
  }
};

 
  return (
    <div className="flex">
      {/* Sidebar */}
      <TeacherPortalSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 ml-0 md:ml-64">
        <h1 className="text-2xl font-bold mb-6"><center>Welcome To Teacher Dashboard</center></h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Students */}
          <Card className="bg-sky-100 border-sky-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                Total Students
                </CardTitle>
                <Users className="h-5 w-5 text-sky-600" />
            </CardHeader>
            <CardContent>
                {loading ? (
                <p className="text-sm text-sky-600">Loading...</p>
                ) : (
                <p className="text-2xl font-bold text-sky-700">
                    {totalStudents}
                </p>
                )}
            </CardContent>
            </Card>


          {/* Classes */}
          <Card className="bg-sky-100 border-sky-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Classes</CardTitle>
                <BookOpen className="h-5 w-5 text-sky-600" />
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold text-sky-700">
                {loading ? "Loading..." : assignedClasses.length}
                </p>
            </CardContent>
            </Card>


          {/* Assignments */}
          <Card className="bg-sky-100 border-sky-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Assignments
              </CardTitle>
              <Notebook className="h-5 w-5 text-sky-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-sky-600">Loading...</p>
              ) : (
                <p className="text-2xl font-bold text-sky-700">
                  {totalAssessments}
                </p>
              )}
            </CardContent>
          </Card>


          {/* Pass Rate */}
          <Card className="bg-sky-100 border-sky-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pass Rate
              </CardTitle>
              <GraduationCap className="h-5 w-5 text-sky-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-sky-700">92%</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
