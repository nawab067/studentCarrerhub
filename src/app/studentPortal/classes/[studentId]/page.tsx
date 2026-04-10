'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import StudentPortalSidebar from '@/components/student-portal/student-sidebar';
import {
  CalendarDays,
  Clock,
  User,
  School,
  BookOpen,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';

/* ------------------ Types ------------------ */
interface Teacher {
  _id: string;
  name: string;
}

interface Classroom {
  _id: string;
  classroom_name: string;
}

interface TimeTableSlot {
  _id: string;
  day: string;
  start_time: string;
  end_time: string;
  teacher_id: string | Teacher;
  classroom_id: string | Classroom;
  date?: string;
  roomno?: string;
}

/* ------------------ Color Palette (matches attendance page) ------------------ */
const subjectColors = [
  { light: '#eef2ff', mid: '#818cf8', bar: 'linear-gradient(135deg,#6366f1,#818cf8)' },
  { light: '#fdf4ff', mid: '#c084fc', bar: 'linear-gradient(135deg,#a855f7,#c084fc)' },
  { light: '#ecfeff', mid: '#22d3ee', bar: 'linear-gradient(135deg,#06b6d4,#22d3ee)' },
  { light: '#fff7ed', mid: '#fb923c', bar: 'linear-gradient(135deg,#f97316,#fb923c)' },
  { light: '#f0fdf4', mid: '#4ade80', bar: 'linear-gradient(135deg,#22c55e,#4ade80)' },
  { light: '#fff1f2', mid: '#fb7185', bar: 'linear-gradient(135deg,#f43f5e,#fb7185)' },
];

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/* ------------------ Component ------------------ */
export default function StudentClassesPage() {
  const router = useRouter();

  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeTableSlots, setTimeTableSlots] = useState<TimeTableSlot[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const baseurl= process.env.NEXT_PUBLIC_BASE_URL;

  /* ---------- Auth ---------- */
  useEffect(() => {
    const storedStudentId = localStorage.getItem('studentId');
    if (!storedStudentId) { router.replace('/login'); return; }
    setStudentId(storedStudentId);
  }, [router]);

  /* ---------- Fetch Timetable ---------- */
  useEffect(() => {
    if (!studentId) return;
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/classes/timetable/${studentId}`);
        const slots = response.data;

        const updatedSlots = await Promise.all(
          slots.map(async (slot: any) => {
            let teacherName = 'Unknown';
            let classroomName = 'Unknown';
            try {
              const t = await axios.get(`${baseurl}/classes/teacher/${slot.teacher_id}`);
              teacherName = t.data.name;
            } catch {}
            try {
              const c = await axios.get(`${baseurl}/classes/classroom/${slot.classroom_id}`);
              classroomName = c.data.classroom_name;
            } catch {}
            return {
              ...slot,
              teacher_id: { _id: slot.teacher_id, name: teacherName },
              classroom_id: { _id: slot.classroom_id, classroom_name: classroomName },
            };
          })
        );

        setTimeTableSlots(updatedSlots);

        // Auto-select current day
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const days = [...new Set(updatedSlots.map((s: TimeTableSlot) => s.day))] as string[];
        setActiveDay(days.includes(today) ? today : days[0] ?? null);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [studentId]);

  /* ---------- Derived Data ---------- */
  const allDays = [...new Set(timeTableSlots.map(s => s.day))].sort(
    (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
  );
  const filteredSlots = activeDay
    ? timeTableSlots.filter(s => s.day === activeDay)
    : timeTableSlots;

  /* ---------- Helpers ---------- */
  const getTeacherName = (t: string | Teacher) => (typeof t === 'object' ? t.name : '—');
  const getClassroomName = (c: string | Classroom) =>
    typeof c === 'object' ? c.classroom_name : '—';

  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  /* ------------------ Render ------------------ */
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

        /* ── Day pill tabs ── */
        .day-pill {
          padding: 6px 18px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 1.5px solid #e8ecf4;
          background: #fff;
          color: #64748b;
          transition: all 0.18s ease;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .day-pill:hover { border-color: #818cf8; color: #6366f1; }
        .day-pill.active {
          background: linear-gradient(135deg,#3730a3,#6366f1);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 4px 14px rgba(99,102,241,.35);
        }
        .day-pill.today-dot::after {
          content: '';
          display: inline-block;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #22c55e;
          margin-left: 6px;
          vertical-align: middle;
          position: relative; top: -1px;
        }
        .day-pill.active.today-dot::after { background: #a7f3d0; }

        /* ── Slot card ── */
        .slot-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e8ecf4;
          overflow: hidden;
          display: flex;
          transition: transform 0.22s cubic-bezier(.22,.68,0,1.15),
                      box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .slot-card:hover {
          transform: translateY(-3px);
          border-color: transparent;
          box-shadow: 0 20px 60px rgba(15,23,42,.10), 0 4px 16px rgba(15,23,42,.06);
        }

        /* ── Meta chip ── */
        .meta-chip {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; color: #64748b;
          background: #f8fafc; border: 1px solid #e8ecf4;
          padding: 4px 10px; border-radius: 8px;
        }

        /* ── Shimmer skeleton ── */
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

        /* ── Card entrance ── */
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-enter { animation: cardIn 0.38s cubic-bezier(.22,.68,0,1.1) forwards; opacity: 0; }

        /* ── Stat chip (header strip) ── */
        .stat-chip {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          padding: 10px 20px; border-right: 1px solid #e8ecf4;
        }
        .stat-chip:last-child { border-right: none; }

        /* ── Time badge ── */
        .time-badge {
          font-family: 'DM Mono', monospace;
          font-size: 13px; font-weight: 500;
          color: #fff;
          padding: 5px 12px;
          border-radius: 8px;
          display: inline-flex; align-items: center; gap: 5px;
        }

        /* ── Ghost empty ── */
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
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Icon badge */}
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg,#3730a3 0%,#6366f1 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(99,102,241,.28)',
              }}>
                <CalendarDays style={{ width: 20, height: 20, color: '#fff' }} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h1 style={{ fontSize: 21, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', margin: 0 }}>
                    Timetable
                  </h1>
                  {!loading && (
                    <span style={{
                      fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 500,
                      background: '#1e293b', color: '#fff', padding: '2px 10px', borderRadius: 999,
                    }}>
                      {timeTableSlots.length} {timeTableSlots.length === 1 ? 'slot' : 'slots'}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '3px 0 0' }}>
                  Your weekly class schedule at a glance
                </p>
              </div>
            </div>

            {/* Stats strip */}
            {!loading && timeTableSlots.length > 0 && (
              <div style={{
                display: 'flex', background: '#fff',
                border: '1px solid #e8ecf4', borderRadius: 12, overflow: 'hidden',
              }}>
                {[
                  { label: 'Days',    value: allDays.length,        color: '#6366f1' },
                  { label: 'Classes', value: timeTableSlots.length, color: '#16a34a' },
                  { label: 'Today',   value: filteredSlots.length,  color: '#d97706' },
                ].map(s => (
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

          {/* Day filter pills */}
          {!loading && allDays.length > 0 && (
            <div style={{ padding: '0 32px 16px', display: 'flex', gap: 8, overflowX: 'auto' }}>
              {/* All pill */}
              <button
                className={`day-pill${activeDay === null ? ' active' : ''}`}
                onClick={() => setActiveDay(null)}
              >
                All days
              </button>
              {allDays.map(day => (
                <button
                  key={day}
                  className={`day-pill${activeDay === day ? ' active' : ''}${day === todayLabel ? ' today-dot' : ''}`}
                  onClick={() => setActiveDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          )}

          <div style={{ height: 1, background: 'linear-gradient(90deg,#e8ecf4,transparent)', margin: '0 32px' }} />
          <div style={{ height: 16 }} />
        </div>

        {/* ══════════ CONTENT ══════════ */}
        <div className="page-bg" style={{ padding: '28px 32px', minHeight: 'calc(100vh - 140px)' }}>

          {/* ── Skeletons ── */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skel" style={{ height: 100 }} />
              ))}
            </div>
          )}

          {/* ── Day group view (when "All days") ── */}
          {!loading && timeTableSlots.length > 0 && activeDay === null && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {allDays.map((day, di) => {
                const daySlots = timeTableSlots.filter(s => s.day === day);
                return (
                  <div key={day}>
                    {/* Day section header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.08em', color: '#6366f1',
                        fontFamily: "'DM Mono', monospace",
                      }}>
                        {day}
                      </span>
                      {day === todayLabel && (
                        <span style={{
                          fontSize: 10, fontWeight: 600, background: '#dcfce7',
                          color: '#16a34a', padding: '2px 8px', borderRadius: 999,
                          letterSpacing: '0.04em',
                        }}>TODAY</span>
                      )}
                      <div style={{ flex: 1, height: 1, background: '#e8ecf4' }} />
                      <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>
                        {daySlots.length} {daySlots.length === 1 ? 'class' : 'classes'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {daySlots.map((slot, i) => (
                        <SlotCard key={slot._id} slot={slot} index={(di * 10) + i} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Single day view ── */}
          {!loading && timeTableSlots.length > 0 && activeDay !== null && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredSlots.length === 0 ? (
                <div style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                  No classes scheduled for {activeDay}.
                </div>
              ) : (
                filteredSlots.map((slot, i) => (
                  <SlotCard key={slot._id} slot={slot} index={i} />
                ))
              )}
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && timeTableSlots.length === 0 && (
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
                <CalendarDays style={{ width: 24, height: 24, color: '#fff' }} />
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.2px' }}>
                No timetable available
              </p>
              <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 280, lineHeight: 1.6 }}>
                Your schedule hasn't been set up yet. Check back once your teacher creates the timetable.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

/* ══════════ Slot Card Sub-component ══════════ */
function SlotCard({ slot, index }: { slot: TimeTableSlot; index: number }) {
  const color = subjectColors[index % subjectColors.length];
  const teacherName = typeof slot.teacher_id === 'object' ? slot.teacher_id.name : '—';
  const classroomName = typeof slot.classroom_id === 'object' ? slot.classroom_id.classroom_name : '—';

  return (
    <div className="card-enter" style={{ animationDelay: `${index * 45}ms` }}>
      <div className="slot-card">
        {/* Left accent bar */}
        <div style={{ width: 4, background: color.bar, flexShrink: 0 }} />

        {/* Main content */}
        <div style={{ flex: 1, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 20 }}>

          {/* Subject icon */}
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: color.light, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen style={{ width: 17, height: 17, color: color.mid }} />
          </div>

          {/* Classroom name + time */}
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 style={{ fontSize: 14, fontWeight: 650, color: '#0f172a', marginBottom: 6, letterSpacing: '-0.1px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {classroomName}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span className="meta-chip">
                <User style={{ width: 11, height: 11, color: color.mid }} />
                {teacherName}
              </span>
              {slot.date && (
                <span className="meta-chip">
                  <CalendarDays style={{ width: 11, height: 11 }} />
                  {slot.date}
                </span>
              )}
              {slot.roomno && (
                <span className="meta-chip">
                  <School style={{ width: 11, height: 11 }} />
                  Room {slot.roomno}
                </span>
              )}
            </div>
          </div>

          {/* Time badge + day pill */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
            <span className="time-badge" style={{ background: color.bar }}>
              <Clock style={{ width: 11, height: 11 }} />
              {slot.start_time} – {slot.end_time}
            </span>
            <span style={{
              fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 500,
              background: color.light, color: color.mid,
              padding: '3px 10px', borderRadius: 999,
              border: `1px solid ${color.mid}22`,
            }}>
              {slot.day}
            </span>
          </div>
        </div>

        {/* Right progress accent strip */}
        <div style={{
          width: 3, background: color.bar, opacity: 0.3, flexShrink: 0,
          borderRadius: '0 16px 16px 0',
        }} />
      </div>
    </div>
  );
}