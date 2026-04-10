'use client';
import axios from "axios";
import { useState, useEffect } from "react";
import SubjectEditPage from "@/components/admin/subject-edit"; // your child component
import { useRouter, useParams } from "next/navigation";
import { subject } from "@/app/admin/subjects/add-subject/page";

export default function EditSubjectPage() {
    const [loading, setLoading] = useState(false);
    const [subjectData, setSubjectData] = useState<subject | null>(null); // avoid name conflict
    const router = useRouter();
    const { id } = useParams();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    async function getSubject() {
        try {
            setLoading(true);
            const response = await axios.get<subject>(`${baseUrl}/teacher/subject/${id}`, {
                headers: { "Content-Type": "application/json" },
            });
            setSubjectData(response.data);
        } catch (error) {
            console.error("Error fetching subject:", error);
            setSubjectData(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) getSubject();
    }, [id]);

    async function handleUpdate(updatedSubject: subject) {
        try {
            setLoading(true);
            await axios.put(`${baseUrl}/teacher/subject/${id}`, updatedSubject, {
                headers: { "Content-Type": "application/json" },
            });
            router.push("/admin/subjects");
        } catch (error) {
            console.error("Error updating subject:", error);
            alert("Failed to update subject");
        } finally {
            setLoading(false);
        }
    }

    return (
        <SubjectEditPage
            subject={subjectData}
            loading={loading}
            onSubmit={handleUpdate}
        />
    );
}
