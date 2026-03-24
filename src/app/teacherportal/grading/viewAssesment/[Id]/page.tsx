'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

import TeacherPortalSidebar from '@/components/teacher-portal/teacherportal-sidebar';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';

interface ViewAssessment {
  studentId: string;
  file: string;
}

export default function ViewAssessment() {
  const router = useRouter();
  const { Id } = useParams();

  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<ViewAssessment[]>([]);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // ✅ Store student names in a map
  const [studentNames, setStudentNames] = useState<Record<string, string>>({});

  // ✅ Get teacherId
  useEffect(() => {
    const storedTeacherId = localStorage.getItem('teacherId');

    if (!storedTeacherId) {
      router.push('/login');
    } else {
      setTeacherId(storedTeacherId);
    }
  }, [router]);

  // ✅ Fetch assessments
  useEffect(() => {
    if (teacherId && Id) {
      fetchAssessments();
    }
  }, [teacherId, Id]);

  async function fetchAssessments() {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://127.0.0.1:8000/teacher/submission/${Id}/${teacherId}`
      );

      if (Array.isArray(response.data.data)) {
        setAssessments(response.data.data);
      } else {
        setAssessments([]);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Fetch student names properly
  useEffect(() => {
    async function fetchStudentNames() {
      const newNames: Record<string, string> = {};

      for (const item of assessments) {
        if (!studentNames[item.studentId]) {
          try {
            const res = await axios.get(
              `http://127.0.0.1:8000/classes/student/user/${item.studentId}`
            );

            newNames[item.studentId] = res.data.name;
          } catch (error) {
            newNames[item.studentId] = 'Unknown';
          }
        }
      }

      setStudentNames((prev) => ({ ...prev, ...newNames }));
    }

    if (assessments.length > 0) {
      fetchStudentNames();
    }
  }, [assessments]);

  return (
    <div className="flex">
      <TeacherPortalSidebar />

      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <h1 className="text-2xl font-bold mb-6">
          View Assessment
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : assessments.length === 0 ? (
          <p>No submissions found</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>File Link</TableHead>
                  <TableHead>Weightage</TableHead>
                  <TableHead>Total Marks</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {assessments.map((item) => (
                  <TableRow
                    key={item.studentId} 
                    className="hover:bg-gray-100"
                  >
                    {/* Student Name */}
                    <TableCell>
                      {studentNames[item.studentId] || 'Loading...'}
                    </TableCell>

                    {/* Student ID */}

                    {/* Preview */}
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedFile(item.file)}
                      >
                        Preview
                      </Button>
                    </TableCell>

                    {/* File Link */}
                    <TableCell>
                      <a
                        href={item.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Open File
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Preview */}
            {selectedFile && (
              <div className="mt-6 border rounded p-4">
                <h2 className="font-semibold mb-3">File Preview</h2>

                {selectedFile.endsWith('.pdf') ? (
                  <iframe
                    src={selectedFile}
                    className="w-full h-[500px]"
                  />
                ) : (
                  <img
                    src={selectedFile}
                    alt="Preview"
                    className="max-h-[500px] rounded"
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}