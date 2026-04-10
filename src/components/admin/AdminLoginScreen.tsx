"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AdminLoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const body = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !body.ok) {
        setError(body.error || "Inloggen mislukt. Controleer je wachtwoord.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="relative flex min-h-dvh flex-col bg-pp-olive px-4 py-10 sm:px-6 sm:py-14">
      {/* Rustige diepte: alleen olijftinten, geen harde kleurverloop */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_65%_at_50%_-15%,rgb(40_72_66/0.45),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.12)_0%,transparent_35%,rgb(0_0_0/0.18)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center">
        <div className="rounded-2xl border border-pp-white/10 bg-pp-white shadow-[0_24px_64px_rgb(0_0_0/0.28),0_0_0_1px_rgb(0_0_0/0.04)_inset]">
          <div className="border-b border-pp-olive/[0.08] px-8 pb-6 pt-8 sm:px-10 sm:pt-10">
            <p className="font-accent text-[0.55rem] tracking-[0.32em] text-pp-olive/50 uppercase">
              Backstage
            </p>
            <h1 className="font-display mt-3 text-[1.75rem] leading-tight tracking-wide text-pp-olive sm:text-[2rem]">
              Marketing console
            </h1>
            <p className="font-display mt-3 text-sm leading-relaxed text-pp-black/65 sm:text-[0.9375rem]">
              Beveiligde toegang voor beheerders. Na aanmelding werk je verder onder{" "}
              <span className="font-mono text-[0.8125rem] text-pp-olive/80">/admin</span> op dit
              domein.
            </p>
          </div>

          <form className="space-y-5 px-8 py-8 sm:px-10" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="backstage-password"
                className="font-accent text-[0.55rem] tracking-[0.22em] text-pp-olive/55 uppercase"
              >
                Wachtwoord
              </label>
              <input
                id="backstage-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-lg border border-pp-olive/15 bg-pp-white px-3.5 py-2.5 text-sm text-pp-black shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-pp-black/35 focus:border-pp-olive/35 focus:ring-2 focus:ring-pp-lollypop/25"
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            {error ? (
              <div
                className="rounded-lg border border-pp-christmas/25 bg-pp-christmas/[0.06] px-3.5 py-2.5 font-display text-sm text-pp-christmas"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-pp-olive px-4 py-3 text-center font-accent text-[0.65rem] tracking-[0.2em] text-pp-creme uppercase shadow-sm transition-[background-color,opacity] hover:bg-[#243d38] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {pending ? "Even geduld…" : "Aanmelden"}
            </button>
          </form>

          <div className="border-t border-pp-olive/[0.08] px-8 py-5 sm:px-10">
            <p className="text-center font-display text-[0.75rem] leading-relaxed text-pp-black/45">
              Alleen voor geautoriseerd personeel van Poule &amp; Poulette.
            </p>
            <Link
              href="/"
              className="mt-4 block text-center font-accent text-[0.58rem] tracking-[0.2em] text-pp-olive/50 uppercase underline-offset-4 transition-colors hover:text-pp-lollypop"
            >
              Terug naar de site
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
