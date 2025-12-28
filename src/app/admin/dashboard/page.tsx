"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, BookOpen, GraduationCap } from "lucide-react";

export default function DashboardPage() {
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
  try {
    const [teachersRes, studentsRes, coursesRes] = await Promise.all([
      axios.get('http://127.0.0.1:8000/teacher'),
      axios.get('http://127.0.0.1:8000/Student'),
      axios.get('http://127.0.0.1:8000/teacher/course/')
    ]);

    setTotalTeachers(teachersRes.data.length);
    setTotalStudents(studentsRes.data.length);

    console.log("COURSES RESPONSE:", coursesRes.data);

    const courses =
      Array.isArray(coursesRes.data)
        ? coursesRes.data
        : coursesRes.data.courses || coursesRes.data.data || [];

    setTotalCourses(courses.length);

    setLoading(false);

  } catch (error) {
    console.log("Error fetching stats", error);
    setLoading(false);
  }
}

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <p className="p-6 text-center">compiling...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold mb-6">Welcome to the Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Teachers */}
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-500" />
              Total Teachers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalTeachers}</p>
          </CardContent>
        </Card>

        {/* Students */}
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-green-500" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalStudents}</p>
          </CardContent>
        </Card>

        {/* Courses */}
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-purple-500" />
              Active Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalCourses}</p>
          </CardContent>
        </Card>

      </div>
    </motion.div>
  );
}
