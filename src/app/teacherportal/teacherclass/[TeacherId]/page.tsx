'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import {
  BookOpen,
  Users,
  GraduationCap,
  TrendingUp,
  LayoutGrid,
  AlertCircle,
  Search,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export interface AssignedClass {
  _id: string;
  classroom_name: string;
  students: string[];
  teacherId: string;
}

// ── Same color palette as the assessment page ──────────────────────────────
const CLASS_COLORS = [
  { light: '#eef2ff', mid: '#6366f1', bar: 'linear-gradient(135deg,#4f46e5,#6366f1)' },
  { light: '#f5f3ff', mid: '#8b5cf6', bar: 'linear-gradient(135deg,#7c3aed,#8b5cf6)' },
  { light: '#fdf4ff', mid: '#c084fc', bar: 'linear-gradient(135deg,#a855f7,#c084fc)' },
  { light: '#ede9fe', mid: '#7c3aed', bar: 'linear-gradient(135deg,#6d28d9,#7c3aed)' },
  { light: '#f0f9ff', mid: '#818cf8', bar: 'linear-gradient(135deg,#6366f1,#818cf8)' },
  { light: '#faf5ff', mid: '#a78bfa', bar: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
];

type FilterType = 'all' | 'small' | 'medium' | 'large';

export default function TeacherClassesPage() {
  const [teacherId, setTeacherId]         = useState<string | null>(null);
  const [assignedClasses, setAssignedClasses] = useState<AssignedClass[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [collapsed, setCollapsed]         = useState(false);
  const [filter, setFilter]               = useState<FilterType>('all');
  const [search, setSearch]               = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const id = localStorage.getItem("teacherId");
    if (!id) { setError("Teacher ID not found. Please login again."); setLoading(false); return; }
    setTeacherId(id);
  }, []);

  useEffect(() => {
    if (!teacherId) return;
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/classes/assigned/${teacherId}`);
        setAssignedClasses(res.data?.data || []);
      } catch { setError("Failed to load classes."); }
      finally { setLoading(false); }
    };
    fetchClasses();
  }, [teacherId]);

  const getClassSize = (count: number): FilterType =>
    count <= 15 ? 'small' : count <= 30 ? 'medium' : 'large';

  const counts = {
    all:    assignedClasses.length,
    small:  assignedClasses.filter(c => getClassSize(c.students.length) === 'small').length,
    medium: assignedClasses.filter(c => getClassSize(c.students.length) === 'medium').length,
    large:  assignedClasses.filter(c => getClassSize(c.students.length) === 'large').length,
  };

  const filtered = assignedClasses.filter(cls => {
    const matchFilter = filter === 'all' || getClassSize(cls.students.length) === filter;
    const matchSearch = cls.classroom_name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalStudents = assignedClasses.reduce((s, c) => s + c.students.length, 0);
  const avgClassSize  = assignedClasses.length > 0 ? Math.round(totalStudents / assignedClasses.length) : 0;

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

        /* ── Card ── */
        .cls-card {
          background: #fff; border-radius: 16px; border: 1px solid #e8ecf4;
          cursor: pointer; overflow: hidden; display: flex; flex-direction: column;
          transition: transform 0.22s cubic-bezier(.22,.68,0,1.15), box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .cls-card:hover {
          transform: translateY(-4px); border-color: transparent;
          box-shadow: 0 20px 60px rgba(15,23,42,.10), 0 4px 16px rgba(15,23,42,.06);
        }
        .card-arrow { opacity: 0; transform: translate(-4px,4px); transition: opacity 0.2s ease, transform 0.2s ease; }
        .cls-card:hover .card-arrow { opacity: 1; transform: translate(0,0); }

        /* ── Filter pills ── */
        .filter-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 500;
          cursor: pointer; border: 1px solid transparent; transition: all 0.16s ease;
          background: transparent; white-space: nowrap; font-family: 'DM Sans', sans-serif;
        }
        .filter-pill:hover { background: #eef0f8; }
        .filter-pill.active { background: #1e293b; color: #fff !important; }
        .pill-count { font-size: 11px; font-family: 'DM Mono', monospace; padding: 1px 6px; border-radius: 999px; min-width: 20px; text-align: center; }
        .filter-pill.active .pill-count { background: rgba(255,255,255,.2); }
        .filter-pill:not(.active) .pill-count { background: #e8ecf4; color: #64748b; }

        /* ── Search ── */
        .search-wrap { position: relative; flex: 1; max-width: 300px; }
        .search-input {
          width: 100%; padding: 9px 14px 9px 38px; border-radius: 10px; border: 1px solid #e2e8f0;
          background: #fff; font-size: 13px; font-family: 'DM Sans', sans-serif; color: #1e293b; outline: none;
          transition: border-color 0.16s ease, box-shadow 0.16s ease;
        }
        .search-input::placeholder { color: #94a3b8; }
        .search-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.10); }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; }

        /* ── Shimmer skeleton ── */
        @keyframes shimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }
        .skel {
          background: linear-gradient(90deg,#eef0f6 25%,#e4e8f2 50%,#eef0f6 75%);
          background-size: 600px 100%; animation: shimmer 1.4s infinite;
          border-radius: 16px; border: 1px solid #e8ecf4;
        }

        /* ── Card entrance animation ── */
        @keyframes cardIn { from { opacity: 0; transform: translateY(18px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .card-enter { animation: cardIn 0.38s cubic-bezier(.22,.68,0,1.1) forwards; opacity: 0; }

        /* ── Stat strip ── */
        .stat-chip { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 20px; border-right: 1px solid #e8ecf4; }
        .stat-chip:last-child { border-right: none; }
        .stats-strip { display: flex; background: #fff; border: 1px solid #e8ecf4; border-radius: 12px; overflow: hidden; flex-shrink: 0; }

        .subject-bar { width: 4px; border-radius: 0 4px 4px 0; flex-shrink: 0; align-self: stretch; }

        /* ── Capacity bar ── */
        .capacity-track { height: 5px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
        .capacity-fill  { height: 100%; border-radius: 999px; transition: width 0.6s cubic-bezier(.22,.68,0,1.1); }

        /* ── Clear button ── */
        .clear-btn {
          margin-top: 16px; padding: 8px 20px; border-radius: 8px; background: #1e293b; color: #fff;
          font-size: 13px; font-weight: 500; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: background 0.16s ease;
        }
        .clear-btn:hover { background: #0f172a; }

        /* ── Empty ghost ── */
        .empty-ghost { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; opacity: 0.22; margin-bottom: 32px; }
        .ghost-card  { height: 130px; background: #dde2ec; border-radius: 12px; }

        /* ── Layout ── */
        .main-content { transition: margin-left 0.3s; }
        .header-title-row  { display: flex; align-items: center; justify-content: space-between; padding: 24px 32px 16px; flex-wrap: wrap; gap: 12px; }
        .header-filter-row { display: flex; align-items: center; gap: 10px; padding: 0 32px 16px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .header-filter-row::-webkit-scrollbar { display: none; }
        .cards-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
        .content-padding { padding: 28px 32px; }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .main-content { margin-left: 0 !important; }
          .header-title-row { padding: 16px 16px 12px; flex-direction: column; align-items: flex-start; }
          .header-filter-row { padding: 0 16px 12px; gap: 6px; }
          .filter-pill { padding: 5px 10px; font-size: 12px; }
          .stats-strip { width: 100%; }
          .stat-chip { flex: 1; padding: 8px 10px; }
          .search-wrap { max-width: 100%; width: 100%; }
          .cards-grid { grid-template-columns: 1fr; }
          .content-padding { padding: 16px 12px; }
          .header-title-row h1 { font-size: 18px !important; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .main-content { margin-left: 0 !important; }
          .header-title-row { padding: 20px 20px 14px; }
          .header-filter-row { padding: 0 20px 14px; }
          .cards-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
          .content-padding { padding: 20px; }
          .search-wrap { max-width: 240px; }
        }
        @media (min-width: 1025px) {
          .main-content.sidebar-expanded  { margin-left: 256px; }
          .main-content.sidebar-collapsed { margin-left: 80px; }
        }
      `}</style>

      <TeacherPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className={`main-content min-h-screen ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>

        {/* ══════════ STICKY HEADER ══════════ */}
        <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(244,246,251,0.93)', backdropFilter: 'blur(14px)', borderBottom: '1px solid #e2e8f0' }}>

          {/* Title row */}
          <div className="header-title-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(135deg,#3730a3 0%,#6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(99,102,241,.28)' }}>
                <BookOpen style={{ width: 20, height: 20, color: '#fff' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h1 style={{ fontSize: 21, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>
                    My Classes
                  </h1>
                  {!loading && (
                    <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 500, background: '#1e293b', color: '#fff', padding: '2px 10px', borderRadius: 999 }}>
                      {assignedClasses.length} total
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '3px 0 0' }}>
                  Overview of all your assigned classes
                </p>
              </div>
            </div>

            {/* Stat strip — same as page 2 */}
            {!loading && assignedClasses.length > 0 && (
              <div className="stats-strip">
                {([
                  { label: 'Classes',     value: assignedClasses.length, color: '#4f46e5' },
                  { label: 'Students',    value: totalStudents,           color: '#7c3aed' },
                  { label: 'Avg / Class', value: avgClassSize,            color: '#8b5cf6' },
                ] as const).map(s => (
                  <div key={s.label} className="stat-chip">
                    <span style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>{s.value}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter + search row */}
          <div className="header-filter-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
              {([
                { key: 'all'    as FilterType, label: 'All Classes',   count: counts.all    },
                { key: 'small'  as FilterType, label: '≤ 15 Students', count: counts.small  },
                { key: 'medium' as FilterType, label: '16 – 30',       count: counts.medium },
                { key: 'large'  as FilterType, label: '30 +',          count: counts.large  },
              ]).map(f => (
                <button
                  key={f.key}
                  className={`filter-pill${filter === f.key ? ' active' : ''}`}
                  style={{ color: filter === f.key ? '#fff' : '#475569' }}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                  <span className="pill-count">{f.count}</span>
                </button>
              ))}
            </div>
            <div className="search-wrap">
              <Search className="search-icon" style={{ width: 15, height: 15, color: '#94a3b8' }} />
              <input
                className="search-input"
                placeholder="Search classes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ══════════ CONTENT ══════════ */}
        <div className="page-bg content-padding" style={{ minHeight: 'calc(100vh - 160px)' }}>

          {/* Error */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
              <AlertCircle style={{ width: 18, height: 18, color: '#ef4444', flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 500 }}>{error}</p>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="cards-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skel" style={{ height: 240 }} />
              ))}
            </div>
          )}

          {/* ── Cards grid ── */}
          {!loading && filtered.length > 0 && (
            <div className="cards-grid">
              {filtered.map((cls, i) => {
                const color     = CLASS_COLORS[i % CLASS_COLORS.length];
                const sizeKey   = getClassSize(cls.students.length);
                const sizeLabel = sizeKey === 'large' ? 'Large class' : sizeKey === 'medium' ? 'Medium class' : 'Small class';
                const barWidth  = sizeKey === 'large' ? '90%' : sizeKey === 'medium' ? '55%' : '25%';
                const maxStudentsForSize = sizeKey === 'large' ? 60 : sizeKey === 'medium' ? 30 : 15;
                const fillPct   = Math.min(100, (cls.students.length / maxStudentsForSize) * 100);

                return (
                  <div key={cls._id} className="card-enter" style={{ animationDelay: `${i * 45}ms` }}>
                    <div className="cls-card">
                      <div style={{ display: 'flex', flex: 1 }}>
                        {/* Left color bar — identical to page 2 */}
                        <div className="subject-bar" style={{ background: color.bar }} />

                        <div style={{ flex: 1, padding: '18px 18px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

                          {/* Top row: icon badge + arrow */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: color.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <BookOpen style={{ width: 16, height: 16, color: color.mid }} />
                              </div>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px 3px 7px', borderRadius: 999, fontSize: 11, fontWeight: 600, fontFamily: "'DM Mono',monospace", background: color.light, color: color.mid }}>
                                <GraduationCap style={{ width: 10, height: 10 }} />
                                Active
                              </span>
                            </div>
                            <div className="card-arrow">
                              <ArrowUpRight style={{ width: 16, height: 16, color: '#94a3b8' }} />
                            </div>
                          </div>

                          {/* Class name + subtitle */}
                          <div>
                            <h3 style={{ fontSize: 14, fontWeight: 650, color: '#0f172a', lineHeight: 1.35, marginBottom: 4, letterSpacing: '-0.1px' }}>
                              {cls.classroom_name}
                            </h3>
                            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                              {cls.students.length} student{cls.students.length !== 1 ? 's' : ''} enrolled in this class
                            </p>
                          </div>

                          <div style={{ height: 1, background: '#f1f5f9' }} />

                          {/* Students row */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: color.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Users style={{ width: 11, height: 11, color: color.mid }} />
                            </div>
                            <span style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>
                              {cls.students.length} student{cls.students.length !== 1 ? 's' : ''} enrolled
                            </span>
                          </div>

                          {/* Capacity bar */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Class capacity</span>
                              <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: color.mid, fontWeight: 600 }}>
                                {Math.round(fillPct)}%
                              </span>
                            </div>
                            <div className="capacity-track">
                              <div className="capacity-fill" style={{ width: `${fillPct}%`, background: color.bar }} />
                            </div>
                          </div>

                          {/* Footer — identical structure to page 2 */}
                          <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px dashed #e8ecf4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <Layers style={{ width: 12, height: 12, color: color.mid }} />
                              <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: color.mid, fontWeight: 500 }}>
                                {sizeLabel}
                              </span>
                            </div>
                            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: "'DM Mono',monospace" }}>
                              ID: {cls._id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom capacity bar stripe */}
                      <div style={{ height: 3, background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, background: color.bar, opacity: 0.55, width: barWidth }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No results after filter/search */}
          {!loading && assignedClasses.length > 0 && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Search style={{ width: 24, height: 24, color: '#94a3b8' }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>No matching classes</p>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Try adjusting your search or filter</p>
              <button className="clear-btn" onClick={() => { setFilter('all'); setSearch(''); }}>
                Clear filters
              </button>
            </div>
          )}

          {/* Empty — no classes at all */}
          {!loading && !error && assignedClasses.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px', textAlign: 'center' }}>
              <div className="empty-ghost" style={{ width: 280 }}>
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="ghost-card" />)}
              </div>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#3730a3 0%,#6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(99,102,241,.25)' }}>
                <BookOpen style={{ width: 24, height: 24, color: '#fff' }} />
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.2px' }}>
                No classes assigned
              </p>
              <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 280, lineHeight: 1.6 }}>
                You haven't been assigned to any class yet. Contact your administrator.
              </p>
            </div>
          )}

          {/* Bottom info strip */}
          {!loading && !error && assignedClasses.length > 0 && (
            <div style={{ marginTop: 32, background: 'linear-gradient(135deg,#eef2ff 0%,#f5f3ff 100%)', border: '1px solid #c7d2fe', borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(79,70,229,.28)' }}>
                <TrendingUp style={{ width: 20, height: 20, color: '#fff' }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4, letterSpacing: '-0.2px' }}>
                  Teaching summary
                </p>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                  You're currently teaching <strong style={{ color: '#4f46e5' }}>{assignedClasses.length}</strong> {assignedClasses.length === 1 ? 'class' : 'classes'} with a total of{' '}
                  <strong style={{ color: '#7c3aed' }}>{totalStudents}</strong> students and an average class size of{' '}
                  <strong style={{ color: '#8b5cf6' }}>{avgClassSize}</strong> students.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}