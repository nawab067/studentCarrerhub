'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface subject {
    _id: string;
    subject_name: string;
    description: string;
    subjectId: string;

}

export default function TeachersPage() {
    const [subject, setsubject] = useState<subject[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function fetch_Teacher() {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/teacher/subject/', {
                headers: { 'Content-Type': 'application/json' }
            });
            setsubject(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    async function hamdledelete(id: string) {
        if (!confirm("Are you sure you want to delete this subject?")) return;
        try {
            setLoading(true);
            await axios.delete(`http://127.0.0.1:8000/teacher/subject/${id}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            fetch_Teacher();
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
                    <h1 className="text-3xl font-bold">subject</h1>
                    <Button
                        variant="default"
                        className="flex items-center space-x-2 px-4 py-2"
                        onClick={() => router.push('/admin/subjects/add-subject')}
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add subject</span>
                    </Button>
                </div>

                <Card className="w-full shadow-lg rounded-2xl">
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>subject id</TableHead>
                                    <TableHead>Discription</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subject.map((subject) => (
                                    <TableRow key={subject._id}>
                                        <TableCell>{subject.subject_name}</TableCell>
                                        <TableCell>{subject.subjectId}</TableCell>
                                        <TableCell>{subject.description}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="icon" className="rounded-xl" onClick ={() => router.push(`/admin/subjects/edit/${subject._id}`)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="icon" className="rounded-xl" onClick={() => hamdledelete(subject._id)}>
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