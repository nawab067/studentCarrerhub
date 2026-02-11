'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const [users, setUsers] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const router = useRouter();

  async function handleLogin() {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          email: users.email,
          password: users.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const user = response.data.user;

      console.log("Login response name:", user);

      if (!user) {
        alert("Invalid login credentials");
        return;
      }

      if (user.role === "TEACHER") {
       
        localStorage.setItem("teacherId", String(user._id));

        router.push(`/teacherportal/dashboard/${user._id}`);
      }

      if (user.role === "ADMIN") {
        localStorage.setItem("adminId", user._id); 
        localStorage.setItem("userEmail", user.email);
        router.push("/admin/dashboard");
      }
      if (user.role === "STUDENT") {
        localStorage.setItem("studentId", String(user._id));
        localStorage.setItem("userEmail", user.email);
        router.push("/studentPortal/dashboard");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setButtonDisabled(!(users.email && users.password));
  }, [users]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          email={users.email}
          password={users.password}
          onLogin={handleLogin}
          isLoading={loading}
          isButtonDisabled={buttonDisabled}
          onChangeEmail={(e) =>
            setUsers({ ...users, email: e.target.value })
          }
          onChangePassword={(e) =>
            setUsers({ ...users, password: e.target.value })
          }
          onSignUp={() => router.push("/register")}
        />
      </div>
    </div>
  );
}
