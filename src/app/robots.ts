import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/teacherportal/",
          "/studentPortal/",
        ],
      },
    ],
    sitemap: "https://student-carrerhub.vercel.app/sitemap.xml",
  };
}