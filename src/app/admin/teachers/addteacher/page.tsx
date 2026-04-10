'use client';

import axios from "axios";
import { useState } from "react";
import AddTeacherPage from "@/components/admin/Teacher-add";
import { useRouter } from "next/navigation";

export interface Teacher {
  _id?: string;
  name: string;
  email: string;
  Teacher_Professionality: string;
  Teacher_Designation: string;
  Teacher_Phone_Number: string;
  status: string;
  image: File | null;
}

export default function AddTeacher() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  async function addTeacher(teacher: Teacher) {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", teacher.name);
      formData.append("email", teacher.email);
      formData.append("Teacher_Professionality", teacher.Teacher_Professionality);
      formData.append("Teacher_Designation", teacher.Teacher_Designation);
      formData.append("Teacher_Phone_Number", teacher.Teacher_Phone_Number);
      formData.append("status", teacher.status);
      formData.append("image", teacher.image as File);

      const response = await axios.post(
        `${baseUrl}/teacher_Added`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Teacher added:", response.data);
      alert("Teacher added successfully!");

      router.push("/admin/teachers");
    } catch (error: any) {
      console.error("Error adding teacher:", error.response?.data || error.message);
      alert("Error adding teacher. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return <AddTeacherPage onSubmit={addTeacher} loading={loading} />;
}
