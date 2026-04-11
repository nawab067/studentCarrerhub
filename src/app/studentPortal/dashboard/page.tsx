'use client';

import StudentPortalSidebar from '@/components/student-portal/student-sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  BookOpen, Layers, ClipboardList, BarChart2,
  CalendarDays, ArrowUpRight, Clock, AlertCircle,
  CheckCircle2, TrendingUp, Award, Zap,
  ChevronRight, Bell, User,
} from 'lucide-react';

interface QuickStat {
  label: string;
  value: string | number;
  sub: string;
  color: string;
  icon: React.ElementType;
  gradient: string;
}

interface NavCard {
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  colorIndex: number;
  badge?: string;
  badgeColor?: string;
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [time, setTime] = useState(new Date());
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    if (!id) { router.replace('/login'); return; }
    setStudentId(id);
    setLoading(false);
  }, [router]);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const subjectColors = [
    { light: '#eef2ff', mid: '#818cf8', bar: 'linear-gradient(135deg,#6366f1,#818cf8)' },
    { light: '#fdf4ff', mid: '#c084fc', bar: 'linear-gradient(135deg,#a855f7,#c084fc)' },
    { light: '#ecfeff', mid: '#22d3ee', bar: 'linear-gradient(135deg,#06b6d4,#22d3ee)' },
    { light: '#fff7ed', mid: '#fb923c', bar: 'linear-gradient(135deg,#f97316,#fb923c)' },
    { light: '#f0fdf4', mid: '#4ade80', bar: 'linear-gradient(135deg,#22c55e,#4ade80)' },
    { light: '#fff1f2', mid: '#fb7185', bar: 'linear-gradient(135deg,#f43f5e,#fb7185)' },
  ];

  const navCards: NavCard[] = [
    {
      label: 'Assignments',
      description: 'View & submit your pending work',
      href: `/studentPortal/Assignments/${studentId}`,
      icon: Layers,
      colorIndex: 0,
      badge: 'Active',
      badgeColor: '#6366f1',
    },
    {
      label: 'Attendance',
      description: 'Track your class attendance records',
      href: `/studentPortal/attendance/${studentId}`,
      icon: ClipboardList,
      colorIndex: 1,
      badge: 'Updated',
      badgeColor: '#a855f7',
    },
    {
      label: 'Timetable',
      description: 'Your weekly class schedule',
      href: `/studentPortal/classes/${studentId}`,
      icon: CalendarDays,
      colorIndex: 2,
    },
    {
      label: 'Grades',
      description: 'Review your academic performance',
      href: `/studentPortal/grades/${studentId}`,
      icon: BarChart2,
      colorIndex: 3,
      badge: 'New',
      badgeColor: '#f97316',
    },
  ];

  const quickStats: QuickStat[] = [
    {
      label: 'Assignments Due',
      value: '—',
      sub: 'this week',
      color: '#6366f1',
      icon: Layers,
      gradient: 'linear-gradient(135deg,#6366f1,#818cf8)',
    },
    {
      label: 'Attendance Rate',
      value: '—',
      sub: 'overall',
      color: '#16a34a',
      icon: CheckCircle2,
      gradient: 'linear-gradient(135deg,#22c55e,#4ade80)',
    },
    {
      label: 'Classes Enrolled',
      value: '—',
      sub: 'active courses',
      color: '#d97706',
      icon: BookOpen,
      gradient: 'linear-gradient(135deg,#f97316,#fb923c)',
    },
    {
      label: 'Avg. Grade',
      value: '—',
      sub: 'current term',
      color: '#db2777',
      icon: Award,
      gradient: 'linear-gradient(135deg,#f43f5e,#fb7185)',
    },
  ];

  const greeting = (() => {
    const h = time.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const dateLabel = time.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
  const timeLabel = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen" style={{ background: '#f4f6fb', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

        .page-bg {
          background: #f4f6fb;
          background-image:
            radial-gradient(ellipse 80% 50% at 20% -10%, rgba(99,102,241,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 110%, rgba(168,85,247,0.05) 0%, transparent 60%);
        }

        /* ── Nav Card ── */
        .nav-card {
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
        .nav-card:hover {
          transform: translateY(-4px);
          border-color: transparent;
          box-shadow: 0 20px 60px rgba(15,23,42,.10), 0 4px 16px rgba(15,23,42,.06);
        }
        .card-arrow {
          opacity: 0;
          transform: translate(-4px, 4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .nav-card:hover .card-arrow { opacity: 1; transform: translate(0, 0); }

        /* ── Stat Card ── */
        .stat-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8ecf4;
          padding: 20px 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.22s cubic-bezier(.22,.68,0,1.15),
                      box-shadow 0.22s ease;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(15,23,42,.08);
        }

        /* ── Hero banner ── */
        .hero-banner {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          padding: 32px 36px;
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .hero-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(ellipse 60% 80% at 80% 50%, rgba(99,102,241,0.35) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 10% 10%, rgba(167,139,250,0.2) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-dots {
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 45%;
          overflow: hidden;
          pointer-events: none;
        }
        .hero-dot {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }

        /* ── Activity item ── */
        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .activity-item:last-child { border-bottom: none; }

        /* ── Section header ── */
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .section-title {
          font-size: 13px;
          font-weight: 700;
          color: '#0f172a';
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-family: 'DM Mono', monospace;
        }

        /* ── Shimmer ── */
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .skel {
          background: linear-gradient(90deg, #eef0f6 25%, #e4e8f2 50%, #eef0f6 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 16px;
        }

        /* ── Card entrance ── */
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-enter { animation: cardIn 0.4s cubic-bezier(.22,.68,0,1.1) forwards; opacity: 0; }

        /* ── Quick link ── */
        .quick-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s ease;
          border: 1px solid transparent;
        }
        .quick-link:hover { background: #f4f6fb; border-color: #e8ecf4; }

        .subject-bar { width: 4px; border-radius: 0 4px 4px 0; flex-shrink: 0; align-self: stretch; }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #22c55e;
          animation: pulse-dot 2s ease-in-out infinite;
          display: inline-block;
        }

        /* ── MAIN LAYOUT ── */
        .main-content {
          transition: margin-left 0.3s;
          min-height: 100vh;
        }

        /* ── LARGE SCREENS: sidebar offset ── */
        @media (min-width: 1025px) {
          .main-content.sidebar-expanded { margin-left: 256px; }
          .main-content.sidebar-collapsed { margin-left: 80px; }
        }

        /* ── Sticky header layout ── */
        .sticky-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 32px;
        }

        /* ── Content padding ── */
        .content-padding {
          padding: 28px 32px;
          min-height: calc(100vh - 84px);
        }

        /* ── Stats grid ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 14px;
          margin-bottom: 28px;
        }

        /* ── Two-column layout ── */
        .two-col-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
          align-items: start;
        }

        /* ── Nav cards grid ── */
        .nav-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        /* ── Hero banner buttons ── */
        .hero-buttons {
          display: flex;
          gap: 10px;
          margin-top: 22px;
          flex-wrap: wrap;
        }

        /* ── Header right side ── */
        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* ── TABLET (641–1024px) ── */
        @media (min-width: 641px) and (max-width: 1024px) {
          .main-content { margin-left: 0 !important; }

          .sticky-header-inner {
            padding: 16px 20px;
          }

          .content-padding {
            padding: 20px;
          }

          .two-col-layout {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero-banner {
            padding: 24px 24px;
          }
        }

        /* ── MOBILE (≤ 640px) ── */
        @media (max-width: 640px) {
          .main-content { margin-left: 0 !important; }

          .sticky-header-inner {
            padding: 12px 16px;
            flex-wrap: wrap;
            gap: 10px;
          }

          .sticky-header-inner h1 {
            font-size: 17px !important;
          }

          /* Hide clock & bell on very small screens, keep bell only */
          .header-clock {
            display: none !important;
          }

          .header-right {
            gap: 8px;
          }

          .content-padding {
            padding: 14px 12px;
          }

          .hero-banner {
            padding: 22px 18px;
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          /* Hide the large graduation cap icon on mobile */
          .hero-icon-wrapper {
            display: none !important;
          }

          .hero-banner h2 {
            font-size: 20px !important;
          }

          .hero-buttons {
            margin-top: 16px;
            gap: 8px;
          }

          .hero-buttons button {
            font-size: 12px !important;
            padding: 8px 14px !important;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }

          .stat-card {
            padding: 14px 14px;
            gap: 10px;
          }

          .two-col-layout {
            grid-template-columns: 1fr;
          }

          .nav-cards-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .section-header {
            margin-bottom: 10px;
          }
        }
      `}</style>

      <StudentPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className={`main-content ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>

        {/* ══════════ STICKY HEADER ══════════ */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: 'rgba(244,246,251,0.93)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid #e2e8f0',
        }}>
          <div className="sticky-header-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg,#3730a3 0%,#6366f1 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(99,102,241,.28)',
              }}>
                <Zap style={{ width: 20, height: 20, color: '#fff' }} />
              </div>
              <div>
                <h1 style={{ fontSize: 21, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>
                  Dashboard
                </h1>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="live-dot" />
                  {dateLabel}
                </p>
              </div>
            </div>

            {/* Right side: clock + notification bell */}
            <div className="header-right">
              <div className="header-clock" style={{
                background: '#fff', border: '1px solid #e8ecf4', borderRadius: 10,
                padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 7,
              }}>
                <Clock style={{ width: 13, height: 13, color: '#6366f1' }} />
                <span style={{ fontSize: 13, fontFamily: "'DM Mono', monospace", fontWeight: 500, color: '#1e293b' }}>
                  {timeLabel}
                </span>
              </div>
              <button style={{
                width: 38, height: 38, borderRadius: 10, border: '1px solid #e8ecf4',
                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative',
              }}>
                <Bell style={{ width: 16, height: 16, color: '#64748b' }} />
                <span style={{
                  position: 'absolute', top: 7, right: 7, width: 7, height: 7,
                  borderRadius: '50%', background: '#6366f1', border: '1.5px solid #fff',
                }} />
              </button>
              <div style={{
                width: 38, height: 38, borderRadius: 10, border: '1px solid #e8ecf4',
                background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <User style={{ width: 16, height: 16, color: '#6366f1' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ CONTENT ══════════ */}
        <div className="page-bg content-padding">

          {/* ── Hero Banner ── */}
          <div className="hero-banner card-enter" style={{ animationDelay: '0ms', marginBottom: 28 }}>
            {/* Decorative dots */}
            <div className="hero-dots">
              <div className="hero-dot" style={{ width: 220, height: 220, right: -60, top: -60 }} />
              <div className="hero-dot" style={{ width: 140, height: 140, right: 80, top: 20, background: 'rgba(255,255,255,0.04)' }} />
              <div className="hero-dot" style={{ width: 80, height: 80, right: 200, bottom: -20, background: 'rgba(255,255,255,0.07)' }} />
              <div className="hero-dot" style={{ width: 50, height: 50, right: 40, bottom: 10 }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 999, padding: '4px 12px', marginBottom: 14,
              }}>
                <span className="live-dot" style={{ background: '#a7f3d0' }} />
                <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: '0.05em', color: '#a7f3d0' }}>
                  STUDENT PORTAL
                </span>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px', margin: '0 0 6px', color: '#fff' }}>
                {greeting} 👋
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: 340, lineHeight: 1.6 }}>
                Here's what's happening in your academic world today. Stay on top of your assignments and attendance.
              </p>
              <div className="hero-buttons">
                <button
                  onClick={() => router.push(`/studentPortal/Assignments/${studentId}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: '#fff', color: '#4338ca',
                    border: 'none', borderRadius: 10, padding: '9px 18px',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <Layers style={{ width: 14, height: 14 }} />
                  View Assignments
                </button>
                <button
                  onClick={() => router.push(`/studentPortal/classes/${studentId}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    color: '#fff', borderRadius: 10, padding: '9px 18px',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'background 0.15s ease',
                  }}
                >
                  <CalendarDays style={{ width: 14, height: 14 }} />
                  Timetable
                </button>
              </div>
            </div>

            {/* Right side large icon — hidden on mobile via CSS class */}
            <div className="hero-icon-wrapper" style={{ position: 'relative', zIndex: 1, flexShrink: 0, display: 'flex', alignItems: 'center', paddingRight: 16 }}>
              <div style={{
                width: 90, height: 90, borderRadius: 24,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(8px)',
              }}>
                <GraduationCapIcon />
              </div>
            </div>
          </div>

          {/* ── Quick Stats Row ── */}
          <div className="stats-grid">
            {quickStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="stat-card card-enter" style={{ animationDelay: `${80 + i * 50}ms` }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: stat.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 6px 16px ${stat.color}30`,
                  }}>
                    <Icon style={{ width: 18, height: 18, color: '#fff' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 22, fontWeight: 700, color: stat.color,
                      fontFamily: "'DM Mono', monospace", lineHeight: 1,
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', marginTop: 3 }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                      {stat.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Two-column: Nav Cards + Activity ── */}
          <div className="two-col-layout">

            {/* Left: Navigation Cards */}
            <div>
              <div className="section-header">
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'DM Mono', monospace" }}>
                  Quick Access
                </span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{navCards.length} sections</span>
              </div>
              <div className="nav-cards-grid">
                {navCards.map((card, i) => {
                  const color = subjectColors[card.colorIndex];
                  const Icon = card.icon;
                  return (
                    <div key={card.label} className="card-enter" style={{ animationDelay: `${200 + i * 60}ms` }}>
                      <div
                        className="nav-card"
                        onClick={() => router.push(card.href)}
                      >
                        <div style={{ display: 'flex', flex: 1 }}>
                          <div className="subject-bar" style={{ background: color.bar }} />
                          <div style={{ flex: 1, padding: '18px 18px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

                            {/* Top row */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                                  background: color.light, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                  <Icon style={{ width: 16, height: 16, color: color.mid }} />
                                </div>
                                {card.badge && (
                                  <span style={{
                                    fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                                    background: `${card.badgeColor}15`, color: card.badgeColor,
                                    border: `1px solid ${card.badgeColor}30`,
                                    fontFamily: "'DM Mono', monospace",
                                  }}>
                                    {card.badge}
                                  </span>
                                )}
                              </div>
                              <div className="card-arrow">
                                <ArrowUpRight style={{ width: 16, height: 16, color: '#94a3b8' }} />
                              </div>
                            </div>

                            {/* Text */}
                            <div>
                              <h3 style={{ fontSize: 14, fontWeight: 650, color: '#0f172a', marginBottom: 4, letterSpacing: '-0.1px' }}>
                                {card.label}
                              </h3>
                              <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                                {card.description}
                              </p>
                            </div>

                            {/* Divider */}
                            <div style={{ height: 1, background: '#f1f5f9' }} />

                            {/* Footer */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <span style={{ fontSize: 11, color: color.mid, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                                Go to {card.label} <ArrowUpRight style={{ width: 11, height: 11 }} />
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom progress strip */}
                        <div style={{ height: 3, background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                          <div style={{
                            position: 'absolute', inset: 0, background: color.bar,
                            opacity: 0.55, width: `${30 + i * 17}%`,
                          }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Activity Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Status overview */}
              <div className="card-enter" style={{ animationDelay: '280ms' }}>
                <div style={{
                  background: '#fff', borderRadius: 16, border: '1px solid #e8ecf4',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '16px 18px 12px',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <TrendingUp style={{ width: 15, height: 15, color: '#6366f1' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Assignment Status</span>
                  </div>
                  <div style={{ padding: '12px 18px' }}>
                    {([
                      { label: 'Overdue', icon: AlertCircle, color: '#e11d48', bg: '#fff1f2', border: '#fecdd3' },
                      { label: 'Due Soon', icon: Clock, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
                      { label: 'Upcoming', icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
                    ]).map(({ label, icon: Icon, color, bg, border }) => (
                      <div key={label} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '9px 0', borderBottom: '1px solid #f8fafc',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                            background: bg, border: `1px solid ${border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Icon style={{ width: 12, height: 12, color }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 500, color: '#475569' }}>{label}</span>
                        </div>
                        <span style={{
                          fontSize: 13, fontWeight: 700, color,
                          fontFamily: "'DM Mono', monospace",
                        }}>—</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '10px 18px 14px' }}>
                    <button
                      onClick={() => router.push('/studentPortal/Assignments')}
                      style={{
                        width: '100%', padding: '8px', borderRadius: 8,
                        background: '#eef2ff', color: '#4338ca',
                        border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        fontFamily: "'DM Sans', sans-serif",
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                        transition: 'background 0.15s',
                      }}
                    >
                      View all assignments <ChevronRight style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div className="card-enter" style={{ animationDelay: '340ms' }}>
                <div style={{
                  background: '#fff', borderRadius: 16, border: '1px solid #e8ecf4', overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '16px 18px 12px', borderBottom: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <Zap style={{ width: 15, height: 15, color: '#6366f1' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Quick Links</span>
                  </div>
                  <div style={{ padding: '8px 10px 10px' }}>
                    {navCards.map((card, i) => {
                      const color = subjectColors[card.colorIndex];
                      const Icon = card.icon;
                      return (
                        <div
                          key={card.label}
                          className="quick-link"
                          onClick={() => router.push(card.href)}
                        >
                          <div style={{
                            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                            background: color.light, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Icon style={{ width: 13, height: 13, color: color.mid }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 500, color: '#334155', flex: 1 }}>
                            {card.label}
                          </span>
                          <ChevronRight style={{ width: 14, height: 14, color: '#cbd5e1' }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Info note */}
              <div className="card-enter" style={{ animationDelay: '400ms' }}>
                <div style={{
                  borderRadius: 14, padding: '14px 16px',
                  background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)',
                  border: '1px solid #c7d2fe',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: 'linear-gradient(135deg,#4338ca,#6366f1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Award style={{ width: 13, height: 13, color: '#fff' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#3730a3', margin: '0 0 3px' }}>
                      Stay on track
                    </p>
                    <p style={{ fontSize: 11, color: '#4338ca', margin: 0, lineHeight: 1.5 }}>
                      Check your assignments regularly to avoid missing any deadlines.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* Inline SVG graduation cap so no extra import needed */
function GraduationCapIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}