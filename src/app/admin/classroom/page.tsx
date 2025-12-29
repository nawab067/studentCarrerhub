'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { Pencil, Trash2, Plus } from "lucide-react";
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

  /* =======================
     FETCH CLASSROOMS + TEACHERS
  ======================= */

  const fetchClassrooms = async () => {
    try {
      // 1️⃣ Get raw classrooms
      const res = await axios.get("http://127.0.0.1:8000/classrooms");
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
              `http://127.0.0.1:8000/classroom/${cls._id}`
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
    } catch (error) {
      console.error("Classroom fetch error:", error);
      setClassrooms([]);
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
      await axios.delete(`http://127.0.0.1:8000/classroom/${id}`);
      setClassrooms((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  /* =======================
     UI
  ======================= */

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 flex flex-col items-center w-full"
    >
      <div className="w-full max-w-5xl flex flex-col space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Classrooms</h1>

          <Button
            onClick={() => router.push("/admin/classroom/add-classroom")}
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Classroom
          </Button>
        </div>

        {/* TABLE */}
        <Card className="w-full shadow-lg rounded-2xl">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {classrooms.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell>{c.classroom_name}</TableCell>
                    <TableCell>{c.students.length}</TableCell>

                    {/* ✅ TEACHER NAME */}
                    <TableCell>
                      {c.teacher ? c.teacher.name : "Unassigned"}
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          router.push(`/admin/classroom/edit/${c._id}`)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setOpenClassroomId(c._id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(c._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {classrooms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No classrooms found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ADD STUDENTS DIALOG */}
      <ClassroomDialog
        open={Boolean(openClassroomId)}
        onClose={() => setOpenClassroomId(null)}
        classroomId={openClassroomId}
        onStudentAdded={fetchClassrooms}
      />
    </motion.div>
  );
}
