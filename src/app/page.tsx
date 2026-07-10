import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Student Career Hub",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Home() {
  return (
    redirect("/login")
  );
}
