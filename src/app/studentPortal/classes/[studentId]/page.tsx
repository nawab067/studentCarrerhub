'use client';

import { useEffect, useState, type ComponentType, type Dispatch, type SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import StudentPortalSidebar from '@/components/student-portal/student-sidebar';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Clock, User, School } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/* ------------------ Types ------------------ */
interface Teacher {
  _id: string;
  name: string;
}

interface Classroom {
  _id: string;
  classroom_name: string;
}

interface TimeTableSlot {
  _id: string;
  day: string;
  start_time: string;
  end_time: string;
  teacher_id: string | Teacher;
  classroom_id: string | Classroom;
  date?: string;
  roomno?: string;
}

/* ------------------ Component ------------------ */
export default function StudentClassesPage() {
  const router = useRouter();

  const [studentId, setStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeTableSlots, setTimeTableSlots] = useState<TimeTableSlot[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  /* ---------- Auth ---------- */
  useEffect(() => {
    const storedStudentId = localStorage.getItem('studentId');
    if (!storedStudentId) {
      router.replace('/login');
      return;
    }
    setStudentId(storedStudentId);
  }, [router]);

  /* ---------- Fetch Timetable ---------- */
  useEffect(() => {
    if (!studentId) return;

    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/classes/timetable/${studentId}`
        );

        const slots = response.data;

        const updatedSlots = await Promise.all(
          slots.map(async (slot: any) => {
            let teacherName = "Unknown";
            let classroomName = "Unknown";

            try {
              const t = await axios.get(
                `http://127.0.0.1:8000/classes/teacher/${slot.teacher_id}`
              );
              teacherName = t.data.name;
            } catch {}

            try {
              const c = await axios.get(
                `http://127.0.0.1:8000/classes/classroom/${slot.classroom_id}`
              );
              classroomName = c.data.classroom_name;
            } catch {}

            return {
              ...slot,
              teacher_id: { _id: slot.teacher_id, name: teacherName },
              classroom_id: {
                _id: slot.classroom_id,
                classroom_name: classroomName,
              },
            };
          })
        );

        setTimeTableSlots(updatedSlots);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [studentId]);

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen bg-muted/40">
      {/* Sidebar (fixed width) */}
      <StudentPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <main
            className={`p-6 lg:p-10 transition-all duration-300 ${
              collapsed ? "ml-20" : "ml-64"
            }`}
          > {/* 👈 KEY FIX */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Student Classes
          </h1>
          <p className="text-muted-foreground">
            Weekly timetable overview
          </p>
        </div>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">
              📅 Weekly Class Timetable
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              View your scheduled classes
            </p>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            {loading ? (
              <div className="py-16 text-center text-muted-foreground">
                Loading timetable...
              </div>
            ) : timeTableSlots.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                No timetable available
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead>Room #</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {timeTableSlots.map((slot) => (
              <TableRow key={slot._id} className="hover:bg-muted/40">
  {/* Day */}
  <TableCell>
    <Badge variant="outline">{slot.day}</Badge>
  </TableCell>

  {/* Time */}
  <TableCell className="flex items-center gap-2">
    <Clock className="h-4 w-4 text-muted-foreground" />
    {slot.start_time} – {slot.end_time}
  </TableCell>

  {/* Date */}
  <TableCell>
    {slot.date ?? "—"}
  </TableCell>

  {/* Teacher */}
  <TableCell>
    <div className="flex items-center gap-2 font-medium">
      <User className="h-4 w-4 text-muted-foreground" />
      {typeof slot.teacher_id === "object"
        ? slot.teacher_id.name
        : "—"}
    </div>
  </TableCell>

  {/* Classroom */}
  <TableCell>
    <div className="flex items-center gap-2">
      <School className="h-4 w-4 text-muted-foreground" />
      {typeof slot.classroom_id === "object"
        ? slot.classroom_id.classroom_name
        : "—"}
    </div>
  </TableCell>

  {/* Room # */}
  <TableCell className="font-medium">
    {slot.roomno ?? "—"}
  </TableCell>
</TableRow>



                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
