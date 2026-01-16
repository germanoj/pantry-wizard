// server/index.js

import express from "express";
import cors from "cors";
import "dotenv/config";

import OpenAI from "openai";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import pg from "pg";
const { Pool } = pg;

/**
 * ----------------------------
 * App + DB
 * ----------------------------
 */
const app = express();

const isRender =
  !!process.env.RENDER || /render\.com/i.test(process.env.DATABASE_URL || "");
const needsSSL = isRender || process.env.PGSSLMODE === "require";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: needsSSL ? { rejectUnauthorized: false } : false,
});

const app = express();

/**
 * ----------------------------
 * Middleware (order matters)
 * ----------------------------
 */

// Parse JSON once

app.use(express.json());

// CORS allowlist: localhost + deployed web
const allowedOrigins = new Set([
  // local web dev
  "http://localhost:8081",
  "http://localhost:19006",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8080",

  // production web (Render static site)
  "https://pantry-wizard-yxez.onrender.com",
]);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow non-browser requests with no Origin header (native apps, curl, Postman)
      if (!origin) return cb(null, true);

      if (allowedOrigins.has(origin)) return cb(null, true);

      console.warn("[CORS] Blocked origin:", origin);
      return cb(null, false);
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

/**
 * ----------------------------
 * Cloudinary (optional)
 * ----------------------------
 */
const hasCloudinary =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

async function uploadPngDataUrlToCloudinary(dataUrl, publicId) {
  if (!hasCloudinary) throw new Error("Cloudinary env vars not set");

  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: "pantry-wizard",
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    format: "png",
  });

  return result.secure_url;
}

// ===== Middleware =====
app.use(cors()); // dev-safe: allow all origins
app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

/**
 * ----------------------------
 * Auth helpers
 * ----------------------------
 */

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn(
    "⚠️ Missing JWT_SECRET in server .env (auth will fail until set)."
  );
}

function signToken(userId) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET not set");
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "30d" });
}

function requireUser(req, res, next) {
  if (!JWT_SECRET)
    return res.status(500).json({ message: "Server auth not configured" });

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

/**
 * ----------------------------
 * Dev fallback user (keep if you want)
 * ----------------------------
 */
const DEV_USER_ID = "00000000-0000-0000-0000-000000000001";
function getUserId(req) {
  return req.userId || DEV_USER_ID;
}

/**
 * ----------------------------
 * OpenAI
 * ----------------------------
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log(
  "OPENAI key loaded:",
  process.env.OPENAI_API_KEY
    ? `yes (len ${process.env.OPENAI_API_KEY.length})`
    : "NO"
);

/**
 * ----------------------------
 * Image helpers
 * ----------------------------
 * NOTE: You referenced placeholderImageUrl() in your original file,
 * but it wasn't included in the snippet. Add/keep your own version.
 */
function placeholderImageUrl(title = "recipe") {
  // Simple placeholder (replace with your own if you already have one)
  const safe = String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  return `https://via.placeholder.com/1024?text=${encodeURIComponent(safe)}`;
}

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

async function generateImageUrlForRecipe(r) {
  const imgPrompt = buildFoodImagePrompt(r);

  const img = await withTimeout(
    openai.images.generate({
      model: "gpt-image-1",
      prompt: imgPrompt,
      size: "1024x1024",
    }),
    90000,
    "images.generate"
  );

  const first = img?.data?.[0];
  console.log("🧩 image response keys:", Object.keys(first || {}));

  if (first?.url) return first.url;

  if (first?.b64_json) {
    if (!hasCloudinary) return placeholderImageUrl(r?.title);

    const dataUrl = `data:image/png;base64,${first.b64_json}`;

    const safeTitle = String(r?.title || "recipe")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60);

    const publicId = `${safeTitle}-${Date.now()}`;
    return await uploadPngDataUrlToCloudinary(dataUrl, publicId);
  }

  throw new Error(
    `No usable image in response. keys=${Object.keys(first || {}).join(",")}`
  );
}

/**
 * ----------------------------
 * Routes: Auth
 * ----------------------------
 */
