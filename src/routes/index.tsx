import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, MessageCircle, Hospital, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrialBridge India — Find Clinical Trials in India" },
      { name: "description", content: "Discover recruiting clinical trials in India for free. Search by condition, age, and city. Simple, patient-friendly explanations powered by AI." },
      { property: "og:title", content: "TrialBridge India — Find Clinical Trials in India" },
      { property: "og:description", content: "Free patient awareness platform. Search live trials from ClinicalTrials.gov." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[color:var(--brand-soft)] to-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-28 text-center">
          <span className="inline-block rounded-full bg-[color:var(--brand)]/10 text-[color:var(--brand-dark)] text-xs font-medium px-3 py-1 mb-6">
            For patients across India · Always free
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-[color:var(--brand-dark)] leading-tight">
            Find clinical trials in India,<br className="hidden sm:block" /> explained in simple language.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            TrialBridge connects Indian patients with recruiting clinical trials from
            ClinicalTrials.gov, and rewrites the complex medical text into plain English you
            can actually understand.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/find-trials"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Search className="h-4 w-4" /> Find a Trial
            </Link>
            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 rounded-md border border-[color:var(--brand)] text-[color:var(--brand-dark)] px-5 py-3 text-sm font-semibold hover:bg-[color:var(--brand-soft)]"
            >
              <MessageCircle className="h-4 w-4" /> Ask the AI Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[color:var(--brand-dark)]">How it works</h2>
        <div className="mt-10 grid sm:grid-cols-3 gap-6">
          {[
            { icon: Search, title: "1. Search", body: "Enter the disease, age, gender, and city. We search live across all recruiting trials in India." },
            { icon: ShieldCheck, title: "2. Match", body: "Each trial gets a match score out of 100 based on age, gender, condition, and location." },
            { icon: Hospital, title: "3. Connect", body: "Read a simple, patient-friendly summary, then register interest with the hospital." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-xl bg-[color:var(--brand-soft)] flex items-center justify-center text-[color:var(--brand-dark)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-[color:var(--brand-dark)]">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[color:var(--brand-soft)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14 grid sm:grid-cols-3 gap-8 text-center">
          {[
            { n: "1000+", l: "Recruiting trials in India" },
            { n: "100%", l: "Free for patients" },
            { n: "Live", l: "Data from ClinicalTrials.gov" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl sm:text-4xl font-bold text-[color:var(--brand-dark)]">{s.n}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
