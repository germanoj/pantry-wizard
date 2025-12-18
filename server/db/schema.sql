DROP TABLE IF EXISTS tried_recipes;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS users;

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
    is_gf BOOLEAN NOT NULL
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