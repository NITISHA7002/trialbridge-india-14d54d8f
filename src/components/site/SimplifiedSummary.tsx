import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Trial } from "@/lib/clinical-trials";

export function SimplifiedSummary({ trial }: { trial: Trial }) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const simplify = async () => {
    setOpen(true);
    setLoading(true);
    setText(null);
    try {
      const res = await fetch("/api/public/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trial.title,
          description: trial.description,
          eligibility: trial.eligibility,
          intervention: trial.interventions.join(", "),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { text: string };
      setText(data.text);
    } catch {
      setText("Could not simplify right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={simplify}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
      >
        <Sparkles className="h-4 w-4" /> Patient Friendly Summary
      </button>
      {open && (
        <div className="rounded-xl border border-[color:var(--brand)]/30 bg-[color:var(--brand-soft)] p-4">
          {loading ? (
            <div className="flex items-center gap-3 text-[color:var(--brand-dark)]">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">
                AI is simplifying this trial for you...
              </span>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[color:var(--brand-dark)]">
              {text}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}