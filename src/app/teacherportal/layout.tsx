import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TeacherPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}