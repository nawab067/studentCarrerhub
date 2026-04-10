'use client';

import StudentPortalSidebar from '@/components/student-portal/student-sidebar';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { CalendarDays, CheckCircle2, XCircle, User, Hash, ArrowLeft, BarChart3 } from 'lucide-react';

export interface StudentAttendance {
  attendance_id: string;
  student_id: string;
  user_id: string;
  student_name: string;
  roll_number: string;
  classroom_id: string;
  date: string;
  status: 'present' | 'absent';
}

export default function StudentAttendanceDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const classroomId = params.classroomId as string;

  const [userId, setUserId] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);
   const [collapsed, setCollapsed] = useState(false);
   const baseurl = process.env.BASE_URL;

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    if (!id) {
      router.replace('/login');
      return;
    }
    setUserId(id);
    fetchAttendanceData(id, classroomId);
  }, [classroomId]);

  const fetchAttendanceData = async (userId: string, classroomId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseurl}/student-attendance/${userId}/${classroomId}`
      );
      setAttendanceData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const presentCount = attendanceData.filter((a) => a.status === 'present').length;
  const absentCount = attendanceData.filter((a) => a.status === 'absent').length;
  const attendanceRate =
    attendanceData.length > 0
      ? Math.round((presentCount / attendanceData.length) * 100)
      : 0;

  const studentName = attendanceData[0]?.student_name ?? '';
  const rollNumber = attendanceData[0]?.roll_number ?? '';

  return (
    <div
      className="min-h-screen"
      style={{ background: '#f8fafc', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .row-enter {
          animation: fadeUp 0.35s ease forwards;
          opacity: 0;
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skel {
          background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%);
          background-size: 400px 100%;
          animation: shimmer 1.3s infinite;
          border-radius: 12px;
        }
        .att-row {
          transition: box-shadow 0.18s ease, transform 0.18s ease;
        }
        .att-row:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.07);
        }
        .stat-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .progress-bar-fill {
          transition: width 1s cubic-bezier(.22,.68,0,1.2);
        }
        .back-btn {
          transition: background 0.15s ease, color 0.15s ease;
        }
        .back-btn:hover {
          background: #ede9fe;
          color: #6d28d9;
        }
        .header-blob {
          position: absolute;
          right: -40px;
          top: -60px;
          width: 280px;
          height: 280px;
          background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
      `}</style>

      <StudentPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
            className={`p-6 lg:p-10 transition-all duration-300 ${
              collapsed ? "ml-20" : "ml-64"
            }`}
          > 

        {/* ── Header ── */}
        <div
          className="relative overflow-hidden px-10 py-8 border-b"
          style={{ background: '#ffffff', borderColor: '#e2e8f0' }}
        >
          <div className="header-blob" />

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Back button */}
              <button
                onClick={() => router.back()}
                className="back-btn flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
                style={{ background: '#f1f5f9', color: '#64748b' }}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div
                className="flex items-center justify-center w-12 h-12 rounded-2xl flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                }}
              >
                <CalendarDays className="w-5 h-5 text-white" />
              </div>

              <div>
                <h1
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: '#0f172a' }}
                >
                  Attendance Details
                </h1>
                {!loading && studentName && (
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" style={{ color: '#94a3b8' }} />
                      <span className="text-sm" style={{ color: '#64748b' }}>
                        {studentName}
                      </span>
                    </div>
                    <span style={{ color: '#e2e8f0' }}>·</span>
                    <div className="flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5" style={{ color: '#94a3b8' }} />
                      <span
                        className="text-sm"
                        style={{ color: '#64748b', fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {rollNumber}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Total records pill */}
            {!loading && attendanceData.length > 0 && (
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full mt-1"
                style={{
                  background: '#ede9fe',
                  color: '#6d28d9',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {attendanceData.length} records
              </span>
            )}
          </div>
        </div>

        <div className="p-10 space-y-8">

          {/* ── Loading ── */}
          {loading && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skel h-28" />
                ))}
              </div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skel h-16" />
                ))}
              </div>
            </div>
          )}

          {/* ── Empty ── */}
          {!loading && attendanceData.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-24 rounded-2xl"
              style={{ background: '#ffffff', border: '1.5px dashed #e2e8f0' }}
            >
              <div
                className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                style={{ background: '#ede9fe' }}
              >
                <CalendarDays className="w-7 h-7" style={{ color: '#7c3aed' }} />
              </div>
              <p className="text-base font-semibold mb-1" style={{ color: '#0f172a' }}>
                No attendance records
              </p>
              <p className="text-sm" style={{ color: '#94a3b8' }}>
                No attendance has been recorded for this classroom yet.
              </p>
            </div>
          )}

          {!loading && attendanceData.length > 0 && (
            <>
              {/* ── Stats Row ── */}
              <div className="grid grid-cols-3 gap-5">

                {/* Present */}
                <div
                  className="stat-card rounded-2xl p-5 flex flex-col gap-3"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-xl"
                      style={{ background: '#d1fae5' }}
                    >
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#059669' }} />
                    </div>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: '#059669', fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {presentCount}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>
                      Present
                    </p>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>
                      Days attended
                    </p>
                  </div>
                </div>

                {/* Absent */}
                <div
                  className="stat-card rounded-2xl p-5 flex flex-col gap-3"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-xl"
                      style={{ background: '#ffe4e6' }}
                    >
                      <XCircle className="w-4 h-4" style={{ color: '#e11d48' }} />
                    </div>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: '#e11d48', fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {absentCount}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>
                      Absent
                    </p>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>
                      Days missed
                    </p>
                  </div>
                </div>

                {/* Attendance Rate */}
                <div
                  className="stat-card rounded-2xl p-5 flex flex-col gap-3"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-xl"
                      style={{ background: '#ede9fe' }}
                    >
                      <BarChart3 className="w-4 h-4" style={{ color: '#7c3aed' }} />
                    </div>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: '#6366f1', fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {attendanceRate}%
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>
                      Rate
                    </p>
                    {/* Progress bar */}
                    <div
                      className="mt-2 h-1.5 rounded-full overflow-hidden"
                      style={{ background: '#e2e8f0' }}
                    >
                      <div
                        className="progress-bar-fill h-full rounded-full"
                        style={{
                          width: `${attendanceRate}%`,
                          background:
                            attendanceRate >= 75
                              ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                              : attendanceRate >= 50
                              ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                              : 'linear-gradient(90deg, #e11d48, #fb7185)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Records Table ── */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                {/* Table header */}
                <div
                  className="grid grid-cols-3 px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#94a3b8',
                    letterSpacing: '0.06em',
                  }}
                >
                  <span>Date</span>
                  <span className="text-center">Day</span>
                  <span className="text-right">Status</span>
                </div>

                {/* Rows */}
                <div className="divide-y" style={{ borderColor: '#f1f5f9' }}>
                  {attendanceData.map((item, i) => {
                    const dateObj = new Date(item.date);
                    const isPresent = item.status === 'present';
                    return (
                      <div
                        key={item.attendance_id}
                        className="att-row row-enter grid grid-cols-3 items-center px-6 py-4"
                        style={{
                          animationDelay: `${i * 40}ms`,
                          borderBottom: i < attendanceData.length - 1 ? '1px solid #f1f5f9' : 'none',
                        }}
                      >
                        {/* Date */}
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                          >
                            <CalendarDays className="w-3.5 h-3.5" style={{ color: '#94a3b8' }} />
                          </div>
                          <span
                            className="text-sm font-medium"
                            style={{
                              color: '#0f172a',
                              fontFamily: "'JetBrains Mono', monospace",
                            }}
                          >
                            {dateObj.toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        {/* Day name */}
                        <div className="text-center">
                          <span
                            className="text-xs font-medium px-2.5 py-1 rounded-full"
                            style={{ background: '#f1f5f9', color: '#64748b' }}
                          >
                            {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="flex justify-end">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                            style={{
                              background: isPresent ? '#d1fae5' : '#ffe4e6',
                              color: isPresent ? '#065f46' : '#9f1239',
                            }}
                          >
                            {isPresent ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}