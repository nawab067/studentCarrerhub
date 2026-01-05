'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { teacher, classroom } from "@/app/admin/classroom/types";

export interface ClassroomEditPageProps {
  onSubmit: (data: { classroom_name: string; teacherId: string | null }) => Promise<void>;
  loading: boolean;
  teacher: teacher[];
  classroomData: classroom | null;
}

export default function ClassroomEditPage({
  onSubmit,
  loading,
  teacher,
  classroomData,
}: ClassroomEditPageProps) {
  const [classroomName, setClassroomName] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  // Pre-fill the form when classroomData is loaded
  useEffect(() => {
    if (classroomData) {
      setClassroomName(classroomData.classroom_name);
      setSelectedTeacher(classroomData.teacherId ?? null);
    }
  }, [classroomData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!classroomName.trim()) {
      alert("Please enter a classroom name.");
      return;
    }

    await onSubmit({
      classroom_name: classroomName,
      teacherId: selectedTeacher,
    });
  };

  return (
    <Card className="shadow-lg rounded-2xl max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Edit Classroom</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Classroom Name Input */}
          <div>
            <Label htmlFor="classroom_name">Classroom Name</Label>
            <Input
              id="classroom_name"
              placeholder="Enter classroom name"
              value={classroomName}
              onChange={(e) => setClassroomName(e.target.value)}
              required
            />
          </div>

          {/* Teacher Dropdown */}
          <div>
            <Label>Teacher</Label>
            <Select
              value={selectedTeacher ?? ""}
              onValueChange={(value) => setSelectedTeacher(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teacher.map((t) => (
                  <SelectItem key={t._id} value={t._id}>
                    {t.name ?? "Unnamed Teacher"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Updating..." : "Update Classroom"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
