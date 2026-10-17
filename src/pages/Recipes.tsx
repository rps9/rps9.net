import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, BookOpen, ChefHat, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import RecipeEditor from "../components/RecipeEditor";
import RecipePlayer from "../components/RecipePlayer";
import type { RecipeDraft, SavedRecipe } from "../types/recipes";
import { isSignedIn } from "../utils/auth";
import {
  createRecipe,
  deleteRecipe,
  listRecipes,
  RecipeApiError,
  updateRecipe,
} from "../utils/recipeApi";
import { emptyRecipe, optimizeRecipe } from "../utils/recipeOptimizations";

function toDraft(recipe: SavedRecipe): RecipeDraft {
  return {
    title: recipe.title,
    description: recipe.description,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    optimization_notes: recipe.optimization_notes,
  };
}

function validate(recipe: RecipeDraft): string | null {
  if (!recipe.title.trim()) return "Give the recipe a name before saving or cooking.";
  if (recipe.ingredients.some((ingredient) => !ingredient.name.trim())) return "Every ingredient needs a name.";
  if (recipe.steps.some((step) => !step.instruction.trim())) return "Every step needs an instruction.";
  return null;
}

export default function Recipes() {
  const signedIn = isSignedIn();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [draft, setDraft] = useState<RecipeDraft>(() => emptyRecipe());
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(signedIn);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const loaded = await listRecipes();
      setRecipes(loaded);
      if (loaded.length > 0) {
        setSelectedId(loaded[0].id);
        setDraft(toDraft(loaded[0]));
      }
    } catch (requestError) {
      const message = requestError instanceof RecipeApiError && requestError.status === 401
        ? "Your session has expired. Sign in again to open your recipes."
        : requestError instanceof Error ? requestError.message : "Recipes could not be loaded.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (signedIn) void loadRecipes();
  }, [loadRecipes, signedIn]);

  const chooseRecipe = (recipe: SavedRecipe) => {
    setSelectedId(recipe.id);
    setDraft(toDraft(recipe));
    setPlaying(false);
    setError(null);
    setNotice(null);
  };

  const newRecipe = () => {
    setSelectedId(null);
    setDraft(emptyRecipe());
    setPlaying(false);
    setError(null);
    setNotice(null);
  };

  const save = async () => {
    const validationError = validate(draft);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setNotice(null);
    setSaving(true);
    try {
      const saved = selectedId === null
        ? await createRecipe(draft)
        : await updateRecipe(selectedId, draft);
      setSelectedId(saved.id);
      setDraft(toDraft(saved));
      setRecipes((current) => [saved, ...current.filter((recipe) => recipe.id !== saved.id)]);
      setNotice("Recipe saved.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Recipe could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (selectedId === null || !window.confirm("Delete this recipe? This cannot be undone.")) return;
    setError(null);
    try {
      await deleteRecipe(selectedId);
      const remaining = recipes.filter((recipe) => recipe.id !== selectedId);
      setRecipes(remaining);
      if (remaining.length > 0) chooseRecipe(remaining[0]);
      else newRecipe();
      setNotice("Recipe deleted.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Recipe could not be deleted.");
    }
  };

  const beginPlayback = () => {
    const validationError = validate(draft);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setPlaying(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!signedIn) {
    return (
      <div className="site-shell">
        <Header />
        <main className="site-section flex min-h-[calc(100vh-4rem)] items-center">
          <div className="site-container">
            <div className="page-panel mx-auto max-w-2xl text-center">
              <BookOpen className="mx-auto h-10 w-10 text-[#b21f2d]" />
              <p className="editorial-kicker mt-6 text-center">Recipe Studio</p>
              <h1 className="text-4xl font-black md:text-5xl">Your kitchen notebook lives behind sign-in.</h1>
              <p className="mx-auto mt-5 max-w-lg leading-7 text-neutral-600">Sign in to create recipes, save your optimizations, and play each dish back one step at a time.</p>
              <Link to="/sign-in" className="btn-primary mt-8">Sign in to continue</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="site-shell">
      <Header />
      <main className="site-section !py-10 md:!py-14">
        <div className="site-container">
          <div className="mb-10 flex flex-col justify-between gap-6 border-b border-black pb-8 md:flex-row md:items-end">
            <div>
              <p className="editorial-kicker">Recipe Studio</p>
              <h1 className="editorial-title">Plan less. <span className="text-[#b21f2d]">Cook smoother.</span></h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">Build a reusable recipe, organize the kitchen work, then follow it in a distraction-free cook mode.</p>
            </div>
            <button type="button" className="btn-primary shrink-0" onClick={newRecipe}>
              <Plus className="h-4 w-4" /> New recipe
            </button>
          </div>

          {error && <div className="status-error mb-6 flex items-center gap-2"><AlertTriangle className="h-5 w-5 shrink-0" /> {error}</div>}
          {notice && <div className="status-success mb-6">{notice}</div>}

          {playing ? (
            <RecipePlayer recipe={draft} onExit={() => setPlaying(false)} />
          ) : (
            <div className="grid min-w-0 gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
              <aside>
                <div className="sticky top-24 border border-black bg-white">
                  <div className="border-b border-black p-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#b21f2d]" />
                      <h2 className="font-black uppercase tracking-wide">Saved recipes</h2>
                    </div>
                  </div>
                  {loading ? (
                    <p className="p-4 text-sm text-neutral-600">Loading your kitchen…</p>
                  ) : recipes.length === 0 ? (
                    <p className="p-4 text-sm leading-6 text-neutral-600">Your shelf is empty. Start with the recipe on the right.</p>
                  ) : (
                    <ul>
                      {recipes.map((recipe) => (
                        <li key={recipe.id} className="border-b border-neutral-200 last:border-b-0">
                          <button type="button" onClick={() => chooseRecipe(recipe)}
                            className={`w-full p-4 text-left transition hover:bg-neutral-100 ${selectedId === recipe.id ? "bg-[#fff6f4]" : ""}`}>
                            <span className="block font-bold">{recipe.title}</span>
                            <span className="mt-1 block text-xs uppercase tracking-wide text-neutral-500">{recipe.steps.length} steps · serves {recipe.servings}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {selectedId !== null && (
                    <div className="border-t border-black p-3">
                      <button type="button" className="btn-danger w-full" onClick={() => void remove()}>
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </aside>

              <div className="min-w-0">
                <div className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-neutral-600">
                  <ChefHat className="h-5 w-5 text-[#b21f2d]" />
                  {selectedId === null ? "New draft" : "Editing saved recipe"}
                </div>
                <RecipeEditor
                  recipe={draft}
                  saving={saving}
                  onChange={(recipe) => {
                    setDraft(recipe);
                    setNotice(null);
                  }}
                  onSave={() => void save()}
                  onPlay={beginPlayback}
                  onOptimize={() => {
                    setDraft((recipe) => optimizeRecipe(recipe));
                    setNotice("Optimization cues added. Review and adjust them for your kitchen.");
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
