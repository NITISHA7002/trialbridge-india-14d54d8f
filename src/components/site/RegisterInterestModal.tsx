import { useState } from "react";
import type { Trial } from "@/lib/clinical-trials";
import { supabase } from "@/integrations/supabase/client";

export function RegisterInterestModal({ trial, onClose }: { trial: Trial; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contactTime, setContactTime] = useState<"Morning" | "Afternoon" | "Evening">("Morning");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {submitted ? (
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-[color:var(--brand-dark)]">Thank you for your interest!</h3>
            <p className="text-sm text-muted-foreground">
              Your registration has been securely recorded. In a full deployment, this would be
              shared with the trial's research coordinator to arrange contact — for this demo,
              no hospital or research team has been notified.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-md bg-[color:var(--brand-dark)] px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-[color:var(--brand-dark)]">Request more information</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {trial.title.slice(0, 80)}{trial.title.length > 80 ? "…" : ""}
            </p>
            <form
              className="mt-4 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                setError(null);
                const { error: insertError } = await supabase
                  .from("registrations")
                  .insert({
                    nct_id: trial.nctId,
                    trial_title: trial.title,
                    name,
                    phone,
                    email: email || null,
                    contact_time: contactTime,
                  });
                setSaving(false);
                if (insertError) {
                  setError("Could not save your registration. Please try again.");
                  return;
                }
                setSubmitted(true);
              }}
            >
              <div>
                <label className="text-sm font-medium">Full name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone number</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Preferred contact time</label>
                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                  {(["Morning", "Afternoon", "Evening"] as const).map((t) => (
                    <label key={t} className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="contactTime"
                        value={t}
                        checked={contactTime === t}
                        onChange={() => setContactTime(t)}
                        className="accent-[color:var(--brand-dark)]"
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              {error && (
                <p className="text-xs text-destructive text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-md bg-[color:var(--brand-dark)] px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Submitting…" : "Request more information"}
              </button>
              <p className="text-xs text-muted-foreground text-center">
                We share your details only with the research team for this study. No account is created.
              </p>
              <button type="button" onClick={onClose} className="w-full rounded-md px-4 py-1 text-xs text-muted-foreground hover:underline">
                Cancel
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}