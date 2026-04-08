import { NextResponse } from "next/server";
import type { JobsLocale } from "@/content/jobsPage";

type ApplyPayload = {
  locale?: JobsLocale;
  jobId?: string;
  jobTitle?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  preferredLocation?: string;
  availability?: string;
  motivation?: string;
  cvUrl?: string;
  company?: string;
};

function sanitize(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ApplyPayload;
    const locale = sanitize(body.locale || "nl");
    const jobId = sanitize(body.jobId);
    const jobTitle = sanitize(body.jobTitle);
    const fullName = sanitize(body.fullName);
    const email = sanitize(body.email);
    const phone = sanitize(body.phone);
    const preferredLocation = sanitize(body.preferredLocation);
    const availability = sanitize(body.availability);
    const motivation = sanitize(body.motivation);
    const cvUrl = sanitize(body.cvUrl);
    const company = sanitize(body.company);

    if (company) {
      return NextResponse.json({ ok: true }, { status: 202 });
    }

    if (!jobId || !jobTitle || !fullName || !email || !motivation) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const toEmail = process.env.JOBS_TO_EMAIL;
    const fromEmail = process.env.JOBS_FROM_EMAIL || "Poule & Poulette Jobs <jobs@poulepoulette.com>";
    const resendApiKey = process.env.RESEND_API_KEY;

    const mailText = [
      "New jobs application",
      "",
      `Locale: ${locale || "nl"}`,
      `Job ID: ${jobId}`,
      `Job title: ${jobTitle}`,
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone || "-"}`,
      `Preferred location: ${preferredLocation || "-"}`,
      `Availability: ${availability || "-"}`,
      `CV/LinkedIn: ${cvUrl || "-"}`,
      "",
      "Motivation:",
      motivation,
    ].join("\n");

    if (resendApiKey && toEmail) {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          subject: `Jobs application - ${jobTitle} - ${fullName}`,
          text: mailText,
          reply_to: email,
        }),
      });

      if (!resendResponse.ok) {
        const details = await resendResponse.text();
        return NextResponse.json(
          { ok: false, error: "Email provider error", details },
          { status: 502 },
        );
      }

      return NextResponse.json({ ok: true }, { status: 200 });
    }

    console.info("[jobs/apply] Fallback submission (no email provider configured):", {
      locale,
      jobId,
      jobTitle,
      fullName,
      email,
      phone,
      preferredLocation,
      availability,
      motivation,
      cvUrl,
    });

    return NextResponse.json(
      { ok: true, mode: "dev-log" },
      { status: 202 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload" },
      { status: 400 },
    );
  }
}
