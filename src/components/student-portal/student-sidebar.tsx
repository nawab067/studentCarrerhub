"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChangePasswordDialog } from "@/components/student-portal/change-password";
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
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function StudentPortalSidebar({
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [studentId, setStudentId] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState<string>("");

  useEffect(() => {
  setStudentId(localStorage.getItem("studentId"));
}, []);


  const handleLogout = () => {
  localStorage.removeItem("studentId");
  router.replace("/login");
};


  const studentNav = [
    { title: "Dashboard", href: "/studentPortal/dashboard", icon: LayoutDashboard },
    { title: "Time Table", href: `/studentPortal/classes/${studentId}`, icon: BookOpen },
    { title: "Attendance", href: `/studentPortal/attendance/${studentId}`, icon: ClipboardList },
    { title: "Assignments", href: `/studentPortal/Assignments/${studentId}`, icon: ClipboardList },
    { title: "Grades", href: `/studentPortal/grades/${studentId}`, icon: GraduationCap },
    { title: "Settings", href: "/studentPortal/settings", icon: Settings },
  ];

  async function get_student_name_By_userId() {
  if (!studentId) return;

  try {
    setLoading(true);
    const response = await axios.get(
      `http://127.0.0.1:8000/classes/student/user/${studentId}`
    );

    setStudentName(response.data.name);
  } catch (error) {
    console.error("Error fetching student name:", error);
  } finally {
    setLoading(false);
  }
}
useEffect(() => {
  get_student_name_By_userId();
}, [studentId]);

async function get_Student_email_Byuserid() {
  if (!studentId) return;
  try {
    setLoading(true);
    const response = await axios.get(`http://127.0.0.1:8000/classes/student/email/${studentId}`);
    setUserEmail(response.data.email);
  } catch (error) {
    console.error("Error fetching student email:", error);
  } finally {
    setLoading(false);
  }
  
}

useEffect(() => {
  get_Student_email_Byuserid();
}, [studentId]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-emerald-900 text-white"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside
  className={cn(
    "fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white transition-all flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
          collapsed ? "md:w-16" : "md:w-64"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-emerald-700 px-4">
          {!collapsed && <span className="font-bold">Student Portal</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex text-white"
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          {studentNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-white hover:bg-indigo-700b ",
                    isActive && "bg-indigo-700"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {!collapsed && item.title}
                </Button>
              </Link>
            );
          })}
        </ScrollArea>

        <Separator className="bg-indigo-700" />

        {/* Profile / Login Section */}
        <div className="mt-auto p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 hover:bg-indigo-700b"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage />
                  <AvatarFallback>SP</AvatarFallback>
                </Avatar>

                {!collapsed && (
                  <>
                    <div className="flex flex-col text-sm">
                      <span className="font-medium">{studentName}</span>
                      <span className="text-xs text-emerald-200">
                        {userEmail || "student@example.com"}

                      </span>
                    </div>
                    <ChevronDown className="ml-auto h-4 w-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setOpenChangePassword(true)}>
                <Settings className="mr-2 h-4 w-4" />
                Change Password
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={openChangePassword}
        onOpenChange={setOpenChangePassword}
      />
    </>
  );
}
