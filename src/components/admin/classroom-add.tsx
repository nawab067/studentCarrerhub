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
import { useState } from "react";
import { teacher } from "@/app/admin/classroom/types";

export interface ClassroomAddPageProps {
  onSubmit: (data: { classroom_name: string; teacherId: string }) => Promise<void>;
  loading: boolean;
  teacher: teacher[];
}

export default function ClassroomAddPage({
  onSubmit,
  loading,
  teacher,
}: ClassroomAddPageProps) {
  const [classroomName, setClassroomName] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!classroomName) {
      alert("Please enter classroom name");
      return;
    }

    if (!selectedTeacher) {
      alert("Please select a teacher");
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
          <CardTitle className="text-2xl font-semibold">Add Classroom</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Classroom Name Input */}
          <div>
            <Label htmlFor="classroom_name">Classroom Name</Label>
            <Input
              id="classroom_name"
              name="classroom_name"
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
            {loading ? "Adding..." : "Add Classroom"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
