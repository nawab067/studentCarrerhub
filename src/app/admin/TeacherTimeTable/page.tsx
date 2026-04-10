'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Trash2,
  Pencil,
  Plus,
  Clock,
  User,
  DoorOpen,
  CalendarDays,
  Loader2,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface TeacherTimeTableProps {
  _id: string;
  day: string;
  start_time: string;
  end_time: string;
  teacher_id: string;
  classroom_id: string;
  teacher_name?: string;
  classroom_name?: string;
  date?: string;
  roomno?: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_CONFIG: Record<string, { short: string; accent: string; bg: string; border: string; badge: string; dot: string }> = {
  Monday:    { short: 'Mon', accent: 'text-sky-600 dark:text-sky-400',    bg: 'bg-sky-50 dark:bg-sky-950/40',       border: 'border-sky-200 dark:border-sky-800',   badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300',    dot: 'bg-sky-500' },
  Tuesday:   { short: 'Tue', accent: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/40', border: 'border-violet-200 dark:border-violet-800', badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300', dot: 'bg-violet-500' },
  Wednesday: { short: 'Wed', accent: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300', dot: 'bg-emerald-500' },
  Thursday:  { short: 'Thu', accent: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-950/40',   border: 'border-amber-200 dark:border-amber-800',   badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',  dot: 'bg-amber-500' },
  Friday:    { short: 'Fri', accent: 'text-rose-600 dark:text-rose-400',    bg: 'bg-rose-50 dark:bg-rose-950/40',     border: 'border-rose-200 dark:border-rose-800',   badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',    dot: 'bg-rose-500' },
  Saturday:  { short: 'Sat', accent: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/40', border: 'border-orange-200 dark:border-orange-800', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300', dot: 'bg-orange-500' },
  Sunday:    { short: 'Sun', accent: 'text-pink-600 dark:text-pink-400',    bg: 'bg-pink-50 dark:bg-pink-950/40',     border: 'border-pink-200 dark:border-pink-800',   badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300',    dot: 'bg-pink-500' },
};

// Stat chip
function StatChip({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent: string }) {
  return (
    <div className={cn('flex items-center gap-3 rounded-xl border px-4 py-3 bg-white dark:bg-gray-900 shadow-sm', accent)}>
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>
        <p className="text-xl font-bold leading-tight tabular-nums">{value}</p>
      </div>
    </div>
  );
}

// Slot card in the weekly grid
function SlotCard({
  slot,
  onEdit,
  onDelete,
  onClick,
}: {
  slot: TeacherTimeTableProps;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  const cfg = DAY_CONFIG[slot.day] ?? DAY_CONFIG['Monday'];
  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          'group relative rounded-xl border p-3 cursor-pointer transition-all duration-200',
          'hover:shadow-md hover:-translate-y-0.5',
          cfg.bg, cfg.border
        )}
        onClick={onClick}
      >
        {/* Color dot */}
        <span className={cn('absolute top-2.5 right-2.5 h-2 w-2 rounded-full', cfg.dot)} />

        {/* Time */}
        <div className="flex items-center gap-1 mb-2">
          <Clock className={cn('h-3 w-3 shrink-0', cfg.accent)} />
          <span className={cn('text-[11px] font-semibold tabular-nums', cfg.accent)}>
            {slot.start_time} – {slot.end_time}
          </span>
        </div>

        {/* Teacher */}
        <div className="flex items-center gap-1.5 mb-1">
          <div className="p-1 rounded-full bg-white/70 dark:bg-white/10">
            <User className="h-3 w-3 text-gray-500 dark:text-gray-400" />
          </div>
          <span className="text-[12px] font-semibold text-gray-800 dark:text-gray-100 truncate leading-tight">
            {slot.teacher_name ?? 'Unknown'}
          </span>
        </div>

        {/* Classroom */}
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded-full bg-white/70 dark:bg-white/10">
            <DoorOpen className="h-3 w-3 text-gray-500 dark:text-gray-400" />
          </div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
            {slot.classroom_name ?? 'Unknown'}
            {slot.roomno ? ` · Rm ${slot.roomno}` : ''}
          </span>
        </div>

        {/* Action buttons — appear on hover */}
        <div
          className="absolute bottom-2 right-2 hidden group-hover:flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-lg bg-white/80 dark:bg-gray-800/80 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 shadow-sm"
                onClick={onEdit}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Edit</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-lg bg-white/80 dark:bg-gray-800/80 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 shadow-sm"
                onClick={onDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Delete</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

// List row
function SlotRow({
  slot,
  onEdit,
  onDelete,
}: {
  slot: TeacherTimeTableProps;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const cfg = DAY_CONFIG[slot.day] ?? DAY_CONFIG['Monday'];
  return (
    <div className="flex flex-wrap items-center gap-3 py-3 px-4 rounded-xl hover:bg-muted/40 transition-colors group">
      <Badge variant="secondary" className={cn('shrink-0 font-semibold text-xs px-2.5', cfg.badge)}>
        {slot.day}
      </Badge>
      <div className="flex items-center gap-1.5 min-w-[130px]">
        <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-sm font-medium tabular-nums">
          {slot.start_time} – {slot.end_time}
        </span>
      </div>
      <div className="flex items-center gap-1.5 min-w-[140px]">
        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-sm font-medium truncate">{slot.teacher_name}</span>
      </div>
      <div className="flex items-center gap-1.5 min-w-[120px]">
        <DoorOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-sm text-muted-foreground truncate">{slot.classroom_name}</span>
      </div>
      {slot.roomno && (
        <Badge variant="outline" className="text-xs shrink-0">Room {slot.roomno}</Badge>
      )}
      {slot.date && (
        <span className="text-xs text-muted-foreground shrink-0">{slot.date}</span>
      )}
      <div className="ml-auto hidden group-hover:flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="sm" onClick={onEdit}
          className="h-7 gap-1 text-xs hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950">
          <Pencil className="h-3 w-3" />Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}
          className="h-7 gap-1 text-xs hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950">
          <Trash2 className="h-3 w-3" />Delete
        </Button>
      </div>
    </div>
  );
}

export default function TeacherTimeTable() {
  const [loading, setLoading] = useState(false);
  const [teacherTimeTable, setTeacherTimeTable] = useState<TeacherTimeTableProps[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TeacherTimeTableProps | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  async function fetchTimetable() {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/all_time_slots`);
      const slots: TeacherTimeTableProps[] = response.data;

      const slotsWithNames = await Promise.all(
        slots.map(async (slot) => {
          let teacher_name = 'Unknown';
          let classroom_name = 'Unknown';
          try {
            const res = await axios.get(`${baseUrl}/classes/teacher/${slot.teacher_id}`);
            teacher_name = res.data.name || 'Unknown';
          } catch {}
          try {
            const res = await axios.get(`${baseUrl}/classes/classroom/${slot.classroom_id}`);
            classroom_name = res.data.classroom_name || 'Unknown';
          } catch {}
          return { ...slot, teacher_name, classroom_name };
        })
      );
      setTeacherTimeTable(slotsWithNames);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTimetable(); }, []);

  const handleDelete = async (slotId: string) => {
    try {
      await axios.delete(`${baseUrl}/delete_time_slot/${slotId}`);
      setTeacherTimeTable(prev => prev.filter(s => s._id !== slotId));
    } catch {
      alert('Failed to delete slot');
    } finally {
      setDeleteDialogOpen(false);
      setSlotToDelete(null);
    }
  };

  const openDeleteDialog = (slotId: string) => {
    setSlotToDelete(slotId);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (slot: TeacherTimeTableProps) => {
    router.push(`/admin/TeacherTimeTable/edit/${slot._id}`);
  };

  const handleAdd = () => router.push('/admin/TeacherTimeTable/add');

  const openSlotDetail = (slot: TeacherTimeTableProps) => {
    setSelectedSlot(slot);
    setSheetOpen(true);
  };

  const visibleDays = activeDay ? [activeDay] : DAYS;
  const slotsByDay = (day: string) => teacherTimeTable.filter(s => s.day === day);
  const activeDays = DAYS.filter(d => slotsByDay(d).length > 0);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f8fc] dark:bg-[#0d0d12]">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">

          {/* ── Header ── */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Weekly Schedule
                </h1>
              </div>
              <p className="text-sm text-muted-foreground pl-[2.75rem]">
                Manage and organise all teacher timetable slots
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center rounded-lg border bg-white dark:bg-gray-900 p-1 shadow-sm gap-0.5">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className={cn('h-7 w-7 rounded-md', viewMode === 'grid' && 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm')}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  className={cn('h-7 w-7 rounded-md', viewMode === 'list' && 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm')}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Button
                onClick={handleAdd}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900"
              >
                <Plus className="h-4 w-4" />
                Add Slot
              </Button>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatChip icon={<CalendarDays className="h-5 w-5 text-indigo-500" />} label="Total Slots" value={teacherTimeTable.length} accent="border-indigo-100 dark:border-indigo-900/50" />
            <StatChip icon={<User className="h-5 w-5 text-emerald-500" />} label="Teachers" value={new Set(teacherTimeTable.map(s => s.teacher_id)).size} accent="border-emerald-100 dark:border-emerald-900/50" />
            <StatChip icon={<DoorOpen className="h-5 w-5 text-violet-500" />} label="Classrooms" value={new Set(teacherTimeTable.map(s => s.classroom_id)).size} accent="border-violet-100 dark:border-violet-900/50" />
            <StatChip icon={<CalendarDays className="h-5 w-5 text-amber-500" />} label="Active Days" value={activeDays.length} accent="border-amber-100 dark:border-amber-900/50" />
          </div>

          {/* ── Day filter pills ── */}
          {!loading && teacherTimeTable.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveDay(null)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
                  activeDay === null
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-gray-900 text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:text-indigo-600'
                )}
              >
                All Days
              </button>
              {DAYS.map(d => {
                const cfg = DAY_CONFIG[d];
                const count = slotsByDay(d).length;
                if (count === 0) return null;
                return (
                  <button
                    key={d}
                    onClick={() => setActiveDay(activeDay === d ? null : d)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
                      activeDay === d
                        ? cn(cfg.badge, 'border-current shadow-sm scale-105')
                        : 'bg-white dark:bg-gray-900 text-muted-foreground border-gray-200 dark:border-gray-700 hover:border-current',
                      activeDay === d ? '' : cfg.accent
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} />
                    {cfg.short}
                    <span className="ml-0.5 opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Main Content ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900" />
                <Loader2 className="h-16 w-16 animate-spin text-indigo-600 absolute inset-0" />
              </div>
              <p className="text-sm text-muted-foreground animate-pulse">Loading schedule…</p>
            </div>
          ) : teacherTimeTable.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-5">
              <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50">
                <CalendarDays className="h-12 w-12 text-indigo-400" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold">No schedule yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Start building your weekly timetable by adding the first time slot.
                </p>
              </div>
              <Button onClick={handleAdd} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="h-4 w-4" />
                Add First Slot
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            /* ─── WEEKLY GRID VIEW ─── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {visibleDays.map(day => {
                const daySlots = slotsByDay(day);
                const cfg = DAY_CONFIG[day];
                const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;

                return (
                  <div key={day} className="flex flex-col gap-2">
                    <div className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-xl',
                      cfg.bg, cfg.border, 'border'
                    )}>
                      <div className="flex items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full', cfg.dot)} />
                        <span className={cn('text-sm font-bold', cfg.accent)}>{day}</span>
                        {isToday && (
                          <Badge className="h-4 px-1.5 text-[10px] bg-indigo-600 text-white border-0">Today</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground font-medium tabular-nums">
                        {daySlots.length} {daySlots.length === 1 ? 'slot' : 'slots'}
                      </span>
                    </div>

                    {daySlots.length === 0 ? (
                      <div className={cn(
                        'flex flex-col items-center justify-center py-6 rounded-xl border-2 border-dashed gap-2',
                        'border-gray-200 dark:border-gray-800 text-muted-foreground'
                      )}>
                        <span className="text-xs">No classes</span>
                        <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 hover:text-indigo-600" onClick={handleAdd}>
                          <Plus className="h-3 w-3" />Add
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {daySlots.map(slot => (
                          <SlotCard
                            key={slot._id}
                            slot={slot}
                            onEdit={() => handleEdit(slot)}
                            onDelete={() => openDeleteDialog(slot._id)}
                            onClick={() => openSlotDetail(slot)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* ─── LIST VIEW ─── */
            <Card className="shadow-sm border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {visibleDays.map(day => {
                  const daySlots = slotsByDay(day);
                  if (daySlots.length === 0) return null;
                  const cfg = DAY_CONFIG[day];
                  return (
                    <div key={day}>
                      <div className={cn('flex items-center gap-2 px-4 py-2.5', cfg.bg)}>
                        <span className={cn('h-2 w-2 rounded-full shrink-0', cfg.dot)} />
                        <span className={cn('text-xs font-bold uppercase tracking-wider', cfg.accent)}>{day}</span>
                        <Separator className="flex-1 opacity-40" />
                        <span className="text-xs text-muted-foreground">{daySlots.length} slot{daySlots.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="px-2 py-1 space-y-0.5">
                        {daySlots.map(slot => (
                          <SlotRow
                            key={slot._id}
                            slot={slot}
                            onEdit={() => handleEdit(slot)}
                            onDelete={() => openDeleteDialog(slot._id)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* ── Slot Detail Sheet ── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        {/*
          KEY FIX: SheetContent is now a flex column.
          - ScrollArea takes all available space (flex-1) so the detail rows scroll.
          - The Edit/Delete button row is pinned at the bottom (shrink-0) and is
            always visible regardless of how many detail rows are shown.
        */}
        <SheetContent side="right" className="w-[360px] sm:w-[400px] flex flex-col p-0">
          {selectedSlot && (() => {
            const cfg = DAY_CONFIG[selectedSlot.day] ?? DAY_CONFIG['Monday'];
            return (
              <>
                {/* Scrollable header + detail rows */}
                <ScrollArea className="flex-1 min-h-0">
                  <div className="px-6 pt-6 pb-2">
                    <SheetHeader className="pb-4">
                      <div className={cn('inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold mb-2', cfg.badge)}>
                        <span className={cn('h-2 w-2 rounded-full', cfg.dot)} />
                        {selectedSlot.day}
                      </div>
                      <SheetTitle className="text-xl">Slot Details</SheetTitle>
                      <SheetDescription>Full information for this time slot</SheetDescription>
                    </SheetHeader>

                    <div className="space-y-4 mt-2">
                      {[
                        { label: 'Time',      icon: <Clock className="h-4 w-4" />,      value: `${selectedSlot.start_time} – ${selectedSlot.end_time}` },
                        { label: 'Teacher',   icon: <User className="h-4 w-4" />,       value: selectedSlot.teacher_name ?? 'Unknown' },
                        { label: 'Classroom', icon: <DoorOpen className="h-4 w-4" />,   value: selectedSlot.classroom_name ?? 'Unknown' },
                        ...(selectedSlot.roomno ? [{ label: 'Room No.', icon: <DoorOpen className="h-4 w-4" />, value: selectedSlot.roomno }] : []),
                        ...(selectedSlot.date   ? [{ label: 'Date',     icon: <CalendarDays className="h-4 w-4" />, value: selectedSlot.date }] : []),
                      ].map(({ label, icon, value }) => (
                        <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <div className="p-1.5 rounded-md bg-background shadow-sm text-muted-foreground">{icon}</div>
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
                            <p className="text-sm font-semibold text-foreground truncate">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>

                {/* Edit / Delete — always pinned at the bottom */}
                <div className="shrink-0 px-6 py-4 border-t bg-background">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => { handleEdit(selectedSlot); setSheetOpen(false); }}
                      className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Pencil className="h-3.5 w-3.5" />Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { openDeleteDialog(selectedSlot._id); setSheetOpen(false); }}
                      className="flex-1 gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-3.5 w-3.5" />Delete
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* ── Delete Dialog ── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this time slot?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The slot will be permanently removed from the schedule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSlotToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => slotToDelete && handleDelete(slotToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}