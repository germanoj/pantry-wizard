import express from "express";
import cors from "cors";
import "dotenv/config";
import OpenAI from "openai";

//for hayley for password hashing and tokens!!
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//////////////////////////////

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

//import crypto from "crypto";

//// hayley password token and logn/reg routes!!!!! NO TOUCHY
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn("⚠️ Missing JWT_SECRET in server .env (auth will fail until set).");
}

function signToken(userId) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET not set");
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "30d" });
}

function requireUser(req, res, next) {
    if (!JWT_SECRET) return res.status(500).json({ message: "Server auth not configured" });
    try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing token" });

    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

app.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body ?? {};

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email, password required" });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: "password must be at least 8 characters" });
    }

    const uname = String(username).trim();
    const mail = String(email).trim().toLowerCase();

    // check uniqueness
    const existing = await db.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [mail, uname]
    );
    if (existing.rowCount > 0) {
      return res.status(409).json({ message: "Email or username already in use" });
    }

    const hash = await bcrypt.hash(String(password), 10);

    const created = await db.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [uname, mail, hash]
    );

    const user = created.rows[0];
    const token = signToken(user.id);

    return res.status(201).json({ token, user });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ message: String(err?.message || err) }); //"Registration failed"
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }

    const mail = String(email).trim().toLowerCase();

    const found = await db.query(
      "SELECT id, username, email, password FROM users WHERE email = $1",
      [mail]
    );

    if (found.rowCount === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = found.rows[0];
    const ok = await bcrypt.compare(String(password), user.password);

    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user.id);
    return res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

/////////////// NO TOUCHY //////////////////////

//////////HAYLEY DELETED BELOW DEV USER BC DONT NEED NOW!!!! /////////
// TEMP (Option A): hardcode dev user until auth is done
//const DEV_USER_ID = "00000000-0000-0000-0000-000000000001";

///ALSO DELETED BELOW BEFORE AI///
/*
function recipeHash(obj) {
  // stable-ish hash to dedupe recipes across saves
  const str = JSON.stringify(obj);
  return crypto.createHash("sha256").update(str).digest("hex");
}

function getUserId(req) {
  return DEV_USER_ID;
}
*/

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

app.get("/", (req, res) => {
  res.status(200).send("OK - Pantry Wizard API");
});

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
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

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`${label} timed out after ${ms}ms`)),
        ms
      )
    ),
  ]);
}

function placeholderImageUrl(title) {
  const text = encodeURIComponent(String(title || "Recipe").slice(0, 40));
  // Force PNG for better compatibility
  return `https://placehold.co/1024x1024/png?text=${text}`;
}

async function generateImageUrlForRecipe(r) {
  const imgPrompt = buildFoodImagePrompt(r);

  const img = await withTimeout(
    openai.images.generate({
      model: "gpt-image-1",
      prompt: imgPrompt,
      size: "1024x1024", // faster while debugging
    }),
    90000,
    "images.generate"
  );

  const first = img?.data?.[0];

  console.log("🧩 image response keys:", Object.keys(first || {}));

  // If it returns a URL, great
  if (first?.url) return first.url;

  // If it returns base64, convert to data URL
  if (first?.b64_json) return `data:image/png;base64,${first.b64_json}`;

  // Some SDKs return "base64" under a different key — log and fail loudly
  throw new Error(
    `No usable image in response. keys=${Object.keys(first || {}).join(",")}`
  );
}

app.post("/api/generate-ai", async (req, res) => {
  try {
    console.log("🔥 HIT /api/generate-ai", new Date().toISOString());

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

    console.log("🧾 calling chat.completions...");

    const completion = await withTimeout(
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a precise JSON-only API." },
          { role: "user", content: prompt },
        ],
        temperature: 0.6,
      }),
      60000,
      "chat.completions"
    );

    console.log("🧾 chat.completions returned");

    const raw = completion.choices[0].message.content ?? "";
    console.log("🧾 raw length:", raw.length);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("❌ JSON.parse failed. raw was:", raw);
      return res.status(500).json({ error: "AI returned invalid JSON" });
    }

    console.log("🧠 parsed recipes:", parsed.recipes?.length);

    // Attach imageUrl to each recipe (fallback to placeholder on any error)
    for (const r of parsed.recipes ?? []) {
      try {
        console.log("🖼️ attempting image for:", r.title);

        r.imageUrl = await generateImageUrlForRecipe(r);

        console.log("✅ image model succeeded for:", r.title);
      } catch (e) {
        console.error("❌ image gen failed for:", r?.title, e?.message || e);
        r.imageUrl = placeholderImageUrl(r?.title);
      }
    }

    return res.json(parsed);
  } catch (err) {
    console.error("AI ERROR:", err);
    return res.status(500).json({ error: "AI generation failed" });
  }
});

app.get("/api/user-recipes", requireUser, async (req, res) => {
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
      [req.userId]
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

app.get("/_debug/router-shape", (req, res) => {
  const has_router = !!app._router;
  const has_router_stack = !!app._router?.stack;
  const has_router2 = !!app.router;
  const has_router2_stack = !!app.router?.stack;

  res.json({
    has_router,
    has_router_stack,
    router_stack_len: app._router?.stack?.length ?? null,
    has_app_router: has_router2,
    has_app_router_stack: has_router2_stack,
    app_router_stack_len: app.router?.stack?.length ?? null,
    // show keys to see what Express put on the app object
    app_keys: Object.keys(app).slice(0, 40),
  });
});


app.get("/_debug/routes", (req, res) => {
  const routes = [];
  const stack = app._router?.stack || app.router?.stack || [];
  // Express 4: app._router.stack
  // Express 5: app.router.stack
   for (const layer of stack) {
    // Direct routes
    if (layer.route?.path) {
      const methods = Object.keys(layer.route.methods || {})
        .filter((m) => layer.route.methods[m])
        .map((m) => m.toUpperCase());
      routes.push({ path: layer.route.path, methods });
      continue;
    }

    // Mounted routers (e.g., app.use("/auth", router))
    if (layer.name === "router" && layer.handle?.stack) {
      for (const r of layer.handle.stack) {
        if (r.route?.path) {
          const methods = Object.keys(r.route.methods || {})
            .filter((m) => r.route.methods[m])
            .map((m) => m.toUpperCase());
          routes.push({ path: r.route.path, methods });
        }
      }
    }
  }

  res.json({ routes });
});

app.get("/_debug/db", async (req, res) => {
  const dbName = await db.query("select current_database() as db");
  const schema = await db.query("select current_schema() as schema");
  const idDefault = await db.query(`
    SELECT table_schema, column_default
    FROM information_schema.columns
    WHERE table_name='users' AND column_name='id'
    ORDER BY table_schema;
  `);

  res.json({
    current_database: dbName.rows[0].db,
    current_schema: schema.rows[0].schema,
    users_id_defaults: idDefault.rows,
  });
});

// ===== Start server =====

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
