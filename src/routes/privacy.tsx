import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — TrialBridge India" },
      { name: "description", content: "TrialBridge India does not store health information. Learn how your data is handled." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-[color:var(--brand-dark)]">Privacy Policy</h1>
      <p className="mt-6 text-base text-foreground/85 leading-relaxed">
        TrialBridge India does not store any health information. Search data is never saved.
        If you register interest in a trial, only your name and phone are shared with that
        specific hospital. We do not sell or share your information.
      </p>
    </div>
  );
}