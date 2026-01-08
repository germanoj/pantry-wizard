import express from "express";
import cors from "cors";
import "dotenv/config";
import OpenAI from "openai";

const app = express();
export default app;

// ===== Middleware =====
app.use(cors()); // dev-safe: allow all origins
app.use(express.json());

// ===== OpenAI client =====
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===== Health check =====
app.get("/health", (req, res) => {
  res.json({ ok: true });
});
app.get("/", (req, res) => {
  res.send("Pantry Wizard API is running. Try GET /health");
});

// =======================================================
// =============== STUB / FALLBACK GENERATOR ==============
// =======================================================

function parsePantry(pantryText) {
  return pantryText
    .split(/[\n,]+/g)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function includesAny(pantry, options) {
  return options.some((opt) => pantry.includes(opt));
}

app.post("/api/generate", (req, res) => {
  const { pantryText } = req.body ?? {};

  if (typeof pantryText !== "string" || pantryText.trim().length === 0) {
    return res.status(400).json({ error: "pantryText is required" });
  }

  const pantry = parsePantry(pantryText);

  const candidates = [
    {
      title: "Simple Rice Bowl",
      requiresAny: ["rice"],
      uses: ["rice", "eggs", "soy sauce"],
      missing: ["green onion (optional)"],
      steps: ["Cook rice.", "Cook eggs.", "Assemble bowl and season."],
      timeMinutes: 15,
    },
    {
      title: "Pantry Pasta",
      requiresAny: ["pasta", "noodles"],
      uses: ["pasta", "garlic", "olive oil"],
      missing: ["parmesan (optional)"],
      steps: ["Boil pasta.", "Sauté garlic.", "Toss and season."],
      timeMinutes: 20,
    },
    {
      title: "Tuna Toast",
      requiresAny: ["bread", "toast"],
      uses: ["bread", "tuna", "mayo"],
      missing: ["lemon (optional)"],
      steps: ["Toast bread.", "Mix tuna.", "Assemble."],
      timeMinutes: 10,
    },
  ];

  const matched = candidates.filter((c) => includesAny(pantry, c.requiresAny));

  const recipes =
    matched.length > 0
      ? matched.slice(0, 3).map((c) => ({
          title: c.title,
          ingredientsUsed: c.uses.filter((x) =>
            pantry.some((p) => p.includes(x) || x.includes(p))
          ),
          missingIngredients: c.missing,
          steps: c.steps,
          timeMinutes: c.timeMinutes,
        }))
      : [
          {
            title: "Chef’s Choice",
            ingredientsUsed: pantry.slice(0, 6),
            missingIngredients: ["protein", "vegetable", "sauce"],
            steps: [
              "Choose a protein.",
              "Choose a vegetable.",
              "Cook and combine.",
            ],
            timeMinutes: 25,
          },
        ];

  res.json({ recipes });
});

// =======================================================
// ===================== REAL AI ROUTE ====================
// =======================================================

app.post("/api/generate-ai", async (req, res) => {
  try {
    const { pantryText } = req.body ?? {};

    if (typeof pantryText !== "string" || pantryText.trim().length === 0) {
      return res.status(400).json({ error: "pantryText is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res
        .status(500)
        .json({ error: "OPENAI_API_KEY not set on server" });
    }

    const prompt = `
You are a helpful cooking assistant.

Given this list of pantry ingredients:
${pantryText}

Generate 3 realistic recipes.

Rules:
- Use AS MANY of the provided ingredients as possible
- Do NOT invent ingredients unless marked as optional
- Each recipe should include:
  - title
  - ingredientsUsed (array)
  - missingIngredients (array, optional items only)
  - steps (array of strings)
  - timeMinutes (number)

Return ONLY valid JSON in this exact shape:
{
  "recipes": [ ... ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a precise JSON-only API." },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
    });

    const raw = completion.choices[0].message.content;

    const parsed = JSON.parse(raw);

    return res.json(parsed);
  } catch (err) {
    console.error("AI ERROR:", err);
    return res.status(500).json({ error: "AI generation failed" });
  }
});

// ===== Start server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
