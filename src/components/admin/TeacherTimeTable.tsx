"use client";

import { useState } from "react";
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

interface TimeSlot {
  day: string;
  start_time: string;
  end_time: string;
  teacher_id: string;
  classroom_id: string;
}

interface TimetableFormProps {
  teachers: Teacher[];
  classrooms: Classroom[];
  onSubmit: (data: TimeSlot) => void;
  loading?: boolean;
}

export default function TeacherTimeTable({
  teachers,
  classrooms,
  onSubmit,
  loading = false,
}: TimetableFormProps) {
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [classroomId, setClassroomId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!day || !startTime || !endTime || !teacherId || !classroomId) {
      alert("Please fill all fields");
      return;
    }

    onSubmit({
      day,
      start_time: startTime,
      end_time: endTime,
      teacher_id: teacherId,
      classroom_id: classroomId,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow"
    >
      {/* Day */}
      <div>
        <Label>Day</Label>
        <Input
          placeholder="Monday"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />
      </div>

      {/* Start Time */}
      <div>
        <Label>Start Time</Label>
        <Input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      {/* End Time */}
      <div>
        <Label>End Time</Label>
        <Input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      {/* Teacher */}
      <div>
        <Label>Teacher</Label>
        <Select value={teacherId} onValueChange={setTeacherId}>
          <SelectTrigger>
            <SelectValue placeholder="Select teacher" />
          </SelectTrigger>
          <SelectContent>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <SelectItem
                  key={`teacher-${teacher.id}`}
                  value={teacher.id}
                >
                  {teacher.name}
                </SelectItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No teachers found
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Classroom */}
      {/* Classroom */}
<div>
  <Label>Classroom</Label>
  <Select value={classroomId} onValueChange={setClassroomId}>
    <SelectTrigger>
      <SelectValue placeholder="Select classroom" />
    </SelectTrigger>
    <SelectContent>
      {classrooms.length > 0 ? (
        classrooms.map((room) => (
          <SelectItem
            key={`classroom-${room.id}`}
            value={String(room.id)}   // ✅ MUST be string
          >
            {room.name}               {/* ✅ render ONCE */}
          </SelectItem>
        ))
      ) : (
        <div className="px-3 py-2 text-sm text-muted-foreground">
          No classrooms found
        </div>
      )}
    </SelectContent>
  </Select>
</div>


      <Button type="submit"  disabled={loading}>
        {loading ? "Saving..." : "Add Time Slot"}
       
        
      </Button>
    </form>
  );
}
