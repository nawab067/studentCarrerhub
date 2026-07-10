import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/adminportal/",
          "/teacherportal/",
          "/studentportal/",
          "/login",
        ],
      },
    ],
    sitemap: "https://student-carrerhub.vercel.app/sitemap.xml",
  };
}