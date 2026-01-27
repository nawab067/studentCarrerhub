'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import TeacherTimeTable from "@/components/admin/TeacherTimeTable";
import { useRouter } from "next/navigation";

interface Teacher {
  id: string;
  name: string;
}

interface Classroom {
  id: string;
  name: string;
}

interface TimeSlot {
  day: string;
  start_time: string;
  end_time: string;
  teacher_id: string;
  classroom_id: string;
}

export default function TeacherTimeTableAdd() {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const router = useRouter();

  async function fetchTeachers() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/teacher");

      // Normalize IDs (IMPORTANT)
      setTeachers(
        response.data.map((t: any) => ({
          id: t.id ?? t._id ?? t.teacher_id,
          name: t.name,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  }

 async function fetchClassrooms() {
  try {
    const response = await axios.get("http://127.0.0.1:8000/classrooms");

    const classroomArray = response.data?.data ?? [];

    setClassrooms(
      classroomArray.map((c: any) => ({
        id: String(c._id),
        name: c.classroom_name, // ✅ FIX HERE
      }))
    );
  } catch (error) {
    console.error("Failed to fetch classrooms:", error);
    setClassrooms([]);
  }
}



  async function addSlot(timeslot: TimeSlot) {
    try {
      setLoading(true);
      await axios.post("http://127.0.0.1:8000/add_time_slot", timeslot);
      alert("Time slot added successfully");
      router.push("/admin/TeacherTimeTable");
    } catch (error) {
      console.error(error);
      alert("Failed to add time slot");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeachers();
    fetchClassrooms();
  }, []);

  return (
    <TeacherTimeTable
      teachers={teachers}
      classrooms={classrooms}
      onSubmit={addSlot}
      loading={loading}
    />
  );
}
