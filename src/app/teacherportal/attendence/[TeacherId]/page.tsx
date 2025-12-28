'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Interface
export interface AssignedClass {
  _id: string;
  classroom_name: string;
  students: string[];
  teacherId: string;
}

interface AttendanceState {
  [studentId: string]: "P" | "A" | null;
}

export default function TeacherClassesPage() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [assignedClasses, setAssignedClasses] = useState<AssignedClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<AssignedClass | null>(null);
  const [attendance, setAttendance] = useState<AttendanceState>({});

  // Load teacherId
  useEffect(() => {
    const id = localStorage.getItem("teacherId");
    if (!id) {
      setError("Teacher ID not found. Please login again.");
      setLoading(false);
      return;
    }
    setTeacherId(id);
  }, []);

  // Fetch classes
  useEffect(() => {
    if (!teacherId) return;

    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/classes/assigned/${teacherId}`);
        setAssignedClasses(response.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [teacherId]);

  // Open modal
  const handleOpenModal = (cls: AssignedClass) => {
    setSelectedClass(cls);

    // Initialize attendance state for each student
    const initialAttendance: AttendanceState = {};
    cls.students.forEach(student => {
      initialAttendance[student] = null;
    });
    setAttendance(initialAttendance);

    setShowModal(true);
  };

  // Handle checkbox change
  const handleAttendanceChange = (studentId: string, value: "P" | "A") => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === value ? null : value, // toggle
    }));
  };

  // Save attendance
  const handleSaveAttendance = () => {
    console.log("Attendance for class", selectedClass?._id, attendance);
    // TODO: Send POST request to backend
    setShowModal(false);
  };

  return (
    <div className="flex min-h-screen">
      <TeacherPortalSidebar />
      <main className="flex-1 p-6 ml-0 md:ml-64">
        <h1 className="text-2xl font-bold mb-6">Attendance Overview</h1>

        {loading && <p>Loading classes...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && assignedClasses.length === 0 && (
          <p className="text-gray-500">No classes assigned yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedClasses.map((cls) => (
            <Card key={cls._id} className="bg-sky-100 border-sky-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">{cls.classroom_name}</CardTitle>
                <BookOpen className="h-5 w-5 text-sky-600" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-sky-600" />
                  <p className="text-md font-medium text-sky-700">
                    {cls.students.length} Students
                  </p>
                </div>

                <Button
                  className="w-full bg-sky-500 hover:bg-sky-600"
                  onClick={() => handleOpenModal(cls)}
                >
                  View Attendance
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal */}
        {showModal && selectedClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold mb-4">{selectedClass.classroom_name} - Attendance</h2>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {selectedClass.students.map((student) => (
                  <div key={student} className="flex items-center justify-between border p-2 rounded">
                    <span>{student}</span>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={attendance[student] === "P"}
                          onChange={() => handleAttendanceChange(student, "P")}
                        />
                        P
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={attendance[student] === "A"}
                          onChange={() => handleAttendanceChange(student, "A")}
                        />
                        A
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="mt-4 w-full bg-sky-500 hover:bg-sky-600"
                onClick={handleSaveAttendance}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
