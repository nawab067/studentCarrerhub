"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import ClassroomAddPage from "@/components/admin/classroom-add";
import { useRouter } from "next/navigation";
import { classroom, teacher } from "@/app/admin/classroom/types";

export default function ClassroomAddPageContainer() {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<teacher[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/teacher");
        setTeachers(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTeachers();
  }, []);

  async function addClassroom(data: { classroom_name: string; teacherId: string }) {
    try {
      setLoading(true);

      await axios.post(
    "http://127.0.0.1:8000/classroom_Added",
    {
        classroom_name: data.classroom_name, 
        teacherId: data.teacherId,           
        students: []                       
    },
    {
        headers: { "Content-Type": "application/json" },
    }
    );

      router.push("/admin/classroom");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ClassroomAddPage
      onSubmit={addClassroom}
      loading={loading}
      teacher={teachers}
    />
  );
}
