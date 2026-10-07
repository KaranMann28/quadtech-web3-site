import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/apply/rate-limit";
import { company } from "@/lib/company";
import { services } from "@/lib/services";

export const runtime = "nodejs";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY_MESSAGES = 20;

const offices = company.offices
  .map((office) => `${office.city}, ${office.regionName} (${office.countryName})`)
  .join(" and ");

/**
 * Prompt facts come from lib/company.ts and lib/services.ts only. The previous
 * site's chatbot prompt carried a placeholder phone number and an unconfirmed
 * inbox; neither may be published, so the model is pointed at /contact instead.
 */
const SYSTEM_PROMPT = `You are the AI assistant on the ${company.legalName} website (quadtechsolutions.io). You help visitors with telecom and network infrastructure questions.

COMPANY FACTS (the only company facts you may state):
- ${company.legalName} is a telecom engineering and field services company founded in ${company.founded}.
- Offices in ${offices}. Field and engineering teams in ${company.teams.join(", ")}.
- Clients are served across the ${company.markets.join(" and ")}.

SERVICES:
${services.map((service) => `- ${service.name}: ${service.summary}`).join("\n")}

YOUR ROLE:
- Give clear technical guidance on telecom and network engineering topics.
- Help visitors work out which services fit their project, and encourage them to send details through the contact form at /contact.
- Point people asking about jobs to the careers board at /careers.

GUIDELINES:
- Keep responses concise but informative, at most two or three short paragraphs.
- Use technical terminology appropriately and explain complex concepts plainly.
- Never invent phone numbers, email addresses, street addresses, pricing, client names, or availability claims. When someone wants to reach the team, the contact form at /contact is the channel to offer.
- If asked about pricing, explain that cost depends on project scope and suggest sending the details through the contact form.`;

const FAILURE_MESSAGE =
  "Sorry, I ran into a problem answering that. Please try again, or send your question through the contact form at /contact.";

type ChatTurn = { role: "user" | "model"; text: string };

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function parseHistory(value: unknown): ChatTurn[] {
  if (!Array.isArray(value)) return [];
  const turns: ChatTurn[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) continue;
    const { role, content } = entry as { role?: unknown; content?: unknown };
    if (typeof content !== "string" || !content.trim()) continue;
    if (role !== "user" && role !== "assistant") continue;
    turns.push({
      role: role === "user" ? "user" : "model",
      text: content.slice(0, MAX_MESSAGE_CHARS),
    });
  }
  const recent = turns.slice(-MAX_HISTORY_MESSAGES);
  // Gemini requires the first turn to be the user's, so the widget's greeting is dropped.
  const firstUser = recent.findIndex((turn) => turn.role === "user");
  return firstUser === -1 ? [] : recent.slice(firstUser);
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Cross-site requests are not accepted." }, { status: 403 });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The assistant is offline right now. Please use the contact form at /contact." },
      { status: 503 },
    );
  }
  const ip = clientIp(request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip"));
  if (!rateLimit(`chat:${ip}`, 20, 5 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many messages from this network. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let body: { message?: unknown; conversationHistory?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Could not read the message." }, { status: 400 });
  }
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return NextResponse.json(
      { error: "That message is too long. Please shorten it and try again." },
      { status: 400 },
    );
  }

  const contents = [
    ...parseHistory(body.conversationHistory).map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
      }),
    });
    if (!response.ok) {
      console.error(`Chat API error: Gemini responded ${response.status}`, await response.text());
      return NextResponse.json({ error: FAILURE_MESSAGE }, { status: 502 });
    }
    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = (data.candidates?.[0]?.content?.parts ?? [])
      .map((part) => part.text ?? "")
      .join("")
      .trim();
    if (!text) {
      console.error("Chat API error: Gemini returned no text");
      return NextResponse.json({ error: FAILURE_MESSAGE }, { status: 502 });
    }
    return NextResponse.json({ message: text, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: FAILURE_MESSAGE }, { status: 502 });
  }
}
