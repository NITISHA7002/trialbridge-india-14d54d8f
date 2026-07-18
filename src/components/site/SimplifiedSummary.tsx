import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Trial } from "@/lib/clinical-trials";

export function SimplifiedSummary({ trial }: { trial: Trial }) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<"English" | "Hindi">("English");

  const simplify = async (lang: "English" | "Hindi" = language) => {
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
          language: lang,
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

  const selectLanguage = (lang: "English" | "Hindi") => {
    setLanguage(lang);
    if (open) void simplify(lang);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => simplify(language)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
        >
          <Sparkles className="h-4 w-4" /> Patient Friendly Summary
        </button>
        <div className="inline-flex overflow-hidden rounded-md border border-[color:var(--brand)]/30 text-xs">
          <button
            type="button"
            onClick={() => selectLanguage("English")}
            aria-pressed={language === "English"}
            className={`px-2.5 py-1.5 transition ${
              language === "English"
                ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] font-medium"
                : "bg-white text-muted-foreground hover:bg-[color:var(--brand-soft)]/60"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => selectLanguage("Hindi")}
            aria-pressed={language === "Hindi"}
            className={`px-2.5 py-1.5 border-l border-[color:var(--brand)]/30 transition ${
              language === "Hindi"
                ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)] font-medium"
                : "bg-white text-muted-foreground hover:bg-[color:var(--brand-soft)]/60"
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>
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