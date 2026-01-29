"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Teacher {
  id: string;
  name: string;
}

interface Classroom {
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

interface Props {
  teachers: Teacher[];
  classrooms: Classroom[];
  updateSlot: (updatedSlot: SlotData) => Promise<void>; // parent will handle slotId
  slotData: SlotData;
  loading?: boolean;
}

export default function TeacherTimeTable({
  teachers,
  classrooms,
  updateSlot,
  slotData,
  loading = false,
}: Props) {
  // Initialize form state with default values
  const [day, setDay] = useState(slotData.day || "Monday");
  const [startTime, setStartTime] = useState(slotData.start_time || "09:00");
  const [endTime, setEndTime] = useState(slotData.end_time || "10:00");
  const [teacherId, setTeacherId] = useState(slotData.teacher_id || "");
  const [classroomId, setClassroomId] = useState(slotData.classroom_id || "");

  // Update state whenever slotData changes (e.g., after fetch)
  useEffect(() => {
    setDay(slotData.day || "Monday");
    setStartTime(slotData.start_time || "09:00");
    setEndTime(slotData.end_time || "10:00");
    setTeacherId(slotData.teacher_id || (teachers[0]?.id ?? ""));
    setClassroomId(slotData.classroom_id || (classrooms[0]?.id ?? ""));
  }, [slotData, teachers, classrooms]);

  // Handle form submission
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateSlot({
      day,
      start_time: startTime,
      end_time: endTime,
      teacher_id: teacherId,
      classroom_id: classroomId,
    });
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow"
    >
      <div>
        <Label>Day</Label>
        <Input value={day} onChange={(e) => setDay(e.target.value)} />
      </div>

      <div>
        <Label>Start Time</Label>
        <Input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <div>
        <Label>End Time</Label>
        <Input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <div>
        <Label>Teacher</Label>
        <Select value={teacherId} onValueChange={setTeacherId}>
          <SelectTrigger>
            <SelectValue placeholder="Select teacher" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Classroom</Label>
        <Select value={classroomId} onValueChange={setClassroomId}>
          <SelectTrigger>
            <SelectValue placeholder="Select classroom" />
          </SelectTrigger>
          <SelectContent>
            {classrooms.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Slot"}
      </Button>
    </form>
  );
}
