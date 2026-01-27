"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navigationItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    title: "Teacher",
    icon: Users,
    children: [
      { title: "All Teachers", href: "/admin/teachers" },
      { title: "Teacher Time Table", href: "/admin/TeacherTimeTable" },
    ],
  },
  { title: "Students", href: "/admin/students", icon: Users },
  { title: "Classrooms", href: "/admin/classroom", icon: Users },
  { title: "Subjects", href: "/admin/subjects", icon: BookOpen },
  { title: "Courses", href: "/admin/courses", icon: BookOpen },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen border-r bg-white transition-all duration-300",
          "flex flex-col", // ✅ CRITICAL FIX
          "md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "md:w-16" : "md:w-64 w-64"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                SC
              </div>
              <span className="font-bold text-lg">Student Career</span>
            </div>
          ) : (
            <div className="h-8 w-8 mx-auto rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              SC
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4 overflow-hidden">
          <TooltipProvider delayDuration={0}>
            <nav className="space-y-1 w-full">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                if (item.children) {
                  return (
                    <Collapsible key={item.title}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full flex items-center",
                            isCollapsed
                              ? "justify-center px-2"
                              : "justify-between"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5" />
                            {!isCollapsed && <span>{item.title}</span>}
                          </div>
                          {!isCollapsed && (
                            <ChevronRight className="h-4 w-4 shrink-0" />
                          )}
                        </Button>
                      </CollapsibleTrigger>

                      {!isCollapsed && (
                        <CollapsibleContent className="w-full pl-9 space-y-1 box-border">
                          {item.children.map((child) => {
                            const isActive = pathname === child.href;

                            return (
                              <Link key={child.href} href={child.href}>
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    "w-full justify-start text-sm",
                                    isActive &&
                                      "bg-primary/10 text-primary"
                                  )}
                                >
                                  {child.title}
                                </Button>
                              </Link>
                            );
                          })}
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  );
                }

                const isActive = pathname === item.href;

                const linkButton = (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full gap-3",
                        isCollapsed
                          ? "justify-center px-2"
                          : "justify-start"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Button>
                  </Link>
                );

                return isCollapsed ? (
                  <Tooltip key={item.title}>
                    <TooltipTrigger asChild>{linkButton}</TooltipTrigger>
                    <TooltipContent side="right">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  linkButton
                );
              })}
            </nav>
          </TooltipProvider>
        </ScrollArea>

        <Separator />

        {/* User */}
        {/* User */}


        {/* User */}
        <div className="p-4">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="text-left">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground">
                      admin@example.com
                    </p>
                  </div>
                )}
              </Button>
            </CollapsibleTrigger>

            {!isCollapsed && (
              <CollapsibleContent className="w-full mt-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-sm"
                  onClick={() => router.replace("/login")}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </CollapsibleContent>
            )}
          </Collapsible>
        </div>

      </aside>  

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
