'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { SlotData } from "@/components/admin/TeacherTimeTable";





const DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

// ✅ Simple helper component to fetch classroom name
function ClassroomName({ id }: { id: string })
 {
  const [name, setName] = useState("Loading...");

  useEffect(() => {
    async function fetchClassroom() {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/classes/classroom/${id}`);
        setName(res.data.classroom_name);
        console.log(res.data)
      } catch (err) {
        setName("Unknown");
      }
    }
    fetchClassroom();
  }, [id]);

  return <>{name}</>;
}

export default function TimetablePage() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [timeslots, setTimeslots] = useState<SlotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Get teacherId from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const id = localStorage.getItem("teacherId");
    if (!id) {
      setError("Teacher not logged in");
      setLoading(false);
      return;
    }

    setTeacherId(id);
  }, []);

  // ✅ Fetch timetable
  async function fetchTimetable() {
    if (!teacherId) return;
    try {
      setLoading(true);
      const res = await axios.get<SlotData[]>(
        `http://127.0.0.1:8000/teacher_time_table/${teacherId}`
      );
      setTimeslots(res.data);
    } catch {
      setError("Error fetching the timetable");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTimetable();
  }, [teacherId]);

  // ✅ Group slots by day
  const grouped = DAYS.map(day => ({
    day,
    slots: timeslots
      .filter(t => t.day === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
  })).filter(d => d.slots.length > 0);

  return (
    <div className="min-h-screen bg-muted/40">

      {/* Sidebar */}
      <TeacherPortalSidebar />

      <main className="ml-0 md:ml-64">
        <div className="p-6 lg:p-8 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">Weekly Timetable</h1>
            <p className="text-muted-foreground text-sm">Your teaching schedule</p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <Card className="border-destructive">
              <CardContent className="p-4 text-destructive font-medium">
                {error}
              </CardContent>
            </Card>
          )}

          {/* No timetable */}
          {!loading && !error && grouped.length === 0 && (
            <Card>
              <CardContent className="p-6 text-muted-foreground">
                No timetable found.
              </CardContent>
            </Card>
          )}

          {/* Timetable */}
          {!loading && !error && grouped.map(group => (
            <Card key={group.day} className="rounded-xl shadow-sm">
              <CardHeader className="py-4">
                <CardTitle className="flex justify-between items-center text-base">
                  {group.day}
                  <Badge variant="secondary">{group.slots.length} periods</Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="divide-y">
                  {group.slots.map((slot, i) => (
                    <div
                      key={`${slot.day}-${slot.start_time}-${i}`}
                      className="flex items-center justify-between gap-4 py-3"
                    >

                      {/* Time */}
                      <div className="w-44 shrink-0 text-sm font-medium">
                        {slot.start_time} — {slot.end_time}
                      </div>

                      {/* Classroom */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">Classroom</div>
                        <div className="text-xs text-muted-foreground truncate">
                          <ClassroomName id ={slot.classroom_id} />
                        </div>
                      </div>

                      {/* Period Tag */}
                      <Badge variant="outline">Period</Badge>

                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

        </div>
      </main>
    </div>
  );
}
