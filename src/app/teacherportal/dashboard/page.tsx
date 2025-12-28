"use client";

import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Notebook, GraduationCap } from "lucide-react";

export default function Dashboard() {
 
  return (
    <div className="flex">
      {/* Sidebar */}
      <TeacherPortalSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 ml-0 md:ml-64">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Students */}
          <Card className="bg-sky-100 border-sky-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-5 w-5 text-sky-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-sky-700">128</p>
            </CardContent>
          </Card>

          {/* Classes */}
          <Card className="bg-sky-100 border-sky-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Classes</CardTitle>
              <BookOpen className="h-5 w-5 text-sky-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-sky-700">12</p>
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card className="bg-sky-100 border-sky-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Assignments
              </CardTitle>
              <Notebook className="h-5 w-5 text-sky-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-sky-700">34</p>
            </CardContent>
          </Card>

          {/* Pass Rate */}
          <Card className="bg-sky-100 border-sky-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pass Rate
              </CardTitle>
              <GraduationCap className="h-5 w-5 text-sky-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-sky-700">92%</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
