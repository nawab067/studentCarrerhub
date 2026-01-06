"use client";

import TeacherPortalSidebar from "@/components/teacher-portal/teacherportal-sidebar";
import { useTheme } from "@/context/themeContext";

export default function TeacherSettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen">
      <TeacherPortalSidebar />

      <div className="p-6 w-full">
        <h1 className="text-center text-2xl font-bold mb-6">
          Settings
        </h1>

        <div className="max-w-md mx-auto bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">
              Theme Mode
            </span>

            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
