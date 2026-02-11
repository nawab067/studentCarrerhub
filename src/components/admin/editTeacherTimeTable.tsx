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
  slotData: SlotData;
  onUpdate: (data: SlotData) => void;
  loading?: boolean;
}

export default function TeacherTimeTableUpdate({
  teachers,
  classrooms,
  slotData,
  onUpdate,
  loading = false,
}: Props) {


  // form state
  const [formData, setFormData] = useState<SlotData>({
    day: "",
    start_time: "",
    end_time: "",
    teacher_id: "",
    classroom_id: "",
  });

  // ✅ update form when slotData arrives from API
  useEffect(() => {
    if (!slotData) return;
    setFormData(slotData);
  }, [slotData]);

  // ✅ handle input/select change
  const handleChange = (
    key: keyof SlotData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
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
          value={formData.day}
          onChange={(e) =>
            handleChange("day", e.target.value)
          }
        />
      </div>

      {/* Start Time */}
      <div>
        <Label>Start Time</Label>
        <Input
          type="time"
          value={formData.start_time}
          onChange={(e) =>
            handleChange("start_time", e.target.value)
          }
        />
      </div>

      {/* End Time */}
      <div>
        <Label>End Time</Label>
        <Input
          type="time"
          value={formData.end_time}
          onChange={(e) =>
            handleChange("end_time", e.target.value)
          }
        />
      </div>

      {/* Teacher */}
      <div>
        <Label>Teacher</Label>
        <Select
          key={formData.teacher_id}   // ⭐ important
          value={formData.teacher_id || ""}
          onValueChange={(value) =>
            handleChange("teacher_id", value)
          }
        >
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

      {/* Classroom */}
      <div>
        <Label>Classroom</Label>
        <Select
            key={formData.classroom_id}
            value={formData.classroom_id || ""}
            onValueChange={(value) =>
              handleChange("classroom_id", value)
            }
          >
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
        {loading ? "Updating..." : "Update Time Slot"}
      </Button>
    </form>
  );
}
