import type { Metadata } from "next";
import { JobsExperience } from "@/components/jobs/JobsExperience";
import { jobsPageCopy } from "@/content/jobsPage";

export const metadata: Metadata = {
  title: "Jobs",
  description: `${jobsPageCopy.title} — Poule & Poulette. ${jobsPageCopy.intro.nl}`,
};

export default function JobsPage() {
  return <JobsExperience />;
}
