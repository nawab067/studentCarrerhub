import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Student Career Hub",
};

export default function Home() {
  redirect("/login");
}