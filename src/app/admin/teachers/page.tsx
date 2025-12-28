'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface teacher {
    _id: number;
    name: string;
    email: string;
    Teacher_Designation: string;
    Teacher_Phone_Number: string;
}

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<teacher[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function fetch_Teacher() {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/teacher', {
                headers: { 'Content-Type': 'application/json' }
            });
            setTeachers(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    
    }
    async function handledelete(id: string) {
    if (!confirm("Are you sure you want to delete this teacher?")) return;

    try {
        setLoading(true);
        await axios.delete(`http://127.0.0.1:8000/teacher/${id}`, {
            headers: { 'Content-Type': 'application/json' }
        });

      
        setTeachers(prev => prev.filter(t => t._id !== Number(id)));

        setLoading(false);
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
}


  
    useEffect(() => {
        fetch_Teacher();
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
                    <h1 className="text-3xl font-bold">Teachers</h1>
                    <Button
                        variant="default"
                        className="flex items-center space-x-2 px-4 py-2"
                        onClick={() => router.push('/admin/teachers/addteacher')}
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Teacher</span>
                    </Button>
                </div>

                <Card className="w-full shadow-lg rounded-2xl">
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Designation</TableHead>
                                    <TableHead>Phone NO</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teachers.map((teacher) => (
                                    <TableRow key={teacher._id}>
                                        <TableCell>{teacher.name}</TableCell>
                                        <TableCell>{teacher.email}</TableCell>
                                        <TableCell>{teacher.Teacher_Designation}</TableCell>
                                        <TableCell>{teacher.Teacher_Phone_Number}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="icon" className="rounded-xl" onClick={() => router.push(`/admin/teachers/edit-teacher/${teacher._id}`)} >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="icon" className="rounded-xl" onClick={() => handledelete(teacher._id.toString())}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}