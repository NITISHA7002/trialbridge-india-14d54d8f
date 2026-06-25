import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { searchTrials, type SearchInput, type Trial } from "@/lib/clinical-trials";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "Eligibility Checker — TrialBridge India" },
      { name: "description", content: "Answer a few quick questions to see clinical trials in India that you may qualify for." },
      { property: "og:title", content: "Eligibility Checker — TrialBridge India" },
      { property: "og:description", content: "See trials you may qualify for in India." },
    ],
  }),
  component: EligibilityPage,
});

function EligibilityPage() {
  const [form, setForm] = useState<SearchInput>({ condition: "", age: null, gender: "" });
  const [results, setResults] = useState<Trial[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.condition.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const trials = await searchTrials(form);
      setResults(trials.filter((t) => t.matchScore >= 50));
    } catch {
      setError("Could not reach ClinicalTrials.gov. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tb-bg-find">
      {loading && <div className="tb-loadbar" />}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--brand-dark)]">
          See trials you may qualify for
        </h1>
        <p className="mt-2 text-muted-foreground">
          Answer a few quick questions. We'll show recruiting trials in India that look like a likely match.
        </p>
      </div>

      <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <label className="text-sm font-medium">Condition</label>
          <input
            required
            placeholder="e.g. breast cancer, diabetes"
            value={form.condition}
            onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Age (years)</label>
            <input
              type="number"
              min={0}
              max={120}
              value={form.age ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value ? Number(e.target.value) : null }))}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Gender</label>
            <select
              value={form.gender ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as SearchInput["gender"] }))}
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
          disabled={loading || !form.condition.trim()}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[color:var(--brand-dark)] px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Checking..." : "Check eligibility"}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 text-destructive p-4 text-sm">{error}</div>
      )}

      {results && (
        <div className="mt-8 space-y-4">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center">
              No likely matches found. Try the full <Link to="/find-trials" className="text-primary underline">Find Trials</Link> search.
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Found {results.length} trial{results.length === 1 ? "" : "s"} you may qualify for.
              </p>
              {results.map((t) => (
                <EligibilityCard key={t.nctId} trial={t} input={form} />
              ))}
            </>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

function EligibilityCard({ trial, input }: { trial: Trial; input: SearchInput }) {
  const isLikely = trial.matchScore >= 70;
  const conditionMatch = trial.matchReasons.some((r) => r.toLowerCase().includes("condition"));
  const ageMatch = input.age == null || trial.matchReasons.includes("Age eligible");
  const genderMatch =
    !input.gender ||
    input.gender === "All" ||
    trial.matchReasons.includes("Gender eligible");

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <Link
          to="/find-trials"
          search={{ nctId: trial.nctId }}
          className="font-semibold text-[color:var(--brand-dark)] hover:underline leading-snug"
        >
          {trial.title}
        </Link>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            isLikely
              ? "bg-[color:var(--brand-dark)] text-primary-foreground"
              : "bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] border border-[color:var(--brand)]/40"
          }`}
        >
          {isLikely ? "Likely Match" : "Possible Match"}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[color:var(--brand-dark)]">
        <Check label="Condition match" on={conditionMatch} />
        <Check label="Age match" on={ageMatch} />
        <Check label="Gender match" on={genderMatch} />
        <Check label="Recruiting" on />
      </div>

      <Link
        to="/find-trials"
        search={{ nctId: trial.nctId }}
        className="inline-flex items-center rounded-md border border-[color:var(--brand)] text-[color:var(--brand-dark)] px-3 py-1.5 text-sm font-medium hover:bg-[color:var(--brand-soft)]"
      >
        View details
      </Link>
    </article>
  );
}

function Check({ label, on }: { label: string; on: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 ${on ? "" : "opacity-40"}`}>
      <CheckCircle2 className="h-3.5 w-3.5" /> {label}
    </span>
  );
}