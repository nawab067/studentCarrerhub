"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";

import {
  Card,
  CardContent,
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

 

  useEffect(() => {
    if (!classroomId) return;

    const fetchClassroom = async () => {
      try {
        setLoading(true);

        const res = await axios.get<Classroom>(
          `http://127.0.0.1:8000/classroom/${classroomId}`
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
        "http://127.0.0.1:8000/mark_attendance",
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



  return (
    <div className="flex min-h-screen bg-muted/40">
      <TeacherPortalSidebar />

      <main className="flex-1 p-6 md:ml-64">
        <Card className="max-w-5xl mx-auto shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">
              {classroom?.classroom_name || "Attendance Sheet"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Mark student attendance for today
            </p>
          </CardHeader>

          <Separator />

          <CardContent className="pt-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <>
                <ScrollArea className="h-[420px] rounded-md border">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="text-center">
                          Status
                        </TableHead>
                        <TableHead className="text-right">
                          Mark Attendance
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.name}
                          </TableCell>

                          <TableCell className="text-center">
                            {attendance[student.id] === "P" && (
                              <Badge className="bg-green-600">
                                Present
                              </Badge>
                            )}
                            {attendance[student.id] === "A" && (
                              <Badge variant="destructive">
                                Absent
                              </Badge>
                            )}
                            {!attendance[student.id] && (
                              <Badge variant="secondary">
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
                            >
                              <ToggleGroupItem value="P">
                                Present
                              </ToggleGroupItem>
                              <ToggleGroupItem value="A">
                                Absent
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>

                <div className="flex justify-end pt-4">
                  <Button
                    size="lg"
                    className="bg-sky-500 hover:bg-sky-600"
                    onClick={handleSaveAttendance}
                  >
                    Save Attendance
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-fit mb-3"
                  onClick={() => router.back()}
                >
                  ← Back
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
