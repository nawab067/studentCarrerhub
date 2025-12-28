"use client";

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
  async function fetchTeachers() {
    try {
      const res = await axios.get<teacher[]>("http://127.0.0.1:8000/teacher");
      setTeachers(res.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  }

  // Fetch classroom data
  async function getClassroom() {
    try {
      setLoading(true);
      const response = await axios.get<classroom>(
        `http://127.0.0.1:8000/classroom/${id}`
      );
      setClassroomData(response.data);
    } catch (error) {
      console.error("Error fetching classroom:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeachers();
    getClassroom();
  }, []);

  async function update_classroom(data: { classroom_name: string; teacherId: string }) {
    try {
      setLoading(true);

      await axios.put(
        `http://127.0.0.1:8000/classroom/${id}`,
        {
          ...classroomData,
          classroom_name: data.classroom_name,
          teacherId: data.teacherId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert("Classroom updated successfully.");
      router.push("/admin/classroom");
    } catch (error) {
      console.error("Error updating classroom:", error);
      alert("Error updating classroom.");
    } finally {
      setLoading(false);
    }
  }


  return (
  <ClassroomEditPage
    onSubmit={update_classroom}
    loading={loading}
    teacher={teachers}
    classroomData={classroomData}  
  />
);
}
