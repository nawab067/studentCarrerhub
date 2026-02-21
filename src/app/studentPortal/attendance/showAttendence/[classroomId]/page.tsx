'use client';

import StudentPortalSidebar from '@/components/student-portal/student-sidebar';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

export interface StudentAttendance {
  attendance_id: string;
  student_id: string;
  user_id: string;
  student_name: string;
  roll_number: string;
  classroom_id: string;
  date: string;
  status: "present" | "absent";
}

export default function StudentAttendanceDetailsPage() {

  const router = useRouter();
  const params = useParams();

  const classroomId = params.classroomId as string;

  const [userId, setUserId] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const id = localStorage.getItem('studentId'); // this is actually user_id

    if (!id) {
      router.replace('/login');
      return;
    }

    setUserId(id);

    fetchAttendanceData(id, classroomId);

  }, [classroomId]);



  const fetchAttendanceData = async (
    userId: string,
    classroomId: string
  ) => {

    try {

      setLoading(true);

      const response = await axios.get(
        `http://127.0.0.1:8000/student-attendance/${userId}/${classroomId}`
      );
      console.log("userId:", userId);
      console.log("classroomId:", classroomId);

      console.log(response.data);

      setAttendanceData(response.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };
  return (
    <div className="min-h-screen">

      <StudentPortalSidebar />

      <main className="p-6 md:ml-64">

        <h1 className="text-2xl font-bold mb-6">
          Attendance Details
        </h1>
        {loading && <p>Loading...</p>}
        {!loading && attendanceData.length === 0 && (
          <p>No attendance found</p>
        )}

        {!loading && attendanceData.length > 0 && (

          <div className="space-y-4">

            {attendanceData.map((item) => (

              <div
                key={item.attendance_id}
                className="border p-4 rounded-lg"
              >
                <p>
                  Name:
                  {" "}
                  {item.student_name}
                </p>
                  <p>
                  Roll Number:
                  {" "}
                    {item.roll_number}
                </p>
                <p>
                  Date:
                  {" "}
                  {new Date(item.date).toLocaleDateString()}
                </p>
                <p>
                  Status:
                  <span className={
                    item.status === "present"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }>
                    {" "}{item.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}