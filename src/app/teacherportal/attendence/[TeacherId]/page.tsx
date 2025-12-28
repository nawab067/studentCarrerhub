'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

// Attendance state type
interface AttendanceState {
  [studentId: string]: "P" | "A" | null;
}

// Student type
interface Student {
  id: string;
  name: string;
}

export default function AttendanceSheetPage() {
  const params = useParams();
  const classroomId = params.classId; // dynamic parameter from folder

  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const [className, setClassName] = useState<string>(""); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classroomId) return;

    const fetchClassData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://127.0.0.1:8000/classroom/${classroomId}`);
        
        // Verify response structure
        const cls = res.data?.data;
        if (!cls) {
          console.error("Class data not found in API response", res.data);
          setLoading(false);
          return;
        }

        // Set class name safely
        setClassName(cls.classroom_name || "Attendance Sheet");

        // Map students
        const studentObjects: Student[] = Array.isArray(cls.students)
          ? cls.students.map((s: string) => ({ id: s, name: s }))
          : [];

        setStudents(studentObjects);

        // Initialize attendance
        const initialAttendance: AttendanceState = {};
        studentObjects.forEach((student) => (initialAttendance[student.id] = null));
        setAttendance(initialAttendance);

      } catch (err) {
        console.error("Failed to fetch class data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classroomId]);

  const handleAttendanceChange = (studentId: string, value: "P" | "A") => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === value ? null : value,
    }));
  };

  const handleSaveAttendance = () => {
    console.log("Saving attendance for class:", classroomId, attendance);
    alert("Attendance saved successfully!");
    // TODO: POST to backend
  };

  return (
    <div className="flex min-h-screen">
      <TeacherPortalSidebar />
      <main className="flex-1 p-6 ml-0 md:ml-64 bg-gray-50">
        <h1 className="text-2xl font-bold mb-2">{className || "Attendance Sheet"}</h1>

        {loading ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No students found for this class.</p>
        ) : (
          <Card className="border-gray-300">
            <CardHeader>
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between border-b py-2"
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
