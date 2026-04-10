import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  isAdminConfigured,
  isValidAdminSession,
} from "@/lib/auth/admin-edge";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/")) {
    return NextResponse.next();
  }

  if (!isAdminConfigured()) {
    return NextResponse.redirect(new URL("/backstage", request.url));
  }

  const sessionValue = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (await isValidAdminSession(sessionValue)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/backstage", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
