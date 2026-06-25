import { useState } from "react";
import { ChevronDown, ChevronRight, Mail, MapPin, Phone, Share2 } from "lucide-react";
import type { Trial } from "@/lib/clinical-trials";
import { SimplifiedSummary } from "./SimplifiedSummary";
import { RegisterInterestModal } from "./RegisterInterestModal";

function MatchRing({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  const r = 22;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="text-center shrink-0">
      <div className="relative h-14 w-14">
        <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
          <circle cx="28" cy="28" r={r} stroke="#e8f5e9" strokeWidth="5" fill="none" />
          <circle
            cx="28" cy="28" r={r}
            stroke="#2d7a4f" strokeWidth="5" fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: "#2d7a4f" }}>
          {pct}
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground mt-1">Match</div>
    </div>
  );
}

export function TrialCard({ trial }: { trial: Trial }) {
  const [showElig, setShowElig] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);

  const shareText = `Clinical trial in India: ${trial.title} (${trial.nctId}). Learn more: https://clinicaltrials.gov/study/${trial.nctId}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 tb-trial-card tb-card-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h3 className="font-semibold text-[color:var(--brand-dark)] leading-snug">{trial.title}</h3>
          <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
            <span>Phase: {trial.phase}</span>
            <span>NCT ID: {trial.nctId}</span>
          </div>
          {trial.locations.length > 0 && (
            <div className="text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-start gap-1">
                <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                <span>
                  {[trial.locations[0].facility, trial.locations[0].city]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
              {trial.locations.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowAllLocations((v) => !v)}
                  className="inline-flex items-center gap-0.5 text-primary font-medium hover:underline"
                >
                  <ChevronRight className={`h-3 w-3 transition-transform ${showAllLocations ? "rotate-90" : ""}`} />
                  {showAllLocations
                    ? "Hide locations"
                    : `+${trial.locations.length - 1} more location${trial.locations.length - 1 === 1 ? "" : "s"} →`}
                </button>
              )}
              {showAllLocations && trial.locations.length > 1 && (
                <ul className="space-y-2 pt-1 pl-1">
                  {trial.locations.map((l, i) => (
                    <li key={i} className="border-l-2 border-[color:var(--brand)]/30 pl-2">
                      <div className="flex items-start gap-1">
                        <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>
                          {[l.facility, l.city].filter(Boolean).join(" · ")}
                          {l.status && ` — ${l.status.replace(/_/g, " ").toLowerCase()}`}
                        </span>
                      </div>
                      {l.contacts.length > 0 && (
                        <div className="ml-4 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                          {l.contacts.map((c, j) => (
                            <span key={j} className="flex flex-wrap gap-x-2">
                              {c.phone && (
                                <a href={`tel:${c.phone}`} className="text-primary hover:underline inline-flex items-center gap-0.5">
                                  <Phone className="h-3 w-3" /> {c.phone}
                                </a>
                              )}
                              {c.email && (
                                <a href={`mailto:${c.email}`} className="text-primary hover:underline inline-flex items-center gap-0.5 break-all">
                                  <Mail className="h-3 w-3" /> {c.email}
                                </a>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <MatchRing score={trial.matchScore} />
      </div>

      {trial.briefSummary && (
        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{trial.briefSummary}</p>
      )}

      {trial.matchReasons.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {trial.matchReasons.map((r) => (
            <li key={r} className="text-[11px] bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] rounded-full px-2 py-0.5">
              {r}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setShowElig((v) => !v)}
        className="flex items-center gap-1 text-xs font-medium text-primary"
      >
        <ChevronDown className={`h-3 w-3 transition-transform ${showElig ? "rotate-180" : ""}`} />
        {showElig ? "Hide" : "Show"} eligibility details
      </button>
      {showElig && (
        <pre className="whitespace-pre-wrap font-sans text-xs text-muted-foreground bg-muted/40 rounded-md p-3 max-h-60 overflow-y-auto">
          {trial.eligibility || "No eligibility details provided."}
        </pre>
      )}

      <SimplifiedSummary trial={trial} />

      <div className="rounded-md border border-border bg-muted/30 p-3 text-xs space-y-1.5">
        {trial.contacts.length > 0 ? (
          trial.contacts.map((c, i) => (
            <div key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {c.name && <span className="font-medium text-[color:var(--brand-dark)]">{c.name}</span>}
              {c.phone && (
                <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                  <Phone className="h-3 w-3" /> {c.phone}
                </a>
              )}
              {c.email && (
                <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1 text-primary hover:underline break-all">
                  <Mail className="h-3 w-3" /> {c.email}
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="text-muted-foreground">
            Contact via ClinicalTrials.gov — NCT ID: {trial.nctId}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          onClick={() => setShowRegister(true)}
          className="rounded-md border border-[color:var(--brand)] text-[color:var(--brand-dark)] px-3 py-2 text-sm font-medium hover:bg-[color:var(--brand-soft)]"
        >
          Register Interest
        </button>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          <Share2 className="h-3.5 w-3.5" /> Share on WhatsApp
        </a>
        <a
          href={`https://clinicaltrials.gov/study/${trial.nctId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md px-3 py-2 text-sm font-medium text-primary hover:underline"
        >
          View on ClinicalTrials.gov →
        </a>
      </div>

      {showRegister && (
        <RegisterInterestModal trial={trial} onClose={() => setShowRegister(false)} />
      )}
    </article>
  );
}