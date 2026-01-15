import React, { createContext, useContext, useMemo, useState } from "react";
import type { Recipe } from "@/src/types/recipe";

export type GeneratedRecipe = Recipe & { _id: string };

type Ctx = {
  recipes: GeneratedRecipe[];
  setRecipes: (r: GeneratedRecipe[]) => void;
  getById: (id: string) => GeneratedRecipe | undefined;
};

const GeneratedRecipesContext = createContext<Ctx | null>(null);

export function GeneratedRecipesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recipes, setRecipes] = useState<GeneratedRecipe[]>([]);

  const value = useMemo(
    () => ({
      recipes,
      setRecipes,
      getById: (id: string) => recipes.find((x) => x._id === id),
    }),
    [recipes]
  );

  return (
    <GeneratedRecipesContext.Provider value={value}>
      {children}
    </GeneratedRecipesContext.Provider>
  );
}

export function useGeneratedRecipes() {
  const ctx = useContext(GeneratedRecipesContext);
  if (!ctx)
    throw new Error(
      "useGeneratedRecipes must be used within GeneratedRecipesProvider"
    );
  return ctx;
}
