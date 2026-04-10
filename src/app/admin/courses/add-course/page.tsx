'use client';

import axios from "axios";
import { useEffect, useState } from "react";  
import CourseAddPage from "@/components/admin/course-add";
import { useRouter } from "next/navigation";

export interface subject {
  _id: string;
  subject_name: string;
}

export interface Teacher {
  _id: string;
  name: string;
}

export interface course {
  _id?: string;
  name: string;
  course_code: string;
  description: string;
  subject: subject | null;
  teacher: Teacher | null;
  subjectId?: string;  
  teacherId?: string;   
}


export default function AddcoursePageWrapper() {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<subject[]>([]);   
  const [teachers, setTeachers] = useState<Teacher[]>([]);  

  const router = useRouter();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await axios.get(`${baseUrl}/teacher/subject/`);
        // Ensure it's an array
        setSubjects(Array.isArray(response.data) ? response.data : []);   
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    }

    async function fetchTeachers() {
      try {
        const response = await axios.get(`${baseUrl}/teacher`); 
        setTeachers(Array.isArray(response.data) ? response.data : []);     
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    }

    fetchSubjects();
    fetchTeachers();
  }, []);
  async function addcourse(courseData: {
      course_name: string;
      course_code: string;
      description: string;
      subjectId: string;
      teacherId: string;
    }) {
      try {
        setLoading(true);
        await axios.post(`${baseUrl}/teacher/course/`, courseData);
        alert("Course added successfully!");
        router.push("/admin/courses");
      } catch (error: any) {
        console.error("Error adding course:", error.response?.data || error.message);
        alert("Error adding course. Check console.");
      } finally {
        setLoading(false);
      }
    }

 
  return (
    <CourseAddPage
      onSubmit={addcourse}
      loading={loading}
      subject={subjects.map(s => ({ id: s._id, name: s.subject_name }))}  
      teacher={teachers.map(t => ({ id: t._id, name: t.name }))}          
    />
  );
}
