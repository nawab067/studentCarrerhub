'use client';

import { useParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import StudentPortalSidebar from '@/components/student-portal/student-sidebar';
import axios from 'axios';
import { Assessment } from '../../[studentId]/page';

import {
  Upload, FileText, User, GraduationCap, Paperclip,
  CheckCircle2, ChevronRight, Calendar, BookOpen,
  Layers, ArrowUpRight, AlertCircle, Clock, X,
  ExternalLink, RefreshCw,
} from 'lucide-react';


interface student{
  _id: string;
  name: string;
}
export default function UploadAssessmentPage() {
  const params = useParams();
  const AssesmentId = Array.isArray(params.AssesmnetId)
    ? params.AssesmnetId[0]
    : params.AssesmnetId;

  const [studentId, setStudentId]       = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assesmnet, setAssesmnet]       = useState<Assessment | null>(null);
  const [studentid, setStudent]           = useState<student | null>(null);
  const [teacherName, setTeacherName]   = useState('');
  const [classroomname, setClassroomName] = useState('');
  const [studentName, setStudentName]   = useState('');
  const [collapsed, setCollapsed]       = useState(false);
  const [uploading, setUploading]       = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [dragOver, setDragOver]         = useState(false);
  const[loading, setLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    setStudentId(id);
  }, []);

  useEffect(() => {
    if (!AssesmentId) return;
    async function getAssessment() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/student/assesment/${AssesmentId}`);
        setAssesmnet(response.data);
      } catch (error) { console.error('Error fetching assessment', error); }
    }
    getAssessment();
  }, [AssesmentId]);

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
      } catch (error) { console.error('Error fetching uploaded file:', error); }
    }
    get_uploaded_file();
  }, [studentId, AssesmentId]);

  useEffect(() => {
    if (!assesmnet) return;
    async function getTeacher() {
      try {
        const r = await axios.get(`http://127.0.0.1:8000/classes/teacher/user/${assesmnet?.teacherId}`);
        setTeacherName(r.data.name);
      } catch (e) { console.error(e); }
    }
    getTeacher();
  }, [assesmnet]);

  useEffect(() => {
    if (!assesmnet) return;
    async function getClassroom() {
      try {
        const r = await axios.get(`http://127.0.0.1:8000/classes/classroom/${assesmnet?.classId}`);
        setClassroomName(r.data.classroom_name);
      } catch (e) { console.error(e); }
    }
    getClassroom();
  }, [assesmnet]);

  useEffect(() => {
    if (!studentId) return;
    async function getStudentName() {
      try {
        const r = await axios.get(`http://127.0.0.1:8000/classes/student/user/${studentId}`);
        setStudentName(r.data.name);
      } catch (e) { console.error(e); }
    }
    getStudentName();
  }, [studentId]);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setUploadSuccess(false);
    }
  };

  async function get_studentId() {
  if (!studentId) return; // 🔥 important safeguard

  try {
    setLoading(true);
    const response = await axios.get(
      `http://127.0.0.1:8000/classes/student/user/id/${studentId}`
    );

    console.log("Student API Response:", response.data); // 👈 debug

    setStudent(response.data);
  } catch (error) {
    console.error('Error fetching student data:', error);
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  if (!studentId) return;
  get_studentId();
}, [studentId]);

 const uploadAssesment = async () => {
  if (!selectedFile || !assesmnet || !studentid?._id) {
    console.log("❌ Missing student ID", studentid);
    return;
  }

  console.log("✅ Uploading with studentId:", studentid._id); // DEBUG

  setUploading(true);

  const formData = new FormData();
  formData.append('image', selectedFile);
  formData.append('studentId', studentid._id); // ✅ correct
  formData.append('teacherId', assesmnet.teacherId);
  formData.append('classroomId', assesmnet.classId);

  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/upload-assessment/${AssesmentId}`,
      formData
    );
    setUploadSuccess(true);
    setUploadedFile(response.data.file);
  } catch (error) {
    console.error('Upload failed', error);
  } finally {
    setUploading(false);
  }
};

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getDueStatus = () => {
    if (!assesmnet?.dueDate) return null;
    const due = new Date(assesmnet.dueDate);
    const now = new Date();
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, color: '#e11d48', bg: '#fff1f2', border: '#fecdd3', icon: AlertCircle };
    if (diff === 0) return { label: 'Due today', color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: Clock };
    if (diff <= 3) return { label: `${diff}d left`, color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: Clock };
    return { label: `${diff}d left`, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: CheckCircle2 };
  };

  const dueStatus = getDueStatus();

  return (
    <div className="min-h-screen" style={{ background: '#f4f6fb', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

        .page-bg {
          background: #f4f6fb;
          background-image:
            radial-gradient(ellipse 70% 50% at 10% -5%, rgba(99,102,241,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 90% 105%, rgba(168,85,247,0.04) 0%, transparent 60%);
        }

        /* ── Enter animations ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .enter-1 { animation: fadeUp 0.38s ease 0.05s forwards; opacity: 0; }
        .enter-2 { animation: fadeUp 0.38s ease 0.12s forwards; opacity: 0; }
        .enter-3 { animation: fadeUp 0.38s ease 0.20s forwards; opacity: 0; }
        .enter-4 { animation: fadeUp 0.38s ease 0.28s forwards; opacity: 0; }

        /* ── Breadcrumb ── */
        .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #94a3b8; }
        .breadcrumb span.active { color: #1e293b; font-weight: 600; }

        /* ── Section card ── */
        .section-card {
          background: #ffffff;
          border: 1px solid #e8ecf4;
          border-radius: 16px;
          overflow: hidden;
        }
        .section-card-header {
          padding: 18px 22px 16px;
          border-bottom: 1px solid #f1f5f9;
          display: flex; align-items: center; gap: 10px;
        }
        .section-icon {
          width: 32px; height: 32px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .section-title { font-size: 13px; font-weight: 650; color: #0f172a; letter-spacing: -0.1px; }
        .section-subtitle { font-size: 11.5px; color: #94a3b8; margin-top: 1px; }

        /* ── Drop zone ── */
        .drop-zone {
          border: 2px dashed #dde3ef;
          border-radius: 14px;
          padding: 36px 24px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.18s ease, background 0.18s ease;
          background: #fafbfd;
        }
        .drop-zone:hover, .drop-zone.drag-over {
          border-color: #6366f1;
          background: #f5f3ff;
        }
        .drop-zone.has-file {
          border-style: solid;
          border-color: #c7d2fe;
          background: #eef2ff;
        }
        .drop-zone.success {
          border-color: #bbf7d0;
          background: #f0fdf4;
        }

        /* ── Submit button ── */
        .submit-btn {
          width: 100%;
          padding: 13px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s ease;
          letter-spacing: -0.1px;
        }
        .submit-btn:not(:disabled) {
          background: linear-gradient(135deg, #3730a3 0%, #6366f1 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(99,102,241,0.30);
        }
        .submit-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
        }
        .submit-btn:not(:disabled):active { transform: translateY(0); }
        .submit-btn:disabled {
          background: #e8ecf4; color: #94a3b8; cursor: not-allowed; box-shadow: none;
        }

        /* ── Person chip ── */
        .person-chip {
          display: flex; align-items: center; gap: 12px; padding: 14px 22px;
        }
        .avatar {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; letter-spacing: -0.3px;
        }
        .person-name { font-size: 13.5px; font-weight: 600; color: #0f172a; }
        .person-role { font-size: 11px; color: #94a3b8; margin-top: 1px; }

        /* ── Meta detail row ── */
        .meta-row { display: flex; align-items: center; gap: 8px; padding: 13px 22px; border-top: 1px solid #f1f5f9; }
        .meta-icon-wrap {
          width: 28px; height: 28px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .meta-label { font-size: 10px; color: #94a3b8; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
        .meta-value { font-size: 12.5px; color: #1e293b; font-weight: 600; }

        /* ── Status badge ── */
        .status-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 999px;
          font-size: 12px; font-weight: 600; border: 1px solid;
          font-family: 'DM Mono', monospace;
        }

        /* ── Spinning loader ── */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.7s linear infinite; }

        /* ── View link ── */
        .view-link {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 600; color: #6366f1;
          text-decoration: none; transition: color 0.14s ease;
        }
        .view-link:hover { color: #4338ca; }

        /* ── Progress bar ── */
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .progress-bar { animation: progressFill 1.2s ease forwards; }

        /* ── Stat strip ── */
        .stat-strip {
          display: flex; align-items: center;
          background: #ffffff; border: 1px solid #e8ecf4;
          border-radius: 12px; overflow: hidden;
        }
        .stat-cell {
          padding: 10px 18px; border-right: 1px solid #e8ecf4;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
        }
        .stat-cell:last-child { border-right: none; }
      `}</style>

      <StudentPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className={`transition-all duration-300 min-h-screen page-bg ${collapsed ? 'ml-20' : 'ml-64'}`}
      >
        {/* ══════════ STICKY TOP BAR ══════════ */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: 'rgba(244,246,251,0.93)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid #e2e8f0',
          padding: '18px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Left: icon + breadcrumb + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11, flexShrink: 0,
              background: 'linear-gradient(135deg,#3730a3 0%,#6366f1 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 5px 18px rgba(99,102,241,.28)',
            }}>
              <FileText style={{ width: 18, height: 18, color: '#fff' }} />
            </div>
            <div>
              <div className="breadcrumb">
                <span>Assignments</span>
                <ChevronRight style={{ width: 12, height: 12 }} />
                <span className="active">{assesmnet?.name || '…'}</span>
              </div>
              <h1 style={{ fontSize: 19, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px', marginTop: 2 }}>
                Submit Assignment
              </h1>
            </div>
          </div>

          {/* Right: status badge */}
          <span
            className="status-badge"
            style={uploadSuccess
              ? { background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }
              : { background: '#fffbeb', color: '#d97706', borderColor: '#fde68a' }
            }
          >
            {uploadSuccess
              ? <><CheckCircle2 style={{ width: 11, height: 11 }} /> Submitted</>
              : <><Clock style={{ width: 11, height: 11 }} /> Pending</>
            }
          </span>
        </div>

        {/* ══════════ BODY ══════════ */}
        <div style={{ padding: '28px 32px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

          {/* ════ LEFT COLUMN ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Assignment Details card */}
            <div className="section-card enter-1">
              <div className="section-card-header">
                <div className="section-icon" style={{ background: '#eef2ff' }}>
                  <BookOpen style={{ width: 15, height: 15, color: '#6366f1' }} />
                </div>
                <div>
                  <div className="section-title">{assesmnet?.name || '…'}</div>
                  <div className="section-subtitle">Assignment Details</div>
                </div>
                {dueStatus && (
                  <span
                    className="status-badge"
                    style={{
                      marginLeft: 'auto',
                      background: dueStatus.bg,
                      color: dueStatus.color,
                      borderColor: dueStatus.border,
                      fontSize: 11,
                    }}
                  >
                    <dueStatus.icon style={{ width: 10, height: 10 }} />
                    {dueStatus.label}
                  </span>
                )}
              </div>

              <div style={{ padding: '18px 22px' }}>
                <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.7, margin: 0 }}>
                  {assesmnet?.description || (
                    <span style={{ color: '#c4cdd8' }}>Loading description…</span>
                  )}
                </p>
              </div>

              {/* Due date meta */}
              {assesmnet?.dueDate && (
                <div className="meta-row" style={{ borderTop: '1px solid #f1f5f9' }}>
                  <div className="meta-icon-wrap" style={{ background: dueStatus?.bg || '#f1f5f9' }}>
                    <Calendar style={{ width: 13, height: 13, color: dueStatus?.color || '#94a3b8' }} />
                  </div>
                  <div>
                    <div className="meta-label">Due Date</div>
                    <div className="meta-value" style={{
                      color: dueStatus?.color || '#1e293b',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12,
                    }}>
                      {new Date(assesmnet.dueDate).toLocaleDateString('en-US', {
                        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Upload / Submission card */}
            <div className="section-card enter-2">
              <div className="section-card-header">
                <div className="section-icon" style={{ background: '#f0fdf4' }}>
                  <Upload style={{ width: 15, height: 15, color: '#16a34a' }} />
                </div>
                <div>
                  <div className="section-title">Your Submission</div>
                  <div className="section-subtitle">Upload your completed work</div>
                </div>
              </div>

              <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                {/* Drop zone */}
                <div
                  className={`drop-zone ${dragOver ? 'drag-over' : ''} ${selectedFile ? 'has-file' : ''} ${uploadSuccess && !selectedFile ? 'success' : ''}`}
                  onClick={openFilePicker}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  {/* Success state — already submitted, nothing new selected */}
                  {uploadSuccess && !selectedFile ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 14, background: '#dcfce7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2,
                      }}>
                        <CheckCircle2 style={{ width: 24, height: 24, color: '#16a34a' }} />
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#15803d', margin: 0 }}>
                        Assignment Submitted
                      </p>
                      <p style={{ fontSize: 12, color: '#86efac', margin: 0 }}>
                        Click to replace your submission
                      </p>
                      {uploadedFile && (
                        <a
                          href={uploadedFile}
                          target="_blank"
                          className="view-link"
                          onClick={e => e.stopPropagation()}
                        >
                          <ExternalLink style={{ width: 12, height: 12 }} />
                          View submitted file
                        </a>
                      )}
                    </div>
                  ) : selectedFile ? (
                    /* File selected state */
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 14, background: '#e0e7ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2,
                      }}>
                        <FileText style={{ width: 24, height: 24, color: '#6366f1' }} />
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: 0 }}>
                        {selectedFile.name}
                      </p>
                      <p style={{ fontSize: 11, color: '#94a3b8', fontFamily: "'DM Mono',monospace", margin: 0 }}>
                        {formatFileSize(selectedFile.size)}
                      </p>
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedFile(null); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '4px 12px', borderRadius: 999, border: '1px solid #c7d2fe',
                          background: '#fff', color: '#6366f1', fontSize: 11, fontWeight: 600,
                          cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        <X style={{ width: 10, height: 10 }} /> Remove
                      </button>
                    </div>
                  ) : (
                    /* Empty idle state */
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 14, background: '#f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2,
                      }}>
                        <Paperclip style={{ width: 22, height: 22, color: '#94a3b8' }} />
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: 0 }}>
                        Drop your file here
                      </p>
                      <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                        or <span style={{ color: '#6366f1', fontWeight: 600 }}>browse to upload</span>
                      </p>
                      <p style={{ fontSize: 11, color: '#c4cdd8', fontFamily: "'DM Mono',monospace", margin: 0 }}>
                        PDF, DOCX, PNG, JPG supported
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  className="submit-btn"
                  onClick={uploadAssesment}
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="spinner" style={{ width: 16, height: 16 }} />
                      Uploading…
                    </>
                  ) : uploadSuccess && !selectedFile ? (
                    <>
                      <CheckCircle2 style={{ width: 16, height: 16 }} />
                      Already Submitted
                    </>
                  ) : (
                    <>
                      <Upload style={{ width: 16, height: 16 }} />
                      Submit Assignment
                      <ArrowUpRight style={{ width: 14, height: 14 }} />
                    </>
                  )}
                </button>

                {/* Uploading progress bar */}
                {uploading && (
                  <div style={{ height: 4, background: '#e8ecf4', borderRadius: 999, overflow: 'hidden' }}>
                    <div
                      className="progress-bar"
                      style={{ height: '100%', background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 999 }}
                    />
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* People card */}
            <div className="section-card enter-3">
              <div className="section-card-header">
                <div className="section-icon" style={{ background: '#fdf4ff' }}>
                  <User style={{ width: 15, height: 15, color: '#a855f7' }} />
                </div>
                <div>
                  <div className="section-title">Participants</div>
                  <div className="section-subtitle">Student & Teacher</div>
                </div>
              </div>

              {/* Student */}
              <div className="person-chip">
                <div className="avatar" style={{ background: '#eef2ff', color: '#6366f1' }}>
                  {studentName ? getInitials(studentName) : <User style={{ width: 16, height: 16 }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="person-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {studentName || <span style={{ color: '#c4cdd8' }}>Loading…</span>}
                  </div>
                  <div className="person-role">Student</div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                  background: '#eef2ff', color: '#6366f1', fontFamily: "'DM Mono',monospace",
                }}>You</span>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: '#f1f5f9', margin: '0 22px' }} />

              {/* Teacher */}
              <div className="person-chip">
                <div className="avatar" style={{ background: '#fdf4ff', color: '#a855f7' }}>
                  {teacherName ? getInitials(teacherName) : <GraduationCap style={{ width: 16, height: 16 }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="person-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {teacherName || <span style={{ color: '#c4cdd8' }}>Loading…</span>}
                  </div>
                  <div className="person-role">Teacher</div>
                </div>
              </div>
            </div>

            {/* Classroom card */}
            <div className="section-card enter-4">
              <div className="section-card-header">
                <div className="section-icon" style={{ background: '#ecfeff' }}>
                  <Layers style={{ width: 15, height: 15, color: '#06b6d4' }} />
                </div>
                <div>
                  <div className="section-title">Classroom</div>
                  <div className="section-subtitle">Assigned class</div>
                </div>
              </div>
              <div style={{ padding: '14px 22px 18px' }}>
                <p style={{
                  fontSize: 14, fontWeight: 650, color: '#0f172a', margin: 0,
                  letterSpacing: '-0.1px',
                }}>
                  {classroomname || <span style={{ color: '#c4cdd8' }}>Loading…</span>}
                </p>
              </div>
            </div>

            {/* Submission checklist */}
            <div className="section-card enter-4">
              <div className="section-card-header">
                <div className="section-icon" style={{ background: '#f0fdf4' }}>
                  <CheckCircle2 style={{ width: 15, height: 15, color: '#16a34a' }} />
                </div>
                <div>
                  <div className="section-title">Submission Checklist</div>
                  <div className="section-subtitle">Before you submit</div>
                </div>
              </div>
              <div style={{ padding: '12px 22px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'File selected', done: !!selectedFile || uploadSuccess },
                  { label: 'Assignment read', done: !!assesmnet },
                  { label: 'Submitted on time', done: uploadSuccess && dueStatus?.color === '#16a34a' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 999, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: item.done ? '#dcfce7' : '#f1f5f9',
                      border: `1.5px solid ${item.done ? '#86efac' : '#dde3ef'}`,
                      transition: 'all 0.2s ease',
                    }}>
                      {item.done && <CheckCircle2 style={{ width: 11, height: 11, color: '#16a34a' }} />}
                    </div>
                    <span style={{
                      fontSize: 12.5,
                      color: item.done ? '#15803d' : '#94a3b8',
                      fontWeight: item.done ? 600 : 400,
                      transition: 'color 0.2s ease',
                    }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}