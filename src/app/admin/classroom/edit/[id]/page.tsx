'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import ClassroomEditPage from "@/components/admin/classroom-edit";
import { useRouter, useParams } from "next/navigation";
import { classroom, teacher } from "@/app/admin/classroom/types";

export default function ClassroomEditPageWrapper() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [classroomData, setClassroomData] = useState<classroom | null>(null);
  const [teachers, setTeachers] = useState<teacher[]>([]);

  // Fetch teacher list
  const fetchTeachers = async () => {
    try {
      const res = await axios.get<teacher[]>("http://127.0.0.1:8000/teacher");
      setTeachers(res.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  // Fetch classroom data
  const getClassroom = async () => {
    try {
      setLoading(true);
      const response = await axios.get<classroom>(`http://127.0.0.1:8000/classroom/${id}`);
      setClassroomData(response.data);
    } catch (error) {
      console.error("Error fetching classroom:", error);
      alert("Failed to fetch classroom data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
    getClassroom();
  }, []);

  // Update classroom
  const update_classroom = async (data: { classroom_name: string; teacherId: string | null }) => {
  if (!classroomData) return;

  if (!data.classroom_name || data.classroom_name.trim() === "") {
    alert("Classroom name cannot be empty.");
    return;
  }

  try {
    setLoading(true);


    const studentIds = classroomData.students.map((s: any) => (typeof s === 'string' ? s : s._id));

    const payload = {
      classroom_name: data.classroom_name,
      students: studentIds,   
      teacherId: data.teacherId ?? null,
    };

    console.log("Payload sent to backend:", payload);
    await axios.put(`http://127.0.0.1:8000/classroom/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    alert("Classroom updated successfully.");
    router.push("/admin/classroom");
  } catch (error: any) {
    console.error("Error updating classroom:", error);
    alert("Failed to update classroom.");
  } finally {
    setLoading(false);
  }
};


  return (
    <ClassroomEditPage
      onSubmit={update_classroom}
      loading={loading}
      teacher={teachers}
      classroomData={classroomData}
    />
  );
}
