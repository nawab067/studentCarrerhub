'use client';

import StudentPortalSidebar from "@/components/student-portal/student-sidebar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart2, BookOpen, GraduationCap, ArrowUpRight } from "lucide-react";

interface ShowClasses {
  _id: string;
  classroom_name: string;
  teacherid: string;
}

export default function StudentGradesPage() {
  const [classes, setClasses] = useState<ShowClasses[]>([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) { router.replace('/login'); return; }
    setId(studentId);
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/classes/student/${id}`);
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchClasses(); }, [id]);

  const subjectColors = [
    { light: '#eef2ff', mid: '#818cf8', bar: 'linear-gradient(135deg,#6366f1,#818cf8)' },
    { light: '#fdf4ff', mid: '#c084fc', bar: 'linear-gradient(135deg,#a855f7,#c084fc)' },
    { light: '#ecfeff', mid: '#22d3ee', bar: 'linear-gradient(135deg,#06b6d4,#22d3ee)' },
    { light: '#fff7ed', mid: '#fb923c', bar: 'linear-gradient(135deg,#f97316,#fb923c)' },
    { light: '#f0fdf4', mid: '#4ade80', bar: 'linear-gradient(135deg,#22c55e,#4ade80)' },
    { light: '#fff1f2', mid: '#fb7185', bar: 'linear-gradient(135deg,#f43f5e,#fb7185)' },
  ];

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
        .grade-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8ecf4;
          cursor: pointer;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.22s cubic-bezier(.22,.68,0,1.15),
                      box-shadow 0.22s ease,
                      border-color 0.22s ease;
        }
        .grade-card:hover {
          transform: translateY(-4px);
          border-color: transparent;
          box-shadow: 0 20px 60px rgba(15,23,42,.10), 0 4px 16px rgba(15,23,42,.06);
        }
        .card-arrow {
          opacity: 0;
          transform: translate(-4px, 4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .grade-card:hover .card-arrow { opacity: 1; transform: translate(0, 0); }

        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .skel {
          background: linear-gradient(90deg, #eef0f6 25%, #e4e8f2 50%, #eef0f6 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 16px;
          border: 1px solid #e8ecf4;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-enter { animation: cardIn 0.38s cubic-bezier(.22,.68,0,1.1) forwards; opacity: 0; }
        .subject-bar { width: 4px; border-radius: 0 4px 4px 0; flex-shrink: 0; align-self: stretch; }
        .stat-chip {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          padding: 10px 20px; border-right: 1px solid #e8ecf4;
        }
        .stat-chip:last-child { border-right: none; }
        .empty-ghost {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 10px;
          opacity: 0.25; margin-bottom: 32px;
        }
        .ghost-card { height: 130px; background: #dde2ec; border-radius: 12px; }
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
                    My Grades
                  </h1>
                  {!loading && (
                    <span style={{
                      fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 500,
                      background: '#1e293b', color: '#fff', padding: '2px 10px', borderRadius: 999,
                    }}>
                      {classes.length} {classes.length === 1 ? 'class' : 'classes'}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '3px 0 0' }}>
                  Select a classroom to view your grades
                </p>
              </div>
            </div>

            {/* Stats strip */}
            {!loading && classes.length > 0 && (
              <div style={{
                display: 'flex', background: '#fff',
                border: '1px solid #e8ecf4', borderRadius: 12, overflow: 'hidden',
              }}>
                {([
                  { label: 'Classes',  value: classes.length, color: '#6366f1' },
                  { label: 'Active',   value: classes.length, color: '#16a34a' },
                  { label: 'Subjects', value: classes.length, color: '#d97706' },
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

          <div style={{ height: 1, background: 'linear-gradient(90deg,#e8ecf4,transparent)', margin: '0 32px' }} />
          <div style={{ height: 16 }} />
        </div>

        {/* ══════════ CONTENT ══════════ */}
        <div className="page-bg" style={{ padding: '28px 32px', minHeight: 'calc(100vh - 140px)' }}>

          {/* Skeletons */}
          {loading && (
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skel" style={{ height: 190 }} />
              ))}
            </div>
          )}

          {/* Cards */}
          {!loading && classes.length > 0 && (
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
              {classes.map((item, i) => {
                const color = subjectColors[i % subjectColors.length];
                return (
                  <div key={item._id} className="card-enter" style={{ animationDelay: `${i * 45}ms` }}>
                    <div
                      className="grade-card"
                      onClick={() => router.push(`/studentPortal/grades/showgrades/${item._id}`)}
                      onMouseEnter={() => setHoveredId(item._id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <div style={{ display: 'flex', flex: 1 }}>
                        <div className="subject-bar" style={{ background: color.bar }} />

                        <div style={{ flex: 1, padding: '18px 18px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

                          {/* Top: icon + arrow */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div style={{
                              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                              background: color.light, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <BookOpen style={{ width: 16, height: 16, color: color.mid }} />
                            </div>
                            <div className="card-arrow">
                              <ArrowUpRight style={{ width: 16, height: 16, color: '#94a3b8' }} />
                            </div>
                          </div>

                          {/* Title + subtitle */}
                          <div>
                            <h3 style={{ fontSize: 14, fontWeight: 650, color: '#0f172a', lineHeight: 1.35, marginBottom: 5, letterSpacing: '-0.1px' }}>
                              {item.classroom_name}
                            </h3>
                            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>
                              Tap to view your grade report
                            </p>
                          </div>

                          {/* Divider */}
                          <div style={{ height: 1, background: '#f1f5f9' }} />

                          {/* Footer */}
                          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{
                              fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 500,
                              background: color.light, color: color.mid,
                              padding: '3px 10px', borderRadius: 999,
                              border: `1px solid ${color.mid}22`,
                            }}>
                              Class {String(i + 1).padStart(2, '0')}
                            </span>
                            <span style={{ fontSize: 11, color: color.mid, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                              View grades <ArrowUpRight style={{ width: 11, height: 11 }} />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom progress strip */}
                      <div style={{ height: 3, background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                          position: 'absolute', inset: 0, background: color.bar,
                          opacity: 0.55, width: `${35 + (i % 4) * 18}%`,
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && classes.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px', textAlign: 'center' }}>
              <div className="empty-ghost" style={{ width: 280 }}>
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="ghost-card" />)}
              </div>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'linear-gradient(135deg,#3730a3 0%,#6366f1 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(99,102,241,.25)',
              }}>
                <GraduationCap style={{ width: 24, height: 24, color: '#fff' }} />
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.2px' }}>
                No classes found
              </p>
              <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 280, lineHeight: 1.6 }}>
                You haven't been enrolled in any classes yet. Check back once your teacher adds you.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}