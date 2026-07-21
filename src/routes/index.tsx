import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Hospital, ShieldCheck, Lock, HeartHandshake, Database, Globe2, Activity, CheckCircle2, ClipboardCheck } from "lucide-react";
import heroImage from "@/assets/hero-hackthon-2.jpg.asset.json";


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
      <section className="tb-bg-hero">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid gap-10 items-center lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <span className="inline-block rounded-full bg-[#e8f5e9] text-[#2d7a4f] text-xs font-semibold px-3 py-1 mb-6">
                Trusted patient platform for India
              </span>
              <h1 className="tb-hero-title font-bold text-black tracking-tight">
                Helping every patient discover new treatment opportunities
              </h1>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl">
                Find clinical trials from trusted hospitals, understand eligibility in simple language, and connect with right opportunities in minutes.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link
                  to="/find-trials"
                  className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white tb-btn-glow"
                  style={{ backgroundColor: "#2d7a4f" }}
                >
                  <Search className="h-4 w-4" /> Find matching trials
                </Link>
                <Link
                  to="/eligibility"
                  className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold"
                  style={{ color: "#2d7a4f", border: "2px solid #2d7a4f" }}
                >
                  <ClipboardCheck className="h-4 w-4" /> Check my eligibility
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 text-sm text-foreground/80">
                {[
                  "Real ClinicalTrials.gov Data",
                  "AI-Powered Simplification",
                  "Patient-Friendly Language",
                  "Trusted Research Institutions",
                ].map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" style={{ color: "#2d7a4f" }} /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src={heroImage.url}
                alt="Nurse consulting with a young couple at home"
                className="rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-[3/2] object-cover object-center"
              />
            </div>
          </div>
        </div>
        {/* Wave divider */}
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full h-10" aria-hidden="true">
          <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#e8f5e9" />
        </svg>
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
            <div key={title} className="rounded-2xl border border-border bg-card p-6 text-center tb-card-hover">
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
            { n: "500+", l: "Recruiting trials in India" },
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

      {/* Why Trust TrialBridge */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[color:var(--brand-dark)]">
          Why Trust TrialBridge
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: ShieldCheck, title: "Official source", body: "Every trial comes directly from ClinicalTrials.gov, the U.S. government registry." },
            { icon: Lock, title: "Private by default", body: "No search data is stored. Your name and phone are only shared if you choose to register." },
            { icon: HeartHandshake, title: "Built for patients", body: "Free forever. Plain-English summaries created for Indian patients with no medical background." },
            { icon: Database, title: "Always up to date", body: "Results are fetched live every time you search — no stale or outdated listings." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5 tb-card-hover">
              <div className="h-10 w-10 rounded-lg bg-[color:var(--brand-soft)] flex items-center justify-center text-[color:var(--brand-dark)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-semibold text-[color:var(--brand-dark)]">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Powered by Official Data */}
      <section className="bg-[color:var(--brand)] text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold">Powered by Official Data</h2>
          <div className="mt-8 grid sm:grid-cols-3 gap-8">
            {[
              { icon: Globe2, n: "ClinicalTrials.gov", l: "U.S. National Library of Medicine" },
              { icon: Activity, n: "Live API", l: "Real-time recruiting trials in India" },
              { icon: ShieldCheck, n: "Ethics-approved", l: "Every listed trial cleared by a regulator" },
            ].map(({ icon: Icon, n, l }) => (
              <div key={l} className="flex flex-col items-center">
                <Icon className="h-7 w-7 opacity-90" />
                <div className="mt-3 text-lg font-semibold">{n}</div>
                <div className="mt-1 text-sm text-primary-foreground/85">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
