'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import AddTimeSlotForm, { SlotData } from "@/components/admin/TeacherTimeTable";
import { useRouter } from "next/navigation";

export interface Teacher {
  id: string;
  name: string;
}

export interface Classroom {
  id: string;
  name: string;
}

export default function TeacherTimeTableAdd() {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  async function fetchTeachers() {
    try {
      const res = await axios.get(`${baseUrl}/teacher`);
      setTeachers(
        res.data.map((t: any) => ({
          id: t.id ?? t._id ?? t.teacher_id,
          name: t.name,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  }

  async function fetchClassrooms() {
    try {
      const res = await axios.get(`${baseUrl}/classrooms`);
      const classroomArray = res.data?.data ?? [];
      setClassrooms(
        classroomArray.map((c: any) => ({
          id: String(c._id),
          name: c.classroom_name,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch classrooms:", error);
    }
  }

  async function addSlot(newSlot: SlotData) {
    try {
      setLoading(true);
      await axios.post(`${baseUrl}/add_time_slot`, newSlot);
      alert("Time slot added successfully");
      router.push("/admin/TeacherTimeTable");
    } catch (error) {
      console.error("Failed to add slot:", error);
      alert("Failed to add time slot");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeachers();
    fetchClassrooms();
  }, []);

  if (!teachers.length || !classrooms.length) return <p className="p-6">Loading...</p>;

  return (
    <AddTimeSlotForm
      teachers={teachers}
      classrooms={classrooms}
      onAdd={addSlot}
      loading={loading}
    />
  );
}
