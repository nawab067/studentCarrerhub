// File: src/app/admin/students/edit/[id]/page.tsx
'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import StudentEditPage from "@/components/admin/student-edit";
import { useRouter, useParams } from "next/navigation";
import { Student } from "@/app/admin/students/addStudent/page";

export default function EditstudentPageWrapper() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState<Student| null>(null);
  const baseUrl = process.env.BASE_URL;

  // Fetch student data on load
  async function getStudent() {
    try {
      setLoading(true);
      const response = await axios.get<Student>(
        `${baseUrl}/student/${params.id}`
      );
      setStudentData(response.data);
    } catch (error: any) {
      console.error("Error fetching student:", error.response?.data || error.message);
      alert("Error loading student.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getStudent();
  }, []);

  // Update student
  async function editStudent(updatedStudent: Student) {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", updatedStudent.name);
      formData.append("email", updatedStudent.email);
      formData.append("state", updatedStudent.state);
      formData.append("city", updatedStudent.city);
      formData.append("roll_number", updatedStudent.Roll_Number);
      formData.append("address", updatedStudent.address);
      formData.append("date_of_birth", updatedStudent.date_of_birth);
      formData.append("phone_number", updatedStudent.phone_number);

      // Add new image if uploaded
      if (updatedStudent.image_url instanceof File) {
        formData.append("image_url", updatedStudent.image_url);
      }

      await axios.put(
        `${baseUrl}/student/${params.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Student updated successfully!");
      router.push("/admin/students");
    } catch (error: any) {
      console.error("Error updating student:", error.response?.data || error.message);
      alert("Error updating student.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <StudentEditPage
        studentData={studentData}
        editStudent={editStudent}
        loading={loading}
      />
    </div>
  );
}
