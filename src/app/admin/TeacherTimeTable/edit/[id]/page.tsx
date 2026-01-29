"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import TeacherTimeTableuupdate from "@/components/admin/TeacherTimeTable";
import { useRouter, useParams } from "next/navigation";

export interface Teacher {
  id: string;
  name: string;
}

export interface Classroom {
  id: string;
  name: string;
}

export interface SlotData {
  day: string;
  start_time: string;
  end_time: string;
  teacher_id: string;
  classroom_id: string;
}

// helper for formatting time
const formatTime = (time?: string) => {
  if (!time) return "";
  return time.slice(0, 5);
};

export default function TeacherTimeTableEdit() {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [slotData, setSlotData] = useState<SlotData | null>(null);

  const router = useRouter();
  const params = useParams();
  const slotId = params.id as string;

  // fetch teachers
  async function fetchTeachers() {
    try {
      const res = await axios.get("http://127.0.0.1:8000/teacher");
      setTeachers(
        res.data.map((t: any) => ({
          id: t.id ?? t._id ?? t.teacher_id,
          name: t.name,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    }
  }

  // fetch classrooms
  async function fetchClassrooms() {
    try {
      const res = await axios.get("http://127.0.0.1:8000/classrooms");
      const data = res.data?.data ?? [];
      setClassrooms(
        data.map((c: any) => ({
          id: String(c._id),
          name: c.classroom_name,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch classrooms:", err);
    }
  }

  // fetch slot by ID
  async function fetchSlotById(id: string) {
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:8000/time_table/${id}`);
      setSlotData({
        day: res.data?.day ?? "",
        start_time: formatTime(res.data?.start_time),
        end_time: formatTime(res.data?.end_time),
        teacher_id: res.data?.teacher_id ?? "",
        classroom_id: res.data?.classroom_id ?? "",
      });
    } catch (err) {
      console.error("Failed to load slot:", err);
    } finally {
      setLoading(false);
    }
  }

  // update slot
  async function Updateslot(updatedSlot: SlotData) {
    try {
      setLoading(true);
      await axios.put(
        `http://127.0.0.1:8000/update_time_slot/${slotId}`,
        updatedSlot
      );
      router.push("/admin/TeacherTimeTable");
    } catch (err: any) {
      console.error("Failed to update slot:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }

  // load initial data
  useEffect(() => {
    fetchTeachers();
    fetchClassrooms();
    if (slotId) fetchSlotById(slotId);
  }, [slotId]);

  if (!slotData) return null; // wait until data loads

  return (
    <TeacherTimeTableuupdate
      teachers={teachers}
      classrooms={classrooms}
      updateSlot={Updateslot}
      slotData={slotData}
      loading={loading}
    />
  );
}
