'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import ClassroomDialog from "@/components/admin/classroom-add-students";

// IMPORT THE DIALOG

interface Teacher {
  id: string;
  name: string;
}

interface Classroom {
  _id: string;
  classroom_name: string;
  students: string[];
  teacher?: Teacher | null;
}

interface Student {
  _id: string;
  name: string;
}

export default function ClassroomPage() {
  const router = useRouter();

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // Dialog open handler
  const [openClassroomId, setOpenClassroomId] = useState<string | null>(null);

  // Fetch classrooms
  const fetchClassrooms = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/classrooms', {
        headers: { "Content-Type": "application/json" },
      });

      const data = Array.isArray(res.data) ? res.data : res.data.classrooms;
      setClassrooms(data);
    } catch (error) {
      console.error("Classroom fetch error:", error);
    }
  };

  // Fetch students
  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/Student', {
        headers: { "Content-Type": "application/json" },
      });

      setStudents(res.data);
    } catch (error) {
      console.error("Student fetch error:", error);
    }
  };

  useEffect(() => {
    fetchClassrooms();
    fetchStudents();
  }, []);

  // Delete classroom
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/classroom/${id}`);
      setClassrooms(prev => prev.filter(c => c._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  const handleEdit = (id: string) => {
    setOpenClassroomId(id);
    try{
      setLoading(false);
      const response= axios.post(`http://127.0.0.1:8000/classroom/${id}`,{
        headers: { 'Content-Type': 'application/json' }

      });

    }catch(error){
      console.log(error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 flex flex-col items-center w-full"
    >
      <div className="w-full max-w-5xl flex flex-col space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Classrooms</h1>
          <Button
            onClick={() => router.push('/admin/classroom/add-classroom')}
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Classroom
          </Button>
        </div>

        {/* Table */}
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
                    <TableCell>{c.teacher?.name || "unassigned"}</TableCell>

                    <TableCell className="text-right space-x-2">

                      {/* Edit */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                        onClick={() => router.push(`/admin/classroom/edit/${c._id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* Add Students - OPEN DIALOG */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                        onClick={() => setOpenClassroomId(c._id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="rounded-xl"
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

      {/* 📌 CLASSROOM DIALOG */}

      <ClassroomDialog
      
        open={Boolean(openClassroomId)}
        onClose={() => setOpenClassroomId(null)}
        classroomId={openClassroomId}
        onStudentAdded={() => {
          fetchClassrooms();
          fetchStudents();
        }}
      />

    </motion.div>
  );
}
