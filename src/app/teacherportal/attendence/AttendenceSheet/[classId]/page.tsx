"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Save,
  UserCheck,
  UserX,
  AlertCircle
} from "lucide-react";

/* =======================
   Types
======================= */

interface Student {
  id: string;
  name: string;
}

interface AttendanceState {
  [studentId: string]: "P" | "A" | null;
}

interface Classroom {
  _id: string;
  classroom_name: string;
  students: {
    _id: string;
    name: string;
  }[];
}

interface AttendanceItem {
  student_id: string;
  status: "P" | "A";
}

interface AttendancePayload {
  classroom_id: string;
  attendance: AttendanceItem[];
}

/* =======================
   Component
======================= */

export default function AttendanceSheetPage() {
  const params = useParams();
  const classroomId = params.classId as string;

  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const baseurl = process.env.NEXT_PUBLIC_BASE_URL;
  useEffect(() => {
    if (!classroomId) return;

    const fetchClassroom = async () => {
      try {
        setLoading(true);

        const res = await axios.get<Classroom>(
          `${baseurl}/classroom/${classroomId}`
        );

        setClassroom(res.data);

        setStudents(
          res.data.students.map((s) => ({
            id: s._id,
            name: s.name,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch classroom:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [classroomId]);

  const handleAttendanceChange = (studentId: string, value: "P" | "A") => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      const attendanceArray: AttendanceItem[] = Object.entries(attendance)
        .filter(([, status]) => status !== null)
        .map(([studentId, status]) => ({
          student_id: studentId,
          status: status as "P" | "A",
        }));

      if (attendanceArray.length === 0) {
        alert("Please mark attendance before saving");
        return;
      }

      const payload: AttendancePayload = {
        classroom_id: classroomId,
        attendance: attendanceArray,
      };

      const response = await axios.post(
        `${baseurl}/mark_attendance`,
        payload
      );

      alert(response.data.message);
    } catch (error: any) {
      console.error("Attendance error:", error?.response?.data || error);
      alert(
        error?.response?.data?.message || "Failed to save attendance"
      );
    }
  };

  // Calculate statistics
  const presentCount = Object.values(attendance).filter(s => s === "P").length;
  const absentCount = Object.values(attendance).filter(s => s === "A").length;
  const unmarkedCount = students.length - presentCount - absentCount;

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <TeacherPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
               <main
        className={`transition-all duration-300 min-h-screen ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 hover:bg-white/80"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </Button>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Card */}
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold">
                      {classroom?.classroom_name || "Attendance Sheet"}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-blue-100 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {getTodayDate()}
                  </CardDescription>
                </div>
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Statistics Cards */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Total Students</p>
                      <p className="text-3xl font-bold text-slate-800">{students.length}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Present</p>
                      <p className="text-3xl font-bold text-green-600">{presentCount}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Absent</p>
                      <p className="text-3xl font-bold text-red-600">{absentCount}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <UserX className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Unmarked</p>
                      <p className="text-3xl font-bold text-orange-600">{unmarkedCount}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Attendance Card */}
          <Card className="bg-white border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    Mark Attendance
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Select Present or Absent for each student
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {students.length} Students
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <>
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader className="sticky top-0 bg-slate-50 z-10">
                        <TableRow className="hover:bg-slate-50">
                          <TableHead className="font-semibold text-slate-700">
                            Student Name
                          </TableHead>
                          <TableHead className="text-center font-semibold text-slate-700">
                            Current Status
                          </TableHead>
                          <TableHead className="text-right font-semibold text-slate-700">
                            Mark Attendance
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {students.map((student, index) => (
                          <TableRow 
                            key={student.id}
                            className="hover:bg-blue-50/50 transition-colors"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                                  {student.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-slate-800">{student.name}</span>
                              </div>
                            </TableCell>

                            <TableCell className="text-center">
                              {attendance[student.id] === "P" && (
                                <Badge className="bg-green-600 hover:bg-green-700 shadow-sm">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Present
                                </Badge>
                              )}
                              {attendance[student.id] === "A" && (
                                <Badge variant="destructive" className="shadow-sm">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Absent
                                </Badge>
                              )}
                              {!attendance[student.id] && (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Not Marked
                                </Badge>
                              )}
                            </TableCell>

                            <TableCell className="text-right">
                              <ToggleGroup
                                type="single"
                                value={attendance[student.id] ?? ""}
                                onValueChange={(val) => {
                                  if (!val) return;
                                  handleAttendanceChange(
                                    student.id,
                                    val as "P" | "A"
                                  );
                                }}
                                className="justify-end gap-2"
                              >
                                <ToggleGroupItem 
                                  value="P" 
                                  className="data-[state=on]:bg-green-600 data-[state=on]:text-white hover:bg-green-100 border-green-200"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Present
                                </ToggleGroupItem>
                                <ToggleGroupItem 
                                  value="A"
                                  className="data-[state=on]:bg-red-600 data-[state=on]:text-white hover:bg-red-100 border-red-200"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Absent
                                </ToggleGroupItem>
                              </ToggleGroup>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>

                  <Separator />

                  {/* Action Footer */}
                  <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        <span className="font-semibold">{presentCount + absentCount}</span> of <span className="font-semibold">{students.length}</span> students marked
                      </div>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                        onClick={handleSaveAttendance}
                      >
                        <Save className="h-5 w-5 mr-2" />
                        Save Attendance
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}