import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Clinical Trials Explained | TrialBridge India" },
      { name: "description", content: "Simple answers about clinical trials in India: safety, cost, phases, placebos, match scores, and privacy." },
      { property: "og:title", content: "FAQ — Clinical Trials Explained | TrialBridge India" },
      { property: "og:description", content: "Simple answers about clinical trials in India: safety, cost, phases, placebos, match scores, and privacy." },
    ],
  }),
  component: FaqPage,
});

const QA = [
  ["What is a clinical trial?",
   "A clinical trial is a research study where doctors test a new medicine or treatment on real patients with their full permission. Joining a trial can give you access to treatments not yet available in regular hospitals, completely free."],
  ["Is it safe to join a clinical trial?",
   "All trials in India must be approved by the government and an independent Ethics Committee before they begin. You will be told about all possible side effects before joining. You can leave at any time for any reason."],
  ["Does it cost money to join a trial?",
   "No. Joining is completely free. Medicines, tests, and hospital visits are paid for by the institution running the trial. Some trials even cover your travel costs."],
  ["What does the match score mean?",
   "The score out of 100 shows how well a trial matches your age, gender, disease, and location. Above 70 means strong match. The final decision is always made by the hospital doctor."],
  ["What happens after I register interest?",
   "The hospital team will contact you within a few days. They will check your medical history and confirm if you qualify. You are not committed to anything at this stage."],
  ["What does Phase 1, 2, 3 mean?",
   "Phase 1 checks if the medicine is safe. Phase 2 tests if it works. Phase 3 compares it to the current best treatment on a large scale. Most approved medicines went through Phase 3."],
  ["What is a placebo?",
   "A dummy medicine that looks like the real one but has nothing active in it. Used so doctors can compare results fairly. You will always be told if a placebo is used before you join."],
  ["Can I search for a family member?",
   "Yes. Enter their disease, age, gender, and city and the results will be matched to them."],
  ["My city shows no results. What to do?",
   "Leave the city field empty and search by disease only. This shows all active trials across India. Then check which hospital is reachable for you."],
  ["Is my information kept private?",
   "TrialBridge does not store any health information. Search data is never saved. Only your name and phone are shared with the specific hospital if you register interest."],
] as const;

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="tb-bg-faq">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--brand-dark)]">Frequently Asked Questions</h1>
        <p className="mt-2 text-muted-foreground">Everything a patient needs to know about clinical trials</p>
      </div>
      <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
        {QA.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <div key={q} className={i % 2 === 0 ? "bg-card" : "bg-[color:var(--brand-soft)]"}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full text-left flex items-center justify-between gap-4 px-5 py-4"
              >
                <span className="font-medium text-[color:var(--brand-dark)]">{q}</span>
                <ChevronDown className={`h-4 w-4 text-[color:var(--brand)] transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-sm text-foreground/85 leading-relaxed">{a}</div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}