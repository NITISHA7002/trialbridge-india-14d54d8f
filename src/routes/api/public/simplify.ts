import { createFileRoute } from "@tanstack/react-router";

type Body = {
  title?: string;
  description?: string;
  eligibility?: string;
  intervention?: string;
  language?: "English" | "Hindi";
};

const MODEL = "google/gemini-2.5-flash";

export const Route = createFileRoute("/api/public/simplify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return Response.json({ error: "Server not configured" }, { status: 500 });
        }
        const body = (await request.json().catch(() => ({}))) as Body;
        const {
          title = "",
          description = "",
          eligibility = "",
          intervention = "",
          language = "English",
        } = body;

        const hindiInstructions =
          language === "Hindi"
            ? `\n\nLANGUAGE RULES (IMPORTANT):\n- Write the entire response in Hindi, using Devanagari script.\n- Use simple, everyday spoken Hindi that a patient with no medical background and no English education can understand.\n- Avoid English medical terms. Avoid complex, formal, or bookish Hindi words. Avoid technical Hindi medical vocabulary.\n- Keep the exact same structure: the same emoji section headers (🔬 👤 ⚠️ 🏥 📞), the same • bullet style, and the same section order as specified above.\n- Keep following all the other rules above (no drug names, no medical codes/numbers, do not use "we" — say "doctors" or "the study team" translated naturally into simple Hindi).`
            : "";

        const prompt = `Do not write any introduction or preamble. Start your response directly with the 🔬 emoji. No intro sentences before the sections.

Rewrite this clinical trial in simple English for an Indian patient with no medical background.
Never use drug names — say "a new medicine" instead.
Never use medical codes or numbers like Gy or mg.
Never use the word "we" — always say "doctors" or "the study team" instead.
Use this exact structure and use • for bullet points (never use hyphens "-"):

🔬 What is this trial about?
Write 2 simple sentences only.

👤 Who can join?
• bullet point 1
• bullet point 2
• bullet point 3

⚠️ Who cannot join?
• bullet point 1
• bullet point 2

🏥 What will happen to you?
• bullet point 1
• bullet point 2
• bullet point 3

📞 How to apply?
One sentence about contacting the hospital.
${hindiInstructions}

Trial details:
Title: ${title}
Description: ${description}
Eligibility: ${eligibility}
Treatment: ${intervention}`;

        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${key}`,
            },
            body: JSON.stringify({
              model: MODEL,
              messages: [{ role: "user", content: prompt }],
            }),
          });
          if (!res.ok) {
            const detail = await res.text();
            console.error("AI simplify error", res.status, detail);
            return Response.json({ error: "AI error" }, { status: 502 });
          }
          const data = (await res.json()) as {
            choices?: { message?: { content?: string } }[];
          };
          const text = data.choices?.[0]?.message?.content ?? "";
          return Response.json({ text });
        } catch (e) {
          console.error("simplify failed", e);
          return Response.json({ error: "AI unavailable" }, { status: 502 });
        }
      },
    },
  },
});