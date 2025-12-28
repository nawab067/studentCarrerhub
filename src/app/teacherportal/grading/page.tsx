'use client';
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import React from "react";


export default function TeacherClassesPage() {
  return (
    <div className="flex">
      <TeacherPortalSidebar />

      <div className="p-6 w-full">
        <h1 className="text-center text-2xl font-bold mb-4">
          Teacher Grading
        </h1>
      </div>
    </div>
  );
}
