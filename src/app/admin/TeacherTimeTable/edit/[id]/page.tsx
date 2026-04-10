"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TeacherTimeTableUpdate, { SlotData } from "@/components/admin/editTeacherTimeTable";

interface Teacher {
  id: string;
  name: string;
}

interface Classroom {
  id: string;
  name: string;
}

const formatTime = (time?: string) => (time ? time.slice(0, 5) : "");

export default function TeacherTimeTableEdit() {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [slotData, setSlotData] = useState<SlotData | null>(null);

  const router = useRouter();
  const params = useParams();
  const slotId = params?.id as string | undefined;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    async function fetchAll() {
      // fetch teachers and classrooms in parallel
      await Promise.all([fetchTeachers(), fetchClassrooms()]);

      // fetch slot only if slotId exists
      if (slotId) {
        await fetchSlot(slotId);
      }
    }
    fetchAll();
  }, [slotId]);

  async function fetchTeachers() {
    const res = await axios.get(`${baseUrl}/teacher`);
    setTeachers(res.data.map((t: any) => ({ id: String(t.id ?? t._id), name: t.name })));
  }

  async function fetchClassrooms() {
    const res = await axios.get(`${baseUrl}/classrooms`);
    setClassrooms(
      (res.data?.data ?? []).map((c: any) => ({
        id: String(c._id),
        name: c.classroom_name,
      }))
    );
  }

  async function fetchSlot(id: string) {
  setLoading(true);

  const res = await axios.get(
    `${baseUrl}/time_table/${id}`
  );

  const slot = res.data;

  if (!slot) return;

  setSlotData({
    day: slot.day ?? "",
    start_time: formatTime(slot.start_time),
    end_time: formatTime(slot.end_time),
    teacher_id: String(slot.teacher_id ?? ""),
    classroom_id: String(slot.classroom_id ?? ""),
    roomno: slot.roomno ?? "",
    date: slot.date ?? "",
  });

  setLoading(false);
}




  async function updateSlot(data: SlotData) {
    setLoading(true);
    await axios.put(`${baseUrl}/update_time_slot/${slotId}`, data);
    router.push("/admin/TeacherTimeTable");
  
  }

  // only render form when everything is loaded
  if (!slotData || !teachers.length || !classrooms.length) return null;
 
 

  return (
    <TeacherTimeTableUpdate
      teachers={teachers}
      classrooms={classrooms}
      slotData={slotData}
      onUpdate={updateSlot}
      loading={loading}
    />
  );
}
