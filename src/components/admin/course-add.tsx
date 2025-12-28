import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export interface courseAddPageProps {
  onSubmit: (courseData: {
    course_name: string;
    course_code: string;
    description: string;
    subjectId: string;
    teacherId: string;
  }) => Promise<void>;
  loading: boolean;
  subject: { id: string; name: string }[];
  teacher: { id: string; name: string }[];
}

export default function CourseAddPage({ onSubmit, loading, subject, teacher }: courseAddPageProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [selectedTeacher, setSelectedTeacher] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedSubject || !selectedTeacher) {
      alert("Please select both a subject and a teacher.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const payload = {
      course_name: formData.get("course_name") as string,
      course_code: formData.get("course_code") as string,
      description: formData.get("description") as string,
      subjectId: selectedSubject,
      teacherId: selectedTeacher,
    };

    await onSubmit(payload);
  };

  return (
    <Card className="shadow-lg rounded-2xl max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Add Course</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Course Name */}
          <div>
            <Label htmlFor="course_name">Course Name</Label>
            <Input id="course_name" name="course_name" placeholder="Enter course name" required />
          </div>

          {/* Course Code */}
          <div>
            <Label htmlFor="course_code">Course Code</Label>
            <Input id="course_code" name="course_code" type="text" placeholder="Enter course code" required />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" placeholder="Enter description here" required />
          </div>

          {/* Subject Dropdown */}
          <div>
            <Label>Subject</Label>
            <Select value={selectedSubject ?? ""} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subject.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Teacher Dropdown */}
          <div>
            <Label>Teacher</Label>
            <Select value={selectedTeacher ?? ""} onValueChange={setSelectedTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teacher.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Adding..." : "Add Course"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
