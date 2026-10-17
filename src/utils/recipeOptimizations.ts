import type { Ingredient, IngredientGroup, RecipeDraft, RecipeStep } from "../types/recipes";

const DRY_WORDS = [
  "flour", "sugar", "salt", "pepper", "baking", "cocoa", "spice", "cinnamon",
  "rice", "oat", "cornstarch", "yeast", "powder", "soda",
];
const WET_WORDS = [
  "water", "milk", "cream", "oil", "butter", "egg", "vanilla", "vinegar",
  "juice", "broth", "stock", "honey", "syrup", "yogurt",
];
const PARALLEL_KINDS = new Set(["prep", "mix"]);

export function makeRecipeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyIngredient(): Ingredient {
  return { id: makeRecipeId("ingredient"), amount: "", name: "", group: "other" };
}

export function emptyStep(): RecipeStep {
  return {
    id: makeRecipeId("step"),
    instruction: "",
    kind: "prep",
    duration_minutes: 0,
    parallel_note: "",
  };
}

export function emptyRecipe(): RecipeDraft {
  return {
    title: "",
    description: "",
    servings: 4,
    ingredients: [emptyIngredient()],
    steps: [emptyStep()],
    optimization_notes: [],
  };
}

function classifyIngredient(name: string): IngredientGroup {
  const normalized = name.toLowerCase();
  if (DRY_WORDS.some((word) => normalized.includes(word))) return "dry";
  if (WET_WORDS.some((word) => normalized.includes(word))) return "wet";
  return "other";
}

export function optimizeRecipe(recipe: RecipeDraft): RecipeDraft {
  const ingredients = recipe.ingredients.map((ingredient) => ({
    ...ingredient,
    group: classifyIngredient(ingredient.name),
  }));

  const notes: string[] = [];
  const dryCount = ingredients.filter((item) => item.group === "dry").length;
  const wetCount = ingredients.filter((item) => item.group === "wet").length;
  if (dryCount > 1) notes.push("Measure and combine the dry ingredients in one bowl.");
  if (wetCount > 1) notes.push("Combine the wet ingredients before they meet the dry mixture.");

  const steps = recipe.steps.map((step, index, allSteps) => {
    if (step.parallel_note || step.duration_minutes <= 0 || !["heat", "cook", "wait"].includes(step.kind)) {
      return step;
    }
    const nextWork = allSteps.slice(index + 1).find((candidate) => PARALLEL_KINDS.has(candidate.kind));
    if (!nextWork?.instruction.trim()) return step;
    return {
      ...step,
      parallel_note: `While this runs, start: ${nextWork.instruction.trim()}`,
    };
  });

  if (steps.some((step) => step.parallel_note)) {
    notes.push("Use heating and hands-off time for the prep cues shown during playback.");
  }

  return {
    ...recipe,
    ingredients,
    steps,
    optimization_notes: Array.from(new Set([...recipe.optimization_notes, ...notes])),
  };
}
