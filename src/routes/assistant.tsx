import { createFileRoute } from "@tanstack/react-router";
import { ChatBox } from "@/components/site/ChatBox";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Ask About Clinical Trials | TrialBridge India" },
      { name: "description", content: "Chat with the TrialBridge AI Assistant. Ask any question about clinical trials in plain English." },
      { property: "og:title", content: "AI Assistant — TrialBridge India" },
      { property: "og:description", content: "Chat with the TrialBridge AI Assistant. Ask any question about clinical trials in plain English." },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--brand-dark)]">AI Assistant</h1>
        <p className="mt-2 text-muted-foreground">
          Ask anything about clinical trials — in plain English. The AI is here to help you understand, not to replace your doctor.
        </p>
      </div>
      <ChatBox />
    </div>
  );
}