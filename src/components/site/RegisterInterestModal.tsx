import { useState } from "react";
import type { Trial } from "@/lib/clinical-trials";

export function RegisterInterestModal({ trial, onClose }: { trial: Trial; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {submitted ? (
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-[color:var(--brand-dark)]">Thank you!</h3>
            <p className="text-sm text-muted-foreground">
              We've noted your interest. The hospital team will contact you within a few days.
              You are not committed to anything at this stage.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-[color:var(--brand-dark)]">Register Interest</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Trial: {trial.title.slice(0, 60)}{trial.title.length > 60 ? "…" : ""}
            </p>
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div>
                <label className="text-sm font-medium">Your name</label>
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
              <p className="text-xs text-muted-foreground">
                Only your name and phone are shared with the specific hospital. No health
                information is stored by TrialBridge.
              </p>
              <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={onClose} className="rounded-md px-4 py-2 text-sm">
                  Cancel
                </button>
                <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                  Submit
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}