'use client';

import StudentPortalSidebar from '@/components/student-portal/student-sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Assessment {
  name: string;
  description: string;
  classId: string;
  teacherId: string;
  dueDate: string;
  _id: string;
}

export default function StudentDashboardPage() {

  const router = useRouter();

  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [classroomMap, setClassroomMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const id = localStorage.getItem('studentId');

    if (!id) {
      router.replace('/login');
      return;
    }

    setStudentId(id);
    setLoading(false);
  }, [router]);

  async function getAssesmnet() {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://127.0.0.1:8000/student/assesments/${studentId}`
      );

      setAssessments(response.data);
      console.log(response.data);

    } catch (error) {

      console.error('Error fetching assessments:', error);

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {
    if (studentId) {
      getAssesmnet();
    }
  }, [studentId]);

  async function classroomName(classId: Assessment['classId']) {
    try {

      setLoading(true);

      const response = await axios.get(
        `http://127.0.0.1:8000/classes/classroom/${classId}`
      );

      console.log(response.data);
      return response.data;

    } catch (error) {

      console.error('Error fetching classroom name:', error);

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {

    if (assessments.length > 0) {

      assessments.forEach(async (assessment) => {

        const data = await classroomName(assessment.classId);

        if (data?.classroom_name) {

          setClassroomMap(prev => ({
            ...prev,
            [assessment.classId]: data.classroom_name
          }));

        }

      });

    }

  }, [assessments]);

  async function getTeacherName(teacherId: Assessment['teacherId']) {

    try {

      setLoading(true);

      const response = await axios.get(
        `http://127.0.0.1:8000/classes/teacher/user/${teacherId}`
      );

      console.log(response.data);
      console.log(teacherId);

      return response.data;

    } catch (error) {

      console.error('Error fetching teacher name:', error);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    if (assessments.length > 0) {

      assessments.forEach(async (assessment) => {

        const data = await getTeacherName(assessment.teacherId);

        if (data?.name) {

          setClassroomMap(prev => ({
            ...prev,
            [assessment.teacherId]: data.name
          }));

        }

      });

    }

  }, [assessments]);

  return (

    <div className="min-h-screen">

      <StudentPortalSidebar />

      <main className="p-6 md:ml-64">

        <h1 className="text-2xl font-bold">
          Student Assignments
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome to your Assignments
        </p>

        <div className="mt-6">

          {loading ? (

            <p>Loading...</p>

          ) : assessments.length === 0 ? (

            <p>No assessments found.</p>

          ) : (

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {assessments.map((assessment) => (

                <Card
                  key={assessment._id}
                  onClick={() =>
                    router.push(`/studentPortal/Assignments/uploadAssement/${assessment._id}`)
                  }
                  className="cursor-pointer rounded-2xl shadow-sm hover:shadow-md transition"
                >

                  <CardHeader>

                    <CardTitle className="text-lg">
                      {assessment.name}
                    </CardTitle>

                  </CardHeader>

                  <CardContent className="space-y-3">

                    <p className="text-sm text-muted-foreground">
                      {assessment.description}
                    </p>

                    <Badge variant="secondary">
                      {classroomMap[assessment.classId] || "Loading class..."}
                    </Badge>

                    <Badge variant="secondary">
                      {classroomMap[assessment.teacherId] || "Loading teacher..."}
                    </Badge>

                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(assessment.dueDate).toLocaleDateString()}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Click to open assignment
                    </p>

                  </CardContent>

                </Card>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>

  );
}