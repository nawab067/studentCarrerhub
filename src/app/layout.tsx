import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../context/themeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://student-carrerhub.vercel.app"),

  applicationName: "Student Career Hub",

  title: {
    default: "Student Career Hub",
    template: "%s | Student Career Hub",
  },

  description:
    "Student Career Hub is a modern Student ERP System that helps schools, colleges, and universities manage students, teachers, classrooms, attendance, timetables, and academic records.",

  keywords: [
    "Student ERP",
    "School Management System",
    "College Management System",
    "University ERP",
    "Student Information System",
    "Education ERP",
    "Student Portal",
    "Teacher Portal",
    "Admin Portal",
    "Student Management",
    "Teacher Management",
    "Attendance Management",
    "Classroom Management",
    "Class Timetable",
    "Academic Management",
    "Educational Software",
    "Student Career Hub"
  ],

  category: "Education",

  robots: {
    index: true,
    follow: true,
  },

  authors: [
    {
      name: "Nawab Haider",
    },
  ],

  creator: "Nawab Haider",

  openGraph: {
    title: "Student Career Hub | Student ERP System",
    description:
      "Manage students, teachers, classrooms, attendance, timetables, and academic records.",
    url: "https://student-carrerhub.vercel.app",
    siteName: "Student Career Hub",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Student Career Hub | Student ERP",
    description:
      "A complete Student ERP solution for schools, colleges, and universities.",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-white
          dark:bg-gray-900
          text-black
          dark:text-white
        `}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
