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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import {
  GraduationCap,
  Eye,
  ExternalLink,
  ChevronRight,
  BookOpen,
  SendHorizonal,
  X,
  Users,
  Percent,
  ClipboardCheck,
  FileImage,
} from 'lucide-react';

interface Submission {
  studentId: string;
  file: string;
}

export default function ViewAssessment() {
  const router = useRouter();
  const { Id } = useParams();

  const [teacherId, setTeacherId] = useState<string | null>(null);

  const [allStudents, setAllStudents] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [studentNames, setStudentNames] = useState<Record<string, string>>({});
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [weightage, setWeightage] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

  /* ───────────────────────────── */
  /* Auth */
  /* ───────────────────────────── */
  useEffect(() => {
    const storedTeacherId = localStorage.getItem('teacherId');
    if (!storedTeacherId) {
      router.push('/login');
    } else {
      setTeacherId(storedTeacherId);
    }
  }, [router]);

  /* ───────────────────────────── */
  /* Fetch All Data */
  /* ───────────────────────────── */
  useEffect(() => {
    if (teacherId && Id) {
      fetchData();
    }
  }, [teacherId, Id]);

  async function fetchData() {
    try {
      setLoading(true);

      const [studentsRes, submissionsRes, gradesRes] = await Promise.all([
        axios.get(`${baseurl}/grading/${Id}`),
        axios.get(`${baseurl}/teacher/submission/${Id}/${teacherId}`),
        axios.get(`${baseurl}/teacher/grading/${Id}`),
      ]);

      /* All students */
      setAllStudents(studentsRes.data.students || []);

      /* Submissions */
      setSubmissions(submissionsRes.data.data || []);

      /* Existing marks */
      const marksMap: Record<string, string> = {};
      (gradesRes.data.students || []).forEach((s: any) => {
        marksMap[s.student_id] = String(s.marks);
      });
      setMarks(marksMap);

      if (gradesRes.data.weightage !== undefined) {
        setWeightage(String(gradesRes.data.weightage));
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* ───────────────────────────── */
  /* Fetch Student Names */
  /* ───────────────────────────── */
  useEffect(() => {
    async function fetchNames() {
      const newNames: Record<string, string> = {};

      for (const studentId of allStudents) {
        if (!studentNames[studentId]) {
          try {
            const res = await axios.get(
              `${baseurl}/classes/student/id/${studentId}`
            );
            newNames[studentId] = res.data.name;
          } catch {
            newNames[studentId] = 'Unknown';
          }
        }
      }

      setStudentNames((prev) => ({ ...prev, ...newNames }));
    }

    if (allStudents.length > 0) fetchNames();
  }, [allStudents]);

  /* ───────────────────────────── */
  /* Helpers */
  /* ───────────────────────────── */
  const submissionMap = submissions.reduce((acc, item) => {
    acc[item.studentId] = item;
    return acc;
  }, {} as Record<string, Submission>);

  const gradedCount = Object.keys(marks).length;

  const handleMarksChange = (studentId: string, value: string) => {
    setMarks((prev) => ({ ...prev, [studentId]: value }));
  };

  /* ───────────────────────────── */
  /* Submit Grades */
  /* ───────────────────────────── */
  async function createGrades() {
    try {
      if (!teacherId) return alert('Teacher not found');
      if (!weightage) return alert('Enter weightage');

      const grades = allStudents.map((id) => ({
        student_id: id,
        marks: Number(marks[id] || 0),
      }));

      await axios.post(`${baseurl}/teacher/grading/${Id}`, {
        assesmentId: Id,
        teacherId,
        weightage: Number(weightage),
        grades,
      });

      alert('Grades submitted!');
    } catch (err: any) {
      console.error(err);
      alert('Error submitting grades');
    }
  }

  
  /* ───────────────────────────── */
  /* UI */
  /* ───────────────────────────── */
  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <TeacherPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className={`${collapsed ? 'ml-16' : 'ml-64'} p-6 w-full`}>

        {/* Header */}
        <h1 className="text-2xl font-bold mb-6">View & Grade Assessment</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card><CardContent className="p-4">Total: {allStudents.length}</CardContent></Card>
          <Card><CardContent className="p-4">Graded: {gradedCount}</CardContent></Card>
          <Card><CardContent className="p-4">Pending: {allStudents.length - gradedCount}</CardContent></Card>
        </div>

        {/* Weightage */}
        <Card className="mb-6">
          <CardContent className="p-4 flex gap-4 items-center">
            <Label>Weightage</Label>
            <Input
              type="number"
              value={weightage}
              onChange={(e) => setWeightage(e.target.value)}
              className="w-32"
            />
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>Students</CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Marks</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {allStudents.map((studentId) => {
                  const submission = submissionMap[studentId];

                  return (
                    <TableRow key={studentId}>
                      <TableCell>
                        {studentNames[studentId] || 'Loading...'}
                      </TableCell>

                      <TableCell>
                        {submission ? (
                          <a href={submission.file} target="_blank">
                            <Badge>Open</Badge>
                          </a>
                        ) : (
                          <Badge variant="destructive">Not Submitted</Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        {submission ? (
                          <Button onClick={() => setSelectedFile(submission.file)}>
                            <Eye size={14} />
                          </Button>
                        ) : (
                          '—'
                        )}
                      </TableCell>

                      <TableCell>
                        <Input
                          type="number"
                          value={marks[studentId] || ''}
                          onChange={(e) =>
                            handleMarksChange(studentId, e.target.value)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Preview */}
        {selectedFile && (
          <div className="mt-6">
            {selectedFile.endsWith('.pdf') ? (
              <iframe src={selectedFile} className="w-full h-[500px]" />
            ) : (
              <img src={selectedFile} className="max-h-[400px]" />
            )}
            <Button onClick={() => setSelectedFile(null)} className="mt-2">
              <X size={14} /> Close
            </Button>
          </div>
        )}

        <Separator className="my-6" />

        {/* Submit */}
        <Button onClick={createGrades}>
          <SendHorizonal size={14} /> Submit Grades
        </Button>

      </main>
    </div>
  );
}