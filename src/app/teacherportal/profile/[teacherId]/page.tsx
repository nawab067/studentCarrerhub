"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Award,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  GraduationCap,
  BookOpen,
  Users,
} from "lucide-react";

interface Teacher {
  name: string;
  email: string;
  professionality: string;
  status: string;
  Teacher_Designation: string;
  Teacher_Phone_Number: string;
  image_url: string;
}

export default function TeacherProfilePage() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const id = localStorage.getItem("teacherId");
    setTeacherId(id);
  }, []);

  useEffect(() => {
    if (!teacherId) return;
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`${baseUrl}/teacher/user/${teacherId}`);
        setTeacher(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [teacherId]);

  const initials = teacher?.name?.slice(0, 2).toUpperCase() ?? "TC";
  const isActive = teacher?.status === "active";

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
          border-radius: 12px;
        }

        @keyframes cardIn { from { opacity: 0; transform: translateY(16px) scale(0.99); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .card-enter { animation: cardIn 0.38s cubic-bezier(.22,.68,0,1.1) forwards; opacity: 0; }

        .main-content { transition: margin-left 0.3s; }
        .header-title-row { display: flex; align-items: center; justify-content: space-between; padding: 24px 32px 16px; flex-wrap: wrap; gap: 12px; }
        .content-padding { padding: 28px 32px; }

        .profile-panel {
          background: #fff; border-radius: 16px; border: 1px solid #e8ecf4; overflow: hidden;
        }

        .info-card {
          background: #fff; border-radius: 14px; border: 1px solid #e8ecf4;
          padding: 18px 20px; display: flex; align-items: flex-start; gap: 14px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .info-card:hover {
          transform: translateY(-3px); border-color: transparent;
          box-shadow: 0 12px 36px rgba(15,23,42,.08), 0 2px 8px rgba(15,23,42,.04);
        }

        .info-icon-wrap {
          width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }

        .stat-chip { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 22px; border-right: 1px solid #e8ecf4; }
        .stat-chip:last-child { border-right: none; }
        .stats-strip { display: flex; background: #fff; border: 1px solid #e8ecf4; border-radius: 12px; overflow: hidden; flex-shrink: 0; }

        .avatar-ring {
          padding: 3px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border-radius: 50%;
          display: inline-flex;
        }

        @media (max-width: 640px) {
          .main-content { margin-left: 0 !important; }
          .header-title-row { padding: 14px 14px 12px; }
          .content-padding { padding: 14px 12px; }
          .profile-hero { flex-direction: column !important; align-items: center !important; text-align: center; }
          .hero-meta { align-items: center !important; }
          .info-grid { grid-template-columns: 1fr !important; }
          .stats-strip { width: 100%; }
          .stat-chip { flex: 1; padding: 8px 10px; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .main-content { margin-left: 0 !important; }
          .header-title-row { padding: 18px 18px 14px; }
          .content-padding { padding: 18px; }
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
                <User style={{ width: 20, height: 20, color: "#fff" }} />
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
                    Teacher Profile
                  </h1>
                  {!loading && teacher && (
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "'DM Mono', monospace",
                        fontWeight: 500,
                        background: isActive ? "#f0fdf4" : "#fef2f2",
                        color: isActive ? "#16a34a" : "#dc2626",
                        border: `1px solid ${isActive ? "#bbf7d0" : "#fecaca"}`,
                        padding: "2px 10px",
                        borderRadius: 999,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      {isActive
                        ? <CheckCircle2 style={{ width: 10, height: 10 }} />
                        : <XCircle style={{ width: 10, height: 10 }} />
                      }
                      {teacher.status}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: "3px 0 0" }}>
                  View and manage your professional profile
                </p>
              </div>
            </div>

            {/* Stats strip */}
            {!loading && teacher && (
              <div className="stats-strip">
                {[
                  { label: "Status", value: isActive ? "Active" : "Inactive", color: isActive ? "#16a34a" : "#dc2626" },
                  { label: "Role", value: "Teacher", color: "#4f46e5" },
                  { label: "Portal", value: "Educator", color: "#7c3aed" },
                ].map((s) => (
                  <div key={s.label} className="stat-chip">
                    <span
                      style={{
                        fontSize: 13,
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

          {/* ── SKELETON ── */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                className="profile-panel"
                style={{ padding: "28px 28px 24px" }}
              >
                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                  <div className="skel" style={{ width: 96, height: 96, borderRadius: "50%", flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="skel" style={{ width: 200, height: 22 }} />
                    <div className="skel" style={{ width: 260, height: 14 }} />
                    <div className="skel" style={{ width: 100, height: 22, borderRadius: 999 }} />
                  </div>
                </div>
              </div>
              <div
                className="info-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 14,
                }}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skel" style={{ height: 90 }} />
                ))}
              </div>
            </div>
          )}

          {/* ── PROFILE CARD ── */}
          {!loading && teacher && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Hero panel */}
              <div className="profile-panel card-enter" style={{ animationDelay: "0ms" }}>

                {/* Top accent bar */}
                <div
                  style={{
                    height: 4,
                    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                  }}
                />

                <div style={{ padding: "28px 28px 24px" }}>
                  <div
                    className="profile-hero"
                    style={{ display: "flex", alignItems: "flex-start", gap: 24 }}
                  >
                    {/* Avatar */}
                    <div style={{ flexShrink: 0 }}>
                      <div className="avatar-ring">
                        <Avatar
                          style={{
                            width: 88,
                            height: 88,
                            border: "3px solid #fff",
                            borderRadius: "50%",
                            fontSize: 28,
                            fontWeight: 700,
                            background: "#eef2ff",
                            color: "#4f46e5",
                          }}
                        >
                          {teacher.image_url ? (
                            <AvatarImage src={teacher.image_url} alt={teacher.name} />
                          ) : null}
                          <AvatarFallback
                            style={{
                              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                              color: "#fff",
                              fontSize: 26,
                              fontWeight: 700,
                              fontFamily: "'DM Mono', monospace",
                            }}
                          >
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      {/* Online dot */}
                      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 10,
                            fontFamily: "'DM Mono', monospace",
                            fontWeight: 500,
                            color: isActive ? "#16a34a" : "#dc2626",
                            background: isActive ? "#f0fdf4" : "#fef2f2",
                            border: `1px solid ${isActive ? "#bbf7d0" : "#fecaca"}`,
                            padding: "2px 8px",
                            borderRadius: 999,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: isActive ? "#22c55e" : "#ef4444",
                              flexShrink: 0,
                            }}
                          />
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div
                      className="hero-meta"
                      style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}
                    >
                      <h2
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: "#0f172a",
                          letterSpacing: "-0.4px",
                          margin: 0,
                        }}
                      >
                        {teacher.name}
                      </h2>

                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 12,
                            fontFamily: "'DM Mono', monospace",
                            color: "#6366f1",
                            background: "#eef2ff",
                            padding: "3px 10px",
                            borderRadius: 999,
                            fontWeight: 500,
                          }}
                        >
                          <Award style={{ width: 11, height: 11 }} />
                          {teacher.Teacher_Designation || "Teacher"}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 12,
                            fontFamily: "'DM Mono', monospace",
                            color: "#7c3aed",
                            background: "#faf5ff",
                            padding: "3px 10px",
                            borderRadius: 999,
                            fontWeight: 500,
                          }}
                        >
                          <GraduationCap style={{ width: 11, height: 11 }} />
                          {teacher.professionality || "Educator"}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: 13,
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginTop: 2,
                        }}
                      >
                        <Mail style={{ width: 13, height: 13, color: "#94a3b8" }} />
                        {teacher.email}
                      </p>

                      {/* Divider */}
                      <div
                        style={{
                          height: 1,
                          background: "#f1f5f9",
                          margin: "8px 0",
                        }}
                      />

                      {/* Quick stat row */}
                      <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                        {[
                          { icon: BookOpen, label: "Classes", color: "#4f46e5", bg: "#eef2ff" },
                          { icon: Users, label: "Students", color: "#7c3aed", bg: "#faf5ff" },
                          { icon: Award, label: "Assessments", color: "#16a34a", bg: "#f0fdf4" },
                        ].map((q) => {
                          const Icon = q.icon;
                          return (
                            <div
                              key={q.label}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <div
                                style={{
                                  width: 26,
                                  height: 26,
                                  borderRadius: 7,
                                  background: q.bg,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <Icon style={{ width: 12, height: 12, color: q.color }} />
                              </div>
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "#64748b",
                                  fontWeight: 500,
                                }}
                              >
                                {q.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── INFO GRID ── */}
              <div
                className="info-grid card-enter"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 14,
                  animationDelay: "60ms",
                }}
              >
                <InfoCard
                  icon={Briefcase}
                  label="Profession"
                  value={teacher.professionality}
                  iconBg="#eef2ff"
                  iconColor="#4f46e5"
                  barColor="linear-gradient(135deg,#4f46e5,#6366f1)"
                />
                <InfoCard
                  icon={Award}
                  label="Designation"
                  value={teacher.Teacher_Designation}
                  iconBg="#faf5ff"
                  iconColor="#7c3aed"
                  barColor="linear-gradient(135deg,#7c3aed,#8b5cf6)"
                />
                <InfoCard
                  icon={Phone}
                  label="Phone"
                  value={teacher.Teacher_Phone_Number}
                  iconBg="#f0fdf4"
                  iconColor="#16a34a"
                  barColor="linear-gradient(135deg,#15803d,#16a34a)"
                />
              </div>

              {/* ── CONTACT ROW ── */}
              <div
                className="card-enter"
                style={{
                  background: "#fff",
                  border: "1px solid #e8ecf4",
                  borderRadius: 16,
                  overflow: "hidden",
                  animationDelay: "110ms",
                }}
              >
                <div
                  style={{
                    padding: "14px 20px",
                    borderBottom: "1px solid #e8ecf4",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Mail style={{ width: 14, height: 14, color: "#6366f1" }} />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#0f172a",
                      letterSpacing: "-0.1px",
                    }}
                  >
                    Contact Information
                  </span>
                </div>

                <div style={{ padding: "6px 0" }}>
                  {[
                    {
                      icon: Mail,
                      label: "Email address",
                      value: teacher.email,
                      iconBg: "#eef2ff",
                      iconColor: "#4f46e5",
                    },
                    {
                      icon: Phone,
                      label: "Phone number",
                      value: teacher.Teacher_Phone_Number,
                      iconBg: "#f0fdf4",
                      iconColor: "#16a34a",
                    },
                    {
                      icon: Briefcase,
                      label: "Profession",
                      value: teacher.professionality,
                      iconBg: "#faf5ff",
                      iconColor: "#7c3aed",
                    },
                    {
                      icon: Award,
                      label: "Designation",
                      value: teacher.Teacher_Designation,
                      iconBg: "#fff7ed",
                      iconColor: "#ea580c",
                    },
                  ].map((row, i, arr) => {
                    const Icon = row.icon;
                    return (
                      <div
                        key={row.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          padding: "13px 20px",
                          borderBottom:
                            i < arr.length - 1 ? "1px solid #f1f5f9" : "none",
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 9,
                            flexShrink: 0,
                            background: row.iconBg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon
                            style={{ width: 14, height: 14, color: row.iconColor }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: 11,
                              color: "#94a3b8",
                              marginBottom: 2,
                              fontFamily: "'DM Mono', monospace",
                            }}
                          >
                            {row.label}
                          </p>
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#0f172a",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.value || "—"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* No data */}
          {!loading && !teacher && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "80px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "#fef2f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <AlertCircle style={{ width: 24, height: 24, color: "#ef4444" }} />
              </div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0f172a",
                  marginBottom: 6,
                }}
              >
                Profile not found
              </p>
              <p style={{ fontSize: 13, color: "#94a3b8", maxWidth: 260 }}>
                Could not load teacher data. Please log in again.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ── Info Card Component ── */
function InfoCard({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
  barColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
  barColor: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #e8ecf4",
        overflow: "hidden",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
      }}
      className="info-card-outer"
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-4px)";
        el.style.borderColor = "transparent";
        el.style.boxShadow =
          "0 16px 48px rgba(15,23,42,.09), 0 2px 8px rgba(15,23,42,.05)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.borderColor = "#e8ecf4";
        el.style.boxShadow = "none";
      }}
    >
      {/* Accent bar */}
      <div style={{ height: 3, background: barColor, opacity: 0.7 }} />

      <div
        style={{
          padding: "16px 18px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: 16, height: 16, color: iconColor }} />
        </div>
        <div>
          <p
            style={{
              fontSize: 10,
              color: "#94a3b8",
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.1px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}