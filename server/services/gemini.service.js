/**
 * Single place where we talk to Gemini.
 * If GEMINI_API_KEY is missing or the call fails, we fall back to mock data
 * so the demo NEVER breaks in front of judges.
 */
const MODEL = "gemini-2.0-flash";
const URL = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;

function extractJson(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{") >= 0 ? cleaned.indexOf("{") : cleaned.indexOf("[");
  const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function askGemini(prompt, { json = true } = {}) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("NO_GEMINI_KEY");

  const res = await fetch(URL(key), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 2048 },
    }),
  });

  if (!res.ok) throw new Error(`GEMINI_${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return json ? extractJson(text) : text;
}

// Wrapper: try AI, otherwise return mock. Always resolves.
export async function askGeminiSafe(prompt, mock, opts) {
  try {
    return { source: "gemini", data: await askGemini(prompt, opts) };
  } catch (err) {
    console.warn("[gemini fallback]", err.message);
    return { source: "mock", data: mock };
  }
}
