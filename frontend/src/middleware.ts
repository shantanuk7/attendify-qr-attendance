import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {jwtDecode} from "jwt-decode";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  try {
    const { role }: { role: string } = jwtDecode(token);
    const pathname = request.nextUrl.pathname;

    if (role === "admin" && !pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (role === "user" && !pathname.startsWith("/user")) {
      return NextResponse.redirect(new URL("/user", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/auth/singup", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
