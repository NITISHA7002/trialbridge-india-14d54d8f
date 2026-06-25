import { createFileRoute } from "@tanstack/react-router";
import { Shield, Sparkles, Heart, MapPin } from "lucide-react";

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
  const cards = [
    { icon: Shield, title: "Trustworthy by design", body: "Real data from the official ClinicalTrials.gov registry, surfaced without edits to the source record." },
    { icon: Sparkles, title: "AI for understanding, not advice", body: "AI summaries help you understand what a study means. Final eligibility is always confirmed by the research team." },
    { icon: Heart, title: "Built for families", body: "Designed for patients, caregivers, and elderly users with no medical background." },
    { icon: MapPin, title: "India first", body: "We prioritise trials available in India so families see relevant opportunities first." },
  ];
  return (
    <div className="tb-bg-about">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
        <div className="text-center">
          <span className="inline-block text-xs font-semibold tracking-widest px-3 py-1 rounded-full bg-[#e8f5e9]" style={{ color: "#2d7a4f" }}>
            ABOUT US
          </span>
          <h1 className="mt-5 text-3xl sm:text-5xl font-bold text-black tracking-tight">
            A trusted bridge between patients and research
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            ClinicalTrials.gov contains valuable information but it can be difficult for ordinary patients to read. TrialBridge India makes clinical trials easy to discover, easy to understand, and easy to explore in plain language built for Indian patients and families.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {cards.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-2xl bg-white p-5 shadow-sm tb-card-hover flex gap-4" style={{ border: "1px solid #c8e6d2" }}>
              <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#e8f5e9", color: "#2d7a4f" }}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[color:var(--brand-dark)]">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl p-8 text-white shadow-sm" style={{ backgroundColor: "#2d7a4f" }}>
          <h2 className="text-xl font-semibold">Our Vision</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/95">
            Every year in India, hundreds of life-saving clinical trials go unfilled not because patients do not exist but because patients do not know. TrialBridge was built to change that.
          </p>
        </div>

        <div className="mt-12 text-center space-y-2">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground">CONCEPT &amp; PRODUCT VISION</p>
          <p className="text-xl font-bold" style={{ color: "#2d7a4f" }}>Nandini Gandhi &amp; Nitisha Solanki</p>
          <p className="text-sm text-muted-foreground">We believe that patients deserve better.</p>
          <p className="text-[11px] text-muted-foreground">© 2026 TrialBridge India. Powered by ClinicalTrials.gov public data.</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <section className="rounded-2xl bg-white p-5 shadow-sm" style={{ border: "1px solid #c8e6d2" }}>
            <h3 className="font-semibold text-[color:var(--brand-dark)]">Privacy Policy</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              TrialBridge India does not require an account and does not store your health information. When you submit an I'm Interested form, your name, phone, email, and preferred contact time are shared only with the research team for that specific study. We do not sell or share your information with third parties.
            </p>
          </section>
          <section className="rounded-2xl bg-white p-5 shadow-sm" style={{ border: "1px solid #c8e6d2" }}>
            <h3 className="font-semibold text-[color:var(--brand-dark)]">Terms and Conditions</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              TrialBridge India is an informational service and is not a substitute for professional medical advice. Always seek the advice of your physician before joining any clinical trial. Trial data is provided by ClinicalTrials.gov and may change without notice.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}