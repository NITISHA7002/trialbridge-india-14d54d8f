import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — TrialBridge India" },
      { name: "description", content: "TrialBridge India is an informational service. Always consult your doctor before joining a clinical trial." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-[color:var(--brand-dark)]">Terms & Conditions</h1>
      <p className="mt-6 text-base text-foreground/85 leading-relaxed">
        TrialBridge India is an informational service only. It is not a substitute for
        professional medical advice. Always consult your doctor before joining any clinical
        trial. Trial data is sourced from ClinicalTrials.gov and may change without notice.
      </p>
    </div>
  );
}