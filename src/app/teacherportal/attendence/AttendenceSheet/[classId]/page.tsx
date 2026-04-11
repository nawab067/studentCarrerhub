"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  UserCheck,
  UserX,
  AlertCircle,
  GraduationCap,
  Layers,
} from "lucide-react";

interface Student { id: string; name: string; }
interface AttendanceState { [studentId: string]: "P" | "A" | null; }
interface Classroom {
  _id: string;
  classroom_name: string;
  students: { _id: string; name: string }[];
}
interface AttendanceItem { student_id: string; status: "P" | "A"; }
interface AttendancePayload { classroom_id: string; attendance: AttendanceItem[]; }

const AVATAR_COLORS = [
  'linear-gradient(135deg,#4f46e5,#6366f1)',
  'linear-gradient(135deg,#7c3aed,#8b5cf6)',
  'linear-gradient(135deg,#a855f7,#c084fc)',
  'linear-gradient(135deg,#6d28d9,#7c3aed)',
  'linear-gradient(135deg,#6366f1,#818cf8)',
  'linear-gradient(135deg,#8b5cf6,#a78bfa)',
]

export default function AttendanceSheetPage() {
  const params = useParams();
  const classroomId = params.classId as string;
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (!classroomId) return;
    const fetchClassroom = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Classroom>(`${baseurl}/classroom/${classroomId}`);
        setClassroom(res.data);
        setStudents(res.data.students.map(s => ({ id: s._id, name: s.name })));
      } catch { showToast('Failed to load classroom data.', 'error'); }
      finally { setLoading(false); }
    };
    fetchClassroom();
  }, [classroomId]);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAttendanceChange = (studentId: string, value: "P" | "A") => {
    setAttendance(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSaveAttendance = async () => {
    const attendanceArray: AttendanceItem[] = Object.entries(attendance)
      .filter(([, status]) => status !== null)
      .map(([studentId, status]) => ({ student_id: studentId, status: status as "P" | "A" }));

    if (attendanceArray.length === 0) { showToast('Please mark attendance before saving.', 'error'); return; }

    try {
      setSaving(true);
      const payload: AttendancePayload = { classroom_id: classroomId, attendance: attendanceArray };
      const response = await axios.post(`${baseurl}/mark_attendance`, payload);
      showToast(response.data.message || 'Attendance saved successfully!', 'success');
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Failed to save attendance.', 'error');
    } finally { setSaving(false); }
  };

  const presentCount  = Object.values(attendance).filter(s => s === "P").length;
  const absentCount   = Object.values(attendance).filter(s => s === "A").length;
  const unmarkedCount = students.length - presentCount - absentCount;
  const progress      = students.length > 0 ? Math.round(((presentCount + absentCount) / students.length) * 100) : 0;

  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen" style={{ background: '#f4f6fb', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

        .page-bg {
          background: #f4f6fb;
          background-image:
            radial-gradient(ellipse 80% 50% at 20% -10%, rgba(99,102,241,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 110%, rgba(139,92,246,0.05) 0%, transparent 60%);
        }

        /* ── Back button ── */
        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 10px; border: 1px solid #e2e8f0;
          background: #fff; color: #475569; font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: background 0.15s, box-shadow 0.15s, color 0.15s;
        }
        .back-btn:hover { background: #eef2ff; color: #4f46e5; border-color: #c7d2fe; box-shadow: 0 2px 8px rgba(99,102,241,.08); }

        /* ── Stat chip ── */
        .stat-chip { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 20px; border-right: 1px solid #e8ecf4; }
        .stat-chip:last-child { border-right: none; }
        .stats-strip { display: flex; background: #fff; border: 1px solid #e8ecf4; border-radius: 12px; overflow: hidden; flex-shrink: 0; }

        /* ── Mini stat cards ── */
        .mini-stat {
          background: #fff; border-radius: 14px; border: 1px solid #e8ecf4;
          padding: 16px 18px; display: flex; align-items: center; justify-content: space-between;
          transition: box-shadow 0.18s ease;
        }
        .mini-stat:hover { box-shadow: 0 6px 24px rgba(15,23,42,.07); }

        /* ── Table container ── */
        .table-wrap {
          background: #fff; border-radius: 16px; border: 1px solid #e8ecf4;
          overflow: hidden; box-shadow: 0 4px 24px rgba(15,23,42,.05);
        }
        .table-header-bg {
          padding: 18px 22px 14px;
          background: linear-gradient(135deg,#eef2ff 0%,#f5f3ff 100%);
          border-bottom: 1px solid #e8ecf4;
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
        }

        /* ── Table rows ── */
        .att-table { width: 100%; border-collapse: collapse; }
        .att-table thead tr { background: #fafafa; }
        .att-table th {
          padding: 11px 16px; text-align: left; font-size: 11px; font-weight: 600;
          color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;
          border-bottom: 1px solid #f1f5f9;
        }
        .att-table th:last-child { text-align: right; }
        .att-table th:nth-child(2) { text-align: center; }
        .att-row { border-bottom: 1px solid #f8f9fb; transition: background 0.14s ease; }
        .att-row:last-child { border-bottom: none; }
        .att-row:hover { background: #f5f3ff; }
        .att-table td { padding: 12px 16px; vertical-align: middle; }
        .att-table td:last-child { text-align: right; }
        .att-table td:nth-child(2) { text-align: center; }

        /* ── Avatar ── */
        .avatar {
          width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 13px; font-weight: 700;
          box-shadow: 0 2px 8px rgba(79,70,229,.2);
        }

        /* ── Status badge ── */
        .status-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px 3px 7px; border-radius: 999px; font-size: 11px; font-weight: 600;
          font-family: 'DM Mono', monospace; border: 1px solid;
        }

        /* ── Toggle buttons ── */
        .tog-wrap { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }
        .tog-btn {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600;
          border: 1.5px solid; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.16s ease;
        }
        .tog-btn.present { border-color: #bbf7d0; color: #16a34a; background: #f0fdf4; }
        .tog-btn.present:hover, .tog-btn.present.active { background: #16a34a; color: #fff; border-color: #16a34a; box-shadow: 0 3px 10px rgba(22,163,74,.2); }
        .tog-btn.absent  { border-color: #fecaca; color: #dc2626; background: #fef2f2; }
        .tog-btn.absent:hover,  .tog-btn.absent.active  { background: #dc2626; color: #fff; border-color: #dc2626; box-shadow: 0 3px 10px rgba(220,38,38,.2); }

        /* ── Save button ── */
        .save-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 11px 24px; border-radius: 10px;
          background: linear-gradient(135deg,#4f46e5,#7c3aed); color: #fff;
          font-size: 13px; font-weight: 600; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; box-shadow: 0 4px 14px rgba(79,70,229,.28);
          transition: opacity 0.16s ease, transform 0.16s ease;
        }
        .save-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Progress bar ── */
        .prog-track { height: 6px; background: #e8ecf4; border-radius: 999px; overflow: hidden; flex: 1; }
        .prog-fill  { height: 100%; border-radius: 999px; background: linear-gradient(90deg,#4f46e5,#8b5cf6); transition: width 0.5s ease; }

        /* ── Toast ── */
        .toast {
          position: fixed; bottom: 24px; right: 24px; z-index: 9999;
          display: flex; align-items: center; gap: 10px;
          padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 500;
          box-shadow: 0 8px 32px rgba(15,23,42,.14);
          animation: toastIn 0.3s cubic-bezier(.22,.68,0,1.2) forwards;
        }
        .toast.success { background: #fff; border: 1px solid #bbf7d0; color: #15803d; }
        .toast.error   { background: #fff; border: 1px solid #fecaca; color: #dc2626; }
        @keyframes toastIn { from { opacity:0; transform: translateY(12px) scale(0.96); } to { opacity:1; transform: translateY(0) scale(1); } }

        @keyframes shimmer { 0% { background-position:-600px 0; } 100% { background-position:600px 0; } }
        .skel-row {
          height: 58px; border-radius: 10px; margin-bottom: 8px;
          background: linear-gradient(90deg,#eef0f6 25%,#e4e8f2 50%,#eef0f6 75%);
          background-size: 600px 100%; animation: shimmer 1.4s infinite;
        }

        /* ── Layout ── */
        .main-content { transition: margin-left 0.3s; }
        .content-padding { padding: 28px 32px; }
        .grid-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 20px; }

        /* Mobile */
        @media (max-width: 640px) {
          .main-content { margin-left: 0 !important; }
          .content-padding { padding: 14px 12px; }
          .grid-stats { grid-template-columns: repeat(2,1fr); gap: 10px; }
          .stats-strip { width: 100%; }
          .stat-chip { flex: 1; padding: 8px 10px; }
          .table-header-bg { padding: 14px 14px 12px; }
          .att-table th, .att-table td { padding: 10px 10px; }
          .tog-btn { padding: 5px 9px; font-size: 11px; }
          .toast { left: 12px; right: 12px; bottom: 12px; }
          .save-btn { padding: 10px 18px; font-size: 12px; }
          .back-btn { font-size: 12px; padding: 6px 12px; }
          .page-header-row { flex-direction: column !important; align-items: flex-start !important; }
        }
        /* Tablet */
        @media (min-width: 641px) and (max-width: 1024px) {
          .main-content { margin-left: 0 !important; }
          .content-padding { padding: 20px; }
          .grid-stats { grid-template-columns: repeat(2,1fr); }
        }
        /* Desktop sidebar */
        @media (min-width: 1025px) {
          .main-content.sidebar-expanded { margin-left: 256px; }
          .main-content.sidebar-collapsed { margin-left: 80px; }
        }

        /* Hide status column on very small screens */
        @media (max-width: 480px) {
          .col-status { display: none; }
        }
      `}</style>

      <TeacherPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className={`main-content min-h-screen ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>

        {/* ══════════ STICKY HEADER ══════════ */}
        <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(244,246,251,0.93)', backdropFilter: 'blur(14px)', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ padding: '18px 32px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }} className="page-header-row">

            {/* Left: back + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <button className="back-btn" onClick={() => router.back()}>
                <ArrowLeft style={{ width: 14, height: 14 }} />
                Back
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: 'linear-gradient(135deg,#3730a3 0%,#6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 16px rgba(99,102,241,.28)' }}>
                  <GraduationCap style={{ width: 18, height: 18, color: '#fff' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h1 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px', margin: 0 }}>
                      {loading ? 'Loading…' : (classroom?.classroom_name || 'Attendance Sheet')}
                    </h1>
                    {!loading && (
                      <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 500, background: '#1e293b', color: '#fff', padding: '2px 9px', borderRadius: 999 }}>
                        {students.length} students
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                    <Calendar style={{ width: 12, height: 12, color: '#94a3b8' }} />
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{todayDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: stat strip */}
            {!loading && students.length > 0 && (
              <div className="stats-strip">
                {([
                  { label: 'Present',  value: presentCount,  color: '#16a34a' },
                  { label: 'Absent',   value: absentCount,   color: '#dc2626' },
                  { label: 'Unmarked', value: unmarkedCount, color: '#d97706' },
                ] as const).map(s => (
                  <div key={s.label} className="stat-chip">
                    <span style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>{s.value}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════ CONTENT ══════════ */}
        <div className="page-bg content-padding" style={{ minHeight: 'calc(100vh - 100px)' }}>

          {/* ── Mini stat cards ── */}
          {!loading && (
            <div className="grid-stats">
              {([
                { label: 'Total',    value: students.length, icon: Users,      iconBg: '#eef2ff', iconColor: '#6366f1' },
                { label: 'Present',  value: presentCount,    icon: UserCheck,  iconBg: '#f0fdf4', iconColor: '#16a34a' },
                { label: 'Absent',   value: absentCount,     icon: UserX,      iconBg: '#fef2f2', iconColor: '#dc2626' },
                { label: 'Unmarked', value: unmarkedCount,   icon: AlertCircle,iconBg: '#fffbeb', iconColor: '#d97706' },
              ]).map(({ label, value, icon: Icon, iconBg, iconColor }) => (
                <div key={label} className="mini-stat">
                  <div>
                    <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                    <p style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>{value}</p>
                  </div>
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ width: 18, height: 18, color: iconColor }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Main table card ── */}
          <div className="table-wrap">

            {/* Table card header */}
            <div className="table-header-bg">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <CheckCircle2 style={{ width: 15, height: 15, color: '#6366f1' }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Mark Attendance</span>
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>Select Present or Absent for each student</p>
              </div>

              {/* Progress */}
              {!loading && students.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 180 }}>
                  <div className="prog-track">
                    <div className="prog-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", fontWeight: 600, color: '#6366f1', whiteSpace: 'nowrap' }}>
                    {presentCount + absentCount}/{students.length}
                  </span>
                </div>
              )}
            </div>

            {/* Skeleton */}
            {loading && (
              <div style={{ padding: '20px 22px' }}>
                {Array.from({ length: 7 }).map((_, i) => <div key={i} className="skel-row" />)}
              </div>
            )}

            {/* Table */}
            {!loading && (
              <>
                <ScrollArea style={{ maxHeight: 480 }}>
                  <table className="att-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th className="col-status">Status</th>
                        <th>Mark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, i) => {
                        const status = attendance[student.id];
                        const avatarGrad = AVATAR_COLORS[i % AVATAR_COLORS.length];
                        return (
                          <tr key={student.id} className="att-row">
                            {/* Name */}
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div className="avatar" style={{ background: avatarGrad }}>
                                  {student.name.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{student.name}</span>
                              </div>
                            </td>

                            {/* Status badge */}
                            <td className="col-status">
                              {status === "P" && (
                                <span className="status-badge" style={{ background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }}>
                                  <CheckCircle2 style={{ width: 10, height: 10 }} /> Present
                                </span>
                              )}
                              {status === "A" && (
                                <span className="status-badge" style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}>
                                  <XCircle style={{ width: 10, height: 10 }} /> Absent
                                </span>
                              )}
                              {!status && (
                                <span className="status-badge" style={{ background: '#fffbeb', color: '#d97706', borderColor: '#fde68a' }}>
                                  <Clock style={{ width: 10, height: 10 }} /> Unmarked
                                </span>
                              )}
                            </td>

                            {/* Toggle */}
                            <td>
                              <div className="tog-wrap">
                                <button
                                  className={`tog-btn present${status === 'P' ? ' active' : ''}`}
                                  onClick={() => handleAttendanceChange(student.id, 'P')}
                                >
                                  <CheckCircle2 style={{ width: 12, height: 12 }} />
                                  P
                                </button>
                                <button
                                  className={`tog-btn absent${status === 'A' ? ' active' : ''}`}
                                  onClick={() => handleAttendanceChange(student.id, 'A')}
                                >
                                  <XCircle style={{ width: 12, height: 12 }} />
                                  A
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </ScrollArea>

                {/* Footer */}
                <div style={{ padding: '16px 22px', background: 'linear-gradient(135deg,#eef2ff 0%,#f5f3ff 100%)', borderTop: '1px solid #e8ecf4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                      <span style={{ fontWeight: 700, color: '#4f46e5', fontFamily: "'DM Mono',monospace" }}>{presentCount + absentCount}</span>
                      <span style={{ color: '#94a3b8' }}> of </span>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontFamily: "'DM Mono',monospace" }}>{students.length}</span>
                      <span style={{ color: '#94a3b8' }}> students marked</span>
                    </p>
                    {unmarkedCount > 0 && (
                      <p style={{ fontSize: 11, color: '#d97706', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertCircle style={{ width: 11, height: 11 }} />
                        {unmarkedCount} student{unmarkedCount > 1 ? 's' : ''} still unmarked
                      </p>
                    )}
                  </div>
                  <button className="save-btn" onClick={handleSaveAttendance} disabled={saving}>
                    <Save style={{ width: 14, height: 14 }} />
                    {saving ? 'Saving…' : 'Save Attendance'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* ══════════ TOAST ══════════ */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success'
            ? <CheckCircle2 style={{ width: 15, height: 15 }} />
            : <AlertCircle style={{ width: 15, height: 15 }} />
          }
          {toast.msg}
        </div>
      )}
    </div>
  );
}