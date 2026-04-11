"use client";

import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { useTheme } from "@/context/themeContext";
import { useState } from "react";
import {
  Sun,
  Moon,
  Monitor,
  Settings,
  Bell,
  Shield,
  User,
  Palette,
  Globe,
  ChevronRight,
  Check,
} from "lucide-react";

export default function TeacherSettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("appearance");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    newStudent: true,
    assessmentDue: true,
    attendanceAlert: false,
  });
  const [language, setLanguage] = useState("en");

  const sections = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "language", label: "Language & Region", icon: Globe },
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

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-enter { animation: cardIn 0.35s cubic-bezier(.22,.68,0,1.1) forwards; opacity: 0; }

        .main-content { transition: margin-left 0.3s; }

        .settings-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 500; color: #475569;
          cursor: pointer; border: none; background: transparent;
          width: 100%; text-align: left;
          transition: background 0.15s ease, color 0.15s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .settings-nav-item:hover { background: #f1f5f9; color: #0f172a; }
        .settings-nav-item.active { background: #eef2ff; color: #4f46e5; }
        .settings-nav-item.active .nav-icon-wrap { background: #4f46e5; }
        .settings-nav-item.active .nav-icon-wrap svg { color: #fff; }

        .nav-icon-wrap {
          width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
          background: #f1f5f9; display: flex; align-items: center; justify-content: center;
          transition: background 0.15s ease;
        }

        .panel {
          background: #fff; border-radius: 16px;
          border: 1px solid #e8ecf4; overflow: hidden;
        }
        .panel-header {
          padding: 18px 22px; border-bottom: 1px solid #e8ecf4;
          display: flex; align-items: center; gap: 10px;
        }
        .panel-title {
          font-size: 14px; font-weight: 700; color: #0f172a; letter-spacing: -0.1px;
        }
        .panel-desc { font-size: 12px; color: #94a3b8; margin-top: 1px; }

        .setting-row {
          padding: 16px 22px; display: flex; align-items: center;
          justify-content: space-between; gap: 16px;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.12s ease;
        }
        .setting-row:last-child { border-bottom: none; }
        .setting-row:hover { background: #fafafa; }

        .setting-label { font-size: 13px; font-weight: 600; color: #1e293b; }
        .setting-sub { font-size: 11px; color: #94a3b8; margin-top: 2px; font-family: 'DM Mono', monospace; }

        /* Theme selector */
        .theme-option {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          padding: 14px 20px; border-radius: 12px; cursor: pointer;
          border: 1.5px solid #e8ecf4; background: #fff;
          transition: all 0.18s ease; flex: 1; min-width: 80px;
          font-family: 'DM Sans', sans-serif;
        }
        .theme-option:hover { border-color: #a5b4fc; background: #eef2ff; }
        .theme-option.selected { border-color: #6366f1; background: #eef2ff; }
        .theme-option-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .theme-label { font-size: 12px; font-weight: 600; color: #475569; }
        .theme-option.selected .theme-label { color: #4f46e5; }

        /* Toggle switch */
        .toggle-wrap { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
        .toggle-wrap input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
          position: absolute; cursor: pointer; inset: 0;
          background: #e2e8f0; border-radius: 999px;
          transition: background 0.2s ease;
        }
        .toggle-slider:before {
          content: ""; position: absolute;
          width: 18px; height: 18px; left: 3px; bottom: 3px;
          background: #fff; border-radius: 50%;
          transition: transform 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .toggle-wrap input:checked + .toggle-slider { background: #6366f1; }
        .toggle-wrap input:checked + .toggle-slider:before { transform: translateX(20px); }

        /* Language option */
        .lang-option {
          display: flex; align-items: center; gap: 12px; padding: 12px 14px;
          border-radius: 10px; cursor: pointer; border: 1px solid #e8ecf4;
          background: #fff; transition: all 0.15s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .lang-option:hover { border-color: #a5b4fc; background: #f5f3ff; }
        .lang-option.selected { border-color: #6366f1; background: #eef2ff; }
        .lang-flag { font-size: 20px; width: 28px; text-align: center; }
        .lang-name { font-size: 13px; font-weight: 600; color: #1e293b; }
        .lang-code { font-size: 11px; color: #94a3b8; font-family: 'DM Mono', monospace; }
        .lang-check { margin-left: auto; width: 18px; height: 18px; border-radius: 50%; background: #6366f1; display: flex; align-items: center; justify-content: center; }

        /* Save button */
        .save-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 20px; border-radius: 10px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: #fff; font-size: 13px; font-weight: 600;
          border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 14px rgba(79,70,229,.25);
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .save-btn:hover { opacity: 0.92; transform: translateY(-1px); }

        @media (max-width: 640px) {
          .main-content { margin-left: 0 !important; }
          .settings-layout { flex-direction: column !important; }
          .settings-sidebar { width: 100% !important; }
          .settings-nav { flex-direction: row !important; overflow-x: auto; gap: 4px !important; }
          .settings-nav-item { flex-shrink: 0; white-space: nowrap; }
          .header-title-row { padding: 14px 16px 12px !important; flex-direction: column; align-items: flex-start; }
          .content-padding { padding: 14px 12px !important; }
          .theme-options { flex-direction: column !important; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .main-content { margin-left: 0 !important; }
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
          <div
            className="header-title-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px 32px 16px",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
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
                <Settings style={{ width: 20, height: 20, color: "#fff" }} />
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
                    Settings
                  </h1>
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
                    preferences
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: "3px 0 0" }}>
                  Manage your account settings and preferences
                </p>
              </div>
            </div>

            <button className="save-btn" onClick={() => {}}>
              <Check style={{ width: 14, height: 14 }} />
              Save changes
            </button>
          </div>
        </div>

        {/* ══════════ CONTENT ══════════ */}
        <div
          className="page-bg content-padding"
          style={{ minHeight: "calc(100vh - 90px)", padding: "28px 32px" }}
        >
          <div
            className="settings-layout"
            style={{ display: "flex", gap: 20, alignItems: "flex-start" }}
          >
            {/* ── LEFT NAV ── */}
            <div
              className="settings-sidebar panel card-enter"
              style={{
                width: 220,
                flexShrink: 0,
                animationDelay: "0ms",
                position: "sticky",
                top: 100,
              }}
            >
              <div style={{ padding: "14px 12px" }}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#94a3b8",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "0 8px",
                    marginBottom: 8,
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  Preferences
                </p>
                <nav
                  className="settings-nav"
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  {sections.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        className={`settings-nav-item${activeSection === s.id ? " active" : ""}`}
                        onClick={() => setActiveSection(s.id)}
                      >
                        <div className="nav-icon-wrap">
                          <Icon style={{ width: 14, height: 14 }} />
                        </div>
                        {s.label}
                        <ChevronRight
                          style={{
                            width: 13,
                            height: 13,
                            marginLeft: "auto",
                            opacity: activeSection === s.id ? 1 : 0.3,
                            color: activeSection === s.id ? "#6366f1" : "#94a3b8",
                          }}
                        />
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* ── RIGHT PANELS ── */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>

              {/* APPEARANCE */}
              {activeSection === "appearance" && (
                <>
                  {/* Theme */}
                  <div className="panel card-enter" style={{ animationDelay: "60ms" }}>
                    <div className="panel-header">
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: "#eef2ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Palette style={{ width: 14, height: 14, color: "#6366f1" }} />
                      </div>
                      <div>
                        <div className="panel-title">Theme Mode</div>
                        <div className="panel-desc">Choose how the portal looks to you</div>
                      </div>
                    </div>

                    <div style={{ padding: "20px 22px" }}>
                      <div
                        className="theme-options"
                        style={{ display: "flex", gap: 12 }}
                      >
                        {[
                          {
                            id: "light",
                            label: "Light",
                            icon: Sun,
                            iconBg: "#fffbeb",
                            iconColor: "#d97706",
                          },
                          {
                            id: "dark",
                            label: "Dark",
                            icon: Moon,
                            iconBg: "#1e293b",
                            iconColor: "#818cf8",
                          },
                          {
                            id: "system",
                            label: "System",
                            icon: Monitor,
                            iconBg: "#f0fdf4",
                            iconColor: "#16a34a",
                          },
                        ].map((t) => {
                          const Icon = t.icon;
                          const isSelected =
                            t.id === "system"
                              ? false
                              : theme === t.id;
                          return (
                            <div
                              key={t.id}
                              className={`theme-option${isSelected ? " selected" : ""}`}
                              onClick={() => {
                                if (t.id !== "system" && theme !== t.id) toggleTheme();
                              }}
                            >
                              <div
                                className="theme-option-icon"
                                style={{ background: t.iconBg }}
                              >
                                <Icon
                                  style={{
                                    width: 18,
                                    height: 18,
                                    color: t.iconColor,
                                  }}
                                />
                              </div>
                              <span className="theme-label">{t.label}</span>
                              {isSelected && (
                                <div
                                  style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    background: "#6366f1",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Check style={{ width: 10, height: 10, color: "#fff" }} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <p
                        style={{
                          fontSize: 11,
                          color: "#94a3b8",
                          marginTop: 14,
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        Current mode:{" "}
                        <span style={{ color: "#6366f1", fontWeight: 500 }}>
                          {theme}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Display density */}
                  <div className="panel card-enter" style={{ animationDelay: "100ms" }}>
                    <div className="panel-header">
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: "#f5f3ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Monitor style={{ width: 14, height: 14, color: "#7c3aed" }} />
                      </div>
                      <div>
                        <div className="panel-title">Display</div>
                        <div className="panel-desc">Interface density and font size</div>
                      </div>
                    </div>
                    <div className="setting-row">
                      <div>
                        <div className="setting-label">Compact sidebar</div>
                        <div className="setting-sub">Collapse sidebar by default on load</div>
                      </div>
                      <label className="toggle-wrap">
                        <input
                          type="checkbox"
                          checked={collapsed}
                          onChange={() => setCollapsed((p) => !p)}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                    <div className="setting-row">
                      <div>
                        <div className="setting-label">Animated transitions</div>
                        <div className="setting-sub">Enable card and page animations</div>
                      </div>
                      <label className="toggle-wrap">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* ACCOUNT */}
              {activeSection === "account" && (
                <div className="panel card-enter" style={{ animationDelay: "60ms" }}>
                  <div className="panel-header">
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: "#eef2ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <User style={{ width: 14, height: 14, color: "#6366f1" }} />
                    </div>
                    <div>
                      <div className="panel-title">Account Information</div>
                      <div className="panel-desc">Manage your profile details</div>
                    </div>
                  </div>

                  {/* Avatar row */}
                  <div
                    style={{
                      padding: "20px 22px",
                      borderBottom: "1px solid #f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 14,
                        background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                        boxShadow: "0 4px 14px rgba(79,70,229,.25)",
                      }}
                    >
                      T
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#0f172a",
                          marginBottom: 2,
                        }}
                      >
                        Teacher
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#94a3b8",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        teacher@school.edu
                      </p>
                    </div>
                    <button
                      style={{
                        marginLeft: "auto",
                        padding: "7px 14px",
                        borderRadius: 8,
                        border: "1px solid #e8ecf4",
                        background: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#475569",
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Change photo
                    </button>
                  </div>

                  {[
                    { label: "Full name", value: "Teacher", sub: "Displayed across the portal" },
                    { label: "Email address", value: "teacher@school.edu", sub: "Used for login and notifications" },
                    { label: "Employee ID", value: "TCH-00421", sub: "Assigned by administrator" },
                  ].map((f) => (
                    <div key={f.label} className="setting-row">
                      <div>
                        <div className="setting-label">{f.label}</div>
                        <div className="setting-sub">{f.sub}</div>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#475569",
                          background: "#f8fafc",
                          border: "1px solid #e8ecf4",
                          borderRadius: 8,
                          padding: "6px 12px",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {f.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeSection === "notifications" && (
                <>
                  <div className="panel card-enter" style={{ animationDelay: "60ms" }}>
                    <div className="panel-header">
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: "#fff7ed",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Bell style={{ width: 14, height: 14, color: "#ea580c" }} />
                      </div>
                      <div>
                        <div className="panel-title">Notification Channels</div>
                        <div className="panel-desc">Choose how you want to be notified</div>
                      </div>
                    </div>

                    {(
                      [
                        { key: "email", label: "Email notifications", sub: "Receive updates via email" },
                        { key: "push", label: "Push notifications", sub: "Browser push alerts" },
                        { key: "sms", label: "SMS notifications", sub: "Text message alerts" },
                      ] as const
                    ).map((n) => (
                      <div key={n.key} className="setting-row">
                        <div>
                          <div className="setting-label">{n.label}</div>
                          <div className="setting-sub">{n.sub}</div>
                        </div>
                        <label className="toggle-wrap">
                          <input
                            type="checkbox"
                            checked={notifications[n.key]}
                            onChange={() =>
                              setNotifications((p) => ({ ...p, [n.key]: !p[n.key] }))
                            }
                          />
                          <span className="toggle-slider" />
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="panel card-enter" style={{ animationDelay: "100ms" }}>
                    <div className="panel-header">
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: "#f0fdf4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Bell style={{ width: 14, height: 14, color: "#16a34a" }} />
                      </div>
                      <div>
                        <div className="panel-title">Alert Types</div>
                        <div className="panel-desc">Pick which events trigger a notification</div>
                      </div>
                    </div>

                    {(
                      [
                        { key: "newStudent", label: "New student enrolled", sub: "When a student joins your class" },
                        { key: "assessmentDue", label: "Assessment due reminder", sub: "48 hours before an assessment deadline" },
                        { key: "attendanceAlert", label: "Low attendance alert", sub: "When class attendance drops below 80%" },
                      ] as const
                    ).map((n) => (
                      <div key={n.key} className="setting-row">
                        <div>
                          <div className="setting-label">{n.label}</div>
                          <div className="setting-sub">{n.sub}</div>
                        </div>
                        <label className="toggle-wrap">
                          <input
                            type="checkbox"
                            checked={notifications[n.key]}
                            onChange={() =>
                              setNotifications((p) => ({ ...p, [n.key]: !p[n.key] }))
                            }
                          />
                          <span className="toggle-slider" />
                        </label>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* PRIVACY */}
              {activeSection === "privacy" && (
                <div className="panel card-enter" style={{ animationDelay: "60ms" }}>
                  <div className="panel-header">
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: "#fef2f2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Shield style={{ width: 14, height: 14, color: "#dc2626" }} />
                    </div>
                    <div>
                      <div className="panel-title">Privacy & Security</div>
                      <div className="panel-desc">Control your account security settings</div>
                    </div>
                  </div>

                  {[
                    { label: "Two-factor authentication", sub: "Add an extra layer of login security", on: false },
                    { label: "Login activity alerts", sub: "Get notified of new sign-ins", on: true },
                    { label: "Profile visibility", sub: "Allow students to view your profile", on: true },
                  ].map((s) => (
                    <div key={s.label} className="setting-row">
                      <div>
                        <div className="setting-label">{s.label}</div>
                        <div className="setting-sub">{s.sub}</div>
                      </div>
                      <label className="toggle-wrap">
                        <input type="checkbox" defaultChecked={s.on} />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  ))}

                  <div style={{ padding: "16px 22px" }}>
                    <button
                      style={{
                        width: "100%",
                        padding: "11px",
                        borderRadius: 10,
                        border: "1px solid #fecaca",
                        background: "#fef2f2",
                        color: "#dc2626",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        transition: "background 0.15s",
                      }}
                    >
                      Change password
                    </button>
                  </div>
                </div>
              )}

              {/* LANGUAGE */}
              {activeSection === "language" && (
                <div className="panel card-enter" style={{ animationDelay: "60ms" }}>
                  <div className="panel-header">
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: "#f0fdf4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Globe style={{ width: 14, height: 14, color: "#16a34a" }} />
                    </div>
                    <div>
                      <div className="panel-title">Language & Region</div>
                      <div className="panel-desc">Select your preferred language</div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "16px 22px",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                      gap: 10,
                    }}
                  >
                    {[
                      { code: "en", name: "English", flag: "🇺🇸" },
                      { code: "ur", name: "Urdu", flag: "🇵🇰" },
                      { code: "ar", name: "Arabic", flag: "🇸🇦" },
                      { code: "fr", name: "French", flag: "🇫🇷" },
                      { code: "es", name: "Spanish", flag: "🇪🇸" },
                      { code: "zh", name: "Chinese", flag: "🇨🇳" },
                    ].map((l) => (
                      <div
                        key={l.code}
                        className={`lang-option${language === l.code ? " selected" : ""}`}
                        onClick={() => setLanguage(l.code)}
                      >
                        <span className="lang-flag">{l.flag}</span>
                        <div>
                          <div className="lang-name">{l.name}</div>
                          <div className="lang-code">{l.code.toUpperCase()}</div>
                        </div>
                        {language === l.code && (
                          <div className="lang-check">
                            <Check style={{ width: 10, height: 10, color: "#fff" }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}