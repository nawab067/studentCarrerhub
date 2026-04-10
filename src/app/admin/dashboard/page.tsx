"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, BookOpen, GraduationCap, TrendingUp, Activity, Calendar } from "lucide-react";

export default function DashboardPage() {
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  async function fetchStats() {
    try {
      const [teachersRes, studentsRes, coursesRes] = await Promise.all([
        axios.get(`${baseUrl}/teacher`),
        axios.get(`${baseUrl}/Student`),
        axios.get(`${baseUrl}/teacher/course/`),
      ]);

      setTotalTeachers(teachersRes.data.length);
      setTotalStudents(studentsRes.data.length);

      console.log("COURSES RESPONSE:", coursesRes.data);

      const courses =
        Array.isArray(coursesRes.data)
          ? coursesRes.data
          : coursesRes.data.courses || coursesRes.data.data || [];

      setTotalCourses(courses.length);

      setLoading(false);

    } catch (error) {
      console.log("Error fetching stats", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  const stats = [
    {
      title: "Total Teachers",
      value: totalTeachers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      change: "+12%",
      trend: "up"
    },
    {
      title: "Total Students",
      value: totalStudents,
      icon: GraduationCap,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      change: "+23%",
      trend: "up"
    },
    {
      title: "Active Courses",
      value: totalCourses,
      icon: BookOpen,
      color: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
      change: "+8%",
      trend: "up"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-2">
                Dashboard Overview
              </h1>
              <p className="text-slate-600 text-lg">
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  {/* Gradient Accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-full">
                        <TrendingUp className="w-3 h-3 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-700">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-4xl font-bold text-slate-900">
                        {stat.value.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Quick Stats */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="font-medium text-slate-700">Teacher-Student Ratio</span>
                </div>
                <span className="text-lg font-bold text-slate-900">
                  1:{totalStudents > 0 && totalTeachers > 0 ? Math.round(totalStudents / totalTeachers) : 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="font-medium text-slate-700">Avg Students per Course</span>
                </div>
                <span className="text-lg font-bold text-slate-900">
                  {totalCourses > 0 ? Math.round(totalStudents / totalCourses) : 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                  <span className="font-medium text-slate-700">Courses per Teacher</span>
                </div>
                <span className="text-lg font-bold text-slate-900">
                  {totalTeachers > 0 ? (totalCourses / totalTeachers).toFixed(1) : 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* System Overview */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                System Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors">
                <span className="font-medium">Total Users</span>
                <span className="text-2xl font-bold">
                  {(totalTeachers + totalStudents).toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors">
                <span className="font-medium">Active Resources</span>
                <span className="text-2xl font-bold">{totalCourses}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors">
                <span className="font-medium">Platform Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="font-semibold">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}