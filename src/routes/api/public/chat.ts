import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "user" | "assistant"; content: string };
type Body = { messages?: Msg[] };

const MODEL = "google/gemini-2.5-flash";

const SYSTEM = `You are TrialBridge Assistant helping Indian patients understand clinical trials. Rules:
• Always start your reply with "Namaste!"
• Answer in simple everyday English only
• Maximum 80 words per answer
• Never use medical jargon without explaining it
• Be warm, patient and encouraging
• If asked about a specific trial, say to use the search form
• Never use the word "we" — always say "doctors" or "the study team" instead
• Use • for bullet points, never use hyphens
• When listing multiple points, put each bullet on its own new line
• Always end your reply with this exact line on a new line: "This is informational only. Final eligibility must be confirmed by the research team."`;

export const Route = createFileRoute("/api/public/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return Response.json({ error: "Server not configured" }, { status: 500 });
        }
        const body = (await request.json().catch(() => ({}))) as Body;
        const messages = Array.isArray(body.messages) ? body.messages.slice(-30) : [];
        if (messages.length === 0) {
          return Response.json({ error: "No messages" }, { status: 400 });
        }

        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${key}`,
            },
            body: JSON.stringify({
              model: MODEL,
              messages: [
                { role: "system", content: SYSTEM },
                ...messages.map((m) => ({
                  role: m.role,
                  content: String(m.content ?? ""),
                })),
              ],
            }),
          });
          if (!res.ok) {
            const detail = await res.text();
            console.error("AI chat error", res.status, detail);
            return Response.json({ error: "AI error" }, { status: 502 });
          }
          const data = (await res.json()) as {
            choices?: { message?: { content?: string } }[];
          };
          const text = data.choices?.[0]?.message?.content ?? "";
          return Response.json({ text });
        } catch (e) {
          console.error("chat failed", e);
          return Response.json({ error: "AI unavailable" }, { status: 502 });
        }
      },
    },
  },
});