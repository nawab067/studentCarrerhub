'use client';

import StudentPortalSidebar from "@/components/student-portal/student-sidebar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AssessmentDialog from "@/components/student-portal/viewgrades";
import {
  BarChart2, FileText, Calendar, Eye, Search,
  GraduationCap, ArrowUpRight, ClipboardList
} from "lucide-react";

interface StudentAssessment {
  _id: string;
  name: string;
  description: string;
  teacherId: string;
  created_at: string;
}

export default function StudentGradesDetailPage() {
  const params = useParams();
  const router = useRouter();

  const assessmentIdParam = Array.isArray(params?.assessmentId)
    ? params.assessmentId[0]
    : params?.assessmentId;

  const [assessments, setAssessments] = useState<StudentAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const baseurl= process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const storedId = localStorage.getItem("studentId");
    if (!storedId) { router.replace("/login"); return; }
    setStudentId(storedId);
  }, [router]);

  async function getStudentAssessments() {
    try {
      setLoading(true);
      const response = await axios.get(`${baseurl}/get_assesments/${assessmentIdParam}`);
      setAssessments(response.data.data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (studentId && assessmentIdParam) getStudentAssessments();
  }, [studentId, assessmentIdParam]);

  const handleView = async (assessmentId: string) => {
    if (!studentId) return;
    try {
      setOpen(true);
      setDetailLoading(true);
      const res = await axios.get(`${baseurl}/student/grades/${assessmentId}/${studentId}`);
      const studentData = res.data.students?.find((s: any) => s.student_id === studentId);
      setSelectedAssessment({
        name: "Assessment",
        marks: studentData?.marks ?? null,
        weightage: res.data.weightage ?? null,
      });
    } catch (err) {
      console.error("Error fetching assessment details:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const subjectColors = [
    { light: '#eef2ff', mid: '#818cf8', bar: 'linear-gradient(135deg,#6366f1,#818cf8)' },
    { light: '#fdf4ff', mid: '#c084fc', bar: 'linear-gradient(135deg,#a855f7,#c084fc)' },
    { light: '#ecfeff', mid: '#22d3ee', bar: 'linear-gradient(135deg,#06b6d4,#22d3ee)' },
    { light: '#fff7ed', mid: '#fb923c', bar: 'linear-gradient(135deg,#f97316,#fb923c)' },
    { light: '#f0fdf4', mid: '#4ade80', bar: 'linear-gradient(135deg,#22c55e,#4ade80)' },
    { light: '#fff1f2', mid: '#fb7185', bar: 'linear-gradient(135deg,#f43f5e,#fb7185)' },
  ];

  const filtered = assessments.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: '#f4f6fb', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

        .page-bg {
          background: #f4f6fb;
          background-image:
            radial-gradient(ellipse 80% 50% at 20% -10%, rgba(99,102,241,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 110%, rgba(168,85,247,0.04) 0%, transparent 60%);
        }

        /* ── Table container ── */
        .table-wrap {
          background: #fff;
          border-radius: 18px;
          border: 1px solid #e8ecf4;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(15,23,42,0.05);
        }

        /* ── Table head ── */
        .tbl-head {
          background: #f8fafc;
          border-bottom: 1px solid #e8ecf4;
        }
        .tbl-th {
          padding: 13px 20px;
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }

        /* ── Table rows ── */
        .tbl-row {
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s ease;
        }
        .tbl-row:last-child { border-bottom: none; }
        .tbl-row:hover { background: #fafbff; }
        .tbl-td {
          padding: 16px 20px;
          font-size: 13px;
          color: #334155;
          vertical-align: middle;
        }

        /* ── View button ── */
        .view-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #475569;
          cursor: pointer;
          transition: all 0.16s ease;
          white-space: nowrap;
        }
        .view-btn:hover {
          background: #1e293b;
          color: #fff;
          border-color: #1e293b;
          box-shadow: 0 4px 12px rgba(15,23,42,0.15);
        }
        .view-btn:hover .btn-arrow { transform: translate(1px,-1px); }
        .btn-arrow { transition: transform 0.16s ease; }

        /* ── Search ── */
        .search-wrap { position: relative; }
        .search-input {
          width: 100%;
          padding: 9px 14px 9px 38px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #fff;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #1e293b;
          outline: none;
          transition: border-color 0.16s ease, box-shadow 0.16s ease;
        }
        .search-input::placeholder { color: #94a3b8; }
        .search-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.10); }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; }

        /* ── Skeletons ── */
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .skel {
          background: linear-gradient(90deg,#eef0f6 25%,#e4e8f2 50%,#eef0f6 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }

        /* ── Row entrance ── */
        @keyframes rowIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .row-enter { animation: rowIn 0.3s ease forwards; opacity: 0; }

        /* ── Index badge ── */
        .index-badge {
          width: 28px; height: 28px; border-radius: 8px;
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; font-family: 'DM Mono', monospace;
          flex-shrink: 0;
        }

        /* ── Stat chip ── */
        .stat-chip {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          padding: 10px 20px; border-right: 1px solid #e8ecf4;
        }
        .stat-chip:last-child { border-right: none; }

        /* ── Empty state ghost ── */
        .empty-ghost {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 10px;
          opacity: 0.25; margin-bottom: 32px;
        }
        .ghost-card { height: 40px; background: #dde2ec; border-radius: 8px; }
      `}</style>

      <StudentPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className={`transition-all duration-300 min-h-screen ${collapsed ? 'ml-20' : 'ml-64'}`}>

        {/* ══════════ STICKY HEADER ══════════ */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: 'rgba(244,246,251,0.93)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg,#3730a3 0%,#6366f1 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(99,102,241,.28)',
              }}>
                <BarChart2 style={{ width: 20, height: 20, color: '#fff' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h1 style={{ fontSize: 21, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>
                    Grade Report
                  </h1>
                  {!loading && (
                    <span style={{
                      fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 500,
                      background: '#1e293b', color: '#fff', padding: '2px 10px', borderRadius: 999,
                    }}>
                      {assessments.length} assessments
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '3px 0 0' }}>
                  View your marks and feedback for each assessment
                </p>
              </div>
            </div>

            {/* Stats strip */}
            {!loading && assessments.length > 0 && (
              <div style={{
                display: 'flex', background: '#fff',
                border: '1px solid #e8ecf4', borderRadius: 12, overflow: 'hidden',
              }}>
                {([
                  { label: 'Total',    value: assessments.length, color: '#6366f1' },
                  { label: 'Graded',   value: assessments.length, color: '#16a34a' },
                  { label: 'Pending',  value: 0,                  color: '#d97706' },
                ] as const).map(s => (
                  <div key={s.label} className="stat-chip">
                    <span style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>
                      {s.value}
                    </span>
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 32px 16px' }}>
            <div className="search-wrap" style={{ maxWidth: 320, width: '100%' }}>
              <Search className="search-icon" style={{ width: 15, height: 15, color: '#94a3b8' }} />
              <input
                className="search-input"
                placeholder="Search assessments..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ══════════ CONTENT ══════════ */}
        <div className="page-bg" style={{ padding: '28px 32px', minHeight: 'calc(100vh - 160px)' }}>

          {/* ── Skeleton ── */}
          {loading && (
            <div className="table-wrap">
              {/* Fake header */}
              <div className="tbl-head" style={{ display: 'flex', gap: 16, padding: '13px 20px' }}>
                {['30%','40%','15%','10%'].map((w, i) => (
                  <div key={i} className="skel" style={{ height: 14, width: w }} />
                ))}
              </div>
              {/* Fake rows */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '18px 20px', borderBottom: '1px solid #f1f5f9' }}>
                  <div className="skel" style={{ height: 14, width: '30%' }} />
                  <div className="skel" style={{ height: 14, width: '40%' }} />
                  <div className="skel" style={{ height: 14, width: '15%' }} />
                  <div className="skel" style={{ height: 28, width: '80px', borderRadius: 8 }} />
                </div>
              ))}
            </div>
          )}

          {/* ── Table ── */}
          {!loading && filtered.length > 0 && (
            <div className="table-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead className="tbl-head">
                  <tr>
                    <th className="tbl-th" style={{ width: 48 }}>#</th>
                    <th className="tbl-th">Assessment Name</th>
                    <th className="tbl-th">Description</th>
                    <th className="tbl-th" style={{ whiteSpace: 'nowrap' }}>Created</th>
                    <th className="tbl-th" style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, i) => {
                    const color = subjectColors[i % subjectColors.length];
                    return (
                      <tr
                        key={item._id}
                        className={`tbl-row row-enter`}
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        {/* Index */}
                        <td className="tbl-td" style={{ paddingRight: 8 }}>
                          <div
                            className="index-badge"
                            style={{ background: color.light, color: color.mid }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </div>
                        </td>

                        {/* Name */}
                        <td className="tbl-td">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                              background: color.light, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <FileText style={{ width: 14, height: 14, color: color.mid }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                              {item.name}
                            </span>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="tbl-td" style={{ maxWidth: 280 }}>
                          <span style={{
                            display: '-webkit-box', WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            color: '#64748b', fontSize: 12,
                          }}>
                            {item.description}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="tbl-td">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Calendar style={{ width: 12, height: 12, color: '#94a3b8', flexShrink: 0 }} />
                            <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: '#64748b' }}>
                              {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="tbl-td" style={{ textAlign: 'right' }}>
                          <button
                            className="view-btn"
                            onClick={() => handleView(item._id)}
                          >
                            <Eye style={{ width: 13, height: 13 }} />
                            View Grades
                            <ArrowUpRight className="btn-arrow" style={{ width: 12, height: 12 }} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Table footer */}
              <div style={{
                padding: '12px 20px',
                background: '#f8fafc',
                borderTop: '1px solid #e8ecf4',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>
                  Showing {filtered.length} of {assessments.length} assessments
                </span>
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    style={{
                      fontSize: 12, color: '#6366f1', fontWeight: 600, background: 'none',
                      border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── No search results ── */}
          {!loading && assessments.length > 0 && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              }}>
                <Search style={{ width: 24, height: 24, color: '#94a3b8' }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>No matching assessments</p>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Try adjusting your search</p>
              <button
                onClick={() => setSearch('')}
                style={{
                  marginTop: 16, padding: '8px 20px', borderRadius: 8,
                  background: '#1e293b', color: '#fff', fontSize: 13, fontWeight: 500,
                  border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Clear search
              </button>
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && assessments.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px', textAlign: 'center' }}>
              <div className="empty-ghost" style={{ width: 320 }}>
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="ghost-card" />)}
              </div>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'linear-gradient(135deg,#3730a3 0%,#6366f1 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(99,102,241,.25)',
              }}>
                <ClipboardList style={{ width: 24, height: 24, color: '#fff' }} />
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.2px' }}>
                No assessments yet
              </p>
              <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 280, lineHeight: 1.6 }}>
                Your teacher hasn't added any assessments for this class yet.
              </p>
            </div>
          )}

        </div>
      </main>

      <AssessmentDialog
        open={open}
        onOpenChange={setOpen}
        data={selectedAssessment}
        loading={detailLoading}
      />
    </div>
  );
}