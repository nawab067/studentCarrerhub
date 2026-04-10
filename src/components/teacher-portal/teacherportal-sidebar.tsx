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
}: SidebarProps)  {
  const router = useRouter();
  const pathname = usePathname();

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const[email, setEmail] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teacherName, setTeacherName] = useState("");

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

  async function get_name_of_teacher_Buy_userId(){
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/classes/teacher/user/${teacherId}`);
      console.log(response.data);
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

  async function get_email_of_teacher_Buy_userId(){
    try {
      setLoading(true);
      const response=  await axios.get(`http://127.0.0.1:8000/classes/teacher/email/${teacherId}`);
      console.log(response.data);
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

  const NavItem = ({ item }: { item: typeof teacherNav[0] }) => {
    const Icon = item.icon;
    const isActive = pathname.startsWith(item.href);

    const buttonContent = (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 h-11 transition-all duration-200 text-white",
          collapsed ? "md:w-16" : "md:w-64",
          isActive
            ? "bg-white/20 hover:bg-white/30 shadow-sm"
            : "hover:bg-white/10"
        )}
      >
        <Icon className={cn("h-5 w-5 flex-shrink-0")} />
        {!collapsed && (
          <>
            <span className="flex-1 text-left font-medium">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Button>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={item.href}>{buttonContent}</Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.title}
            {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
          </TooltipContent>
        </Tooltip>
      );
    }

    return <Link href={item.href}>{buttonContent}</Link>;
  };

  return (
    <TooltipProvider delayDuration={0}>
      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={openChangePassword}
        onOpenChange={setOpenChangePassword}
      />

      {/* Mobile Toggle */}
      <Button
        variant="default"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sky-500 text-white transition-all flex flex-col shadow-sm",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
          collapsed ? "md:w-16" : "md:w-64"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex h-16 items-center border-b border-white/20 px-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-white">Teacher Portal</span>
            </div>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:flex h-8 w-8 text-white hover:bg-white/20"
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1">
            {teacherNav.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </nav>
        </ScrollArea>

        <Separator className="bg-white/20" />

        {/* Profile Section */}
        <div className="p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full h-auto transition-all duration-200 hover:bg-white/10 text-white",
                  collapsed ? "p-2" : "p-3"
                )}
              >
                <div className={cn(
                  "flex items-center gap-3 w-full",
                  collapsed && "justify-center"
                )}>
                  <Avatar className="h-9 w-9 border-2 border-white/30">
                    <AvatarImage src="" alt="Teacher" />
                    <AvatarFallback className="bg-white/20 text-white font-semibold">
                      TP
                    </AvatarFallback>
                  </Avatar>

                  {!collapsed && (
                    <div className="flex flex-col flex-1 text-left">
                      <span className="text-sm font-medium">{teacherName}</span>
                      <span className="text-xs text-white/70 truncate">
                        {email}
                      </span>
                    </div>
                  )}

                  {!isCollapsed && (
                    <ChevronDown className="h-4 w-4 text-white/70 flex-shrink-0" />
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
              align="end" 
              className="w-56"
              side={collapsed ? "right" : "top"}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Teacher User</p>
                  <p className="text-xs text-muted-foreground">
                    
                  </p>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />

              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={handleseeprofile}
              >
                <UserCircle className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => setOpenChangePassword(true)}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Change Password
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={handleLogout}
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
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </TooltipProvider>
  );
}