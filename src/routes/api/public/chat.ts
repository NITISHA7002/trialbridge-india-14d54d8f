import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "user" | "assistant"; content: string };
type Body = { messages?: Msg[] };

const MODEL = "claude-sonnet-4-5-20250929";

const SYSTEM = `You are TrialBridge Assistant helping Indian patients understand clinical trials. Rules:
- Answer in simple everyday English only
- Maximum 80 words per answer
- Never use medical jargon without explaining it
- Be warm, patient and encouraging
- If asked about a specific trial, say to use the search form
- Always end with an encouraging sentence`;

export const Route = createFileRoute("/api/public/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.ANTHROPIC_API_KEY;
        if (!key) {
          return Response.json({ error: "Server not configured" }, { status: 500 });
        }
        const body = (await request.json().catch(() => ({}))) as Body;
        const messages = Array.isArray(body.messages) ? body.messages.slice(-30) : [];
        if (messages.length === 0) {
          return Response.json({ error: "No messages" }, { status: 400 });
        }

        try {
          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": key,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: MODEL,
              max_tokens: 400,
              system: SYSTEM,
              messages: messages.map((m) => ({ role: m.role, content: String(m.content ?? "") })),
            }),
          });
          if (!res.ok) {
            const detail = await res.text();
            console.error("Anthropic chat error", res.status, detail);
            return Response.json({ error: "AI error" }, { status: 502 });
          }
          const data = (await res.json()) as { content?: { text?: string }[] };
          const text = data.content?.[0]?.text ?? "";
          return Response.json({ text });
        } catch (e) {
          console.error("chat failed", e);
          return Response.json({ error: "AI unavailable" }, { status: 502 });
        }
      },
    },
  },
});