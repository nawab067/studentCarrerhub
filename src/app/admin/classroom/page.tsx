'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { Pencil, Trash2, Plus, School, Users, BookOpen, UserCheck, Building2 } from "lucide-react";
import ClassroomDialog from "@/components/admin/classroom-add-students";

/* =======================
   TYPES
======================= */

interface Teacher {
  _id: string;
  name: string;
}

interface Classroom {
  _id: string;
  classroom_name: string;
  students: string[];
  teacherId?: string;
  teacher?: Teacher | null;
}

/* =======================
   COMPONENT
======================= */

export default function ClassroomPage() {
  const router = useRouter();

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [openClassroomId, setOpenClassroomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const baseUrl = process.env.BASE_URL;

  /* =======================
     FETCH CLASSROOMS + TEACHERS
  ======================= */

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      // 1️⃣ Get raw classrooms
      const res = await axios.get(`${baseUrl}/classrooms`);
      const rawClassrooms: Classroom[] = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      // 2️⃣ Enrich with teacher names
      const enriched = await Promise.all(
        rawClassrooms.map(async (cls) => {
          if (!cls.teacherId) {
            return { ...cls, teacher: null };
          }

          try {
            const detailRes = await axios.get(
              `${baseUrl}/classroom/${cls._id}`
            );

            return {
              ...cls,
              teacher: detailRes.data.teacher || null,
            };
          } catch {
            return { ...cls, teacher: null };
          }
        })
      );

      setClassrooms(enriched);
      setLoading(false);
    } catch (error) {
      console.error("Classroom fetch error:", error);
      setClassrooms([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  /* =======================
     DELETE CLASSROOM
  ======================= */

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this classroom?")) return;

    try {
      await axios.delete(`${baseUrl}/classroom/${id}`);
      setClassrooms((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  /* =======================
     ANIMATIONS
  ======================= */

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  /* =======================
     LOADING STATE
  ======================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading classrooms...</p>
        </div>
      </div>
    );
  }

  /* =======================
     STATS CALCULATIONS
  ======================= */

  const totalStudents = classrooms.reduce((sum, c) => sum + c.students.length, 0);
  const assignedTeachers = classrooms.filter(c => c.teacher).length;

  /* =======================
     UI
  ======================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 lg:p-8"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* HEADER SECTION */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <School className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Classrooms
                </h1>
              </div>
              <p className="text-slate-600 ml-14">
                Manage classrooms, students, and teacher assignments
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 text-base font-semibold"
                onClick={() => router.push("/admin/classroom/add-classroom")}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Classroom
              </Button>
            </motion.div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      <School className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Classrooms</p>
                      <p className="text-2xl font-bold text-slate-900">{classrooms.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-xl">
                      <Users className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Students</p>
                      <p className="text-2xl font-bold text-slate-900">{totalStudents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <UserCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Assigned Teachers</p>
                      <p className="text-2xl font-bold text-slate-900">{assignedTeachers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-100">Avg Class Size</p>
                      <p className="text-2xl font-bold">
                        {classrooms.length > 0 ? Math.round(totalStudents / classrooms.length) : 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* MAIN TABLE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-white overflow-hidden">
              <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-indigo-50/30 pb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="text-2xl font-bold text-slate-900">
                    All Classrooms ({classrooms.length})
                  </CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                <ScrollArea className="h-[500px] w-full">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b-2">
                        <TableHead className="font-bold text-slate-700 py-4">
                          <div className="flex items-center gap-2">
                            <School className="h-4 w-4" />
                            Classroom Name
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-slate-700">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Students
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-slate-700">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            Teacher
                          </div>
                        </TableHead>
                        <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    
                    <motion.tbody
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {classrooms.map((c, index) => (
                        <motion.tr
                          key={c._id}
                          variants={rowVariants}
                          className="border-b hover:bg-indigo-50/30 transition-colors group"
                          custom={index}
                        >
                          <TableCell className="font-medium py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {c.classroom_name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-slate-900 font-semibold">{c.classroom_name}</span>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                {c.students.length} {c.students.length === 1 ? 'Student' : 'Students'}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            {c.teacher ? (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                  {c.teacher.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-slate-900 font-medium">{c.teacher.name}</span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                Unassigned
                              </span>
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-9 w-9 border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                                  onClick={() => router.push(`/admin/classroom/edit/${c._id}`)}
                                  title="Edit classroom"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </motion.div>

                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-9 w-9 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                                  onClick={() => setOpenClassroomId(c._id)}
                                  title="Add students"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </motion.div>

                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-9 w-9 border-slate-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                                  onClick={() => handleDelete(c._id)}
                                  title="Delete classroom"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </Table>
                  </ScrollArea>
                </div>

                {classrooms.length === 0 && (
                  <div className="py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-slate-100 rounded-full">
                        <School className="h-12 w-12 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">No classrooms found</h3>
                        <p className="text-slate-500 text-sm">Get started by creating your first classroom</p>
                      </div>
                      <Button
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white mt-4"
                        onClick={() => router.push("/admin/classroom/add-classroom")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Classroom
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* ADD STUDENTS DIALOG */}
      <ClassroomDialog
        open={Boolean(openClassroomId)}
        onClose={() => setOpenClassroomId(null)}
        classroomId={openClassroomId}
        onStudentAdded={fetchClassrooms}
      />
    </div>
  );
}