'use client';

import axios from "axios";
import { useState } from "react";
import StudentAddPage from "@/components/admin/student-add";  
import { useRouter } from "next/navigation";

export interface student {
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
export interface studentList{
  student_ids : number[]
}

export default function AddstudentPageWrapper(){

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  async function addStudent(student: student){
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", student.name);
      formData.append("email", student.email);
      formData.append("state", student.state);
      formData.append("city", student.city);
      formData.append("Roll_Number", student.Roll_Number);
      formData.append("address", student.address);
      formData.append("date_of_birth", student.date_of_birth);
      formData.append("phone_number", student.phone_number);
      
      if (student.image_url) {
        formData.append("image_url", student.image_url);
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/student_Added",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Student added:", response.data);
      alert("Student added successfully!");
      router.push('/admin/students');

    } catch (error: any) {
      console.error("Error adding student:", error.response?.data || error.message);
      alert("Error adding student. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <StudentAddPage onSubmit={addStudent} loading={loading} />
    </div>
  );
}
