export type IngredientGroup = "dry" | "wet" | "other";
export type StepKind = "prep" | "mix" | "heat" | "cook" | "wait" | "finish";

export type Ingredient = {
  id: string;
  amount: string;
  name: string;
  group: IngredientGroup;
};

export type RecipeStep = {
  id: string;
  instruction: string;
  kind: StepKind;
  duration_minutes: number;
  parallel_note: string;
};

export type RecipeDraft = {
  title: string;
  description: string;
  servings: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  optimization_notes: string[];
};

export type SavedRecipe = RecipeDraft & {
  id: number;
  created_at: string;
  updated_at: string;
};
