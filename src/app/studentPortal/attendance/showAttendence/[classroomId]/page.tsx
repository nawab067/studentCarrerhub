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
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

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

        /* ── MAIN LAYOUT ── */
        .main-content {
          transition: margin-left 0.3s;
          min-height: 100vh;
        }

        /* Large screen sidebar offsets */
        @media (min-width: 1025px) {
          .main-content.sidebar-expanded  { margin-left: 256px; }
          .main-content.sidebar-collapsed { margin-left: 80px; }
        }

        /* Tablet + mobile: no sidebar push */
        @media (max-width: 1024px) {
          .main-content { margin-left: 0 !important; }
        }

        /* ── Header ── */
        .page-header {
          position: relative;
          overflow: hidden;
          padding: 32px 40px;
          border-bottom: 1px solid #e2e8f0;
          background: #ffffff;
        }
        .header-inner {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        /* ── Stats grid ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        /* ── Table ── */
        .table-header {
          display: grid;
          grid-template-columns: 1fr auto auto;
          padding: 12px 24px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #94a3b8;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .table-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          padding: 16px 24px;
          gap: 12px;
        }

        .body-padding {
          padding: 40px;
        }

        /* ── TABLET (641–1024px) ── */
        @media (min-width: 641px) and (max-width: 1024px) {
          .page-header { padding: 24px 24px; }
          .body-padding { padding: 24px; }
          .stats-grid { gap: 14px; }
        }

        /* ── MOBILE (≤ 640px) ── */
        @media (max-width: 640px) {
          .page-header { padding: 16px 16px; }
          .body-padding { padding: 14px 12px; }

          .header-left { gap: 10px; }

          .page-header h1 { font-size: 18px !important; }

          /* Stack stats vertically on very small screens */
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          /* Stat card: horizontal layout on mobile */
          .stat-card {
            flex-direction: row !important;
            align-items: center;
            gap: 16px;
            padding: 14px 16px !important;
          }
          .stat-card-top {
            flex-direction: row-reverse;
            align-items: center;
            width: 100%;
          }

          /* Table: tighten columns */
          .table-header {
            padding: 10px 14px;
            font-size: 10px;
          }
          .table-row {
            padding: 12px 14px;
            gap: 8px;
          }

          /* Records pill */
          .records-pill {
            font-size: 10px !important;
            padding: 3px 8px !important;
          }

          /* Student meta: stack on mobile */
          .student-meta {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 4px !important;
          }
          .meta-dot { display: none !important; }
        }
      `}</style>

      <StudentPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className={`main-content ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>

        {/* ── Header ── */}
        <div className="page-header">
          <div className="header-blob" />

          <div className="header-inner">
            <div className="header-left">
              {/* Back button */}
              <button
                onClick={() => router.back()}
                className="back-btn"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                  background: '#f1f5f9', color: '#64748b', border: 'none', cursor: 'pointer',
                }}
              >
                <ArrowLeft style={{ width: 16, height: 16 }} />
              </button>

              {/* Icon */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 48, height: 48, borderRadius: 16, flexShrink: 0,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                }}
              >
                <CalendarDays style={{ width: 20, height: 20, color: '#fff' }} />
              </div>

              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px', margin: 0 }}>
                  Attendance Details
                </h1>
                {!loading && studentName && (
                  <div
                    className="student-meta"
                    style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <User style={{ width: 13, height: 13, color: '#94a3b8' }} />
                      <span style={{ fontSize: 13, color: '#64748b' }}>{studentName}</span>
                    </div>
                    <span className="meta-dot" style={{ color: '#e2e8f0' }}>·</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Hash style={{ width: 13, height: 13, color: '#94a3b8' }} />
                      <span style={{ fontSize: 13, color: '#64748b', fontFamily: "'JetBrains Mono', monospace" }}>
                        {rollNumber}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Records pill */}
            {!loading && attendanceData.length > 0 && (
              <span
                className="records-pill"
                style={{
                  fontSize: 11, fontWeight: 600, padding: '6px 12px', borderRadius: 999,
                  background: '#ede9fe', color: '#6d28d9',
                  fontFamily: "'JetBrains Mono', monospace",
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {attendanceData.length} records
              </span>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="body-padding" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="stats-grid">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skel" style={{ height: 112 }} />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skel" style={{ height: 64 }} />
                ))}
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading && attendanceData.length === 0 && (
            <div
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '80px 24px', borderRadius: 16,
                background: '#ffffff', border: '1.5px dashed #e2e8f0', textAlign: 'center',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 64, height: 64, borderRadius: 16, background: '#ede9fe', marginBottom: 20,
              }}>
                <CalendarDays style={{ width: 28, height: 28, color: '#7c3aed' }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>
                No attendance records
              </p>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>
                No attendance has been recorded for this classroom yet.
              </p>
            </div>
          )}

          {!loading && attendanceData.length > 0 && (
            <>
              {/* ── Stats Row ── */}
              <div className="stats-grid">

                {/* Present */}
                <div
                  className="stat-card"
                  style={{
                    background: '#ffffff', border: '1px solid #e2e8f0',
                    borderRadius: 16, padding: 20,
                    display: 'flex', flexDirection: 'column', gap: 12,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 40, height: 40, borderRadius: 12, background: '#d1fae5',
                    }}>
                      <CheckCircle2 style={{ width: 16, height: 16, color: '#059669' }} />
                    </div>
                    <span style={{ fontSize: 24, fontWeight: 700, color: '#059669', fontFamily: "'JetBrains Mono', monospace" }}>
                      {presentCount}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>Present</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>Days attended</p>
                  </div>
                </div>

                {/* Absent */}
                <div
                  className="stat-card"
                  style={{
                    background: '#ffffff', border: '1px solid #e2e8f0',
                    borderRadius: 16, padding: 20,
                    display: 'flex', flexDirection: 'column', gap: 12,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 40, height: 40, borderRadius: 12, background: '#ffe4e6',
                    }}>
                      <XCircle style={{ width: 16, height: 16, color: '#e11d48' }} />
                    </div>
                    <span style={{ fontSize: 24, fontWeight: 700, color: '#e11d48', fontFamily: "'JetBrains Mono', monospace" }}>
                      {absentCount}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>Absent</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>Days missed</p>
                  </div>
                </div>

                {/* Rate */}
                <div
                  className="stat-card"
                  style={{
                    background: '#ffffff', border: '1px solid #e2e8f0',
                    borderRadius: 16, padding: 20,
                    display: 'flex', flexDirection: 'column', gap: 12,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 40, height: 40, borderRadius: 12, background: '#ede9fe',
                    }}>
                      <BarChart3 style={{ width: 16, height: 16, color: '#7c3aed' }} />
                    </div>
                    <span style={{ fontSize: 24, fontWeight: 700, color: '#6366f1', fontFamily: "'JetBrains Mono', monospace" }}>
                      {attendanceRate}%
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>Rate</p>
                    <div style={{ marginTop: 8, height: 6, borderRadius: 999, overflow: 'hidden', background: '#e2e8f0' }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          height: '100%', borderRadius: 999,
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
                style={{
                  background: '#ffffff', border: '1px solid #e2e8f0',
                  borderRadius: 16, overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                {/* Table header */}
                <div className="table-header">
                  <span>Date</span>
                  <span style={{ textAlign: 'center' }}>Day</span>
                  <span style={{ textAlign: 'right' }}>Status</span>
                </div>

                {/* Rows */}
                <div style={{ borderColor: '#f1f5f9' }}>
                  {attendanceData.map((item, i) => {
                    const dateObj = new Date(item.date);
                    const isPresent = item.status === 'present';
                    return (
                      <div
                        key={item.attendance_id}
                        className="att-row row-enter table-row"
                        style={{
                          animationDelay: `${i * 40}ms`,
                          borderBottom: i < attendanceData.length - 1 ? '1px solid #f1f5f9' : 'none',
                        }}
                      >
                        {/* Date */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                          <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                            background: '#f8fafc', border: '1px solid #e2e8f0',
                          }}>
                            <CalendarDays style={{ width: 13, height: 13, color: '#94a3b8' }} />
                          </div>
                          <span style={{
                            fontSize: 12, fontWeight: 500, color: '#0f172a',
                            fontFamily: "'JetBrains Mono', monospace",
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {dateObj.toLocaleDateString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric',
                            })}
                          </span>
                        </div>

                        {/* Day name */}
                        <div style={{ textAlign: 'center', flexShrink: 0 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 500, padding: '3px 8px',
                            borderRadius: 999, background: '#f1f5f9', color: '#64748b',
                          }}>
                            {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                        </div>

                        {/* Status */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 999,
                            background: isPresent ? '#d1fae5' : '#ffe4e6',
                            color: isPresent ? '#065f46' : '#9f1239',
                            whiteSpace: 'nowrap',
                          }}>
                            {isPresent
                              ? <CheckCircle2 style={{ width: 11, height: 11 }} />
                              : <XCircle style={{ width: 11, height: 11 }} />
                            }
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