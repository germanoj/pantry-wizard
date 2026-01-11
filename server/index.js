import express from "express";
import cors from "cors";
import "dotenv/config";
import OpenAI from "openai";

import pg from "pg";
const { Pool } = pg;

const needsSSL =
  process.env.PGSSLMODE === "require" ||
  (process.env.DATABASE_URL?.includes("render.com") ?? false) ||
  process.env.NODE_ENV === "production";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: needsSSL ? { rejectUnauthorized: false } : false,
});

const app = express();
export default app;

// ===== Middleware =====
app.use(cors()); // dev-safe: allow all origins
app.use(express.json());

import crypto from "crypto";

// TEMP (Option A): hardcode dev user until auth is done
const DEV_USER_ID = "00000000-0000-0000-0000-000000000001";

function recipeHash(obj) {
  // stable-ish hash to dedupe recipes across saves
  const str = JSON.stringify(obj);
  return crypto.createHash("sha256").update(str).digest("hex");
}

function getUserId(req) {
  return DEV_USER_ID;
}

// ===== OpenAI client =====
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log(
  "OPENAI key loaded:",
  process.env.OPENAI_API_KEY
    ? `yes (len ${process.env.OPENAI_API_KEY.length})`
    : "NO"
);

// ================== Recipe Image Generation ==================
console.log("🧠 parsed recipes:", parsed.recipes?.length);

function buildFoodImagePrompt(recipe) {
  const title = String(recipe.title ?? "a homemade dish").trim();

  const used = Array.isArray(recipe.ingredientsUsed)
    ? recipe.ingredientsUsed
    : [];
  const missing = Array.isArray(recipe.missingIngredients)
    ? recipe.missingIngredients
    : [];

  const ingredients = [...used, ...missing]
    .filter(Boolean)
    .slice(0, 12)
    .join(", ");

  return `
A professional food photograph of ${title}.
Key ingredients: ${ingredients || "simple pantry ingredients"}.
Plated neatly on a ceramic plate or bowl.
Soft natural window lighting, shallow depth of field.
Realistic, appetizing, high detail, no text, no watermark.
`;
}

async function generateAndAttachRecipeImage({ recipeId, recipeJson }) {
  try {
    // Mark as generating
    await db.query(
      `UPDATE recipes
       SET image_status = 'generating'
       WHERE id = $1 AND (image_status IS NULL OR image_status IN ('none', 'failed'))`,
      [recipeId]
    );

    const prompt = buildFoodImagePrompt(recipeJson);

    const img = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    const imageUrl = img?.data?.[0]?.url;
    if (!imageUrl) throw new Error("No image URL returned");

    await db.query(
      `UPDATE recipes
       SET image_url = $2, image_status = 'ready'
       WHERE id = $1`,
      [recipeId, imageUrl]
    );
  } catch (err) {
    console.error("image generation error:", err);
    await db.query(
      `UPDATE recipes
       SET image_status = 'failed'
       WHERE id = $1`,
      [recipeId]
    );
  }
}

// ===== Health check =====
app.get("/health", (req, res) => {
  res.json({ ok: true });
});
app.get("/", (req, res) => {
  res.send("Pantry Wizard API is running. Try GET /health");
});

db.query("SELECT NOW()")
  .then(() => console.log("✅ DB connected"))
  .catch((e) => console.error("❌ DB connection error", e));

app.get("/version", (req, res) => {
  res.json({
    sha: process.env.RENDER_GIT_COMMIT || "unknown",
    hasUserRecipesRoute: true,
  });
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
console.log("🔥 HIT /api/generate-ai", new Date().toISOString());

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

    // 1) Get recipes (text)
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

    // 2) Image helpers
    function placeholderImageUrl(title) {
      const text = encodeURIComponent(String(title || "Recipe").slice(0, 40));
      return `https://placehold.co/1024x1024?text=${text}`;
    }

    async function generateImageUrlForRecipe(r) {
      const imgPrompt = buildFoodImagePrompt(r);

      const img = await openai.images.generate({
        model: "gpt-image-1",
        prompt: imgPrompt,
        size: "1024x1024",
      });

      const imageUrl = img?.data?.[0]?.url;
      if (!imageUrl) throw new Error("No image URL returned from OpenAI");

      return imageUrl;
    }

    // 3) Attach imageUrl to each recipe (fallback to placeholder on any error)
    for (const r of parsed.recipes) {
      try {
        console.log("🖼️ attempting image for:", r.title);
        r.imageUrl = await generateImageUrlForRecipe(r);
      } catch (e) {
        console.error("generate-ai image failed:", r?.title, e?.message || e);
        r.imageUrl = placeholderImageUrl(r?.title);
      }
    }

    // Optional temporary debug flag (remove later)
    // parsed._debug_imageFallbackEnabled = true;

    return res.json(parsed);
  } catch (err) {
    console.error("AI ERROR:", err);
    return res.status(500).json({ error: "AI generation failed" });
  }
});

