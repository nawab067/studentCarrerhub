'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { SlotData } from "@/components/admin/TeacherTimeTable";
import {
  Clock,
  DoorOpen,
  GraduationCap,
  AlertCircle,
  CalendarDays,
  LayoutGrid,
  List,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DAY_CONFIG: Record<
  string,
  { short: string; accent: string; bg: string; border: string; badge: string; dot: string }
> = {
  Monday:    { short: "Mon", accent: "text-sky-600 dark:text-sky-400",         bg: "bg-sky-50 dark:bg-sky-950/40",         border: "border-sky-200 dark:border-sky-800",         badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300",               dot: "bg-sky-500"     },
  Tuesday:   { short: "Tue", accent: "text-violet-600 dark:text-violet-400",   bg: "bg-violet-50 dark:bg-violet-950/40",   border: "border-violet-200 dark:border-violet-800",   badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300",   dot: "bg-violet-500"  },
  Wednesday: { short: "Wed", accent: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-800", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300", dot: "bg-emerald-500" },
  Thursday:  { short: "Thu", accent: "text-amber-600 dark:text-amber-400",     bg: "bg-amber-50 dark:bg-amber-950/40",     border: "border-amber-200 dark:border-amber-800",     badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",       dot: "bg-amber-500"   },
  Friday:    { short: "Fri", accent: "text-rose-600 dark:text-rose-400",       bg: "bg-rose-50 dark:bg-rose-950/40",       border: "border-rose-200 dark:border-rose-800",       badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",           dot: "bg-rose-500"    },
  Saturday:  { short: "Sat", accent: "text-orange-600 dark:text-orange-400",   bg: "bg-orange-50 dark:bg-orange-950/40",   border: "border-orange-200 dark:border-orange-800",   badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",   dot: "bg-orange-500"  },
  Sunday:    { short: "Sun", accent: "text-pink-600 dark:text-pink-400",       bg: "bg-pink-50 dark:bg-pink-950/40",       border: "border-pink-200 dark:border-pink-800",       badge: "bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300",           dot: "bg-pink-500"    },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatChip({ icon, label, value, accent }: {
  icon: React.ReactNode; label: string; value: number; accent: string;
}) {
  return (
    <div className={cn(
      "flex items-center gap-2.5 sm:gap-3 rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-900 shadow-sm",
      accent
    )}>
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">{label}</p>
        <p className="text-lg sm:text-xl font-bold leading-tight tabular-nums">{value}</p>
      </div>
    </div>
  );
}

const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

function ClassroomName({ id }: { id: string }) {
  const [name, setName] = useState<string>("…");
  useEffect(() => {
    axios
      .get(`${baseurl}/classes/classroom/${id}`)
      .then((r) => setName(r.data.classroom_name ?? "Unknown"))
      .catch(() => setName("Unknown"));
  }, [id]);
  return <>{name}</>;
}

function SlotCard({ slot, periodNumber, onClick }: {
  slot: SlotData; periodNumber: number; onClick: () => void;
}) {
  const cfg = DAY_CONFIG[slot.day] ?? DAY_CONFIG["Monday"];
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-xl border p-3 cursor-pointer transition-all duration-200",
        // On mobile: active state instead of hover for better touch UX
        "hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] active:shadow-sm",
        cfg.bg, cfg.border
      )}
    >
      <span className={cn("absolute top-2.5 right-2.5 h-2 w-2 rounded-full", cfg.dot)} />

      <span className={cn(
        "inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md mb-2",
        cfg.badge
      )}>
        P{periodNumber}
      </span>

      <div className="flex items-center gap-1 mb-2">
        <Clock className={cn("h-3 w-3 shrink-0", cfg.accent)} />
        <span className={cn("text-[11px] font-semibold tabular-nums", cfg.accent)}>
          {slot.start_time} – {slot.end_time}
        </span>
      </div>

      <div className="flex items-center gap-1.5 mb-1">
        <div className="p-1 rounded-full bg-white/70 dark:bg-white/10">
          <DoorOpen className="h-3 w-3 text-gray-500 dark:text-gray-400" />
        </div>
        <span className="text-[12px] font-semibold text-gray-800 dark:text-gray-100 truncate leading-tight">
          <ClassroomName id={slot.classroom_id} />
        </span>
      </div>

      {slot.roomno && (
        <div className="flex items-center gap-1.5 mb-1">
          <div className="p-1 rounded-full bg-white/70 dark:bg-white/10">
            <DoorOpen className="h-3 w-3 text-gray-400" />
          </div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">Rm {slot.roomno}</span>
        </div>
      )}

      {slot.date && (
        <div className="flex items-center gap-1 mt-1">
          <CalendarDays className={cn("h-3 w-3 shrink-0", cfg.accent)} />
          <span className="text-[10px] text-muted-foreground">{slot.date}</span>
        </div>
      )}
    </div>
  );
}

function SlotRow({ slot, periodNumber }: { slot: SlotData; periodNumber: number }) {
  const cfg = DAY_CONFIG[slot.day] ?? DAY_CONFIG["Monday"];
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-muted/40 active:bg-muted/60 transition-colors">
      <Badge variant="secondary" className={cn("shrink-0 font-semibold text-xs px-2 sm:px-2.5", cfg.badge)}>
        {slot.day}
      </Badge>
      <Badge variant="outline" className="text-xs shrink-0">P{periodNumber}</Badge>
      <div className="flex items-center gap-1 sm:gap-1.5 min-w-[110px] sm:min-w-[130px]">
        <Clock className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs sm:text-sm font-medium tabular-nums">{slot.start_time} – {slot.end_time}</span>
      </div>
      <div className="flex items-center gap-1 sm:gap-1.5 min-w-[120px] sm:min-w-[140px]">
        <DoorOpen className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs sm:text-sm font-medium truncate"><ClassroomName id={slot.classroom_id} /></span>
      </div>
      {slot.roomno && (
        <Badge variant="outline" className="text-xs shrink-0">Rm {slot.roomno}</Badge>
      )}
      {slot.date && (
        <span className="text-xs text-muted-foreground shrink-0">{slot.date}</span>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TimetablePage() {
  const [teacherId, setTeacherId]       = useState<string | null>(null);
  const [timeslots, setTimeslots]       = useState<SlotData[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [viewMode, setViewMode]         = useState<"grid" | "list">("grid");
  const [activeDay, setActiveDay]       = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null);
  const [sheetOpen, setSheetOpen]       = useState(false);
  const [collapsed, setCollapsed]       = useState(false);

  const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = localStorage.getItem("teacherId");
    if (!id) { setError("Teacher not logged in"); setLoading(false); return; }
    setTeacherId(id);
  }, []);

  useEffect(() => {
    if (!teacherId) return;
    setLoading(true);
    axios
      .get<SlotData[]>(`${baseurl}/teacher_time_table/${teacherId}`)
      .then((r) => setTimeslots(r.data))
      .catch(() => setError("Error fetching the timetable"))
      .finally(() => setLoading(false));
  }, [teacherId]);

  const slotsByDay  = (day: string) =>
    timeslots.filter((s) => s.day === day).sort((a, b) => a.start_time.localeCompare(b.start_time));
  const activeDays  = DAYS.filter((d) => slotsByDay(d).length > 0);
  const visibleDays = activeDay ? [activeDay] : DAYS;
  const isToday     = (day: string) =>
    new Date().toLocaleDateString("en-US", { weekday: "long" }) === day;

  return (
    /*
     * RESPONSIVE LAYOUT STRATEGY
     * ──────────────────────────
     * Mobile  (<768px):  sidebar hidden/overlay, no left margin, full-width content
     * Tablet  (768-1024px): sidebar collapsed (icon-only, w-16), ml-16
     * Desktop (>1024px): sidebar expanded/collapsed based on state
     *
     * The sidebar is position:fixed, so we use margin-left on main to offset.
     * On mobile we use ml-0 since the sidebar either overlays or is hidden.
     */
    <div className="min-h-screen bg-[#f8f8fc] dark:bg-[#0d0d12]">
      {/* Sidebar — renders fixed internally */}
      <TeacherPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className={cn(
          "transition-all duration-300 min-h-screen",
          // Mobile: no offset (sidebar overlays)
          // md+: offset by sidebar width
          collapsed
            ? "ml-0 md:ml-16"
            : "ml-0 md:ml-64"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-5 md:space-y-7">

          {/* ── Header ── */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1 sm:space-y-1.5">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="p-1.5 sm:p-2 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900">
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Weekly Timetable
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground pl-9 sm:pl-[2.75rem]">
                Your complete teaching schedule for the week
              </p>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <TooltipProvider delayDuration={200}>
                <div className="flex items-center rounded-lg border bg-white dark:bg-gray-900 p-1 shadow-sm gap-0.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="icon"
                        className={cn(
                          "h-7 w-7 rounded-md",
                          viewMode === "grid" && "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                        )}
                        onClick={() => setViewMode("grid")}
                      >
                        <LayoutGrid className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Grid view</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="icon"
                        className={cn(
                          "h-7 w-7 rounded-md",
                          viewMode === "list" && "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                        )}
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>List view</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>

          {/* ── Stats ── */}
          {/* Mobile: 3-col compact, sm+: 3-col normal */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <StatChip
              icon={<CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />}
              label="Total Periods"
              value={timeslots.length}
              accent="border-indigo-100 dark:border-indigo-900/50"
            />
            <StatChip
              icon={<DoorOpen className="h-4 w-4 sm:h-5 sm:w-5 text-violet-500" />}
              label="Classrooms"
              value={new Set(timeslots.map((s) => s.classroom_id)).size}
              accent="border-violet-100 dark:border-violet-900/50"
            />
            <StatChip
              icon={<CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />}
              label="Active Days"
              value={activeDays.length}
              accent="border-amber-100 dark:border-amber-900/50"
            />
          </div>

          {/* ── Day filter pills ── */}
          {!loading && timeslots.length > 0 && (
            // Scrollable horizontally on mobile so pills never wrap awkwardly
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-3 sm:mx-0 px-3 sm:px-0 scrollbar-none flex-nowrap sm:flex-wrap">
              <button
                onClick={() => setActiveDay(null)}
                className={cn(
                  "whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 shrink-0",
                  activeDay === null
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white dark:bg-gray-900 text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:text-indigo-600"
                )}
              >
                All Days
              </button>
              {DAYS.map((d) => {
                const cfg   = DAY_CONFIG[d];
                const count = slotsByDay(d).length;
                if (count === 0) return null;
                return (
                  <button
                    key={d}
                    onClick={() => setActiveDay(activeDay === d ? null : d)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 shrink-0 whitespace-nowrap",
                      activeDay === d
                        ? cn(cfg.badge, "border-current shadow-sm scale-105")
                        : cn(
                            "bg-white dark:bg-gray-900 text-muted-foreground border-gray-200 dark:border-gray-700",
                            cfg.accent
                          )
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                    {cfg.short}
                    <span className="ml-0.5 opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Loading ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-4">
              <div className="relative">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900" />
                <Loader2 className="h-14 w-14 sm:h-16 sm:w-16 animate-spin text-indigo-600 absolute inset-0" />
              </div>
              <p className="text-sm text-muted-foreground animate-pulse">Loading schedule…</p>
            </div>
          )}

          {/* ── Error ── */}
          {error && !loading && (
            <Alert variant="destructive" className="border-2">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="font-medium ml-2">{error}</AlertDescription>
            </Alert>
          )}

          {/* ── Empty ── */}
          {!loading && !error && timeslots.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-4 sm:gap-5">
              <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50">
                <CalendarDays className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-400" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base sm:text-lg font-semibold">No schedule yet</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
                  You don't have any scheduled classes yet. Contact the administrator
                  if this seems incorrect.
                </p>
              </div>
            </div>
          )}

          {/* ── Main content ── */}
          {!loading && !error && timeslots.length > 0 && (
            viewMode === "grid" ? (
              /* ─── GRID ───
               * Mobile:  1 col (full width, day headers + cards stack vertically)
               * sm:      2 col
               * lg:      3 col
               * xl:      4 col
               * 2xl:     5 col
               */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                {visibleDays.map((day) => {
                  const daySlots = slotsByDay(day);
                  const cfg      = DAY_CONFIG[day];
                  const today    = isToday(day);

                  return (
                    <div key={day} className="flex flex-col gap-2">
                      {/* Day header */}
                      <div className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl border",
                        cfg.bg, cfg.border
                      )}>
                        <div className="flex items-center gap-2">
                          <span className={cn("h-2 w-2 rounded-full", cfg.dot)} />
                          <span className={cn("text-sm font-bold", cfg.accent)}>{day}</span>
                          {today && (
                            <Badge className="h-4 px-1.5 text-[10px] bg-indigo-600 text-white border-0">
                              Today
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground font-medium tabular-nums">
                          {daySlots.length} {daySlots.length === 1 ? "period" : "periods"}
                        </span>
                      </div>

                      {/* Slot cards or empty */}
                      {daySlots.length === 0 ? (
                        <div className="flex items-center justify-center py-5 sm:py-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-muted-foreground">
                          <span className="text-xs">No classes</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {daySlots.map((slot, i) => (
                            <SlotCard
                              key={`${slot.day}-${slot.start_time}-${i}`}
                              slot={slot}
                              periodNumber={i + 1}
                              onClick={() => { setSelectedSlot(slot); setSheetOpen(true); }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ─── LIST ─── */
              <Card className="shadow-sm border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {visibleDays.map((day) => {
                    const daySlots = slotsByDay(day);
                    if (daySlots.length === 0) return null;
                    const cfg = DAY_CONFIG[day];
                    return (
                      <div key={day}>
                        <div className={cn("flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5", cfg.bg)}>
                          <span className={cn("h-2 w-2 rounded-full shrink-0", cfg.dot)} />
                          <span className={cn("text-xs font-bold uppercase tracking-wider", cfg.accent)}>
                            {day}
                          </span>
                          <Separator className="flex-1 opacity-40" />
                          <span className="text-xs text-muted-foreground">
                            {daySlots.length} period{daySlots.length > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="px-1 sm:px-2 py-1 space-y-0.5">
                          {daySlots.map((slot, i) => (
                            <SlotRow
                              key={`${slot.day}-${slot.start_time}-${i}`}
                              slot={slot}
                              periodNumber={i + 1}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )
          )}

        </div>
      </main>

      {/* ── Detail Sheet ──
       * Mobile:  full-width bottom sheet (side="bottom") for better thumb reach
       * sm+:     right-side panel
       * We detect screen size and swap the `side` prop accordingly.
       */}
      <ResponsiveSheet open={sheetOpen} onOpenChange={setSheetOpen}>
        {selectedSlot && (() => {
          const cfg = DAY_CONFIG[selectedSlot.day] ?? DAY_CONFIG["Monday"];
          return (
            <>
              <SheetHeader className="pb-3 sm:pb-4">
                <div className={cn(
                  "inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold mb-2",
                  cfg.badge
                )}>
                  <span className={cn("h-2 w-2 rounded-full", cfg.dot)} />
                  {selectedSlot.day}
                </div>
                <SheetTitle className="text-lg sm:text-xl">Period Details</SheetTitle>
                <SheetDescription>Full information for this time slot</SheetDescription>
              </SheetHeader>

              <div className="space-y-3 sm:space-y-4 mt-2">
                {[
                  {
                    label: "Time",
                    icon:  <Clock className="h-4 w-4" />,
                    value: `${selectedSlot.start_time} – ${selectedSlot.end_time}`,
                  },
                  {
                    label: "Classroom",
                    icon:  <DoorOpen className="h-4 w-4" />,
                    value: <ClassroomName id={selectedSlot.classroom_id} />,
                  },
                  ...(selectedSlot.roomno
                    ? [{ label: "Room No.", icon: <DoorOpen    className="h-4 w-4" />, value: selectedSlot.roomno }]
                    : []),
                  ...(selectedSlot.date
                    ? [{ label: "Date",     icon: <CalendarDays className="h-4 w-4" />, value: selectedSlot.date }]
                    : []),
                ].map(({ label, icon, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-1.5 rounded-md bg-background shadow-sm text-muted-foreground">
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </ResponsiveSheet>
    </div>
  );
}

// ─── Responsive Sheet helper ──────────────────────────────────────────────────
// Uses "bottom" on mobile (≤640px) and "right" on larger screens.

function ResponsiveSheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          isMobile
            ? "rounded-t-2xl max-h-[85vh] overflow-y-auto pb-safe"
            : "w-[360px] sm:w-[400px]"
        )}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}