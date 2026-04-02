'use client';

import StudentPortalSidebar from "@/components/student-portal/student-sidebar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";



interface showclasses{
  _id: string;
  classroom_name: string;
  teacherid: string;
}
export default function Page() {
  const [classes, setClasses] = useState<showclasses[]>([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);
   const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');

    if (!studentId) {
      router.replace('/login');
      return;
    }

    setId(studentId);
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/classes/student/${id}`);
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) fetchClasses();
  }, [id]);

  const handleClick = (classId: string) => {
    router.push(`/studentPortal/grades/showgrades/${classId}`);
  };

  return (
    <>
      <StudentPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

       <main
            className={`p-6 lg:p-10 transition-all duration-300 ${
              collapsed ? "ml-20" : "ml-64"
            }`}
          >
        <h1 className="text-2xl font-bold mb-4">My Classes</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {classes.map((item) => (
              <Card
                key={item._id}
                onClick={() => handleClick(item._id)}
                className="cursor-pointer hover:shadow-xl transition rounded-2xl"
              >
                <CardContent className="p-6 flex items-center justify-center">
                  <h2 className="text-lg font-semibold text-center">
                    {item.classroom_name}
                  </h2>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
