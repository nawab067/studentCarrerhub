'use client';

import { useParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import StudentPortalSidebar from '@/components/student-portal/student-sidebar';
import axios from 'axios';
import { Assessment } from '../../[studentId]/page';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

import {
  Upload,
  Trash2,
  FileText,
  User,
  BookOpen,
  GraduationCap,
  Paperclip,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';


export default function UploadAssesmentPage() {

  const params = useParams();

  const AssesmentId = Array.isArray(params.AssesmnetId)
    ? params.AssesmnetId[0]
    : params.AssesmnetId;

  const [studentId, setStudentId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assesmnet, setAssesmnet] = useState<Assessment | null>(null);

  const [teacherName, setTeacherName] = useState('');
  const [classroomname, setClassroomName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ----------------------------- */
  /* Get Student ID */
  /* ----------------------------- */

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    setStudentId(id);
  }, []);

  /* ----------------------------- */
  /* Get Assessment */
  /* ----------------------------- */

  useEffect(() => {
    if (!AssesmentId) return;

    async function getAssessment() {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/student/assesment/${AssesmentId}`
        );
        setAssesmnet(response.data);
      } catch (error) {
        console.error('Error fetching assessment', error);
      }
    }

    getAssessment();
  }, [AssesmentId]);

  /* ----------------------------- */
  /* Get Uploaded Submission */
  /* ----------------------------- */

  useEffect(() => {

    if (!studentId || !AssesmentId) return;

    async function get_uploaded_file() {
      try {

        const response = await axios.get(
          `http://127.0.0.1:8000/student/submission/${AssesmentId}/${studentId}`
        );

        if (response.data.submitted) {
          setUploadSuccess(true);
          setUploadedFile(response.data.file);
        }

      } catch (error) {
        console.error('Error fetching uploaded file:', error);
      }
    }

    get_uploaded_file();

  }, [studentId, AssesmentId]);

  /* ----------------------------- */
  /* File Picker */
  /* ----------------------------- */

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  /* ----------------------------- */
  /* Upload File */
  /* ----------------------------- */

  const uploadAssesment = async () => {

    if (!selectedFile || !assesmnet) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('studentId', studentId || '');
    formData.append('teacherId', assesmnet.teacherId);
    formData.append('classroomId', assesmnet.classId);

    try {

      const response = await axios.post(
        `http://127.0.0.1:8000/upload-assessment/${AssesmentId}`,
        formData
      );

      setUploadSuccess(true);
      setUploadedFile(response.data.file);

      alert('Assessment uploaded successfully');

    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed');
    }
  };

  /* ----------------------------- */
  /* Teacher Name */
  /* ----------------------------- */

  useEffect(() => {

    if (!assesmnet) return;

    async function getTeacher() {
      try {

        const response = await axios.get(
          `http://127.0.0.1:8000/classes/teacher/user/${assesmnet?.teacherId}`
        );

        setTeacherName(response.data.name);

      } catch (error) {
        console.error(error);
      }
    }

    getTeacher();

  }, [assesmnet]);

  /* ----------------------------- */
  /* Classroom Name */
  /* ----------------------------- */

  useEffect(() => {

    if (!assesmnet) return;

    async function getClassroom() {
      try {

        const response = await axios.get(
          `http://127.0.0.1:8000/classes/classroom/${assesmnet?.classId}`
        );

        setClassroomName(response.data.classroom_name);

      } catch (error) {
        console.error(error);
      }
    }

    getClassroom();

  }, [assesmnet]);

  /* ----------------------------- */
  /* Student Name */
  /* ----------------------------- */

  useEffect(() => {

    if (!studentId) return;

    async function getStudentName() {
      try {

        const response = await axios.get(
          `http://127.0.0.1:8000/classes/student/user/${studentId}`
        );

        setStudentName(response.data.name);

      } catch (error) {
        console.error(error);
      }
    }

    getStudentName();

  }, [studentId]);

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <StudentPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

       <main
            className={`p-6 lg:p-10 transition-all duration-300 ${
              collapsed ? "ml-20" : "ml-64"
            }`}
          >

        {/* Header */}

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span>Assignments</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800 font-medium">
              {assesmnet ? assesmnet.name : '...'}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Submit Assignment
              </h1>
              <p className="text-slate-500 mt-1">
                Upload your completed work for review
              </p>
            </div>

            <Badge
              variant="outline"
              className={`px-3 py-1 ${
                uploadSuccess
                  ? 'text-emerald-700 border-emerald-200 bg-emerald-50'
                  : 'text-amber-600 border-amber-200 bg-amber-50'
              }`}
            >
              {uploadSuccess ? 'Submitted' : 'Pending Submission'}
            </Badge>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT SIDE */}

          <div className="lg:col-span-2 space-y-6">

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>{assesmnet?.name}</CardTitle>
                <CardDescription>Assignment Details</CardDescription>
              </CardHeader>

              <Separator />

              <CardContent>
                <p className="text-slate-600 text-sm">
                  {assesmnet?.description}
                </p>
              </CardContent>
            </Card>

            {/* Upload Card */}

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Your Submission</CardTitle>
              </CardHeader>

              <CardContent className="pt-6">

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={openFilePicker}
                  className="relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer"
                >

                  {selectedFile || uploadedFile ? (

                    <div className="flex flex-col items-center gap-3">

                      <FileText className="w-7 h-7 text-blue-600" />

                      <p className="font-semibold text-slate-800">
                        {selectedFile
                          ? selectedFile.name
                          : 'Submitted File'}
                      </p>

                      <p className="text-sm text-slate-500">
                        {selectedFile
                          ? formatFileSize(selectedFile.size)
                          : 'Already submitted'}
                      </p>

                      {uploadedFile && !selectedFile && (
                        <a
                          href={uploadedFile}
                          target="_blank"
                          className="text-blue-600 underline text-sm"
                        >
                          View submitted file
                        </a>
                      )}

                      {uploadSuccess && (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Uploaded successfully
                        </Badge>
                      )}

                    </div>

                  ) : (

                    <div className="flex flex-col items-center gap-3">
                      <Paperclip className="w-7 h-7 text-slate-400" />
                      <p className="font-semibold text-slate-700">
                        Click to select a file
                      </p>
                    </div>

                  )}

                </div>

                <div className="mt-5">
                  <Button
                    onClick={uploadAssesment}
                    disabled={!selectedFile}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Assignment
                  </Button>
                </div>

              </CardContent>
            </Card>

          </div>

          {/* RIGHT SIDE */}

          <div className="space-y-4">

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm uppercase">
                  Submitted By
                </CardTitle>
              </CardHeader>

              <CardContent className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {studentName
                      ? getInitials(studentName)
                      : <User />}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold text-slate-800">
                    {studentName || '—'}
                  </p>
                  <p className="text-xs text-slate-400">Student</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm uppercase">
                  Submitted To
                </CardTitle>
              </CardHeader>

              <CardContent className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {teacherName
                      ? getInitials(teacherName)
                      : <GraduationCap />}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold text-slate-800">
                    {teacherName || '—'}
                  </p>
                  <p className="text-xs text-slate-400">Teacher</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm uppercase">
                  Classroom
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="font-semibold text-slate-800">
                  {classroomname || '—'}
                </p>
              </CardContent>
            </Card>

          </div>

        </div>
      </main>
    </div>
  );
}