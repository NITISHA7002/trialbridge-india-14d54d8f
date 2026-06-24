import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TrialBridge India" },
      { name: "description", content: "Built by students, for patients. Bridging Indian patients to life-saving clinical trials." },
      { property: "og:title", content: "About TrialBridge India" },
      { property: "og:description", content: "Built by students, for patients. Bridging Indian patients to life-saving clinical trials." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="bg-[color:var(--brand-soft)]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--brand-dark)]">About TrialBridge India</h1>
        </div>

        <p className="mt-10 text-center text-lg sm:text-xl font-medium leading-relaxed text-[color:var(--brand-dark)]">
          Two students from MITS Gwalior who believed patients deserve better.
          <br />
          Built by Nandini Gandhi &amp; Nitisha Solanki.
        </p>

        <div className="mt-10 rounded-2xl bg-[color:var(--brand)] text-primary-foreground p-8 shadow-sm">
          <h2 className="text-xl font-semibold">Our Vision</h2>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/95">
            Every year in India, hundreds of life-saving clinical trials go unfilled
            not because patients do not exist, but because patients do not know.
            TrialBridge was built to change that. We believe no patient should miss
            a treatment opportunity simply because the information was too complex
            to find. Building the bridge between patients and life-saving clinical
            trials through technology.
          </p>
        </div>
      </div>
    </div>
  );
}