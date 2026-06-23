import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { searchTrials, type SearchInput, type Trial } from "@/lib/clinical-trials";
import { TrialCard } from "@/components/site/TrialCard";

export const Route = createFileRoute("/find-trials")({
  head: () => ({
    meta: [
      { title: "Find Clinical Trials in India — TrialBridge" },
      { name: "description", content: "Search live recruiting clinical trials in India by condition, age, gender, and city. Free results from ClinicalTrials.gov." },
      { property: "og:title", content: "Find Clinical Trials in India — TrialBridge" },
      { property: "og:description", content: "Search live recruiting clinical trials in India by condition, age, gender, and city." },
    ],
  }),
  component: FindTrials,
});

function FindTrials() {
  const [form, setForm] = useState<SearchInput>({ condition: "", age: null, gender: "", city: "" });
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
      setResults(trials);
    } catch (err) {
      setError("Could not reach ClinicalTrials.gov. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--brand-dark)]">Find Trials</h1>
        <p className="mt-2 text-muted-foreground">
          Search recruiting clinical trials in India. All searches are free and private.
        </p>
      </div>

      <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Condition or disease *</label>
          <input
            required
            placeholder="e.g. breast cancer, diabetes, asthma"
            value={form.condition}
            onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Age (years)</label>
          <input
            type="number"
            min={0}
            max={120}
            placeholder="optional"
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
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">City (optional)</label>
          <input
            placeholder="e.g. Mumbai, Delhi, Bangalore"
            value={form.city ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Tip: leave city blank to see all trials across India.
          </p>
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading || !form.condition.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? "Searching..." : "Search trials"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 text-destructive p-4 text-sm">{error}</div>
      )}

      {results && (
        <div className="mt-8">
          <p className="text-sm text-muted-foreground mb-4">
            {results.length === 0
              ? "No recruiting trials found. Try removing the city or broadening the condition."
              : `Found ${results.length} recruiting trial${results.length === 1 ? "" : "s"} in India.`}
          </p>
          <div className="space-y-5">
            {results.map((t) => (
              <TrialCard key={t.nctId} trial={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}