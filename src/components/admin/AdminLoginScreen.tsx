"use client";

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
        setError(body.error || "Login mislukt.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Login mislukt.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-pp-olive via-[#17302c] to-pp-christmas px-4 py-10">
      <div className="w-full max-w-md border border-pp-creme/12 bg-[#fff9ea] p-6 shadow-[0_30px_80px_rgb(0_0_0/0.25)]">
        <p className="font-accent text-[0.58rem] tracking-[0.28em] text-pp-olive/55 uppercase">
          Backstage
        </p>
        <h1 className="font-display mt-2 text-4xl text-pp-olive">Marketing Login</h1>
        <p className="font-accent mt-3 text-sm leading-relaxed text-pp-black/68">
          Verborgen toegang voor het marketingteam. Alles blijft op hetzelfde domein onder `/admin`.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="font-accent text-[0.58rem] tracking-[0.18em] text-pp-olive/55 uppercase">
              Wachtwoord
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full border border-pp-olive/18 bg-white px-3 py-2 text-sm text-pp-black outline-none focus:border-pp-lollypop"
              autoComplete="current-password"
            />
          </label>

          {error ? (
            <p className="font-accent text-sm text-pp-christmas">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full border border-pp-olive bg-pp-olive px-4 py-2 font-accent text-[0.62rem] tracking-[0.18em] text-pp-creme uppercase transition-colors hover:border-pp-lollypop hover:text-pp-lollypop disabled:opacity-60"
          >
            {pending ? "Bezig..." : "Naar Admin"}
          </button>
        </form>
      </div>
    </main>
  );
}
