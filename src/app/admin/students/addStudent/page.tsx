'use client';

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StudentAddPage from "@/components/admin/student-add";

export interface Student {
  _id?: number;
  name: string;
  email: string;
  state: string;
  Roll_Number: string;
  city: string;
  address: string;
  date_of_birth: string;
  phone_number: string;
  image_url: File | null;
}

export default function AddStudentPageWrapper() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.BASE_URL;

  const addStudent = async (student: Student) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", student.name);
      formData.append("email", student.email);
      formData.append("state", student.state);
      formData.append("Roll_Number", student.Roll_Number);
      formData.append("city", student.city);
      formData.append("address", student.address);
      formData.append("date_of_birth", student.date_of_birth);
      formData.append("phone_number", student.phone_number);

      if (student.image_url) {
        formData.append("image_url", student.image_url);
      }

      const response = await axios.post(
        `${baseUrl}/student_Added`,
        formData
      );

      console.log("Student added:", response.data);
      alert("Student added successfully!");
      router.push("/admin/students");

    } catch (error) {
      console.error("Error adding student:", error);
      alert("Error adding student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentAddPage
      onSubmit={addStudent}
      loading={loading}
    />
  );
}
