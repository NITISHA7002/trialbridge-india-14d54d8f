import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Namaste! I'm your Clinical Trial Guide. Ask me to explain medical terms, trial phases, eligibility, or what joining a study means. I'm here to help — not to give medical advice.",
};

function formatReply(content: string) {
  // Normalize: ensure each "•" bullet starts on its own line.
  const normalized = content
    .replace(/\s*•\s*/g, "\n• ")
    .replace(/^\n+/, "")
    .trim();
  const lines = normalized.split(/\n+/);
  return lines.map((line, i) => (
    <p key={i} className={line.startsWith("•") ? "pl-1" : ""}>
      {line}
    </p>
  ));
}

export function ChatBox() {
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/public/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.filter((m) => m !== GREETING || messages.length > 1).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text ?? "Sorry, I couldn't reply just now. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't reply just now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col h-[70vh] max-h-[700px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed space-y-1.5 " +
                (m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-[color:var(--brand-soft)] text-[color:var(--brand-dark)]")
              }
            >
              {m.role === "assistant" ? formatReply(m.content) : m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[color:var(--brand-soft)] rounded-2xl px-4 py-3">
              <span className="tb-dot" />
              <span className="tb-dot" />
              <span className="tb-dot" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="border-t border-border p-3 flex gap-2">
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about clinical trials..."
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          <Send className="h-4 w-4" /> Send
        </button>
      </form>
    </div>
  );
}