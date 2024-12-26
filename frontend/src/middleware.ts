import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {jwtDecode} from "jwt-decode";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const pathname = request.nextUrl.pathname;

  // Handle authenticated users
  if (token) {
    try {
      const { role }: { role: string } = jwtDecode(token);

      // Redirect authenticated users trying to access /auth pages
      if (pathname.startsWith("/auth")) {
        const redirectPath = role === "admin" ? "/admin" : "/user";
        if (pathname !== redirectPath) {
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      }

      // Restrict users based on their roles
      if (role === "admin" && !pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      if (role === "user" && !pathname.startsWith("/user")) {
        return NextResponse.redirect(new URL("/user", request.url));
      }

      // Allow access to valid paths
      return NextResponse.next();
    } catch (error) {
      console.error("Token decode error:", error);
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // Handle unauthenticated users
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access protected routes
  return NextResponse.redirect(new URL("/auth/signin", request.url));
}

export const config = {
  matcher: ["/auth/:path*", "/admin/:path*", "/user/:path*"],
};
