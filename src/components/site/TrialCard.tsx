import { useState } from "react";
import { ChevronDown, MapPin, Share2 } from "lucide-react";
import type { Trial } from "@/lib/clinical-trials";
import { SimplifiedSummary } from "./SimplifiedSummary";
import { RegisterInterestModal } from "./RegisterInterestModal";

function scoreColor(score: number) {
  if (score >= 70) return "bg-[color:var(--brand)] text-primary-foreground";
  if (score >= 40) return "bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] border border-[color:var(--brand)]/40";
  return "bg-muted text-muted-foreground";
}

export function TrialCard({ trial }: { trial: Trial }) {
  const [showElig, setShowElig] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const primaryLocation = trial.locations[0];
  const shareText = `Clinical trial in India: ${trial.title} (${trial.nctId}). Learn more: https://clinicaltrials.gov/study/${trial.nctId}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h3 className="font-semibold text-[color:var(--brand-dark)] leading-snug">{trial.title}</h3>
          <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
            <span>Phase: {trial.phase}</span>
            <span>NCT ID: {trial.nctId}</span>
          </div>
          {primaryLocation && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {primaryLocation.facility} {primaryLocation.city && `· ${primaryLocation.city}`}
              {trial.locations.length > 1 && ` (+${trial.locations.length - 1} more)`}
            </div>
          )}
        </div>
        <div className="text-center shrink-0">
          <div className={`px-3 py-2 rounded-xl text-sm font-bold ${scoreColor(trial.matchScore)}`}>
            {trial.matchScore}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">Match Score</div>
        </div>
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