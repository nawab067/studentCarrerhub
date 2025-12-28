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

import { useEffect, useState } from "react";
import { Subject, Teacher, Course } from "@/app/admin/courses/types";

export interface CourseEditPageProps {
  course: Course | null;
  subjects: Subject[];
  teachers: Teacher[];
  loading: boolean;
  updatecourse: (updatedCourse: Course) => Promise<void>;
}

export default function CourseEditPage({
  course,
  subjects,
  teachers,
  loading,
  updatecourse,
}: CourseEditPageProps) {
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [description, setDescription] = useState("");

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");

  useEffect(() => {
    if (course) {
      setCourseName(course.course_name ?? "");
      setCourseCode(course.course_code ?? "");
      setDescription(course.description ?? "");

      setSelectedSubject(course.subject?._id ?? "");
      setSelectedTeacher(course.teacher?._id ?? "");
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!course) return;

    const payload: Course = {
      ...course,
      course_name: courseName,
      course_code: courseCode,
      description,
      subjectId: selectedSubject,
      teacherId: selectedTeacher,
    };

    console.log(payload);

    await updatecourse(payload);
  };

  return (
    <Card className="shadow-lg rounded-2xl max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Edit Course</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="course_name">Course Name</Label>
            <Input
              id="course_name"
              required
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}

            />
          </div>

          <div>
            <Label htmlFor="course_code">Course Code</Label>
            <Input
              id="course_code"
              required
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* SUBJECT DROPDOWN */}
          <div>
            <Label>Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>

              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.subject_name || s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* TEACHER DROPDOWN */}
          <div>
            <Label>Teacher</Label>
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>

              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t._id} value={t._id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Updating..." : "Update Course"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
