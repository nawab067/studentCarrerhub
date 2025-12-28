'use client';

import { Card,CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import{ClassroomAddPageProps} from "@/components/admin/classroom-add"
interface student {
    _id: number;
    name: string;
    email: string;
    state: string;
    Roll_Number: string;
    city: string;
    address: string;
    date_of_birth: string; 
    phone_number: string;
    image_url: string;
}

export default function studentPage() {
    const [students, setStudents] = useState<student[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function fetch_Teacher() {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/Student', {
                headers: { 'Content-Type': 'application/json' }
            });
            setStudents(response.data);
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
        await axios.delete(`http://127.0.0.1:8000/student/${id}`, {
            headers: { 'Content-Type': 'application/json' }
        });

      
        setStudents(prev => prev.filter(t => t._id !== Number(id)));

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
                    <h1 className="text-3xl font-bold">Students</h1>
                    <Button
                        variant="default"
                        className="flex items-center space-x-2 px-4 py-2"
                        onClick={() => router.push('/admin/students/addStudent')}
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Student</span>
                    </Button>
                </div>

                <Card className="w-full shadow-lg rounded-2xl">
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>state</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>Roll Number</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Date of Birth</TableHead>
                                    <TableHead>Phone Number</TableHead>
                                    
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow key={student._id}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell>{student.state}</TableCell>
                                        <TableCell>{student.city}</TableCell>
                                        <TableCell>{student.Roll_Number}</TableCell>
                                        <TableCell>{student.address}</TableCell>
                                        <TableCell>{student.date_of_birth}</TableCell>
                                        <TableCell>{student.phone_number}</TableCell>
                                      
                                        
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="icon" className="rounded-xl" onClick={() => router.push(`/admin/students/edit/${student._id}`)} >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="icon" className="rounded-xl" onClick={() => handledelete(student._id.toString())}>
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