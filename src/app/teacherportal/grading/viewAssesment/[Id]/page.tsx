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
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import {
  GraduationCap,
  FileText,
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
  const [weightage, setWeightage] = useState('');
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [studentNames, setStudentNames] = useState<Record<string, string>>({});
  const[studentmarks, setStudentMarks] = useState<Record<string, string>>({})
  useEffect(() => {
    const storedTeacherId = localStorage.getItem('teacherId');
    if (!storedTeacherId) {
      router.push('/login');
    } else {
      setTeacherId(storedTeacherId);
    }
  }, [router]);

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
          } catch {
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

  const handleMarksChange = (studentId: string, value: string) => {
    setMarks((prev) => ({ ...prev, [studentId]: value }));
  };

  async function createGrades() {
    try {
      const classroomId = Array.isArray(Id) ? Id[0] : Id;
      if (!teacherId) { alert('Teacher not found'); return; }
      if (!weightage) { alert('Please enter weightage'); return; }
      const grades = assessments.map((item) => ({
        student_id: item.studentId,
        marks: Number(marks[item.studentId] || 0),
      }));
      const payload = {
        assesmentId: classroomId,
        teacherId: teacherId,
        weightage: Number(weightage),
        grades: grades,
      };
      console.log('FINAL PAYLOAD:', payload);
      await axios.post(`http://127.0.0.1:8000/teacher/grading/${Id}`, payload);
      alert('Grades submitted successfully!');
    } catch (error: any) {
      console.error('FULL ERROR:', error.response?.data || error);
      alert(error.response?.data?.detail || 'Error submitting grades');
    }
  }

  const gradedCount = assessments.filter((a) => marks[a.studentId]).length;

 async function get_marks_byAssesmentId() {
  try {
    setLoading(true);
    const response = await axios.get(
      `http://127.0.0.1:8000/teacher/grading/${Id}`
    );

    console.log(response.data);
    const studentsData = response.data.students || [];
    const marksMap: Record<string, string> = {};
    studentsData.forEach((s: any) => {
      marksMap[s.student_id] = String(s.marks);
    });
    setMarks(marksMap);

     if (response.data.weightage !== undefined) {
      setWeightage(String(response.data.weightage));
    }

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}
  useEffect(() => {
    get_marks_byAssesmentId();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <TeacherPortalSidebar />
    

      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-10">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 font-medium tracking-wide uppercase">
            <BookOpen size={12} />
            <span>Teacher Portal</span>
            <ChevronRight size={12} />
            <span>Assessments</span>
            <ChevronRight size={12} />
            <span className="text-slate-600">View & Grade</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                View & Grade Assessment
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Review submissions and assign marks
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          /* ── Skeleton ── */
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="rounded-2xl border-slate-100 shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-5 w-8 rounded" />
                      <Skeleton className="h-3 w-16 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="rounded-2xl border-slate-100 shadow-sm">
              <CardContent className="p-6 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </CardContent>
            </Card>
          </div>
        ) : assessments.length === 0 ? (
          /* ── Empty state ── */
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-24 text-slate-400">
              <ClipboardCheck size={44} className="mb-3 opacity-25" />
              <p className="font-semibold text-sm">No submissions found</p>
              <p className="text-xs mt-1 opacity-70">
                Students haven't submitted yet
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* ── Stats strip ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                {
                  label: 'Total Students',
                  value: assessments.length,
                  icon: <Users size={14} />,
                  color: 'text-violet-600 bg-violet-50',
                },
                {
                  label: 'Graded',
                  value: gradedCount,
                  icon: <ClipboardCheck size={14} />,
                  color: 'text-emerald-600 bg-emerald-50',
                },
                {
                  label: 'Pending',
                  value: assessments.length - gradedCount,
                  icon: <FileText size={14} />,
                  color: 'text-amber-600 bg-amber-50',
                },
              ].map((s) => (
                <Card key={s.label} className="rounded-2xl border-slate-100 shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.color}`}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-800 leading-none">{s.value}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ── Weightage input ── */}
            <Card className="rounded-2xl border-slate-100 shadow-sm mb-6">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Percent size={14} />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-slate-700 block">
                        Assessment Weightage
                      </Label>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Applied uniformly to all students
                      </p>
                    </div>
                  </div>
                  <Input
                    type="number"
                    placeholder="e.g. 25"
                    value={weightage}
                    onChange={(e) => setWeightage(e.target.value)}
                    className="w-full sm:w-36 h-9 rounded-xl border-slate-200 bg-white text-sm shadow-sm focus-visible:ring-violet-400 text-right font-semibold"
                  />
                </div>
              </CardContent>
            </Card>

            {/* ── Submissions table ── */}
            <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden mb-6">
              <CardHeader className="px-6 py-4 border-b border-slate-100 bg-white">
                <p className="text-sm font-semibold text-slate-600">Student Submissions</p>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                      {['Student', 'File', 'Preview', 'Marks'].map((h) => (
                        <TableHead
                          key={h}
                          className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3"
                        >
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {assessments.map((item, idx) => (
                      <TableRow
                        key={item.studentId}
                        className="group hover:bg-violet-50/40 transition-colors border-slate-100"
                      >
                        {/* Student name */}
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                              {(studentNames[item.studentId] || '?')[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-sm leading-none">
                                {studentNames[item.studentId] || (
                                  <span className="text-slate-400 italic text-xs">Loading…</span>
                                )}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                #{String(idx + 1).padStart(2, '0')}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Open file */}
                        <TableCell className="px-6 py-4">
                          <a
                            href={item.file}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Badge
                              variant="outline"
                              className="gap-1.5 text-xs font-medium border-slate-200 text-slate-600 bg-white hover:bg-slate-50 cursor-pointer rounded-lg px-2.5 py-1 transition-colors"
                            >
                              <ExternalLink size={11} />
                              Open
                            </Badge>
                          </a>
                        </TableCell>

                        {/* Preview */}
                        <TableCell className="px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedFile(
                                selectedFile === item.file ? null : item.file
                              )
                            }
                            className="h-8 px-3 text-xs rounded-xl border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all gap-1.5"
                          >
                            <Eye size={12} />
                            {selectedFile === item.file ? 'Close' : 'Preview'}
                          </Button>
                        </TableCell>

                        {/* Marks */}
                        <TableCell className="px-6 py-4">
                          <Input
                            type="number"
                            placeholder="0"
                            value={marks[item.studentId] || ''}
                            onChange={(e) =>
                              handleMarksChange(item.studentId, e.target.value)
                            }
                            className="w-24 h-8 rounded-xl border-slate-200 bg-white text-sm text-center font-semibold shadow-sm focus-visible:ring-violet-400"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* ── File preview ── */}
            {selectedFile && (
              <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden mb-6">
                <CardHeader className="px-6 py-4 border-b border-slate-100 bg-white flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <FileImage size={15} className="text-violet-500" />
                    File Preview
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </CardHeader>
                <CardContent className="p-4 bg-slate-50">
                  {selectedFile.endsWith('.pdf') ? (
                    <iframe
                      src={selectedFile}
                      className="w-full h-[520px] rounded-xl border border-slate-200 bg-white shadow-inner"
                    />
                  ) : (
                    <div className="flex items-center justify-center p-4">
                      <img
                        src={selectedFile}
                        className="max-h-[480px] rounded-xl shadow-md object-contain"
                        alt="Student submission"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ── Submit grades ── */}
            <Separator className="mb-6 bg-slate-100" />
            <div className="flex justify-end">
              <Button
                onClick={createGrades}
                className="h-10 px-6 text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-md shadow-violet-200 transition-all gap-2"
              >
                <SendHorizonal size={15} />
                Submit Grades
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}