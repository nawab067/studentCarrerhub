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

export default function AttendanceSheetPage() {
  const params = useParams();
  const classroomId = params.classId as string;

  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classroomId) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://127.0.0.1:8000/classroom/${classroomId}`
        );

        const classData: Classroom = res.data;
        setClassroom(classData);

        setStudents(
          classData.students.map((s) => ({
            id: s._id,
            name: s.name,
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classroomId]);

  const handleAttendanceChange = (
    studentId: string,
    value: "P" | "A"
  ) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSaveAttendance = () => {
    console.log(attendance);
    alert("Attendance saved successfully");
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
                              onValueChange={(val) =>
                                handleAttendanceChange(
                                  student.id,
                                  val as "P" | "A"
                                )
                              }
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
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
