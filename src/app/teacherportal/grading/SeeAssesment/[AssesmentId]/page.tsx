'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TeacherPortalSidebar from '@/components/teacher-portal/teacherportal-sidebar';
import {
  ClipboardList,
  ArrowUpRight,
  Calendar,
  Search,
  FileText,
  AlertCircle,
  BookOpen,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface Assessment {
  _id: string;
  name: string;
  description: string;
  classId: string;
  teacherId: string;
  created_at: string;
}

const ROW_COLORS = [
  { light: '#eef2ff', mid: '#6366f1', bar: 'linear-gradient(135deg,#4f46e5,#6366f1)' },
  { light: '#f5f3ff', mid: '#8b5cf6', bar: 'linear-gradient(135deg,#7c3aed,#8b5cf6)' },
  { light: '#fdf4ff', mid: '#c084fc', bar: 'linear-gradient(135deg,#a855f7,#c084fc)' },
  { light: '#ede9fe', mid: '#7c3aed', bar: 'linear-gradient(135deg,#6d28d9,#7c3aed)' },
  { light: '#f0f9ff', mid: '#818cf8', bar: 'linear-gradient(135deg,#6366f1,#818cf8)' },
  { light: '#faf5ff', mid: '#a78bfa', bar: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
];

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export default function SeeAssessment() {
  const router = useRouter();
  const { AssesmentId } = useParams();

  const [loading, setLoading]       = useState(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed]   = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (!AssesmentId) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseurl}/get_assesments/${AssesmentId}`);
        setAssessments(res.data.data || []);
      } catch { setError('Failed to load assessments.'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [AssesmentId]);

  const filtered = assessments.filter(
    a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const thisMonth = assessments.filter(a => {
    const d = new Date(a.created_at), now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

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

        /* ── Assessment row card ── */
        .asmnt-card {
          background: #fff; border-radius: 14px; border: 1px solid #e8ecf4;
          overflow: hidden; display: flex;
          transition: transform 0.2s cubic-bezier(.22,.68,0,1.15), box-shadow 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .asmnt-card:hover {
          transform: translateY(-3px); border-color: transparent;
          box-shadow: 0 16px 48px rgba(15,23,42,.09), 0 4px 12px rgba(15,23,42,.05);
        }
        .card-arrow { opacity: 0; transform: translate(-4px,4px); transition: opacity 0.18s ease, transform 0.18s ease; }
        .asmnt-card:hover .card-arrow { opacity: 1; transform: translate(0,0); }

        /* ── View button ── */
        .view-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 9px; border: none;
          font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; white-space: nowrap;
          transition: opacity 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
          color: #fff;
        }
        .view-btn:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(79,70,229,.28); }
        .view-btn:active { transform: scale(0.97); }

        /* ── Filter pills ── */
        .filter-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 500;
          cursor: pointer; border: 1px solid transparent; transition: all 0.16s ease;
          background: transparent; white-space: nowrap; font-family: 'DM Sans', sans-serif;
        }
        .filter-pill:hover { background: #eef0f8; }
        .filter-pill.active { background: #1e293b; color: #fff !important; }

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

        /* ── Shimmer ── */
        @keyframes shimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }
        .skel {
          background: linear-gradient(90deg,#eef0f6 25%,#e4e8f2 50%,#eef0f6 75%);
          background-size: 600px 100%; animation: shimmer 1.4s infinite;
          border-radius: 14px; border: 1px solid #e8ecf4;
        }
        @keyframes cardIn { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .card-enter { animation: cardIn 0.36s cubic-bezier(.22,.68,0,1.1) forwards; opacity: 0; }

        /* ── Stat strip ── */
        .stat-chip { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 20px; border-right: 1px solid #e8ecf4; }
        .stat-chip:last-child { border-right: none; }
        .stats-strip { display: flex; background: #fff; border: 1px solid #e8ecf4; border-radius: 12px; overflow: hidden; flex-shrink: 0; }
        .subject-bar { width: 4px; border-radius: 0; flex-shrink: 0; align-self: stretch; }

        /* ── Breadcrumb ── */
        .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 500; color: #94a3b8; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 14px; }
        .breadcrumb-sep { color: #cbd5e1; }
        .breadcrumb-active { color: #475569; }

        /* ── Layout ── */
        .main-content { transition: margin-left 0.3s; }
        .header-title-row  { display: flex; align-items: center; justify-content: space-between; padding: 24px 32px 16px; flex-wrap: wrap; gap: 12px; }
        .header-filter-row { display: flex; align-items: center; gap: 10px; padding: 0 32px 16px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .header-filter-row::-webkit-scrollbar { display: none; }
        .content-padding { padding: 28px 32px; }
        .cards-list { display: flex; flex-direction: column; gap: 10px; }

        /* ── Empty ghost ── */
        .empty-ghost { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; opacity: 0.22; margin-bottom: 32px; }
        .ghost-card { height: 80px; background: #dde2ec; border-radius: 12px; }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .main-content { margin-left: 0 !important; }
          .header-title-row { padding: 16px 16px 12px; flex-direction: column; align-items: flex-start; }
          .header-filter-row { padding: 0 16px 12px; }
          .stats-strip { width: 100%; }
          .stat-chip { flex: 1; padding: 8px 10px; }
          .search-wrap { max-width: 100%; width: 100%; }
          .content-padding { padding: 16px 12px; }
          .header-title-row h1 { font-size: 18px !important; }
          .asmnt-desc { display: none; }
          .asmnt-date { display: none; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .main-content { margin-left: 0 !important; }
          .header-title-row { padding: 20px 20px 14px; }
          .header-filter-row { padding: 0 20px 14px; }
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

          <div className="header-title-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(135deg,#3730a3 0%,#6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(99,102,241,.28)' }}>
                <ClipboardList style={{ width: 20, height: 20, color: '#fff' }} />
              </div>
              <div>
                {/* Breadcrumb */}
                <div className="breadcrumb">
                  <BookOpen style={{ width: 11, height: 11 }} />
                  <span>Teacher Portal</span>
                  <ChevronRight style={{ width: 11, height: 11 }} className="breadcrumb-sep" />
                  <span>Grading</span>
                  <ChevronRight style={{ width: 11, height: 11 }} className="breadcrumb-sep" />
                  <span className="breadcrumb-active">Assessments</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h1 style={{ fontSize: 21, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>
                    Assessment List
                  </h1>
                  {!loading && (
                    <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 500, background: '#1e293b', color: '#fff', padding: '2px 10px', borderRadius: 999 }}>
                      {assessments.length} total
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stat strip */}
            {!loading && assessments.length > 0 && (
              <div className="stats-strip">
                {([
                  { label: 'Total',      value: assessments.length, color: '#4f46e5' },
                  { label: 'This Month', value: thisMonth,           color: '#7c3aed' },
                  { label: 'Showing',    value: filtered.length,     color: '#8b5cf6' },
                ] as const).map(s => (
                  <div key={s.label} className="stat-chip">
                    <span style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>{s.value}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search row */}
          <div className="header-filter-row">
            <div style={{ flex: 1 }} />
            <div className="search-wrap">
              <Search className="search-icon" style={{ width: 15, height: 15, color: '#94a3b8' }} />
              <input
                className="search-input"
                placeholder="Search assessments..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
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
            <div className="cards-list">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skel" style={{ height: 80 }} />
              ))}
            </div>
          )}

          {/* ── Assessment rows ── */}
          {!loading && filtered.length > 0 && (
            <div className="cards-list">
              {filtered.map((item, i) => {
                const color = ROW_COLORS[i % ROW_COLORS.length];
                return (
                  <div
                    key={item._id}
                    className="card-enter"
                    style={{ animationDelay: `${i * 40}ms` }}
                    onClick={() => router.push(`/teacherportal/grading/viewAssesment/${item._id}`)}
                  >
                    <div className="asmnt-card">
                      {/* Left color bar */}
                      <div className="subject-bar" style={{ background: color.bar }} />

                      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>

                        {/* Index badge */}
                        <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: color.bar, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px rgba(99,102,241,.2)` }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: "'DM Mono',monospace" }}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Icon */}
                        <div style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, background: color.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText style={{ width: 14, height: 14, color: color.mid }} />
                        </div>

                        {/* Name + description */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.1px' }}>
                            {item.name}
                          </p>
                          <p className="asmnt-desc" style={{ fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.description}
                          </p>
                        </div>

                        {/* Date */}
                        <div className="asmnt-date" style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                          <div style={{ width: 24, height: 24, borderRadius: 6, background: color.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Calendar style={{ width: 11, height: 11, color: color.mid }} />
                          </div>
                          <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: '#64748b', fontWeight: 500 }}>
                            {formatDate(item.created_at)}
                          </span>
                        </div>

                        {/* Size label */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          <Layers style={{ width: 11, height: 11, color: color.mid }} />
                          <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: color.mid, fontWeight: 500 }}>
                            Assessment
                          </span>
                        </div>

                        {/* View button */}
                        <button
                          className="view-btn"
                          style={{ background: color.bar }}
                          onClick={e => { e.stopPropagation(); router.push(`/teacherportal/grading/viewAssesment/${item._id}`); }}
                        >
                          View
                          <ArrowUpRight style={{ width: 12, height: 12 }} />
                        </button>

                        {/* Arrow indicator */}
                        <div className="card-arrow" style={{ flexShrink: 0 }}>
                          <ArrowUpRight style={{ width: 15, height: 15, color: '#94a3b8' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No search results */}
          {!loading && assessments.length > 0 && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Search style={{ width: 24, height: 24, color: '#94a3b8' }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>No matching assessments</p>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Try adjusting your search query</p>
              <button
                style={{ marginTop: 16, padding: '8px 20px', borderRadius: 8, background: '#1e293b', color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </button>
            </div>
          )}

          {/* Truly empty */}
          {!loading && !error && assessments.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px', textAlign: 'center' }}>
              <div className="empty-ghost" style={{ width: 280 }}>
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="ghost-card" />)}
              </div>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#3730a3 0%,#6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(99,102,241,.25)' }}>
                <ClipboardList style={{ width: 24, height: 24, color: '#fff' }} />
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.2px' }}>No assessments found</p>
              <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 280, lineHeight: 1.6 }}>
                There are no assessments created for this class yet.
              </p>
            </div>
          )}

          {/* Bottom info strip */}
          {!loading && !error && assessments.length > 0 && (
            <div style={{ marginTop: 28, background: 'linear-gradient(135deg,#eef2ff 0%,#f5f3ff 100%)', border: '1px solid #c7d2fe', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(79,70,229,.25)' }}>
                <FileText style={{ width: 18, height: 18, color: '#fff' }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 3, letterSpacing: '-0.2px' }}>
                  Assessment overview
                </p>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                  This class has <strong style={{ color: '#4f46e5' }}>{assessments.length}</strong> assessment{assessments.length !== 1 ? 's' : ''} total,{' '}
                  with <strong style={{ color: '#7c3aed' }}>{thisMonth}</strong> created this month.
                  Click any row to view its grading sheet.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}