app.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body ?? {};

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email, password required",
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        message: "password must be at least 8 characters",
      });
    }

    const uname = String(username).trim();
    const mail = String(email).trim().toLowerCase();

    const existing = await db.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [mail, uname]
    );

    if (existing.rowCount > 0) {
      return res
        .status(409)
        .json({ message: "Email or username already in use" });
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
    return res.status(500).json({ message: String(err?.message || err) });
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
    return res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

app.get("/auth/me", requireUser, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await db.query(
      `SELECT id, username, email
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("auth/me error:", err);
    return res.status(500).json({ message: "Failed to load user" });
  }
});

app.patch("/users/me", requireUser, async (req, res) => {
  try {
    const userId = req.userId;
    const { username } = req.body ?? {};

    if (!username || !String(username).trim()) {
      return res.status(400).json({ message: "username required" });
    }

    const uname = String(username).trim();

    const existing = await db.query(
      `SELECT id FROM users WHERE username = $1 AND id <> $2`,
      [uname, userId]
    );

    if (existing.rowCount > 0) {
      return res.status(409).json({ message: "Username already in use" });
    }

    const updated = await db.query(
      `UPDATE users
       SET username = $1
       WHERE id = $2
       RETURNING id, username, email`,
      [uname, userId]
    );

    if (updated.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(updated.rows[0]);
  } catch (err) {
    console.error("users/me patch error:", err);
    return res.status(500).json({ message: "Failed to update username" });
  }
});

/**
 * ----------------------------
 * Routes: Health + info
 * ----------------------------
 */
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/", (req, res) => {
  res.send("Pantry Wizard API is running. Try GET /health");
});

app.get("/version", (req, res) => {
  res.json({
    sha: process.env.RENDER_GIT_COMMIT || "unknown",
    hasUserRecipesRoute: true,
  });
});

/**
 * ----------------------------
 * Stub generator route
 * ----------------------------
 */
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

/**
 * ----------------------------
 * Real AI route
 * ----------------------------
 */

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

function placeholderImageUrl(title = "Recipe") {
  const text = encodeURIComponent(String(title).slice(0, 40));
  return `https://via.placeholder.com/512?text=${text}`;
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

  // If it returns a URL directly, use it
  if (first?.url) return first.url;
  // If it returns base64, upload to Cloudinary and return a real HTTPS URL
  if (first?.b64_json) {
    const dataUrl = `data:image/png;base64,${first.b64_json}`;

    // ✅ Local/dev fallback: return a data URL so the phone can render it
    // (React Native <Image source={{ uri }} /> supports this)
    if (!hasCloudinary) {
      return dataUrl;
    }

    const safeTitle = String(r?.title || "recipe")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60);

    const publicId = `${safeTitle}-${Date.now()}`;

    return await uploadPngDataUrlToCloudinary(dataUrl, publicId);
  }

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
    // Log the richest version of the error
    console.error("AI ERROR:", err?.response?.data || err);

    // Return details temporarily so your phone can show the real reason
    return res.status(500).json({
      error: "AI generation failed",
      details: err?.response?.data || err?.message || String(err),
    });
  }
});

/**
 * ----------------------------
 * User recipes (saved)
 * ----------------------------
 */
