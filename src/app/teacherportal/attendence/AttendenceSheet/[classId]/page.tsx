'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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

        const studentList = classData.students.map((stu) => ({
          id: stu._id,
          name: stu.name,
        }));

        setStudents(studentList);

      } catch (err) {
        console.error("Error fetching classroom:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classroomId]);

  const handleAttendanceChange = (studentId: string, value: "P" | "A") => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === value ? null : value,
    }));
  };

  const handleSaveAttendance = () => {
    console.log("Attendance:", attendance);
    alert("Attendance saved!");
  };

  return (
    <div className="flex min-h-screen">
      <TeacherPortalSidebar />

      <main className="flex-1 p-6 ml-0 md:ml-64 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">
          {classroom?.classroom_name || "Attendance Sheet"}
        </h1>

        {loading ? (
          <p>Loading students...</p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span className="font-medium">{student.name}</span>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={attendance[student.id] === "P"}
                        onCheckedChange={() =>
                          handleAttendanceChange(student.id, "P")
                        }
                      />
                      Present
                    </label>

                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={attendance[student.id] === "A"}
                        onCheckedChange={() =>
                          handleAttendanceChange(student.id, "A")
                        }
                      />
                      Absent
                    </label>
                  </div>
                </div>
              ))}

              <Button
                className="mt-4 bg-sky-500 hover:bg-sky-600"
                onClick={handleSaveAttendance}
              >
                Save Attendance
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
