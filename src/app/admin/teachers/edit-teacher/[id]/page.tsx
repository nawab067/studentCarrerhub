'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import TeacherEditPage from "@/components/admin/Teacher-edit";
import { useRouter, useParams } from "next/navigation";
import { Teacher } from "@/app/admin/teachers/addteacher/page";

export default function EditTeacherPage() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string; 

  const baseUrl = process.env.BASE_URL;


  async function getTeacher() {
    try {
      setLoading(true);
      const response = await axios.get<Teacher>(`${baseUrl}/teacher/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setTeacher(response.data);
    } catch (error) {
      console.error("Error fetching teacher:", error);
      setTeacher(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) getTeacher();
  }, [id]);


  async function handleUpdate(updatedTeacher: Teacher) {
    try {
      setUpdating(true);
      await axios.put(`${baseUrl}/teacher/${id}`, updatedTeacher, {
        headers: { "Content-Type": "application/json" },
      });
      router.push("/admin/teachers"); 
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert(" Failed to update teacher");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <div className="text-center mt-10">Loading teacher...</div>;
  if (!teacher) return <div className="text-center mt-10">Teacher not found.</div>;
  return (
    <TeacherEditPage
      teacherData={teacher}
      editTeacher={handleUpdate}
      loading={updating}
    />
  );
}
