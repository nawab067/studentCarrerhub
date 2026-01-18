'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Calendar, ArrowRight, GraduationCap, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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

  const handleViewAttendance = (cls: AssignedClass) => {
    router.push(`/teacherportal/attendence/AttendenceSheet/${cls._id}`);
  };

  const getClassColor = (index: number) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-emerald-500 to-emerald-600",
      "from-orange-500 to-orange-600",
      "from-pink-500 to-pink-600",
      "from-cyan-500 to-cyan-600",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <TeacherPortalSidebar />

      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Attendance
              </h1>
              <p className="text-slate-600">Manage and monitor your assigned classes</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {!loading && !error && assignedClasses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Classes</p>
                    <p className="text-3xl font-bold text-slate-800">{assignedClasses.length}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <BookOpen className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Students</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {assignedClasses.reduce((sum, cls) => sum + cls.students.length, 0)}
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Users className="h-7 w-7 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Avg. Class Size</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {Math.round(
                        assignedClasses.reduce((sum, cls) => sum + cls.students.length, 0) /
                          assignedClasses.length
                      )}
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-violet-100 flex items-center justify-center">
                    <GraduationCap className="h-7 w-7 text-violet-600" />
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
                  <span className="text-red-600 text-xl">!</span>
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
                <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No Classes Yet</h3>
                <p className="text-slate-500 max-w-md">
                  You don't have any classes assigned at the moment. Check back later or contact your administrator.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {assignedClasses.map((cls, index) => (
            <Card
              key={cls._id}
              className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-r ${getClassColor(index)}`}></div>

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {cls.classroom_name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Active Class
                    </Badge>
                  </div>
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getClassColor(index)} flex items-center justify-center shadow-md`}>
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Student Count */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Students</p>
                      <p className="text-xl font-bold text-slate-800">{cls.students.length}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleViewAttendance(cls)}
                  className={`w-full bg-gradient-to-r ${getClassColor(index)} hover:opacity-90 text-white font-medium py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group/btn`}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  View Attendance
                  <ArrowRight className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>

                {/* Additional Info */}
                <div className="flex items-center justify-between text-sm text-slate-500 pt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Updated today</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}