app.post("/api/user-recipes", requireUser, async (req, res) => {
  try {
    const { recipe } = req.body ?? {};
    if (!recipe || typeof recipe !== "object") {
      return res.status(400).send("Missing recipe in request body");
    }

    const title = String(recipe.title ?? "").trim();
    const ingredientsUsed = Array.isArray(recipe.ingredientsUsed)
      ? recipe.ingredientsUsed
      : [];
    const missingIngredients = Array.isArray(recipe.missingIngredients)
      ? recipe.missingIngredients
      : [];
    const steps = Array.isArray(recipe.steps) ? recipe.steps : [];
    const timeMinutes = Number(recipe.timeMinutes);

    if (!title) return res.status(400).send("recipe.title is required");
    if (!Number.isFinite(timeMinutes))
      return res.status(400).send("recipe.timeMinutes must be a number");

    const userId = getUserId(req);

    const isVeggie = false;
    const isGf = false;

    // 1) Insert into recipes
    // Step 1: strip id so DB default (gen_random_uuid) can run
    delete recipe.id;

    // 🔍 DEBUG (temporary): inspect DB schema for recipes.id
    // Consider removing once confirmed in production.
    const idInfo = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema='public'
        AND table_name='recipes'
        AND column_name='id'
    `);
    console.log("DB recipes.id column:", idInfo.rows[0]);

    const ext = await db.query(
      `SELECT extname FROM pg_extension WHERE extname='pgcrypto'`
    );
    console.log("pgcrypto installed:", ext.rows.length > 0);

    const newId = uuidv4();

    const inserted = await db.query(
      `INSERT INTO recipes (id, name, generated_by_ai, prompt_used, is_veggie, is_gf, recipe_json)
   VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
   RETURNING id`,
      [
        newId,
        title,
        true, // generated_by_ai

        recipe.imagePrompt ?? null,
        isVeggie,
        isGf,
        JSON.stringify({
          title,
          ingredientsUsed,
          missingIngredients,
          steps,
          timeMinutes,
          imageUrl: recipe.imageUrl ?? null,
        }),
      ]
    );

    const recipeId = inserted.rows[0].id;

    // 2) Insert into favorites (assumes table exists)
    const favId = uuidv4();

    await db.query(
      `INSERT INTO favorites (id, user_id, recipe_id)
   VALUES ($1, $2, $3)
   ON CONFLICT (user_id, recipe_id) DO NOTHING`,
      [favId, userId, recipeId]
    );

    return res.json({ ok: true, recipeId });
  } catch (err) {
    console.error("save recipe error:", err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
});

app.delete("/api/user-recipes/:id", requireUser, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id: recipeId } = req.params;

    // Remove the saved relationship for THIS user + THIS recipe
    const result = await db.query(
      `
      DELETE FROM favorites
      WHERE user_id = $1 AND recipe_id = $2
      RETURNING id
      `,
      [userId, recipeId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Saved recipe not found");
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("delete saved recipe error:", err);
    return res.status(500).json({ error: String(err?.message || err) });
  }
});

app.get("/api/user-recipes", requireUser, async (req, res) => {
  try {
    const userId = getUserId(req);

    const result = await db.query(
      `
      SELECT
        r.id,
        r.name,
        r.recipe_json,
        f.created_at
      FROM favorites f
      JOIN recipes r ON r.id = f.recipe_id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
      `,
      [userId]
    );

    const recipes = result.rows.map((row) => ({
      id: row.id,
      savedAt: row.created_at,
      name: row.name,
      ...(row.recipe_json ?? {}),
    }));

    res.json({ recipes });
  } catch (err) {
    console.error("list saved recipes error:", err);
    return res.status(500).json({ error: "Failed to fetch saved recipes" });
  }
});

/**
 * ----------------------------
 * Debug routes (optional)
 * ----------------------------
 */
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
    app_keys: Object.keys(app).slice(0, 40),
  });
});

app.get("/_debug/routes", (req, res) => {
  const routes = [];

  function walk(stack, prefix = "") {
    for (const layer of stack || []) {
      if (layer.route?.path) {
        const methods = Object.keys(layer.route.methods || {})
          .filter((m) => layer.route.methods[m])
          .map((m) => m.toUpperCase());

        routes.push({ path: prefix + layer.route.path, methods });
      }

      if (layer.name === "router" && layer.handle?.stack) {
        let mount = "";
        const s = layer.regexp?.toString?.() || "";
        const m = s.match(/^\/\^\\\/(.+?)\\\/\?\(\?=\\\/\|\$\)\/i$/);
        if (m?.[1]) mount = "/" + m[1].replace(/\\\//g, "/");

        walk(layer.handle.stack, prefix + mount);
      }
    }
  }

  const rootStack = app._router?.stack || app.router?.stack || [];
  walk(rootStack, "");

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

/**
 * ----------------------------
 * DB ping + server start
 * ----------------------------
 */
db.query("SELECT NOW()")
  .then(() => console.log("✅ DB connected"))
  .catch((e) => console.error("❌ DB connection error", e));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});

/**
 * ----------------------------
 * Exports (must be after app/db exist)
 * ----------------------------
 */
export { app, db };
export default app;
