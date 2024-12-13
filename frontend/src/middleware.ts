import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  // If the user is already logged in, redirect to their respective page
  if (token) {
    try {
      const { role }: { role: string } = jwtDecode(token);
      const pathname = request.nextUrl.pathname;

      // Redirect to /user or /admin based on the role if they are already logged in
      if (pathname.startsWith("/auth")) {
        if (role === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        if (role === "user") {
          return NextResponse.redirect(new URL("/user", request.url));
        }
      }

      // Admin and user route handling
      if (role === "admin" && !pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      if (role === "user" && !pathname.startsWith("/user")) {
        return NextResponse.redirect(new URL("/user", request.url));
      }

    } catch (error) {
      console.error("Token decode error:", error);
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // If no token exists, allow access to /auth pages (signin, signup)
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // For other paths, continue as normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/admin/:path*", "/user/:path*"],
};
