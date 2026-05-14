import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  "MY_SECRET_KEY"
);

export async function middleware(
  request: NextRequest
) {

  const token =
    request.cookies.get("token")?.value;

  const pathname =
    request.nextUrl.pathname;

  // =========================
  // PROTECTED ROUTES
  // =========================

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/teacherportal") ||
    pathname.startsWith("/studentPortal")
  ) {

    // No Token
    if (!token) {

      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    try {

      // Verify JWT
      await jwtVerify(
        token,
        SECRET_KEY
      );

      return NextResponse.next();

    } catch (error) {

      // Token expired or invalid

      const response =
        NextResponse.redirect(
          new URL("/login", request.url)
        );

      response.cookies.delete("token");

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacherportal/:path*",
    "/studentPortal/:path*",
  ],
};