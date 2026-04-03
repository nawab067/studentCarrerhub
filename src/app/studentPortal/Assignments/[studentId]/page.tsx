'use client';

import StudentPortalSidebar from '@/components/student-portal/student-sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  BookOpen, User, Calendar, FileText,
  AlertCircle, Clock, CheckCircle2, ArrowUpRight,
  Layers, Search
} from 'lucide-react';

export interface Assessment {
  name: string;
  description: string;
  classId: string;
  teacherId: string;
  dueDate: string;
  _id: string;
}

type FilterType = 'all' | 'overdue' | 'soon' | 'upcoming';

export default function StudentAssignmentsPage() {
  const router = useRouter();

  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [classroomMap, setClassroomMap] = useState<Record<string, string>>({});
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    if (!id) { router.replace('/login'); return; }
    setStudentId(id);
    setLoading(false);
  }, [router]);

  async function getAssesmnet() {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/student/assesments/${studentId}`);
      setAssessments(response.data);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (studentId) getAssesmnet(); }, [studentId]);

  async function classroomName(classId: string) {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/classes/classroom/${classId}`);
      return res.data;
    } catch { console.error('Error fetching classroom'); }
  }

  async function getTeacherName(teacherId: string) {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/classes/teacher/user/${teacherId}`);
      return res.data;
    } catch { console.error('Error fetching teacher'); }
  }

  useEffect(() => {
    if (assessments.length > 0) {
      assessments.forEach(async (a) => {
        const data = await classroomName(a.classId);
        if (data?.classroom_name) setClassroomMap(prev => ({ ...prev, [a.classId]: data.classroom_name }));
      });
    }
  }, [assessments]);

  useEffect(() => {
    if (assessments.length > 0) {
      assessments.forEach(async (a) => {
        const data = await getTeacherName(a.teacherId);
        if (data?.name) setClassroomMap(prev => ({ ...prev, [a.teacherId]: data.name }));
      });
    }
  }, [assessments]);

  const getDueStatus = (dueDate: string): 'overdue' | 'soon' | 'upcoming' => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 3) return 'soon';
    return 'upcoming';
  };

  const getDaysLabel = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays}d left`;
  };

  const statusConfig = {
    overdue: { label: 'Overdue', bg: '#fff1f2', text: '#e11d48', border: '#fecdd3', icon: AlertCircle },
    soon:    { label: 'Due Soon', bg: '#fffbeb', text: '#d97706', border: '#fde68a', icon: Clock },
    upcoming:{ label: 'Upcoming', bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0', icon: CheckCircle2 },
  };

  const subjectColors = [
    { light: '#eef2ff', mid: '#818cf8', bar: 'linear-gradient(135deg,#6366f1,#818cf8)' },
    { light: '#fdf4ff', mid: '#c084fc', bar: 'linear-gradient(135deg,#a855f7,#c084fc)' },
    { light: '#ecfeff', mid: '#22d3ee', bar: 'linear-gradient(135deg,#06b6d4,#22d3ee)' },
    { light: '#fff7ed', mid: '#fb923c', bar: 'linear-gradient(135deg,#f97316,#fb923c)' },
    { light: '#f0fdf4', mid: '#4ade80', bar: 'linear-gradient(135deg,#22c55e,#4ade80)' },
    { light: '#fff1f2', mid: '#fb7185', bar: 'linear-gradient(135deg,#f43f5e,#fb7185)' },
  ];

  const counts = {
    all:      assessments.length,
    overdue:  assessments.filter(a => getDueStatus(a.dueDate) === 'overdue').length,
    soon:     assessments.filter(a => getDueStatus(a.dueDate) === 'soon').length,
    upcoming: assessments.filter(a => getDueStatus(a.dueDate) === 'upcoming').length,
  };

  const filtered = assessments.filter(a => {
    const status = getDueStatus(a.dueDate);
    const matchFilter = filter === 'all' || status === filter;
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      (classroomMap[a.classId] || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

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
        .asgn-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8ecf4;
          cursor: pointer;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.22s cubic-bezier(.22,.68,0,1.15), box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .asgn-card:hover {
          transform: translateY(-4px);
          border-color: transparent;
          box-shadow: 0 20px 60px rgba(15,23,42,.10), 0 4px 16px rgba(15,23,42,.06);
        }
        .card-arrow {
          opacity: 0;
          transform: translate(-4px,4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .asgn-card:hover .card-arrow { opacity: 1; transform: translate(0,0); }

        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.16s ease;
          background: transparent;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .filter-pill:hover { background: #eef0f8; }
        .filter-pill.active { background: #1e293b; color: #fff !important; }
        .pill-count {
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          padding: 1px 6px;
          border-radius: 999px;
          min-width: 20px;
          text-align: center;
        }
        .filter-pill.active .pill-count { background: rgba(255,255,255,.2); }
        .filter-pill:not(.active) .pill-count { background: #e8ecf4; color: #64748b; }

        .search-wrap { position: relative; flex: 1; max-width: 300px; }
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

        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .skel {
          background: linear-gradient(90deg,#eef0f6 25%,#e4e8f2 50%,#eef0f6 75%);
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

        .stat-chip {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          padding: 10px 20px; border-right: 1px solid #e8ecf4;
        }
        .stat-chip:last-child { border-right: none; }

        .date-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px 3px 6px; border-radius: 999px;
          font-size: 11px; font-family: 'DM Mono', monospace; font-weight: 500;
          border: 1px solid;
        }
        .clear-btn {
          margin-top: 16px; padding: 8px 20px; border-radius: 8px;
          background: #1e293b; color: #fff; font-size: 13px; font-weight: 500;
          border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: background 0.16s ease;
        }
        .clear-btn:hover { background: #0f172a; }
        .subject-bar { width: 4px; border-radius: 0 4px 4px 0; flex-shrink: 0; align-self: stretch; }
        .empty-ghost {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 10px;
          opacity: 0.25; margin-bottom: 32px;
        }
        .ghost-card { height: 130px; background: #dde2ec; border-radius: 12px; }
      `}</style>

      <StudentPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className={`transition-all duration-300 min-h-screen ${collapsed ? 'ml-20' : 'ml-64'}`}>

        {/* ══════════ STICKY HEADER ══════════ */}
        <div
          style={{
            position: 'sticky', top: 0, zIndex: 20,
            background: 'rgba(244,246,251,0.93)',
            backdropFilter: 'blur(14px)',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg,#3730a3 0%,#6366f1 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(99,102,241,.28)',
              }}>
                <Layers style={{ width: 20, height: 20, color: '#fff' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h1 style={{ fontSize: 21, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>
                    My Assignments
                  </h1>
                  {!loading && (
                    <span style={{
                      fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 500,
                      background: '#1e293b', color: '#fff', padding: '2px 10px', borderRadius: 999,
                    }}>
                      {assessments.length} total
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '3px 0 0' }}>
                  Track and submit your pending work
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
                  { label: 'Overdue',  value: counts.overdue,  color: '#e11d48' },
                  { label: 'Due Soon', value: counts.soon,     color: '#d97706' },
                  { label: 'Upcoming', value: counts.upcoming, color: '#16a34a' },
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

          {/* Filter + Search row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 32px 16px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
              {([
                { key: 'all' as FilterType,      label: 'All',      count: counts.all },
                { key: 'overdue' as FilterType,  label: 'Overdue',  count: counts.overdue },
                { key: 'soon' as FilterType,     label: 'Due Soon', count: counts.soon },
                { key: 'upcoming' as FilterType, label: 'Upcoming', count: counts.upcoming },
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
                placeholder="Search assignments..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ══════════ CONTENT ══════════ */}
        <div className="page-bg" style={{ padding: '28px 32px', minHeight: 'calc(100vh - 160px)' }}>

          {/* Skeletons */}
          {loading && (
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skel" style={{ height: 210 }} />
              ))}
            </div>
          )}

          {/* Cards */}
          {!loading && filtered.length > 0 && (
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))' }}>
              {filtered.map((assessment, i) => {
                const status = getDueStatus(assessment.dueDate);
                const sc = statusConfig[status];
                const StatusIcon = sc.icon;
                const color = subjectColors[i % subjectColors.length];
                const daysLabel = getDaysLabel(assessment.dueDate);

                return (
                  <div key={assessment._id} className="card-enter" style={{ animationDelay: `${i * 45}ms` }}>
                    <div
                      className="asgn-card"
                      onClick={() => router.push(`/studentPortal/Assignments/uploadAssement/${assessment._id}`)}
                      onMouseEnter={() => setHoveredId(assessment._id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* Main body: left color bar + content */}
                      <div style={{ display: 'flex', flex: 1 }}>
                        {/* Color bar */}
                        <div className="subject-bar" style={{ background: color.bar }} />

                        {/* Content */}
                        <div style={{ flex: 1, padding: '18px 18px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

                          {/* Top: icon + status badge + arrow */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                                background: color.light, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <BookOpen style={{ width: 16, height: 16, color: color.mid }} />
                              </div>
                              <span
                                className="date-chip"
                                style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}
                              >
                                <StatusIcon style={{ width: 10, height: 10 }} />
                                {daysLabel}
                              </span>
                            </div>
                            <div className="card-arrow">
                              <ArrowUpRight style={{ width: 16, height: 16, color: '#94a3b8' }} />
                            </div>
                          </div>

                          {/* Title + description */}
                          <div>
                            <h3 style={{ fontSize: 14, fontWeight: 650, color: '#0f172a', lineHeight: 1.35, marginBottom: 5, letterSpacing: '-0.1px' }}>
                              {assessment.name}
                            </h3>
                            <p style={{
                              fontSize: 12, color: '#94a3b8', lineHeight: 1.55,
                              display: '-webkit-box', WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>
                              {assessment.description}
                            </p>
                          </div>

                          {/* Divider */}
                          <div style={{ height: 1, background: '#f1f5f9' }} />

                          {/* Meta */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              <div style={{
                                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                background: color.light, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <Layers style={{ width: 11, height: 11, color: color.mid }} />
                              </div>
                              <span style={{ fontSize: 12, color: '#475569', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {classroomMap[assessment.classId] || <span style={{ color: '#c4cdd8' }}>Loading…</span>}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              <div style={{
                                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <User style={{ width: 11, height: 11, color: '#94a3b8' }} />
                              </div>
                              <span style={{ fontSize: 12, color: '#475569', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {classroomMap[assessment.teacherId] || <span style={{ color: '#c4cdd8' }}>Loading…</span>}
                              </span>
                            </div>
                          </div>

                          {/* Due date footer */}
                          <div style={{
                            marginTop: 'auto', paddingTop: 10,
                            borderTop: '1px dashed #e8ecf4',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <Calendar style={{ width: 12, height: 12, color: sc.text }} />
                              <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: sc.text, fontWeight: 500 }}>
                                {new Date(assessment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <span style={{ fontSize: 11, color: color.mid, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                              Submit <ArrowUpRight style={{ width: 11, height: 11 }} />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress strip at bottom */}
                      <div style={{ height: 3, background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                          position: 'absolute', inset: 0, background: color.bar,
                          opacity: 0.55,
                          width: status === 'overdue' ? '100%' : status === 'soon' ? '60%' : '25%',
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No results from filter/search */}
          {!loading && assessments.length > 0 && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              }}>
                <Search style={{ width: 24, height: 24, color: '#94a3b8' }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>No matching assignments</p>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Try adjusting your search or filter</p>
              <button className="clear-btn" onClick={() => { setFilter('all'); setSearch(''); }}>
                Clear filters
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && assessments.length === 0 && (
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
                <FileText style={{ width: 24, height: 24, color: '#fff' }} />
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.2px' }}>
                No assignments yet
              </p>
              <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 280, lineHeight: 1.6 }}>
                Your teacher hasn't posted any assignments yet. Check back soon.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}