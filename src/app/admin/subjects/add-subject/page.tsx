'use client';

import axios from "axios";
import { useState } from "react";
import SubjectAddPage from "@/components/admin/subject-add";  
import { useRouter } from "next/navigation";

export interface subject {
    _id?: string;
    subject_name: string;
    description: string;
    subjectId: string;
}


export default function AddsubjectPageWrapper() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    async function addsubject(subject: subject) {
    try {
        setLoading(true);

        const response = await axios.post(
            `${baseUrl}/teacher/subject/`,
            {
                subject_name: subject.subject_name,
                description: subject.description,
                subjectId: subject.subjectId
            }
        );

        console.log("Subject added:", response.data);
        alert("Subject added successfully!");
        router.push("/admin/subjects");

    } catch (error: any) {
        console.error("Error adding subject:", error.response?.data || error.message);
        alert("Error adding subject. Check console.");
    } finally {
        setLoading(false);
    }
}  

    return (
        <SubjectAddPage onSubmit={addsubject} loading={loading} />
    );
}
