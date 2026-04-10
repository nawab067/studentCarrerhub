'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  LayoutGrid,
  BookMarked,
  Sparkles
} from "lucide-react";

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
  const [collapsed, setCollapsed] = useState(false);
  const baseUrl = process.env.BASE_URL;

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
          `${baseUrl}/classes/assigned/${teacherId}`
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

  const getClassColor = (index: number) => {
    const colors = [
      { 
        gradient: "from-blue-500 to-blue-600", 
        bg: "bg-blue-50", 
        border: "border-blue-200", 
        text: "text-blue-700",
        icon: "text-blue-600"
      },
      { 
        gradient: "from-purple-500 to-purple-600", 
        bg: "bg-purple-50", 
        border: "border-purple-200", 
        text: "text-purple-700",
        icon: "text-purple-600"
      },
      { 
        gradient: "from-emerald-500 to-emerald-600", 
        bg: "bg-emerald-50", 
        border: "border-emerald-200", 
        text: "text-emerald-700",
        icon: "text-emerald-600"
      },
      { 
        gradient: "from-orange-500 to-orange-600", 
        bg: "bg-orange-50", 
        border: "border-orange-200", 
        text: "text-orange-700",
        icon: "text-orange-600"
      },
      { 
        gradient: "from-pink-500 to-pink-600", 
        bg: "bg-pink-50", 
        border: "border-pink-200", 
        text: "text-pink-700",
        icon: "text-pink-600"
      },
      { 
        gradient: "from-cyan-500 to-cyan-600", 
        bg: "bg-cyan-50", 
        border: "border-cyan-200", 
        text: "text-cyan-700",
        icon: "text-cyan-600"
      },
    ];
    return colors[index % colors.length];
  };

  const totalStudents = assignedClasses.reduce((sum, cls) => sum + cls.students.length, 0);
  const avgClassSize = assignedClasses.length > 0 ? Math.round(totalStudents / assignedClasses.length) : 0;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <TeacherPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
               <main
        className={`transition-all duration-300 min-h-screen ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <BookMarked className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                My Classes
              </h1>
              <p className="text-slate-600">Overview of all your assigned classes</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {!loading && !error && assignedClasses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Classes</p>
                    <p className="text-3xl font-bold text-slate-800">{assignedClasses.length}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <LayoutGrid className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Students</p>
                    <p className="text-3xl font-bold text-slate-800">{totalStudents}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Users className="h-7 w-7 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Avg. Class Size</p>
                    <p className="text-3xl font-bold text-slate-800">{avgClassSize}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-violet-100 flex items-center justify-center">
                    <TrendingUp className="h-7 w-7 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-16 w-16 border-4 border-blue-200 rounded-full"></div>
              <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
            <p className="mt-4 text-slate-600 font-medium">Loading your classes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-50 border-red-200 border-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 text-xl font-bold">!</span>
                </div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && assignedClasses.length === 0 && (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="py-20">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No Classes Assigned</h3>
                <p className="text-slate-500 max-w-md">
                  You don't have any classes assigned at the moment. Check back later or contact your administrator.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {assignedClasses.map((cls, index) => {
            const colors = getClassColor(index);
            return (
              <Card
                key={cls._id}
                className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
              >
                {/* Gradient Top Border */}
                <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {cls.classroom_name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="secondary" className={`${colors.bg} ${colors.text} border ${colors.border}`}>
                          <Sparkles className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-md flex-shrink-0 ml-3`}>
                      <BookOpen className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Student Count Display */}
                  <div className={`flex items-center justify-between p-4 ${colors.bg} rounded-xl border ${colors.border} transition-all duration-300 group-hover:scale-[1.02]`}>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-white shadow-sm flex items-center justify-center">
                        <Users className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Students Enrolled</p>
                        <p className={`text-2xl font-bold ${colors.text}`}>
                          {cls.students.length}
                        </p>
                      </div>
                    </div>
                    <GraduationCap className={`h-8 w-8 ${colors.icon} opacity-30`} />
                  </div>

                  {/* Class Info Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-slate-500 font-medium">Active Session</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      ID: {cls._id.slice(-6)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Info Card */}
        {!loading && !error && assignedClasses.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Manage Your Classes Effectively</h3>
                  <p className="text-sm text-slate-600">
                    You're currently teaching {assignedClasses.length} {assignedClasses.length === 1 ? 'class' : 'classes'} with a total of {totalStudents} students. 
                    Keep track of attendance, assessments, and student progress through your dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}