'use client';

import StudentPortalSidebar from "@/components/student-portal/student-sidebar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AssessmentDialog from "@/components/student-portal/viewgrades";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface StudentAssessment {
  _id: string;
  name: string;
  description: string;
  teacherId: string;
  created_at: string;
}

export default function Page() {
  const params = useParams();
  const router = useRouter();

  
  const assessmentIdParam = Array.isArray(params?.assessmentId)
    ? params.assessmentId[0]
    : params?.assessmentId;

  const [assessments, setAssessments] = useState<StudentAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ✅ Get student ID (ONLY ONCE)
  useEffect(() => {
    const storedId = localStorage.getItem("studentId");

    if (!storedId) {
      router.replace("/login");
      return;
    }

    setStudentId(storedId);
  }, [router]);

  async function getStudentAssessments() {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/get_assesments/${assessmentIdParam}`);
      console.log("Assessments response:", response.data.data);

      setAssessments(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setLoading(false);
    }
  }


 
  useEffect(() => {
    if (studentId && assessmentIdParam) {
      getStudentAssessments();
    }
  }, [studentId, assessmentIdParam]);

  // ✅ Handle View
  const handleView = async (assessmentId: string) => {
  if (!studentId) return;

  try {
    setOpen(true);
    setDetailLoading(true);

    const res = await axios.get(
      `http://127.0.0.1:8000/student/grades/${assessmentId}/${studentId}`
    );

    console.log("API RESPONSE:", res.data);

    const studentData = res.data.students?.find(
      (s: any) => s.student_id === studentId
    );

    setSelectedAssessment({
      name: "Assessment", // you can improve this if backend sends name
      marks: studentData?.marks ?? null,
      weightage: res.data.weightage ?? null,
    });

  } catch (err) {
    console.error("Error fetching assessment details:", err);
  } finally {
    setDetailLoading(false);
  }
};

  return (
    <>
      <StudentPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

       <main
            className={`p-6 lg:p-10 transition-all duration-300 ${
              collapsed ? "ml-20" : "ml-64"
            }`}
          >
        <h1 className="text-2xl font-bold mb-4">Assessments</h1>

        {loading ? (
          <p>Loading...</p>
        ) : assessments.length === 0 ? (
          <p>No assessments found.</p>
        ) : (
          <div className="rounded-2xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {assessments.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">
                      {item.name}
                    </TableCell>

                    <TableCell>{item.description}</TableCell>

                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        onClick={() => handleView(item._id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* ✅ Dialog */}
      <AssessmentDialog
        open={open}
        onOpenChange={setOpen}
        data={selectedAssessment}
        loading={detailLoading}
      />
    </>
  );
}