import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact TrialBridge India" },
      { name: "description", content: "Have questions or want to partner with TrialBridge India? Get in touch with the team." },
      { property: "og:title", content: "Contact TrialBridge India" },
      { property: "og:description", content: "Have questions or want to partner with TrialBridge India? Get in touch with the team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--brand-dark)]">Get In Touch</h1>
      <p className="mt-3 text-muted-foreground">Have questions or want to partner with us?</p>
      <a
        href="mailto:trialbridge.india@gmail.com"
        className="mt-6 inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline"
      >
        <Mail className="h-5 w-5" /> trialbridge.india@gmail.com
      </a>
      <p className="mt-8 text-sm text-muted-foreground">
        For help finding trials, use the AI Assistant or search form above.
      </p>
    </div>
  );
}