"use client";
import { useEffect } from "react";
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
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  GraduationCap,
  ChevronDown,
  UserCircle,
  School,
  BookOpenCheck,
  LibraryBig,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  { 
    title: "Dashboard", 
    href: "/admin/dashboard", 
    icon: LayoutDashboard,
    badge: null
  },
  {
    title: "Teachers",
    icon: Users,
    children: [
      { title: "All Teachers", href: "/admin/teachers" },
      { title: "Time Table", href: "/admin/TeacherTimeTable" },
    ],
  },
  { 
    title: "Students", 
    href: "/admin/students", 
    icon: UserCircle,
  },
  { 
    title: "Classrooms", 
    href: "/admin/classroom", 
    icon: School,
  },
  { 
    title: "Subjects", 
    href: "/admin/subjects", 
    icon: BookOpenCheck,
  },
  { 
    title: "Courses", 
    href: "/admin/courses", 
    icon: LibraryBig,
  },
  { 
    title: "Settings", 
    href: "/admin/settings", 
    icon: Settings,
  },
];

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [adminId, setAdminId] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
   const [userEmail, setUserEmail] = useState<string | null>(null);
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
    setMounted(true);
  }, []);

 

    useEffect(() => {
  setAdminId(localStorage.getItem("adminId"));
  const storedEmail = localStorage.getItem("userEmail");
  console.log(storedEmail);
  if (storedEmail) {
    setUserEmail(storedEmail);
  }
}, []);

 if (!mounted) {
    return null;
  }
  

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden shadow-lg bg-background"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[72px]" : "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header with gradient background */}
          <div className={cn(
            "relative overflow-hidden border-b",
            isCollapsed ? "h-[72px]" : "h-20"
          )}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
            <div className={cn(
              "relative flex items-center justify-between h-full",
              isCollapsed ? "px-3" : "px-5"
            )}>
              {!isCollapsed ? (
                <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
                      <GraduationCap className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold tracking-tight">Student Career</span>
                    <span className="text-xs text-muted-foreground font-medium">Admin Portal</span>
                  </div>
                </Link>
              ) : (
                <Link href="/admin/dashboard" className="flex items-center justify-center w-full group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
                      <GraduationCap className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                </Link>
              )}

              {!isCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex h-9 w-9 rounded-lg hover:bg-primary/10"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Collapse button for collapsed state */}
          {isCollapsed && (
            <div className="flex justify-center py-3 border-b bg-muted/30">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg hover:bg-primary/10"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className={cn("flex flex-col", isCollapsed ? "px-2" : "px-3")}>
              {!isCollapsed && (
                <div className="px-3 py-2">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Navigation
                  </h2>
                </div>
              )}
              
              <div className="space-y-1">
                <TooltipProvider delayDuration={0}>
                  {navigationItems.map((item) => {
                    const Icon = item.icon;

                    if (item.children) {
                      return (
                        <Collapsible key={item.title} className="group/collapsible">
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-3 font-medium text-sm hover:bg-accent/50 rounded-lg transition-all",
                                isCollapsed && "justify-center px-2"
                              )}
                            >
                              <div className={cn(
                                "flex items-center justify-center rounded-md transition-colors",
                                isCollapsed ? "h-9 w-9" : "h-8 w-8"
                              )}>
                                <Icon className="h-[18px] w-[18px] shrink-0" />
                              </div>
                              {!isCollapsed && (
                                <>
                                  <span className="flex-1 text-left">{item.title}</span>
                                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                </>
                              )}
                            </Button>
                          </CollapsibleTrigger>

                          {!isCollapsed && (
                            <CollapsibleContent className="space-y-1 mt-1">
                              <div className="ml-4 pl-6 border-l-2 border-muted space-y-1">
                                {item.children.map((child) => {
                                  const isActive = pathname === child.href;
                                  return (
                                    <Button
                                      key={child.href}
                                      variant="ghost"
                                      className={cn(
                                        "w-full justify-start gap-2 font-normal text-sm hover:bg-accent/50 rounded-lg transition-all h-9",
                                        isActive && "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                                      )}
                                      asChild
                                    >
                                      <Link href={child.href}>
                                        <ChevronRight className={cn(
                                          "h-3.5 w-3.5 transition-transform",
                                          isActive && "translate-x-0.5"
                                        )} />
                                        <span>{child.title}</span>
                                        {isActive && (
                                          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                                        )}
                                      </Link>
                                    </Button>
                                  );
                                })}
                              </div>
                            </CollapsibleContent>
                          )}
                        </Collapsible>
                      );
                    }

                    const isActive = pathname === item.href;

                    const linkButton = (
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3 font-medium text-sm hover:bg-accent/50 rounded-lg transition-all relative group/item",
                          isActive && "bg-primary/10 text-primary hover:bg-primary/15",
                          isCollapsed && "justify-center px-2"
                        )}
                        asChild
                      >
                        <Link href={item.href}>
                          {isActive && !isCollapsed && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                          )}
                          <div className={cn(
                            "flex items-center justify-center rounded-md transition-colors",
                            isCollapsed ? "h-9 w-9" : "h-8 w-8",
                            isActive && "bg-primary/10"
                          )}>
                            <Icon className="h-[18px] w-[18px] shrink-0" />
                          </div>
                          {!isCollapsed && (
                            <span className="flex-1">{item.title}</span>
                          )}
                          {!isCollapsed && isActive && (
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                        </Link>
                      </Button>
                    );

                    return isCollapsed ? (
                      <Tooltip key={item.title}>
                        <TooltipTrigger asChild>{linkButton}</TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          <p>{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <div key={item.title}>{linkButton}</div>
                    );
                  })}
                </TooltipProvider>
              </div>
            </nav>
          </ScrollArea>

          <Separator />

          {/* User Profile Section with Dropdown */}
          <div className="border-t bg-muted/30 p-3">
            {isCollapsed ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-2 hover:bg-accent/50 rounded-lg"
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-background">
                      <AvatarImage src="/avatars/admin.png" alt="Admin" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-semibold">
                        AD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Admin User</p>
                      <p className="text-xs text-muted-foreground">admin@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => router.replace("/login")}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-3 justify-start hover:bg-accent/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="h-10 w-10 ring-2 ring-background">
                        <AvatarImage src="/avatars/admin.png" alt="Admin" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                          AD
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 min-w-0 text-left">
                        <span className="text-sm font-semibold truncate">Admin User</span>
                        <span className="text-xs text-muted-foreground truncate">
                              admin@example.com
                            </span>

                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => router.replace("/login")}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden animate-in fade-in-0"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}