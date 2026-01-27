'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Pencil, 
  Plus, 
  Clock, 
  User, 
  DoorOpen,
  Calendar,
  Loader2
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
} from "@/components/ui/alert-dialog";

interface TeacherTimeTableProps {
  _id: string;
  day: string;
  start_time: string;
  end_time: string;
  teacher_id: string;
  classroom_id: string;
  teacher_name?: string;
  classroom_name?: string;
}

export default function TeacherTimeTable() {
  const [loading, setLoading] = useState(false);
  const [teacherTimeTable, setTeacherTimeTable] = useState<TeacherTimeTableProps[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);
  const router = useRouter();

  async function Timetable() {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/all_time_slots');
      const slots: TeacherTimeTableProps[] = response.data;

      const slotsWithNames = await Promise.all(
        slots.map(async (slot) => {
          let teacher_name = "Unknown";
          let classroom_name = "Unknown";

          try {
            const teacherRes = await axios.get(`http://127.0.0.1:8000/classes/teacher/${slot.teacher_id}`);
            teacher_name = teacherRes.data.name || "Unknown";
          } catch (err) {
            console.error("Error fetching teacher:", err);
          }

          try {
            const classroomRes = await axios.get(`http://127.0.0.1:8000/classes/classroom/${slot.classroom_id}`);
            classroom_name = classroomRes.data.classroom_name || "Unknown";
          } catch (err) {
            console.error("Error fetching classroom:", err);
          }

          return { ...slot, teacher_name, classroom_name };
        })
      );

      setTeacherTimeTable(slotsWithNames);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    Timetable();
  }, []);

  // Delete slot
  const handleDelete = async (slotId: string) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/delete_time_slot/${slotId}`);
      setTeacherTimeTable(prev => prev.filter(slot => slot._id !== slotId));
      setDeleteDialogOpen(false);
      setSlotToDelete(null);
    } catch (err) {
      console.error("Error deleting slot:", err);
      alert("Failed to delete slot");
    }
  };

  const openDeleteDialog = (slotId: string) => {
    setSlotToDelete(slotId);
    setDeleteDialogOpen(true);
  };

  // Edit slot
  const handleEdit = (slot: TeacherTimeTableProps) => {
    console.log("Edit slot:", slot);
    // TODO: Implement edit modal or redirect
  };

  // Add new slot
  const handleAdd = () => {
    router.push('/admin/TeacherTimeTable/add');
  };

  const getDayColor = (day: string) => {
    const colors: { [key: string]: string } = {
      'Monday': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Tuesday': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Wednesday': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Thursday': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Friday': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Saturday': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Sunday': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[day] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 space-y-6 max-w-7xl">
          {/* Header Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
             <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-black dark:text-white">
  <Calendar className="h-8 w-8 text-black dark:text-white" />
  Teacher Time Table
</h1>

              <p className="text-sm text-muted-foreground">
                Manage and organize teaching schedules and classroom assignments
              </p>
            </div>
            <Button 
              onClick={handleAdd}
              size="lg"
              className="gap-2 shadow-md hover:shadow-lg transition-shadow bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Add Time Slot
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Slots</p>
                    <h3 className="text-2xl font-bold">{teacherTimeTable.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <User className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Teachers</p>
                    <h3 className="text-2xl font-bold">
                      {new Set(teacherTimeTable.map(s => s.teacher_id)).size}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <DoorOpen className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Classrooms</p>
                    <h3 className="text-2xl font-bold">
                      {new Set(teacherTimeTable.map(s => s.classroom_id)).size}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table Card */}
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Schedule Overview</CardTitle>
                  <CardDescription className="mt-1">
                    View and manage all teaching time slots
                  </CardDescription>
                </div>
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading timetable data...</p>
                </div>
              ) : teacherTimeTable.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="p-4 bg-muted rounded-full">
                    <Calendar className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg">No time slots available</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Get started by adding your first time slot to the schedule
                    </p>
                  </div>
                  <Button onClick={handleAdd} className="gap-2 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="h-4 w-4" />
                    Add Time Slot
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Day</TableHead>
                        <TableHead className="font-semibold">Time Slot</TableHead>
                        <TableHead className="font-semibold">Teacher</TableHead>
                        <TableHead className="font-semibold">Classroom</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teacherTimeTable.map((slot, index) => (
                        <TableRow 
                          key={slot._id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={`${getDayColor(slot.day)} font-medium`}
                            >
                              {slot.day}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{slot.start_time}</span>
                              <span className="text-muted-foreground">-</span>
                              <span className="font-medium">{slot.end_time}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-primary/10 rounded-full">
                                <User className="h-3.5 w-3.5 text-primary" />
                              </div>
                              <span className="font-medium">{slot.teacher_name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full">
                                <DoorOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" />
                              </div>
                              <span className="font-medium">{slot.classroom_name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(slot)}
                                className="h-8 gap-1.5 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteDialog(slot._id)}
                                className="h-8 gap-1.5 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the time slot
              from the schedule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSlotToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => slotToDelete && handleDelete(slotToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
