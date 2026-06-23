import { createFileRoute } from "@tanstack/react-router";

type Body = {
  title?: string;
  description?: string;
  eligibility?: string;
  intervention?: string;
};

const MODEL = "claude-sonnet-4-5-20250929";

export const Route = createFileRoute("/api/public/simplify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.ANTHROPIC_API_KEY;
        if (!key) {
          return Response.json({ error: "Server not configured" }, { status: 500 });
        }
        const body = (await request.json().catch(() => ({}))) as Body;
        const { title = "", description = "", eligibility = "", intervention = "" } = body;

        const prompt = `Rewrite this clinical trial in simple English for an Indian patient with no medical background.
Never use drug names — say "a new medicine" instead.
Never use medical codes or numbers like Gy or mg.
Use this exact structure:

🔬 What is this trial about?
Write 2 simple sentences only.

👤 Who can join?
- bullet point 1
- bullet point 2
- bullet point 3

⚠️ Who cannot join?
- bullet point 1
- bullet point 2

🏥 What will happen to you?
- bullet point 1
- bullet point 2
- bullet point 3

📞 How to apply?
One sentence about contacting the hospital.

Trial details:
Title: ${title}
Description: ${description}
Eligibility: ${eligibility}
Treatment: ${intervention}`;

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
              max_tokens: 800,
              messages: [{ role: "user", content: prompt }],
            }),
          });
          if (!res.ok) {
            const detail = await res.text();
            console.error("Anthropic simplify error", res.status, detail);
            return Response.json({ error: "AI error" }, { status: 502 });
          }
          const data = (await res.json()) as { content?: { text?: string }[] };
          const text = data.content?.[0]?.text ?? "";
          return Response.json({ text });
        } catch (e) {
          console.error("simplify failed", e);
          return Response.json({ error: "AI unavailable" }, { status: 502 });
        }
      },
    },
  },
});