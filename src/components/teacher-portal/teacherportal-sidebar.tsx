"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  ClipboardCheck,
  Calendar,
  GraduationCap,
  UserCircle,
  KeyRound,
} from "lucide-react";

import { ChangePasswordDialog } from "@/components/teacher-portal/change-passworddilogue";

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TeacherPortalSidebar({
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const id = localStorage.getItem("teacherId");
    setTeacherId(id);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("teacherId");
    router.replace("/login");
  };

  const handleseeprofile = () => {
    router.push(`/teacherportal/profile/${teacherId}`);
  };

  const teacherNav = [
    {
      title: "Dashboard",
      href: `/teacherportal/dashboard/${teacherId}`,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: "Attendance",
      href: `/teacherportal/attendence/${teacherId}`,
      icon: ClipboardCheck,
      badge: null,
    },
    {
      title: "Assessments",
      href: `/teacherportal/Assignments/${teacherId}`,
      icon: BookOpen,
      badge: null,
    },
    {
      title: "Time Table",
      href: `/teacherportal/Timetable/${teacherId}`,
      icon: Calendar,
      badge: null,
    },
    teacherId && {
      title: "Classes",
      href: `/teacherportal/teacherclass/${teacherId}`,
      icon: GraduationCap,
      badge: null,
    },
    {
      title: "Grading",
      href: `/teacherportal/grading/${teacherId}`,
      icon: Users,
      badge: null,
    },
    {
      title: "Settings",
      href: "/teacherportal/settings",
      icon: Settings,
      badge: null,
    },
  ].filter(Boolean) as {
    title: string;
    href: string;
    icon: any;
    badge: string | null;
  }[];

  async function get_name_of_teacher_Buy_userId() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseurl}/classes/teacher/user/${teacherId}`
      );
      setTeacherName(response.data.name);
    } catch (error) {
      console.error("Error fetching teacher name:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (teacherId) {
      get_name_of_teacher_Buy_userId();
    }
  }, [teacherId]);

  async function get_email_of_teacher_Buy_userId() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseurl}/classes/teacher/email/${teacherId}`
      );
      setEmail(response.data.email);
    } catch (error) {
      console.error("Error fetching teacher email:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (teacherId) {
      get_email_of_teacher_Buy_userId();
    }
  }, [teacherId]);

  const NavItem = ({ item }: { item: (typeof teacherNav)[0] }) => {
    const Icon = item.icon;
    const isActive = pathname.startsWith(item.href);

    const buttonContent = (
      <button
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: collapsed ? "10px 12px" : "10px 12px",
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: isActive ? 600 : 500,
          transition: "all 0.15s ease",
          justifyContent: collapsed ? "center" : "flex-start",
          background: isActive
            ? "rgba(255,255,255,0.15)"
            : "transparent",
          color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color = "#fff";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.7)";
          }
        }}
      >
        {/* Active left indicator */}
        {isActive && (
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: 3,
              height: 20,
              borderRadius: "0 3px 3px 0",
              background: "#fff",
            }}
          />
        )}

        {/* Icon */}
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: isActive
              ? "rgba(255,255,255,0.2)"
              : "rgba(255,255,255,0.06)",
            transition: "background 0.15s ease",
          }}
        >
          <Icon style={{ width: 15, height: 15 }} />
        </span>

        {!collapsed && (
          <>
            <span style={{ flex: 1, textAlign: "left" }}>{item.title}</span>
            {item.badge && (
              <span
                style={{
                  fontSize: 10,
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  padding: "2px 7px",
                  borderRadius: 999,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
      </button>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={item.href} style={{ textDecoration: "none" }}>
              {buttonContent}
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {item.title}
            {item.badge && (
              <Badge variant="secondary" style={{ marginLeft: 6 }}>
                {item.badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Link href={item.href} style={{ textDecoration: "none" }}>
        {buttonContent}
      </Link>
    );
  };

  // Initials from teacher name
  const initials = teacherName
    ? teacherName.slice(0, 2).toUpperCase()
    : "TP";

  return (
    <TooltipProvider delayDuration={0}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

        .sidebar-root {
          position: fixed;
          left: 0; top: 0;
          z-index: 40;
          height: 100vh;
          display: flex;
          flex-direction: column;
          transition: width 0.3s cubic-bezier(.22,.68,0,1.15), transform 0.3s ease;

          /* ── Indigo → Violet gradient matching the portal ── */
          background: linear-gradient(180deg, #3730a3 0%, #4f46e5 35%, #6d28d9 75%, #7c3aed 100%);
          box-shadow: 4px 0 24px rgba(79,70,229,0.18);
          font-family: 'DM Sans', sans-serif;
        }

        /* Subtle noise texture overlay */
        .sidebar-root::before {
          content: '';
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.3;
        }

        .sidebar-root > * { position: relative; z-index: 1; }

        .sidebar-header {
          display: flex;
          align-items: center;
          height: 64px;
          padding: 0 16px;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          flex-shrink: 0;
        }

        .sidebar-logo-icon {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .sidebar-logo-text {
          font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -0.3px;
        }
        .sidebar-logo-sub {
          font-size: 10px; color: rgba(255,255,255,0.55);
          font-family: 'DM Mono', monospace; margin-top: 1px;
        }

        .collapse-btn {
          margin-left: auto;
          width: 28px; height: 28px; border-radius: 7px;
          background: rgba(255,255,255,0.1); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.7);
          transition: background 0.15s ease, color 0.15s ease;
          flex-shrink: 0;
        }
        .collapse-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }

        .nav-section-label {
          font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.4);
          letter-spacing: 0.07em; text-transform: uppercase;
          padding: 0 12px; margin-bottom: 4px;
          font-family: 'DM Mono', monospace;
        }

        .sidebar-divider {
          height: 1px; background: rgba(255,255,255,0.1); margin: 8px 12px;
        }

        /* Profile footer */
        .profile-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 12px; width: 100%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          cursor: pointer;
          transition: background 0.15s ease;
          text-align: left;
        }
        .profile-btn:hover { background: rgba(255,255,255,0.14); }

        .profile-avatar {
          width: 34px; height: 34px; border-radius: 9px;
          background: rgba(255,255,255,0.2);
          border: 1.5px solid rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #fff;
          flex-shrink: 0; font-family: 'DM Mono', monospace;
          overflow: hidden;
        }

        .profile-name {
          font-size: 13px; font-weight: 600; color: #fff;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .profile-email {
          font-size: 10px; color: rgba(255,255,255,0.55);
          font-family: 'DM Mono', monospace;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .mobile-toggle {
          position: fixed; top: 14px; left: 14px; z-index: 50;
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          border: none; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          color: #fff; box-shadow: 0 4px 14px rgba(79,70,229,.35);
        }

        /* Dropdown overrides to match portal */
        .sidebar-dropdown-content {
          font-family: 'DM Sans', sans-serif;
          border-radius: 12px;
          border: 1px solid #e8ecf4;
          box-shadow: 0 16px 48px rgba(15,23,42,.12);
        }

        @media (max-width: 767px) {
          .sidebar-root { transform: translateX(-100%); }
          .sidebar-root.mobile-open { transform: translateX(0); }
          .collapse-btn { display: none; }
        }
        @media (min-width: 768px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>

      <ChangePasswordDialog
        open={openChangePassword}
        onOpenChange={setOpenChangePassword}
      />

      {/* Mobile toggle */}
      <button
        className="mobile-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X style={{ width: 18, height: 18 }} />
        ) : (
          <Menu style={{ width: 18, height: 18 }} />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar-root${isMobileOpen ? " mobile-open" : ""}`}
        style={{ width: collapsed ? 72 : 256 }}
      >
        {/* ── HEADER ── */}
        <div className="sidebar-header">
          {collapsed ? (
            <div className="sidebar-logo-icon" style={{ margin: "0 auto" }}>
              <GraduationCap style={{ width: 18, height: 18, color: "#fff" }} />
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="sidebar-logo-icon">
                  <GraduationCap style={{ width: 18, height: 18, color: "#fff" }} />
                </div>
                <div>
                  <div className="sidebar-logo-text">EduPortal</div>
                  <div className="sidebar-logo-sub">Teacher workspace</div>
                </div>
              </div>
            </>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="collapse-btn"
                onClick={() => setCollapsed(!collapsed)}
                style={{ marginLeft: collapsed ? "auto" : undefined }}
              >
                {collapsed ? (
                  <PanelLeftOpen style={{ width: 14, height: 14 }} />
                ) : (
                  <PanelLeftClose style={{ width: 14, height: 14 }} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* ── NAV ── */}
        <ScrollArea style={{ flex: 1, padding: "12px 10px 4px" }}>
          {!collapsed && (
            <p className="nav-section-label" style={{ marginBottom: 6 }}>
              Main menu
            </p>
          )}
          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {teacherNav.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </nav>
        </ScrollArea>

        {/* ── DIVIDER ── */}
        <div className="sidebar-divider" />

        {/* ── PROFILE FOOTER ── */}
        <div style={{ padding: "10px 10px 14px", flexShrink: 0 }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        padding: "8px 0",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <div className="profile-avatar">{initials}</div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p style={{ fontWeight: 600, fontSize: 12 }}>{teacherName || "Teacher"}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8" }}>{email}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button className="profile-btn">
                  <div className="profile-avatar">{initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="profile-name">
                      {teacherName || "Teacher"}
                    </div>
                    <div className="profile-email">{email || "Loading..."}</div>
                  </div>
                  <ChevronDown
                    style={{
                      width: 14,
                      height: 14,
                      color: "rgba(255,255,255,0.5)",
                      flexShrink: 0,
                    }}
                  />
                </button>
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side={collapsed ? "right" : "top"}
              sideOffset={8}
              style={{
                width: 220,
                fontFamily: "'DM Sans', sans-serif",
                borderRadius: 12,
                border: "1px solid #e8ecf4",
                boxShadow: "0 16px 48px rgba(15,23,42,.12)",
                padding: "6px",
              }}
            >
              <DropdownMenuLabel style={{ padding: "8px 10px 6px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    paddingBottom: 8,
                    borderBottom: "1px solid #f1f5f9",
                    marginBottom: 2,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background:
                        "linear-gradient(135deg,#4f46e5,#7c3aed)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#0f172a",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {teacherName || "Teacher"}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        fontFamily: "'DM Mono', monospace",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {email || "—"}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuItem
                onClick={handleseeprofile}
                style={{
                  cursor: "pointer",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  gap: 10,
                  padding: "9px 10px",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: "#eef2ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <UserCircle style={{ width: 14, height: 14, color: "#4f46e5" }} />
                </span>
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setOpenChangePassword(true)}
                style={{
                  cursor: "pointer",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  gap: 10,
                  padding: "9px 10px",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: "#faf5ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <KeyRound style={{ width: 14, height: 14, color: "#7c3aed" }} />
                </span>
                Change password
              </DropdownMenuItem>

              <DropdownMenuSeparator style={{ margin: "4px 0", background: "#f1f5f9" }} />

              <DropdownMenuItem
                onClick={handleLogout}
                style={{
                  cursor: "pointer",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  gap: 10,
                  padding: "9px 10px",
                  color: "#dc2626",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: "#fef2f2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <LogOut style={{ width: 14, height: 14, color: "#dc2626" }} />
                </span>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.5)",
            zIndex: 30,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </TooltipProvider>
  );
}