app.post("/api/user-recipes", async (req, res) => {
  try {
    const { recipe } = req.body ?? {};

    if (!recipe || typeof recipe !== "object") {
      return res.status(400).json({ error: "recipe object is required" });
    }

    // Minimal validation (frontend sends the AI recipe object)
    const title = String(recipe.title ?? "").trim();
    if (!title)
      return res.status(400).json({ error: "recipe.title is required" });

    // create a deterministic id for recipe row (uuid NOT required if you prefer)
    const hash = recipeHash(recipe);

    // If you already have a db client helper, use that.
    // This assumes you have `db` or `client` set up for pg queries.
    // If your project uses `pg` Pool as `db`, keep as-is. Otherwise tell me what your db variable is named.

    const existing = await db.query(
      "SELECT id, image_url, image_status FROM recipes WHERE prompt_used = $1 LIMIT 1",
      [hash]
    );

    let recipeId;
    if (existing.rows.length > 0) {
      recipeId = existing.rows[0].id;
    } else {
      // recipes.id is UUID in your schema; we can generate in SQL
      const inserted = await db.query(
        `
        INSERT INTO recipes (id, name, generated_by_ai, prompt_used, is_veggie, is_gf, recipe_json)
        VALUES (gen_random_uuid(), $1, TRUE, $2, FALSE, FALSE, $3)
        RETURNING id
        `,
        [title, hash, recipe]
      );
      recipeId = inserted.rows[0].id;
    }

    await db.query(
      `
      INSERT INTO favorites (id, user_id, recipe_id)
      VALUES (gen_random_uuid(), $1, $2)
      ON CONFLICT (user_id, recipe_id) DO NOTHING
      `,
      [DEV_USER_ID, recipeId]
    );

    // Fire-and-forget image generation if needed
    try {
      const imgCheck = await db.query(
        "SELECT image_url, image_status, recipe_json FROM recipes WHERE id = $1",
        [recipeId]
      );

      const row = imgCheck.rows[0];
      const needsImage =
        !row?.image_url &&
        (!row?.image_status ||
          row.image_status === "none" ||
          row.image_status === "failed");

      if (needsImage) {
        generateAndAttachRecipeImage({
          recipeId,
          recipeJson: row.recipe_json,
        });
      }
    } catch (e) {
      console.error("image kickoff failed:", e);
    }

    return res.json({ ok: true, recipeId });
  } catch (err) {
    console.error("save recipe error:", err);
    return res.status(500).json({ error: "Failed to save recipe" });
  }
});
app.get("/api/user-recipes", async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT
      r.id,
      r.name,
      r.recipe_json,
      r.image_url,
      r.image_status,
      f.created_at
      FROM favorites f
      JOIN recipes r ON r.id = f.recipe_id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
      `,
      [DEV_USER_ID]
    );

    const recipes = result.rows.map((row) => ({
      id: row.id,
      savedAt: row.created_at,
      imageUrl: row.image_url,
      imageStatus: row.image_status,
      ...row.recipe_json,
    }));

    res.json({ recipes });
  } catch (err) {
    console.error("list saved recipes error:", err);
    return res.status(500).json({ error: "Failed to fetch saved recipes" });
  }
});

app.get("/_debug/routes", (req, res) => {
  const routes = [];
  app._router?.stack?.forEach((layer) => {
    if (layer.route?.path) {
      const methods = Object.keys(layer.route.methods)
        .filter((m) => layer.route.methods[m])
        .map((m) => m.toUpperCase());
      routes.push({ path: layer.route.path, methods });
    }
  });
  res.json({ routes });
});

// ===== Start server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
