"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  Users,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { ChangePasswordDialog } from "@/components/teacher-portal/change-passworddilogue";

export default function TeacherPortalSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("teacherId");
    setTeacherId(id);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("teacherId");
    router.replace("/login");
  };

  const teacherNav = [
    {
      title: "Dashboard",
      href: `/teacherportal/dashboard/${teacherId}`,
      icon: LayoutDashboard,
    },
    {
      title: "Attendance",
      href: `/teacherportal/attendence/${teacherId}`,
      icon: BookOpen,
    },
    {
      title: "Assesments",
      href: `/teacherportal/Assignments/${teacherId}`,
      icon: BookOpen,
    },
    teacherId && {
      title: "Classes",
      href: `/teacherportal/teacherclass/${teacherId}`,
      icon: BookOpen,
    },
    {
      title: "Grading",
      href: "/teacherportal/grading",
      icon: Users,
    },
    {
      title: "Settings",
      href: "/teacherportal/settings",
      icon: Settings,
    },
  ].filter(Boolean) as {
    title: string;
    href: string;
    icon: any;
  }[];

  return (
    <>
      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={openChangePassword}
        onOpenChange={setOpenChangePassword}
      />

      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-sky-500 text-white"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sky-500 text-white transition-all flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
          isCollapsed ? "md:w-16" : "md:w-64"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/20 px-4">
          {!isCollapsed && <span className="font-bold">Teacher Portal</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex"
          >
            {isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          {teacherNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-white",
                    isActive && "bg-white/20"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && item.title}
                </Button>
              </Link>
            );
          })}
        </ScrollArea>

        <Separator className="bg-white/20" />

        {/* Profile (STICKS TO BOTTOM) */}
        <div className="mt-auto p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage />
                  <AvatarFallback>TP</AvatarFallback>
                </Avatar>

                {!isCollapsed && (
                  <>
                    <div className="flex flex-col text-sm">
                      <span className="font-medium">Teacher User</span>
                      <span className="text-xs">teacher@example.com</span>
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
                Change Password
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
