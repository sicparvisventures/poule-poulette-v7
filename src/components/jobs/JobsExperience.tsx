"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PromotionStrip } from "@/components/marketing/PromotionStrip";
import {
  jobsMarqueePhrases,
  jobsOpenings,
  jobsPageCopy,
  jobsUI,
  type JobsLocale,
} from "@/content/jobsPage";
import { useMarketingSnapshot } from "@/lib/marketing-admin/store";

const ease = [0.22, 1, 0.36, 1] as const;
const LOCALES: JobsLocale[] = ["nl", "en", "fr"];

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  preferredLocation: string;
  availability: string;
  motivation: string;
  cvUrl: string;
  company: string;
};

const EMPTY_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  preferredLocation: "",
  availability: "",
  motivation: "",
  cvUrl: "",
  company: "",
};

function JobsMarqueeBand() {
  const phrases = useMarketingSnapshot((state) => state.jobsMarqueePhrases);
  const segment = `${(phrases.length ? phrases : jobsMarqueePhrases).join(" · ")} · `;
  return (
    <div className="relative isolate overflow-hidden border-b border-pp-white/12" role="presentation" aria-hidden>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-pp-olive via-[#1e3d38] to-pp-olive" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-pp-creme/18" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-pp-creme/14" />
      <div className="relative overflow-hidden py-1.5">
        <div className="flex w-full overflow-hidden">
          <div className="pp-hero-deck-marquee-inner">
            <span className="font-display whitespace-nowrap text-xs tracking-[0.14em] text-pp-lollypop uppercase md:text-sm">
              {segment}
            </span>
            <span
              className="font-display whitespace-nowrap text-xs tracking-[0.14em] text-pp-lollypop uppercase md:text-sm"
              aria-hidden
            >
              {segment}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function fieldClass() {
  return "w-full border border-pp-olive/18 bg-pp-white/82 px-2.5 py-2 text-sm text-pp-olive outline-none transition-colors focus:border-pp-lollypop/55";
}

export function JobsExperience() {
  const reduceMotion = useReducedMotion();
  const managedJobs = useMarketingSnapshot((state) => state.jobs);
  const managedPageCopy = useMarketingSnapshot((state) => state.jobsPageCopy);
  const managedUi = useMarketingSnapshot((state) => state.jobsUi);
  const jobs = useMemo(
    () => (managedJobs.length ? managedJobs : [...jobsOpenings]),
    [managedJobs],
  );
  const pageCopy = managedPageCopy.title ? managedPageCopy : jobsPageCopy;
  const ui = managedUi.applyNow ? managedUi : jobsUI;
  const [locale, setLocale] = useState<JobsLocale>("nl");
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const activeJob = useMemo(
    () => jobs.find((job) => job.id === activeJobId) ?? null,
    [activeJobId, jobs],
  );

  useEffect(() => {
    if (!activeJobId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveJobId(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [activeJobId]);

  useEffect(() => {
    if (!activeJob) {
      setForm(EMPTY_FORM);
      setSending(false);
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [activeJob]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeJob) return;
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.fullName.trim() || !form.email.trim() || !form.motivation.trim()) {
      setErrorMsg(ui.errors.required[locale]);
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          jobId: activeJob.id,
          jobTitle: activeJob.title[locale],
          ...form,
        }),
      });

      if (!res.ok) {
        setErrorMsg(ui.errors.submit[locale]);
        return;
      }

      setSuccessMsg(ui.success[locale]);
      setForm(EMPTY_FORM);
    } catch {
      setErrorMsg(ui.errors.submit[locale]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="font-display flex min-h-dvh flex-col bg-pp-white text-pp-black">
      <header className="shrink-0 border-b border-pp-white/10 bg-linear-to-b from-pp-olive to-[#152a26] px-4 py-3 text-pp-creme sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/"
            className="text-[0.66rem] tracking-[0.2em] text-pp-creme/82 uppercase underline-offset-4 transition-colors hover:text-pp-lollypop"
          >
            ← {ui.backHome[locale]}
          </Link>
          <p className="text-center text-base sm:text-lg">Poule &amp; Poulette</p>
          <Link
            href="/menu"
            className="hidden w-28 text-right text-[0.62rem] tracking-[0.2em] text-pp-creme/50 uppercase transition-colors hover:text-pp-lollypop sm:block"
          >
            {ui.menu[locale]}
          </Link>
        </div>
      </header>

      <JobsMarqueeBand />
      <PromotionStrip placement="jobs-page" />

      <main className="relative flex flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
          <Image
            src="/images/olive-band-doodle-overlay.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        <section className="relative z-10 border-b border-pp-olive/10 px-5 py-7 sm:px-8 md:py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 rounded-none border border-pp-olive/14 bg-[#fbf8ec] p-4 shadow-[0_14px_36px_rgb(28_56_52/0.1)] sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-5">
            <div className="min-w-0">
              <h1 className="text-3xl text-pp-olive sm:text-[2rem]">{pageCopy.title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-pp-black/74">
                {pageCopy.intro[locale]}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <a
                href={`mailto:${pageCopy.mailto}`}
                className="rounded-none border border-pp-olive/24 bg-pp-olive px-4 py-2 text-[0.66rem] tracking-[0.18em] text-pp-creme uppercase transition-colors hover:border-pp-lollypop/55 hover:text-pp-lollypop"
              >
                {pageCopy.ctaPrimary[locale]}
              </a>
              <Link
                href="/locations"
                className="rounded-none border border-pp-olive/22 bg-pp-white/70 px-4 py-2 text-[0.66rem] tracking-[0.18em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop/45 hover:text-pp-lollypop"
              >
                {pageCopy.ctaSecondary[locale]}
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-3 flex w-full max-w-6xl justify-end gap-1.5">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                type="button"
                className={`border px-2.5 py-1 text-[0.62rem] tracking-[0.18em] uppercase transition-colors ${
                  locale === loc
                    ? "border-pp-lollypop/55 bg-pp-lollypop/14 text-pp-lollypop"
                    : "border-pp-olive/20 bg-pp-white/65 text-pp-olive/70 hover:border-pp-lollypop/45 hover:text-pp-lollypop"
                }`}
                onClick={() => setLocale(loc)}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        <section className="relative z-10 px-5 py-8 sm:px-8 md:py-10" aria-labelledby="jobs-openings-heading">
          <div className="mx-auto max-w-6xl">
            <h2 id="jobs-openings-heading" className="sr-only">
              Open positions
            </h2>
            <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
              {jobs.map((job, i) => (
                <motion.li
                  key={job.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: reduceMotion ? 0 : 0.05 * i, ease }}
                  className="flex"
                >
                  <article className="flex w-full flex-col rounded-none border border-pp-olive/14 bg-[#fdfbf4] shadow-[0_10px_30px_rgb(16_28_24/0.08)]">
                    <div className="border-b border-pp-olive/10 px-4 py-3">
                      <p className="text-[0.58rem] tracking-[0.18em] text-pp-lollypop uppercase">
                        {job.type}
                      </p>
                      <h3 className="mt-1 text-xl text-pp-olive">{job.title[locale]}</h3>
                      <p className="mt-1 text-[0.62rem] tracking-[0.12em] text-pp-olive/60 uppercase">
                        {job.place}
                      </p>
                    </div>
                    <div className="flex flex-1 flex-col px-4 py-3">
                      <p className="text-sm leading-relaxed text-pp-black/72">{job.summary[locale]}</p>
                      <button
                        type="button"
                        className="mt-5 inline-flex w-fit border-b border-pp-olive/25 pb-1 text-[0.64rem] tracking-[0.18em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop/55 hover:text-pp-lollypop"
                        onClick={() => setActiveJobId(job.id)}
                      >
                        {ui.applyNow[locale]}
                      </button>
                    </div>
                  </article>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-pp-olive/10 bg-pp-white px-5 py-6 text-center text-sm text-pp-olive/70 sm:px-8">
        <p>© Poule &amp; Poulette — Belgium</p>
      </footer>

      <AnimatePresence>
        {activeJob ? (
          <motion.div
            key="jobs-modal"
            className="fixed inset-0 z-[220] flex items-end justify-center bg-pp-black/52 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveJobId(null)}
          >
            <motion.article
              initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.24, ease }}
              className="flex max-h-[min(92dvh,58rem)] w-full max-w-5xl flex-col overflow-hidden rounded-none border border-pp-olive/18 bg-[#fbf8ec] shadow-[0_30px_90px_rgb(0_0_0/0.38)]"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`${activeJob.title[locale]} vacancy details`}
            >
              <header className="border-b border-pp-olive/12 px-4 py-3 sm:px-5 sm:py-4">
                <p className="text-[0.58rem] tracking-[0.2em] text-pp-lollypop uppercase">{activeJob.type}</p>
                <h3 className="mt-1 text-2xl text-pp-olive sm:text-3xl">{activeJob.title[locale]}</h3>
                <p className="mt-1 text-[0.62rem] tracking-[0.12em] text-pp-olive/62 uppercase">{activeJob.place}</p>
              </header>

              <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
                <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="space-y-4">
                    <section className="rounded-none border border-pp-olive/12 bg-pp-white/55 p-3">
                      <h4 className="text-[0.62rem] tracking-[0.18em] text-pp-olive uppercase">{ui.whatYouDo[locale]}</h4>
                      <ul className="mt-2 space-y-1.5">
                        {activeJob.responsibilities[locale].map((item) => (
                          <li key={item} className="text-sm leading-relaxed text-pp-black/76">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="rounded-none border border-pp-olive/12 bg-pp-white/55 p-3">
                      <h4 className="text-[0.62rem] tracking-[0.18em] text-pp-olive uppercase">{ui.profile[locale]}</h4>
                      <ul className="mt-2 space-y-1.5">
                        {activeJob.profile[locale].map((item) => (
                          <li key={item} className="text-sm leading-relaxed text-pp-black/76">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="rounded-none border border-pp-olive/12 bg-pp-white/55 p-3">
                      <h4 className="text-[0.62rem] tracking-[0.18em] text-pp-olive uppercase">{ui.offer[locale]}</h4>
                      <ul className="mt-2 space-y-1.5">
                        {activeJob.offer[locale].map((item) => (
                          <li key={item} className="text-sm leading-relaxed text-pp-black/76">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="rounded-none border border-pp-olive/12 bg-pp-white/55 p-3">
                      <h4 className="text-[0.62rem] tracking-[0.18em] text-pp-olive uppercase">{ui.practical[locale]}</h4>
                      <ul className="mt-2 space-y-1.5">
                        {activeJob.practical[locale].map((item) => (
                          <li key={item} className="text-sm leading-relaxed text-pp-black/76">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="rounded-none border border-pp-olive/12 bg-pp-white/55 p-3">
                      <h4 className="text-[0.62rem] tracking-[0.18em] text-pp-olive uppercase">{ui.process[locale]}</h4>
                      <ol className="mt-2 grid gap-1.5 sm:grid-cols-2">
                        {activeJob.process[locale].map((step, i) => (
                          <li key={step} className="border border-pp-olive/12 bg-pp-creme/45 px-2 py-1.5 text-[0.7rem] text-pp-olive">
                            {i + 1}. {step}
                          </li>
                        ))}
                      </ol>
                    </section>
                  </div>

                  <section className="rounded-none border border-pp-olive/14 bg-pp-white/68 p-3">
                    <h4 className="text-[0.62rem] tracking-[0.18em] text-pp-lollypop uppercase">{ui.formTitle[locale]}</h4>
                    <p className="mt-1 text-sm text-pp-black/72">{ui.formIntro[locale]}</p>

                    <form className="mt-3 space-y-2.5" onSubmit={handleSubmit}>
                      <input
                        type="text"
                        className="hidden"
                        value={form.company}
                        onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden
                      />

                      <div>
                        <label className="mb-1 block text-[0.62rem] tracking-[0.16em] text-pp-olive/78 uppercase">
                          {ui.labels.fullName[locale]} *
                        </label>
                        <input
                          className={fieldClass()}
                          value={form.fullName}
                          onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-[0.62rem] tracking-[0.16em] text-pp-olive/78 uppercase">
                            {ui.labels.email[locale]} *
                          </label>
                          <input
                            type="email"
                            className={fieldClass()}
                            value={form.email}
                            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[0.62rem] tracking-[0.16em] text-pp-olive/78 uppercase">
                            {ui.labels.phone[locale]}
                          </label>
                          <input
                            className={fieldClass()}
                            value={form.phone}
                            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-[0.62rem] tracking-[0.16em] text-pp-olive/78 uppercase">
                          {ui.labels.preferredLocation[locale]}
                        </label>
                        <input
                          className={fieldClass()}
                          placeholder={ui.placeholders.preferredLocation[locale]}
                          value={form.preferredLocation}
                          onChange={(e) => setForm((prev) => ({ ...prev, preferredLocation: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[0.62rem] tracking-[0.16em] text-pp-olive/78 uppercase">
                          {ui.labels.availability[locale]}
                        </label>
                        <input
                          className={fieldClass()}
                          placeholder={ui.placeholders.availability[locale]}
                          value={form.availability}
                          onChange={(e) => setForm((prev) => ({ ...prev, availability: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[0.62rem] tracking-[0.16em] text-pp-olive/78 uppercase">
                          {ui.labels.motivation[locale]} *
                        </label>
                        <textarea
                          className={`${fieldClass()} min-h-24 resize-y`}
                          placeholder={ui.placeholders.motivation[locale]}
                          value={form.motivation}
                          onChange={(e) => setForm((prev) => ({ ...prev, motivation: e.target.value }))}
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[0.62rem] tracking-[0.16em] text-pp-olive/78 uppercase">
                          {ui.labels.cvUrl[locale]}
                        </label>
                        <input
                          className={fieldClass()}
                          placeholder={ui.placeholders.cvUrl[locale]}
                          value={form.cvUrl}
                          onChange={(e) => setForm((prev) => ({ ...prev, cvUrl: e.target.value }))}
                        />
                      </div>

                      {errorMsg ? <p className="text-sm text-pp-christmas">{errorMsg}</p> : null}
                      {successMsg ? <p className="text-sm text-pp-olive">{successMsg}</p> : null}

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <button
                          type="button"
                          className="border border-pp-olive/22 px-3 py-2 text-[0.62rem] tracking-[0.16em] text-pp-olive uppercase transition-colors hover:border-pp-lollypop/45 hover:text-pp-lollypop"
                          onClick={() => setActiveJobId(null)}
                        >
                          {ui.close[locale]}
                        </button>
                        <button
                          type="submit"
                          disabled={sending}
                          className="border border-pp-olive/24 bg-pp-olive px-3 py-2 text-[0.62rem] tracking-[0.16em] text-pp-creme uppercase transition-colors hover:border-pp-lollypop/55 hover:text-pp-lollypop disabled:opacity-60"
                        >
                          {sending ? ui.submit.sending[locale] : ui.submit.idle[locale]}
                        </button>
                      </div>
                    </form>
                  </section>
                </div>
              </div>
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
