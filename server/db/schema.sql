DROP TABLE IF EXISTS tried_recipes;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS saved_recipes;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE recipes (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  generated_by_ai BOOLEAN NOT NULL DEFAULT TRUE,
  prompt_used TEXT,
  is_veggie BOOLEAN NOT NULL,
  is_gf BOOLEAN NOT NULL,
  recipe_json JSONB
);

CREATE TABLE favorites (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, recipe_id)
);
    
CREATE TABLE tried_recipes (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    is_tried BOOLEAN DEFAULT FALSE,
    UNIQUE (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS saved_recipes (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    ingredients_used TEXT[] NOT NULL DEFAULT '{}',
    missing_ingredients TEXT[] NOT NULL DEFAULT '{}',
    steps TEXT[] NOT NULL DEFAULT '{}',
    time_minutes INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS saved_recipes_user_id_idx
  ON saved_recipes(user_id);

CREATE INDEX IF NOT EXISTS saved_recipes_created_at_idx
  ON saved_recipes(created_at DESC);

INSERT INTO users (id, username, email, password)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'dev',
  'dev@local.test'
)
ON CONFLICT (email) DO NOTHING;

/*deleted dev for hashing passwords*/