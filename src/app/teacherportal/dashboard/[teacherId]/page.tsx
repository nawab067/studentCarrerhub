'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import {
  BookOpen,
  GraduationCap,
  Users,
  Notebook,
  TrendingUp,
  Award,
  Activity,
  AlertCircle,
  LayoutDashboard,
  ArrowUpRight,
} from "lucide-react";

export interface AssignedClass {
  _id: string;
  classroom_name: string;
  students: string[];
  teacherId: string;
}

export default function TeacherDashboardPage() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [assignedClasses, setAssignedClasses] = useState<AssignedClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAssessments, setTotalAssessments] = useState<number>(0);
  const [collapsed, setCollapsed] = useState(false);

  const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

  const totalClasses = assignedClasses.length;
  const totalStudents = Array.from(
    new Set(assignedClasses.flatMap((cls) => cls.students))
  ).length;

  // ✅ 1️⃣ READ teacherId from localStorage
  useEffect(() => {
    const id = localStorage.getItem("teacherId");
    console.log("Teacher ID from localStorage:", id);
    if (!id) {
      setError("Teacher ID not found. Please login again.");
      setLoading(false);
      return;
    }
    setTeacherId(id);
  }, []);

  // ✅ 2️⃣ FETCH classes once teacherId exists
  useEffect(() => {
    if (!teacherId) return;
    const fetchClasses = async () => {
      try {
        setLoading(true);
        console.log(teacherId);
        const response = await axios.get(
          `${baseurl}/classes/assigned/${teacherId}`
        );
        console.log("FULL API RESPONSE:", response.data);
        setAssignedClasses(response.data.data || []);
        await fetchAssessments(teacherId);
      } catch (err) {
        console.error("API ERROR:", err);
        setError("Failed to load classes.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [teacherId]);

  const fetchAssessments = async (teacherId: string) => {
    try {
      const res = await axios.get(`${baseurl}/all_assesments/${teacherId}`);
      const assessments = res.data.data || [];
      setTotalAssessments(assessments.length);
    } catch (err) {
      console.error("Assessment API error:", err);
      setError("Failed to load assessments.");
    }
  };

  const avgClassSize =
    totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;

  const stats = [
    {
      label: "Total Students",
      value: totalStudents,
      sub: "Active learners",
      icon: Users,
      color: { light: "#eef2ff", mid: "#6366f1", bar: "linear-gradient(135deg,#4f46e5,#6366f1)" },
    },
    {
      label: "Classes",
      value: totalClasses,
      sub: "Active classes",
      icon: BookOpen,
      color: { light: "#f0fdf4", mid: "#16a34a", bar: "linear-gradient(135deg,#15803d,#16a34a)" },
    },
    {
      label: "Assignments",
      value: totalAssessments,
      sub: "Total assessments",
      icon: Notebook,
      color: { light: "#faf5ff", mid: "#7c3aed", bar: "linear-gradient(135deg,#6d28d9,#7c3aed)" },
    },
    {
      label: "Pass Rate",
      value: "92%",
      sub: "Excellent performance",
      icon: GraduationCap,
      color: { light: "#fff7ed", mid: "#ea580c", bar: "linear-gradient(135deg,#c2410c,#ea580c)" },
    },
  ];

  const quickStats = [
    {
      label: "Student Engagement",
      value: "High",
      icon: Users,
      color: { light: "#eef2ff", mid: "#6366f1" },
    },
    {
      label: "Avg. Class Size",
      value: loading ? "—" : String(avgClassSize),
      icon: Activity,
      color: { light: "#f0fdf4", mid: "#16a34a" },
    },
    {
      label: "Success Rate",
      value: "Excellent",
      icon: Award,
      color: { light: "#faf5ff", mid: "#7c3aed" },
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "#f4f6fb", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

        .page-bg {
          background: #f4f6fb;
          background-image:
            radial-gradient(ellipse 80% 50% at 20% -10%, rgba(99,102,241,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 110%, rgba(139,92,246,0.05) 0%, transparent 60%);
        }

        @keyframes shimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }
        .skel {
          background: linear-gradient(90deg,#eef0f6 25%,#e4e8f2 50%,#eef0f6 75%);
          background-size: 600px 100%; animation: shimmer 1.4s infinite;
          border-radius: 16px; border: 1px solid #e8ecf4;
        }

        @keyframes cardIn { from { opacity: 0; transform: translateY(18px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .card-enter { animation: cardIn 0.38s cubic-bezier(.22,.68,0,1.1) forwards; opacity: 0; }

        .stat-card {
          background: #fff; border-radius: 16px; border: 1px solid #e8ecf4;
          overflow: hidden; display: flex; flex-direction: column;
          transition: transform 0.22s cubic-bezier(.22,.68,0,1.15), box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px); border-color: transparent;
          box-shadow: 0 20px 60px rgba(15,23,42,.10), 0 4px 16px rgba(15,23,42,.06);
        }

        .quick-card {
          background: #fff; border-radius: 14px; border: 1px solid #e8ecf4;
          display: flex; align-items: center; gap: 16px; padding: 18px 20px;
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .quick-card:hover {
          transform: translateY(-2px); border-color: transparent;
          box-shadow: 0 12px 40px rgba(15,23,42,.08), 0 2px 8px rgba(15,23,42,.04);
        }

        .stat-chip { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 20px; border-right: 1px solid #e8ecf4; }
        .stat-chip:last-child { border-right: none; }
        .stats-strip { display: flex; background: #fff; border: 1px solid #e8ecf4; border-radius: 12px; overflow: hidden; flex-shrink: 0; }

        .main-content { transition: margin-left 0.3s; }

        .header-title-row { display: flex; align-items: center; justify-content: space-between; padding: 24px 32px 16px; flex-wrap: wrap; gap: 12px; }
        .content-padding { padding: 28px 32px; }
        .stats-grid { display: grid; gap: 16px; grid-template-columns: repeat(4, 1fr); margin-bottom: 24px; }
        .quick-grid { display: grid; gap: 12px; grid-template-columns: repeat(3, 1fr); }

        @media (max-width: 640px) {
          .main-content { margin-left: 0 !important; }
          .header-title-row { padding: 16px 16px 12px; flex-direction: column; align-items: flex-start; }
          .content-padding { padding: 16px 12px; }
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .quick-grid { grid-template-columns: 1fr; }
          .stats-strip { width: 100%; }
          .stat-chip { flex: 1; padding: 8px 10px; }
          .header-title-row h1 { font-size: 18px !important; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .main-content { margin-left: 0 !important; }
          .header-title-row { padding: 20px 20px 14px; }
          .content-padding { padding: 20px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .quick-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1025px) {
          .main-content.sidebar-expanded { margin-left: 256px; }
          .main-content.sidebar-collapsed { margin-left: 80px; }
        }
      `}</style>

      <TeacherPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className={`main-content min-h-screen ${
          collapsed ? "sidebar-collapsed" : "sidebar-expanded"
        }`}
      >
        {/* ══════════ STICKY HEADER ══════════ */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: "rgba(244,246,251,0.93)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div className="header-title-row">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  flexShrink: 0,
                  background: "linear-gradient(135deg,#3730a3 0%,#6366f1 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 20px rgba(99,102,241,.28)",
                }}
              >
                <LayoutDashboard style={{ width: 20, height: 20, color: "#fff" }} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h1
                    style={{
                      fontSize: 21,
                      fontWeight: 700,
                      color: "#0f172a",
                      letterSpacing: "-0.4px",
                      margin: 0,
                    }}
                  >
                    Dashboard
                  </h1>
                  {!loading && (
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "'DM Mono', monospace",
                        fontWeight: 500,
                        background: "#1e293b",
                        color: "#fff",
                        padding: "2px 10px",
                        borderRadius: 999,
                      }}
                    >
                      {totalClasses} classes
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: "3px 0 0" }}>
                  Welcome back, Teacher — here's your overview for today
                </p>
              </div>
            </div>

            {/* Stats strip — matches pages 2, 3, 4 pattern */}
            {!loading && assignedClasses.length > 0 && (
              <div className="stats-strip">
                {(
                  [
                    { label: "Classes", value: totalClasses, color: "#4f46e5" },
                    { label: "Students", value: totalStudents, color: "#7c3aed" },
                    {
                      label: "Avg / Class",
                      value: avgClassSize,
                      color: "#8b5cf6",
                    },
                  ] as const
                ).map((s) => (
                  <div key={s.label} className="stat-chip">
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: s.color,
                        fontFamily: "'DM Mono',monospace",
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#94a3b8",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════ CONTENT ══════════ */}
        <div
          className="page-bg content-padding"
          style={{ minHeight: "calc(100vh - 90px)" }}
        >
          {/* Error */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 12,
                padding: "14px 18px",
                marginBottom: 20,
              }}
            >
              <AlertCircle
                style={{ width: 18, height: 18, color: "#ef4444", flexShrink: 0 }}
              />
              <p style={{ fontSize: 13, color: "#dc2626", fontWeight: 500 }}>
                {error}
              </p>
            </div>
          )}

          {/* ── STAT CARDS ── */}
          {loading ? (
            <div className="stats-grid" style={{ marginBottom: 24 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skel" style={{ height: 140 }} />
              ))}
            </div>
          ) : (
            <div className="stats-grid">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="stat-card card-enter"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* Top accent bar */}
                    <div
                      style={{
                        height: 3,
                        background: s.color.bar,
                        opacity: 0.7,
                      }}
                    />

                    <div
                      style={{
                        flex: 1,
                        padding: "18px 18px 16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      {/* Top row */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            flexShrink: 0,
                            background: s.color.light,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon
                            style={{ width: 17, height: 17, color: s.color.mid }}
                          />
                        </div>
                        <ArrowUpRight
                          style={{
                            width: 14,
                            height: 14,
                            color: "#cbd5e1",
                            marginTop: 2,
                          }}
                        />
                      </div>

                      {/* Value */}
                      <div>
                        <p
                          style={{
                            fontSize: 32,
                            fontWeight: 700,
                            color: "#0f172a",
                            fontFamily: "'DM Mono', monospace",
                            lineHeight: 1,
                            marginBottom: 6,
                          }}
                        >
                          {s.value}
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#0f172a",
                            marginBottom: 2,
                            letterSpacing: "-0.1px",
                          }}
                        >
                          {s.label}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          {s.sub}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── QUICK OVERVIEW ── */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8ecf4",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {/* Panel header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #e8ecf4",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <TrendingUp
                style={{ width: 15, height: 15, color: "#6366f1" }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "-0.1px",
                }}
              >
                Quick Overview
              </span>
            </div>

            {/* Quick stat cards */}
            {loading ? (
              <div
                className="quick-grid"
                style={{ padding: "16px 20px 20px" }}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skel" style={{ height: 80 }} />
                ))}
              </div>
            ) : (
              <div
                className="quick-grid"
                style={{ padding: "16px 20px 20px" }}
              >
                {quickStats.map((q, i) => {
                  const Icon = q.icon;
                  return (
                    <div
                      key={q.label}
                      className="quick-card card-enter"
                      style={{ animationDelay: `${(i + 4) * 60}ms` }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          flexShrink: 0,
                          background: q.color.light,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          style={{ width: 18, height: 18, color: q.color.mid }}
                        />
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            marginBottom: 3,
                            fontFamily: "'DM Mono', monospace",
                            letterSpacing: "0.03em",
                          }}
                        >
                          {q.label}
                        </p>
                        <p
                          style={{
                            fontSize: 17,
                            fontWeight: 700,
                            color: "#0f172a",
                            letterSpacing: "-0.2px",
                          }}
                        >
                          {q.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}