'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, BookOpen, Hash, FileText, BookMarked, Library } from "lucide-react";
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

export default function SubjectsPage() {
    const [subject, setsubject] = useState<subject[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const baseUrl = process.env.BASE_URL;

    async function fetch_Teacher() {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/teacher/subject/`, {
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
            await axios.delete(`${baseUrl}/teacher/subject/${id}`, {
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-rose-50 to-pink-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                    <p className="text-slate-600 font-medium">Loading subjects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-pink-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 lg:p-8"
            >
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                    Subjects
                                </h1>
                            </div>
                            <p className="text-slate-600 ml-14">
                                Manage and organize all course subjects
                            </p>
                        </div>
                        
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 text-base font-semibold"
                                onClick={() => router.push('/admin/subjects/add-subject')}
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add Subject
                            </Button>
                        </motion.div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-rose-100 rounded-xl">
                                            <BookOpen className="h-6 w-6 text-rose-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-600">Total Subjects</p>
                                            <p className="text-2xl font-bold text-slate-900">{subject.length}</p>
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
                                        <div className="p-3 bg-purple-100 rounded-xl">
                                            <Library className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-600">Active Subjects</p>
                                            <p className="text-2xl font-bold text-slate-900">{subject.length}</p>
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
                            <Card className="border-0 shadow-md bg-gradient-to-br from-rose-500 to-pink-600 text-white hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                            <BookMarked className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-rose-100">Curriculum</p>
                                            <p className="text-2xl font-bold">Complete</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Main Table Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="border-0 shadow-xl bg-white overflow-hidden">
                            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-rose-50/30 pb-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <CardTitle className="text-2xl font-bold text-slate-900">
                                        All Subjects ({subject.length})
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b-2">
                                                <TableHead className="font-bold text-slate-700 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="h-4 w-4" />
                                                        Subject Name
                                                    </div>
                                                </TableHead>
                                                <TableHead className="font-bold text-slate-700">
                                                    <div className="flex items-center gap-2">
                                                        <Hash className="h-4 w-4" />
                                                        Subject ID
                                                    </div>
                                                </TableHead>
                                                <TableHead className="font-bold text-slate-700">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4" />
                                                        Description
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
                                            {subject.map((subj, index) => (
                                                <motion.tr
                                                    key={subj._id}
                                                    variants={rowVariants}
                                                    className="border-b hover:bg-rose-50/30 transition-colors group"
                                                    custom={index}
                                                >
                                                    <TableCell className="font-medium py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                                {subj.subject_name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="text-slate-900 font-semibold">{subj.subject_name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                                                            {subj.subjectId}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-slate-600">
                                                        <span className="text-sm max-w-[300px] truncate block">
                                                            {subj.description}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="icon" 
                                                                    className="h-9 w-9 border-slate-300 hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
                                                                    onClick={() => router.push(`/admin/subjects/edit/${subj._id}`)}
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </motion.div>
                                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="icon" 
                                                                    className="h-9 w-9 border-slate-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                                                                    onClick={() => hamdledelete(subj._id)}
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
                                </div>

                                {subject.length === 0 && (
                                    <div className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-4 bg-slate-100 rounded-full">
                                                <BookOpen className="h-12 w-12 text-slate-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900 mb-1">No subjects found</h3>
                                                <p className="text-slate-500 text-sm">Get started by adding your first subject</p>
                                            </div>
                                            <Button
                                                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white mt-4"
                                                onClick={() => router.push('/admin/subjects/add-subject')}
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Subject
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}