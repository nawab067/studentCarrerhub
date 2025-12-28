'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Subject, Teacher, Course, GetCourse } from "./types";



export default function CoursesPage() {
    const [courses, setCourses] = useState<GetCourse[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    async function fetch_Courses() {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/teacher/course/', {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log("FULL RESPONSE:", JSON.stringify(response.data, null, 2));
            setCourses(response.data.courses || []);
        } catch (error) {
            console.log(error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    }
    async function handledelete(id: string) {
        if (!confirm("Are you sure you want to delete this course?")) return;
        try {
            setLoading(true);
            await axios.delete(`http://127.0.0.1:8000/teacher/course/${id}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            fetch_Courses();
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }


    useEffect(() => {
        fetch_Courses();
    }, []);


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 flex flex-col items-center w-full"
        >
            <div className="w-full max-w-5xl flex flex-col space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Courses</h1>
                    <Button
                        variant="default"
                        className="flex items-center space-x-2 px-4 py-2"
                        onClick={() => router.push('/admin/courses/add-course')}
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Courses</span>
                    </Button>
                </div>

                <Card className="w-full shadow-lg rounded-2xl">
                    <CardContent>
                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Course Code</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Teacher</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {courses.map((Course) => (
                                        <TableRow key={Course._id}>
                                            <TableCell>{Course.name}</TableCell>
                                            <TableCell>{Course.course_code}</TableCell>
                                            <TableCell>{Course.description}</TableCell>
                                            <TableCell>{Course.subject?.name}</TableCell>
                                            <TableCell>{Course.teacher?.name}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="icon" onClick={() => router.push(`/admin/courses/edit-course/${Course._id}`)}><Pencil /></Button>
                                                <Button variant="destructive" size="icon" onClick={() => handledelete(String(Course._id))}><Trash2 /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {courses.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-4">
                                                No courses available.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>

                </Card>
            </div>
        </motion.div>
    );
}