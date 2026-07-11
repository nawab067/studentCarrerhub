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

  title: {
    default: "Student Career Hub",
    template: "%s | Student Career Hub",
  },

  description:
    "Student Career Hub helps students discover internships, jobs, career guidance, resume tips, interview preparation, and professional growth resources.",

  keywords: [
    "Student Career Hub",
    "Student Jobs",
    "Internships",
    "Career Guidance",
    "Resume Builder",
    "Interview Preparation",
    "Fresh Graduate Jobs",
    "Pakistan Jobs",
    "Career Development",
  ],

  authors: [
    {
      name: "Nawab Haider",
    },
  ],

  creator: "Nawab Haider",

  openGraph: {
    title: "Student Career Hub",
    description:
      "Find internships, jobs, resume tips, interview preparation and career guidance.",

    url: "https://student-carrerhub.vercel.app",

    siteName: "Student Career Hub",

    locale: "en_US",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Student Career Hub",

    description:
      "Find internships, jobs and career guidance for students.",
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
