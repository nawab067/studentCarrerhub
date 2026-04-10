"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Teacher {
  name: string;
  email: string;
  professionality: string;
  status: string;
  Teacher_Designation: string;
  Teacher_Phone_Number: string;
  image_url: string;
}

export default function TeacherProfilePage() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const baseUrl = process.env.BASE_URL;

 useEffect(() => {
  const id = localStorage.getItem("teacherId");
  setTeacherId(id);
}, []);

useEffect(() => {
  if (!teacherId) return;

  const fetchTeacher = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/teacher/user/${teacherId}`
      );
      setTeacher(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchTeacher();
}, [teacherId]);

  return (
    <div className="flex min-h-screen bg-muted/40">
     <TeacherPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
     
              <main
       className={`transition-all duration-300 min-h-screen ${
         collapsed ? "ml-16" : "ml-64"
       }`}
     >
        <h1 className="text-3xl font-bold mb-6">Teacher Profile</h1>

        {loading ? (
          <Card className="p-6">
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </Card>
        ) : teacher && (
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <Avatar className="h-28 w-28">
                    {teacher.image_url ? (
                        <AvatarImage src={teacher.image_url} alt={teacher.name} />
                    ) : null}
                    <AvatarFallback>
                        {teacher.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                    </Avatar>

                {/* Info */}
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h2 className="text-2xl font-semibold">
                      {teacher.name}
                    </h2>
                    <Badge variant={
                      teacher.status === "active" ? "default" : "destructive"
                    }>
                      {teacher.status}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground">{teacher.email}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <InfoItem label="Profession" value={teacher.professionality} />
                    <InfoItem label="Designation" value={teacher.Teacher_Designation} />
                    <InfoItem label="Phone" value={teacher.Teacher_Phone_Number} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/50 rounded-xl p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
