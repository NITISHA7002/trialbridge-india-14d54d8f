import { createFileRoute, Link } from "@tanstack/react-router";
import { Hospital } from "lucide-react";

export const Route = createFileRoute("/hospitals")({
  head: () => ({
    meta: [
      { title: "Leading Indian Research Institutions — TrialBridge" },
      { name: "description", content: "Real Indian institutions running clinical trials across the country." },
      { property: "og:title", content: "Leading Indian Research Institutions — TrialBridge" },
      { property: "og:description", content: "AIIMS, Tata Memorial, CMC Vellore, NIMHANS, PGIMER, SGPGI and more." },
    ],
  }),
  component: HospitalsPage,
});

const HOSPITALS = [
  { name: "AIIMS", city: "New Delhi", areas: ["Oncology", "Cardiology", "Neurology"] },
  { name: "Tata Memorial Centre", city: "Mumbai", areas: ["Cancer", "Radiation"] },
  { name: "CMC Vellore", city: "Tamil Nadu", areas: ["Hematology", "Infectious Disease"] },
  { name: "NIMHANS", city: "Bengaluru", areas: ["Mental Health", "Neurology"] },
  { name: "PGIMER", city: "Chandigarh", areas: ["Internal Medicine", "Surgery"] },
  { name: "SGPGI", city: "Lucknow", areas: ["Gastroenterology", "Nephrology"] },
];

function HospitalsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--brand-dark)]">
          Leading Indian Research Institutions
        </h1>
        <p className="mt-2 text-muted-foreground">
          Real institutions running clinical trials across India.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {HOSPITALS.map((h) => (
          <article key={h.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3 flex flex-col">
            <div className="h-10 w-10 rounded-lg bg-[color:var(--brand-soft)] flex items-center justify-center text-[color:var(--brand-dark)]">
              <Hospital className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[color:var(--brand-dark)]">{h.name}</h3>
              <p className="text-xs text-muted-foreground">{h.city}</p>
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {h.areas.map((a) => (
                <li key={a} className="text-[11px] bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] rounded-full px-2 py-0.5">
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-2">
              <Link
                to="/find-trials"
                search={{ city: h.city }}
                className="inline-flex items-center rounded-md bg-[color:var(--brand-dark)] px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Find their trials
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}