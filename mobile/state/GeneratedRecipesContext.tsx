import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type UiRecipe = {
  id: string;
  title: string;
  time: string;
  image?: any;
  description?: string;
  ingredients?: string[];
  steps?: string[];
};

type Ctx = {
  recipes: UiRecipe[] | null;
  setRecipes: (recipes: UiRecipe[]) => void;
  clearRecipes: () => void;
};

const GeneratedRecipesContext = createContext<Ctx | null>(null);

export function GeneratedRecipesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recipes, setRecipesState] = useState<UiRecipe[] | null>(null);

  const setRecipes = useCallback(
    (next: UiRecipe[]) => setRecipesState(next),
    []
  );
  const clearRecipes = useCallback(() => setRecipesState(null), []);

  const value = useMemo(
    () => ({ recipes, setRecipes, clearRecipes }),
    [recipes, setRecipes, clearRecipes]
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
