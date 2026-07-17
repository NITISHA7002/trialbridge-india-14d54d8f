import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Loader2, Mail, MapPin, Phone, Share2, Sparkles } from "lucide-react";
import { scoreTrial, type SearchInput, type Trial } from "@/lib/clinical-trials";
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

export function TrialCard({
  trial,
  hideMatchScore = false,
  sharedLink = false,
}: {
  trial: Trial;
  hideMatchScore?: boolean;
  sharedLink?: boolean;
}) {
  const [showElig, setShowElig] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [showFitChecker, setShowFitChecker] = useState(false);
  const [fitResult, setFitResult] = useState<{
    score: number;
    reasons: string[];
    input: SearchInput;
  } | null>(null);

  const shareText = `Clinical trial in India: ${trial.title} (${trial.nctId}). Learn more: https://trialbridge-india.lovable.app/find-trials?nctId=${trial.nctId}`;
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
        {sharedLink ? (
          fitResult ? (
            <MatchRing score={fitResult.score} />
          ) : (
            <button
              type="button"
              onClick={() => setShowFitChecker(true)}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-dark)] px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 shadow-sm tb-btn-glow"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Check if this trial fits you
            </button>
          )
        ) : hideMatchScore ? (
          <div className="shrink-0 max-w-[180px] text-right">
            <span className="inline-block text-[11px] font-medium bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] rounded-full px-2.5 py-1">
              View trial details below
            </span>
          </div>
        ) : (
          <MatchRing score={trial.matchScore} />
        )}
      </div>

      {sharedLink && fitResult && (
        <FitResultPanel trial={trial} result={fitResult} onReset={() => setFitResult(null)} />
      )}
      {sharedLink && !fitResult && (
        <div className="rounded-md border border-dashed border-[color:var(--brand)]/40 bg-[color:var(--brand-soft)]/40 p-3 text-xs text-[color:var(--brand-dark)]">
          Opened from a shared link. Tap <span className="font-semibold">Check if this trial fits you</span> to see a personalized match — nothing is submitted or saved.
        </div>
      )}

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
      {showFitChecker && (
        <FitCheckerModal
          trial={trial}
          onClose={() => setShowFitChecker(false)}
          onResult={(r) => {
            setFitResult(r);
            setShowFitChecker(false);
          }}
        />
      )}
    </article>
  );
}

function FitCheckerModal({
  trial,
  onClose,
  onResult,
}: {
  trial: Trial;
  onClose: () => void;
  onResult: (r: { score: number; reasons: string[]; input: SearchInput }) => void;
}) {
  const suggested = trial.conditions[0] ?? "";
  const [condition, setCondition] = useState("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"" | "Male" | "Female">("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-[color:var(--brand-dark)]">
          Let's check your fit for this trial
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Quick, private, and not saved anywhere.
        </p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!condition.trim()) return;
            setSubmitting(true);
            const input: SearchInput = {
              condition: condition.trim(),
              age: age ? Number(age) : null,
              gender: gender || "",
              city: "",
            };
            const { score, reasons } = scoreTrial(trial, input);
            // small delay so the reveal feels intentional
            setTimeout(() => onResult({ score, reasons, input }), 150);
          }}
        >
          <div>
            <label className="text-sm font-medium">Condition</label>
            <input
              required
              placeholder={suggested ? `e.g. ${suggested}` : "e.g. breast cancer"}
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Age</label>
              <input
                type="number"
                min={0}
                max={120}
                placeholder="optional"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as "" | "Male" | "Female")}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting || !condition.trim()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[color:var(--brand-dark)] px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            See my match
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md px-4 py-1 text-xs text-muted-foreground hover:underline"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

function FitResultPanel({
  trial,
  result,
  onReset,
}: {
  trial: Trial;
  result: { score: number; reasons: string[]; input: SearchInput };
  onReset: () => void;
}) {
  const { input, reasons } = result;

  const conditionOn = reasons.some((r) => r.toLowerCase().includes("condition"));
  const ageProvided = input.age != null;
  const ageOn = ageProvided && reasons.includes("Age eligible");
  const genderProvided = Boolean(input.gender) && input.gender !== "All";
  const genderOn = genderProvided && reasons.includes("Gender eligible");

  const ageReason = (() => {
    if (!ageProvided) return "Add your age in the checker to include this factor.";
    if (ageOn) return "You fall within the trial's age range.";
    const min = trial.minAge;
    const max = trial.maxAge;
    if (min != null && max != null) return `Trial requires ${min} to ${max} years, you entered ${input.age}.`;
    if (min != null) return `Trial requires ${min}+ years, you entered ${input.age}.`;
    if (max != null) return `Trial requires up to ${max} years, you entered ${input.age}.`;
    return "Age criteria not published for this trial.";
  })();

  const genderReason = (() => {
    if (!genderProvided) return "Add your gender in the checker to include this factor.";
    if (genderOn) return "Trial is open to your gender.";
    return `Trial recruits ${trial.sex.toLowerCase()} participants only.`;
  })();

  const conditionReason = conditionOn
    ? `Your condition "${input.condition}" matches this trial.`
    : `"${input.condition}" doesn't appear to match this trial's condition.`;

  return (
    <div className="rounded-2xl border border-[color:var(--brand)]/30 bg-[color:var(--brand-soft)]/40 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-[color:var(--brand-dark)]">Your personalized fit</h4>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-primary hover:underline"
        >
          Reset
        </button>
      </div>
      <ul className="space-y-1.5 text-xs text-[color:var(--brand-dark)]">
        <FitRow label="Condition match" on={conditionOn} reason={conditionReason} />
        <FitRow label="Age match" on={ageOn} dimmed={!ageProvided} reason={ageReason} />
        <FitRow label="Gender match" on={genderOn} dimmed={!genderProvided} reason={genderReason} />
      </ul>
    </div>
  );
}

function FitRow({
  label,
  on,
  dimmed = false,
  reason,
}: {
  label: string;
  on: boolean;
  dimmed?: boolean;
  reason: string;
}) {
  return (
    <li className={`flex items-start gap-2 ${dimmed && !on ? "opacity-50" : ""}`}>
      <CheckCircle2
        className={`h-4 w-4 mt-0.5 shrink-0 ${on ? "text-[color:var(--brand-dark)]" : "text-muted-foreground/60"}`}
      />
      <div>
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground"> — {reason}</span>
      </div>
    </li>
  );
}