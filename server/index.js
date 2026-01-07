import express from "express";
import cors from "cors";

const app = express();
export default app;

const app = express();
export default app;

app.use(
  cors({
    origin: ["http://localhost:8081", "http://localhost:19006", "http://localhost:19000"],
    credentials: true,
  })
);

app.use(express.json());


app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Phase 3.1 helpers: parse pantry + simple matching
function parsePantry(pantryText) {
  return pantryText
    .split(/[\n,]+/g) // split by commas or newlines
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function includesAny(pantry, options) {
  return options.some((opt) => pantry.includes(opt));
}

app.post("/api/generate", (req, res) => {
  const { pantryText } = req.body ?? {};

  // Validation
  if (typeof pantryText !== "string" || pantryText.trim().length === 0) {
    return res.status(400).json({ error: "pantryText is required" });
  }

  if (pantryText.length > 8000) {
    return res
      .status(413)
      .json({ error: "pantryText too long (max 8000 chars)" });
  }

  const pantry = parsePantry(pantryText);

  // Candidate templates (fake AI)
  const candidates = [
    {
      title: "Pantry Pasta",
      requiresAny: ["pasta", "spaghetti", "noodles"],
      uses: ["pasta", "garlic", "olive oil"],
      missing: ["parmesan (optional)"],
      steps: [
        "Boil pasta in salted water.",
        "Sauté garlic in olive oil.",
        "Toss pasta with the garlic oil. Season to taste.",
      ],
      timeMinutes: 20,
    },
    {
      title: "Simple Rice Bowl",
      requiresAny: ["rice"],
      uses: ["rice", "eggs", "soy sauce"],
      missing: ["green onion (optional)"],
      steps: ["Cook rice.", "Cook eggs.", "Assemble bowl and season."],
      timeMinutes: 15,
    },
    {
      title: "Tuna Toast",
      requiresAny: ["bread", "toast"],
      uses: ["bread", "tuna", "mayo"],
      missing: ["lemon (optional)"],
      steps: ["Toast bread.", "Mix tuna + mayo.", "Assemble and season."],
      timeMinutes: 10,
    },
  ];

  const matched = candidates.filter((c) => includesAny(pantry, c.requiresAny));

  const recipes =
    matched.length > 0
      ? matched.slice(0, 3).map((c) => ({
          title: c.title,
          ingredientsUsed: c.uses.filter((x) => pantry.includes(x)),
          missingIngredients: c.missing,
          steps: c.steps,
          timeMinutes: c.timeMinutes,
        }))
      : [
          {
            title: "Chef’s Choice (No strong matches)",
            ingredientsUsed: pantry.slice(0, 6),
            missingIngredients: ["one protein", "one veggie", "one sauce"],
            steps: [
              "Pick a protein + veggie you have (or can buy).",
              "Choose a carb (rice/pasta/bread).",
              "Cook each simply, then combine with a sauce/spice.",
            ],
            timeMinutes: 25,
          },
        ];

  res.json({ recipes });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
