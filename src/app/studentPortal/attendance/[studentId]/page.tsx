'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import StudentPortalSidebar from '@/components/student-portal/student-sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, ChevronRight, BookOpen, GraduationCap } from 'lucide-react';

interface Classroom {
  _id: string;
  classroom_name: string;
}

export default function StudentAttendancePage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem('studentId');
    if (!id) {
      router.replace('/login');
      return;
    }
    setStudentId(id);
    fetchClassrooms(id);
  }, []);

  const fetchClassrooms = async (studentId: string) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/classes/student/${studentId}`
      );
      setClassrooms(res.data);
    } catch (err) {
      console.error('Error fetching classrooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const accentColors = [
    { iconBg: '#ede9fe', iconColor: '#7c3aed', dot: '#7c3aed', strip: '#7c3aed' },
    { iconBg: '#dbeafe', iconColor: '#2563eb', dot: '#2563eb', strip: '#2563eb' },
    { iconBg: '#d1fae5', iconColor: '#059669', dot: '#059669', strip: '#059669' },
    { iconBg: '#fef3c7', iconColor: '#d97706', dot: '#d97706', strip: '#d97706' },
    { iconBg: '#ffe4e6', iconColor: '#e11d48', dot: '#e11d48', strip: '#e11d48' },
    { iconBg: '#e0f2fe', iconColor: '#0284c7', dot: '#0284c7', strip: '#0284c7' },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: '#f8fafc',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        .att-card {
          transition: transform 0.2s cubic-bezier(.22,.68,0,1.2), box-shadow 0.2s ease, border-color 0.2s ease;
          background: #ffffff;
        }
        .att-card:hover {
          transform: translateY(-3px) scale(1.013);
        }
        .chevron-slide {
          transition: transform 0.18s ease, opacity 0.18s ease;
          opacity: 0;
        }
        .att-card:hover .chevron-slide {
          transform: translateX(4px);
          opacity: 1;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-enter {
          animation: fadeUp 0.4s ease forwards;
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

          <div className="flex items-center gap-4 relative z-10">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-2xl flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
              }}
            >
              <ClipboardList className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ color: '#0f172a' }}
              >
                Attendance
              </h1>
              <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
                Select a classroom to view your attendance record
              </p>
            </div>

            {!loading && classrooms.length > 0 && (
              <div className="ml-auto">
                <span
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{
                    background: '#ede9fe',
                    color: '#6d28d9',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {classrooms.length} {classrooms.length === 1 ? 'class' : 'classes'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-10">

          {/* Skeletons */}
          {loading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="skel rounded-2xl h-[148px]"
                  style={{ border: '1px solid #e2e8f0' }}
                />
              ))}
            </div>
          )}

          {/* Classroom cards */}
          {!loading && classrooms.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {classrooms.map((classroom, i) => {
                const accent = accentColors[i % accentColors.length];
                const isHovered = hoveredId === classroom._id;
                return (
                  <div
                    key={classroom._id}
                    className="card-enter"
                    style={{ animationDelay: `${i * 55}ms` }}
                  >
                    <div
                      className="att-card relative cursor-pointer rounded-2xl overflow-hidden flex flex-col"
                      style={{
                        border: isHovered
                          ? `1px solid ${accent.strip}55`
                          : '1px solid #e2e8f0',
                        boxShadow: isHovered
                          ? `0 16px 40px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05)`
                          : '0 1px 4px rgba(0,0,0,0.05)',
                      }}
                      onClick={() =>
                        router.push(
                          `/studentPortal/attendance/showAttendence/${classroom._id}`
                        )
                      }
                      onMouseEnter={() => setHoveredId(classroom._id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* Colored top strip */}
                      <div
                        className="h-1 w-full flex-shrink-0"
                        style={{ background: accent.strip }}
                      />

                      <div className="p-5 flex flex-col gap-4">
                        {/* Icon + chevron */}
                        <div className="flex items-start justify-between">
                          <div
                            className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
                            style={{ background: accent.iconBg }}
                          >
                            <BookOpen
                              className="w-4 h-4"
                              style={{ color: accent.iconColor }}
                            />
                          </div>
                          <ChevronRight
                            className="chevron-slide w-4 h-4 mt-1"
                            style={{ color: accent.iconColor }}
                          />
                        </div>

                        {/* Text */}
                        <div>
                          <h3
                            className="font-semibold text-sm leading-snug mb-1.5"
                            style={{ color: '#0f172a' }}
                          >
                            {classroom.classroom_name}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: accent.dot }}
                            />
                            <p className="text-xs" style={{ color: '#94a3b8' }}>
                              View attendance record
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && classrooms.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-24 rounded-2xl"
              style={{
                background: '#ffffff',
                border: '1.5px dashed #e2e8f0',
              }}
            >
              <div
                className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                style={{ background: '#ede9fe' }}
              >
                <GraduationCap className="w-7 h-7" style={{ color: '#7c3aed' }} />
              </div>
              <p className="text-base font-semibold mb-1" style={{ color: '#0f172a' }}>
                No classrooms found
              </p>
              <p className="text-sm" style={{ color: '#94a3b8' }}>
                You haven't been enrolled in any classes yet.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}