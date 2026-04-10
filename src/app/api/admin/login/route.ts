import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  isAdminConfigured,
  isValidAdminPassword,
} from "@/lib/auth/admin";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD ontbreekt op de server." },
      { status: 500 },
    );
  }

  if (!isValidAdminPassword(password ?? "")) {
    return NextResponse.json(
      { ok: false, error: "Ongeldig wachtwoord." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSessionValue(password ?? ""),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
