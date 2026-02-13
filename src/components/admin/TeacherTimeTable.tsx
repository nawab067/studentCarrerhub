'use client';

import { useState, useEffect } from "react";
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
  roomno?:string;
  date?:string;
  classroom_id: string;
}

interface Props {
  teachers: Teacher[];
  classrooms: Classroom[];
  onAdd: (newSlot: SlotData) => Promise<void>;
  loading?: boolean;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AddTimeSlotForm({
  teachers,
  classrooms,
  onAdd,
  loading = false,
}: Props) {
  // Start all inputs as empty
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const[date,setDate]=useState("");
  const [teacherId, setTeacherId] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const[roomname,setRoomname]=useState("");

  // Set first teacher/classroom dynamically if not selected
 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!day || !startTime || !endTime || !teacherId || !classroomId) {
      alert("Please fill in all fields.");
      return;
    }

    await onAdd({
      day,
      start_time: startTime,
      end_time: endTime,
      teacher_id: teacherId,
      classroom_id: classroomId,
    });

    // Reset everything to empty after adding
    setDay("");
    setStartTime("");
    setEndTime("");
    setTeacherId("");
    setClassroomId("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow"
    >
      <div>
        <Label>Day</Label>
        <Select value={day} onValueChange={setDay}>
          <SelectTrigger>
            <SelectValue placeholder="Select a day" />
          </SelectTrigger>
          <SelectContent>
            {DAYS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Label>Date</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div>
        <Label>Room Name</Label>
        <Input
          type="text"
          value={roomname}
          onChange={(e) => setRoomname(e.target.value)}
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
        {loading ? "Adding..." : "Add Time Slot"}
      </Button>
    </form>
  );
}
