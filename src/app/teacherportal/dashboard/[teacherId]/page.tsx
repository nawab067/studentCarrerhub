'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, GraduationCap, Users, Notebook, TrendingUp, Award, Activity } from "lucide-react";

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
   const [collapsed, setCollapsed] = useState(false);

   const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

  const totalStudents = Array.from(
    new Set(assignedClasses.flatMap((cls) => cls.students))
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
          `${baseurl}/classes/assigned/${teacherId}`
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
        `${baseurl}/all_assesments/${teacherId}`
      );

      const assessments = res.data.data || [];
      setTotalAssessments(assessments.length);
    } catch (err) {
      console.error("Assessment API error:", err);
      setError("Failed to load assessments.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <TeacherPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN CONTENT */}
       <main
  className={`transition-all duration-300 min-h-screen ${
    collapsed ? "ml-16" : "ml-64"
  }`}
>
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Welcome Back, Teacher
          </h1>
          <p className="text-slate-600 text-lg">Here's what's happening with your classes today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Students */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 group hover:scale-105">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-white/90">
                Total Students
              </CardTitle>
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <p className="text-sm text-white/80">Loading...</p>
                </div>
              ) : (
                <>
                  <p className="text-4xl font-bold text-white mb-1">
                    {totalStudents}
                  </p>
                  <div className="flex items-center text-white/80 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>Active learners</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Classes */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-500 to-emerald-600 group hover:scale-105">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-white/90">
                Classes
              </CardTitle>
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <p className="text-sm text-white/80">Loading...</p>
                </div>
              ) : (
                <>
                  <p className="text-4xl font-bold text-white mb-1">
                    {assignedClasses.length}
                  </p>
                  <div className="flex items-center text-white/80 text-sm">
                    <Activity className="h-4 w-4 mr-1" />
                    <span>Active classes</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-violet-500 to-violet-600 group hover:scale-105">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-white/90">
                Assignments
              </CardTitle>
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Notebook className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <p className="text-sm text-white/80">Loading...</p>
                </div>
              ) : (
                <>
                  <p className="text-4xl font-bold text-white mb-1">
                    {totalAssessments}
                  </p>
                  <div className="flex items-center text-white/80 text-sm">
                    <Award className="h-4 w-4 mr-1" />
                    <span>Total assessments</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Pass Rate */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-500 to-orange-500 group hover:scale-105">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-white/90">
                Pass Rate
              </CardTitle>
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-4xl font-bold text-white mb-1">92%</p>
              <div className="flex items-center text-white/80 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Excellent performance</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Student Engagement</p>
                <p className="text-xl font-bold text-slate-800">High</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Activity className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Avg. Class Size</p>
                <p className="text-xl font-bold text-slate-800">
                  {totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-xl bg-violet-100 flex items-center justify-center">
                <Award className="h-7 w-7 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Success Rate</p>
                <p className="text-xl font-bold text-slate-800">Excellent</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}