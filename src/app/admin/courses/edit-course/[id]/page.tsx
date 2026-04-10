"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import CourseEditPage from "@/components/admin/course-edit";
import { useRouter, useParams } from "next/navigation";

import { Subject, Teacher, Course } from "@/app/admin/courses/types";

export default function EditcoursePageWrapper() {
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState<Course | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


    async function getcourse(id: string) {
        try {
            setLoading(true);
            const res = await axios.get(`${baseUrl}/teacher/course/${id}`);
            setCourse(res.data);
        } catch (error) {
            console.error("Error fetching course:", error);
            setCourse(null);
        } finally {
            setLoading(false);
        }
    }


    async function updatecourse(updatedCourse: Course) {
        try {
            setLoading(true);
            await axios.put(
                `${baseUrl}/teacher/course/${courseId}`,
                updatedCourse,
                { headers: { "Content-Type": "application/json" } }
            );
            router.push("/admin/courses");
        } catch (error) {
            console.error("Error updating course:", error);
        } finally {
            setLoading(false);
        }
    }


    async function loadDropdownData() {
        try {
            const [subRes, teachRes] = await Promise.all([
                axios.get(`${baseUrl}/teacher/subject/`),
                axios.get(`${baseUrl}/teacher`),
            ]);

            const fixedSubjects: Subject[] = subRes.data.map((s: any) => ({
                _id: s._id || s.id || s.subject_id,
                subject_name: s.subject_name || s.name || "Unnamed Subject",
            }));

            const fixedTeachers: Teacher[] = teachRes.data.map((t: any) => ({
                _id: t._id || t.id || t.teacher_id,
                name: t.name,
            }));

            setSubjects(fixedSubjects);
            setTeachers(fixedTeachers);
        } catch (error) {
            console.log("Failed to load dropdown data:", error);
        }
    }

    useEffect(() => {
        if (courseId) {
            getcourse(courseId);
            loadDropdownData();
        }
    }, [courseId]);

    return (
        <CourseEditPage
            course={course}
            subjects={subjects}
            teachers={teachers}
            loading={loading}
            updatecourse={updatecourse}
        />
    );
}
