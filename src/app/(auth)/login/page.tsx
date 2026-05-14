'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { LoginForm } from "@/components/login-form";
import Cookies from "js-cookie";

interface UserState {
  email: string;
  password: string;
}

export default function LoginPage() {

  const router = useRouter();

  const [users, setUsers] = useState<UserState>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [buttonDisabled, setButtonDisabled] =
    useState(true);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL;



  async function handleLogin() {

    try {

      setLoading(true);

      const response = await axios.post(
        `${baseUrl}/login`,
        {
          email: users.email,
          password: users.password,
        },
        {
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );


      const {
        access_token,
        user,
      } = response.data;

     

      if (!user) {

        alert("Invalid credentials");

        return;
      }

      

localStorage.setItem(
  "token",
  access_token
);

Cookies.set(
  "token",
  access_token,
  {
    expires: 1 / 1440,
  }
);

localStorage.setItem(
  "userEmail",
  user.email
);

localStorage.setItem(
  "userRole",
  user.role
);



if (user.role === "ADMIN") {

  localStorage.setItem(
    "adminId",
    user._id
  );

  router.push("/admin/dashboard");
}

else if (
  user.role === "TEACHER"
) {

  localStorage.setItem(
    "teacherId",
    user._id
  );

  router.push(
    `/teacherportal/dashboard/${user._id}`
  );
}

else if (
  user.role === "STUDENT"
) {

  localStorage.setItem(
    "studentId",
    user._id
  );

  router.push(
    "/studentPortal/dashboard"
  );
}

    } catch (error: any) {

      console.error(
        "Login Error:",
        error
      );

      if (
        error.response?.data?.detail
      ) {

        alert(
          error.response.data.detail
        );

      } else {

        alert(
          "Login failed. Please try again."
        );
      }

    } finally {

      setLoading(false);
    }
  }



  useEffect(() => {

    setButtonDisabled(
      !users.email ||
      !users.password
    );

  }, [users]);



  return (

    <div
      className="
      flex
      min-h-screen
      items-center
      justify-center
      p-6
      "
    >

      <div
        className="
        w-full
        max-w-sm
        "
      >

        <LoginForm

          email={users.email}

          password={users.password}

          onLogin={handleLogin}

          isLoading={loading}

          isButtonDisabled={
            buttonDisabled
          }

          onChangeEmail={(e) =>
            setUsers({
              ...users,
              email: e.target.value,
            })
          }

          onChangePassword={(e) =>
            setUsers({
              ...users,
              password: e.target.value,
            })
          }

          onSignUp={() =>
            router.push("/register")
          }
        />

      </div>

    </div>
  );
}