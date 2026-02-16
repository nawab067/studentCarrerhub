import { Input } from "@/components/ui/input";
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

    await updatecourse(payload);
  };

  const selectedTeacherName =
    teachers.find((t) => t._id === selectedTeacher)?.name;
  const selectedSubjectName =
    subjects.find((s) => s._id === selectedSubject)?.subject_name ||
    subjects.find((s) => s._id === selectedSubject)?.name;

  return (
    <>
      {/* SAME STYLE BLOCK FROM ADD PAGE */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        .ca-wrap {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ca-card {
          width: 100%;
          max-width: 580px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow:
            0 1px 3px rgba(0,0,0,0.04),
            0 10px 30px rgba(0,0,0,0.07);
          overflow: hidden;
        }

        .ca-header {
          background: linear-gradient(135deg, #3b5bfa 0%, #5c7cfa 100%);
          padding: 2rem 2.5rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .ca-header-title {
          font-size: 1.65rem;
          font-weight: 700;
          color: #fff;
          margin: 1rem 0 0.3rem;
        }

        .ca-header-sub {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.68);
        }

        .ca-strip {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 2.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .ca-strip-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e293b;
        }

        .ca-strip-sub {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 2px;
        }

        .ca-body { padding: 2rem 2.5rem 2.5rem; }

        .ca-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .ca-field {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          margin-bottom: 1.1rem;
        }

        .ca-label {
          font-size: 0.775rem;
          font-weight: 600;
          color: #374151;
        }

        .ca-textarea {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 0.75rem 0.85rem;
          min-height: 90px;
          resize: none;
        }

        .ca-submit {
          width: 100%;
          height: 50px !important;
          border-radius: 12px !important;
          background: linear-gradient(135deg, #3b5bfa 0%, #5c7cfa 100%) !important;
          color: #fff !important;
          font-weight: 700 !important;
        }

        @media (max-width: 560px) {
          .ca-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ca-wrap">
        <div className="ca-card">

          {/* HEADER */}
          <div className="ca-header">
            <h1 className="ca-header-title">Edit Course</h1>
            <p className="ca-header-sub">
              Update course information and assignments
            </p>
          </div>

          {/* PREVIEW STRIP */}
          <div className="ca-strip">
            <div>
              <div className="ca-strip-name">
                {courseName || "Course Name"}
              </div>
              <div className="ca-strip-sub">
                {selectedSubjectName
                  ? `Subject: ${selectedSubjectName}`
                  : "No subject selected"}
                &nbsp;·&nbsp;
                {selectedTeacherName
                  ? `Teacher: ${selectedTeacherName}`
                  : "No teacher selected"}
              </div>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            <div className="ca-body">

              <div className="ca-row">
                <div className="ca-field">
                  <label className="ca-label">Course Name</label>
                  <Input
                    required
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                  />
                </div>

                <div className="ca-field">
                  <label className="ca-label">Course Code</label>
                  <Input
                    required
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="ca-field">
                <label className="ca-label">Description</label>
                <textarea
                  className="ca-textarea"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="ca-row">
                <div className="ca-field">
                  <label className="ca-label">Subject</label>
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  >
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

                <div className="ca-field">
                  <label className="ca-label">Teacher</label>
                  <Select
                    value={selectedTeacher}
                    onValueChange={setSelectedTeacher}
                  >
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
              </div>

              <Button
                type="submit"
                className="ca-submit"
                disabled={loading}
              >
                {loading ? "Updating Course…" : "Update Course"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
