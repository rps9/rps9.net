import {
  ArrowDown,
  ArrowUp,
  ChefHat,
  Lightbulb,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import type {
  Ingredient,
  IngredientGroup,
  RecipeDraft,
  RecipeStep,
  StepKind,
} from "../types/recipes";
import { emptyIngredient, emptyStep } from "../utils/recipeOptimizations";

type Props = {
  recipe: RecipeDraft;
  saving: boolean;
  onChange: (recipe: RecipeDraft) => void;
  onSave: () => void;
  onPlay: () => void;
  onOptimize: () => void;
};

const GROUPS: { value: IngredientGroup; label: string }[] = [
  { value: "dry", label: "Dry bowl" },
  { value: "wet", label: "Wet bowl" },
  { value: "other", label: "Other" },
];

const STEP_KINDS: { value: StepKind; label: string }[] = [
  { value: "prep", label: "Prep / chop" },
  { value: "mix", label: "Mix" },
  { value: "heat", label: "Preheat" },
  { value: "cook", label: "Cook" },
  { value: "wait", label: "Hands-off wait" },
  { value: "finish", label: "Finish / serve" },
];

function move<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function RecipeEditor({
  recipe,
  saving,
  onChange,
  onSave,
  onPlay,
  onOptimize,
}: Props) {
  const updateIngredient = (id: string, patch: Partial<Ingredient>) => {
    onChange({
      ...recipe,
      ingredients: recipe.ingredients.map((item) => item.id === id ? { ...item, ...patch } : item),
    });
  };

  const updateStep = (id: string, patch: Partial<RecipeStep>) => {
    onChange({
      ...recipe,
      steps: recipe.steps.map((step) => step.id === id ? { ...step, ...patch } : step),
    });
  };

  return (
    <div className="space-y-10">
      <section className="page-panel">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_10rem]">
          <div>
            <label htmlFor="recipe-title" className="field-label">Recipe name</label>
            <input
              id="recipe-title"
              className="field-control text-xl font-bold"
              value={recipe.title}
              maxLength={120}
              placeholder="Sunday tomato pasta"
              onChange={(event) => onChange({ ...recipe, title: event.target.value })}
            />
          </div>
          <div>
            <label htmlFor="recipe-servings" className="field-label">Servings</label>
            <input
              id="recipe-servings"
              className="field-control"
              type="number"
              min={1}
              max={100}
              value={recipe.servings}
              onChange={(event) => onChange({
                ...recipe,
                servings: Math.max(1, Math.min(100, Number(event.target.value) || 1)),
              })}
            />
          </div>
        </div>
        <div className="mt-6">
          <label htmlFor="recipe-description" className="field-label">Short description</label>
          <textarea
            id="recipe-description"
            className="field-control"
            rows={2}
            maxLength={1000}
            value={recipe.description}
            placeholder="What makes this recipe worth coming back to?"
            onChange={(event) => onChange({ ...recipe, description: event.target.value })}
          />
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-t border-black pt-4">
          <div>
            <p className="editorial-kicker !mb-2">01 / Mise en place</p>
            <h2 className="text-3xl font-black">Ingredients</h2>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onChange({ ...recipe, ingredients: [...recipe.ingredients, emptyIngredient()] })}
          >
            <Plus className="h-4 w-4" /> Add ingredient
          </button>
        </div>

        <div className="space-y-3">
          {recipe.ingredients.map((ingredient, index) => (
            <div key={ingredient.id} className="grid gap-3 border border-black bg-white p-3 md:grid-cols-[3rem_8rem_minmax(0,1fr)_10rem_2.75rem] md:items-center">
              <span className="text-sm font-black text-[#b21f2d]">{String(index + 1).padStart(2, "0")}</span>
              <input
                aria-label={`Ingredient ${index + 1} amount`}
                className="field-control"
                value={ingredient.amount}
                maxLength={80}
                placeholder="2 cups"
                onChange={(event) => updateIngredient(ingredient.id, { amount: event.target.value })}
              />
              <input
                aria-label={`Ingredient ${index + 1} name`}
                className="field-control"
                value={ingredient.name}
                maxLength={120}
                placeholder="all-purpose flour"
                onChange={(event) => updateIngredient(ingredient.id, { name: event.target.value })}
              />
              <select
                aria-label={`Ingredient ${index + 1} station`}
                className="field-control"
                value={ingredient.group}
                onChange={(event) => updateIngredient(ingredient.id, { group: event.target.value as IngredientGroup })}
              >
                {GROUPS.map((group) => <option key={group.value} value={group.value}>{group.label}</option>)}
              </select>
              <button
                type="button"
                className="tool-tile flex h-11 items-center justify-center"
                aria-label={`Remove ingredient ${index + 1}`}
                onClick={() => onChange({
                  ...recipe,
                  ingredients: recipe.ingredients.length === 1
                    ? [emptyIngredient()]
                    : recipe.ingredients.filter((item) => item.id !== ingredient.id),
                })}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-t border-black pt-4">
          <div>
            <p className="editorial-kicker !mb-2">02 / Timeline</p>
            <h2 className="text-3xl font-black">Cooking steps</h2>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onChange({ ...recipe, steps: [...recipe.steps, emptyStep()] })}
          >
            <Plus className="h-4 w-4" /> Add step
          </button>
        </div>

        <div className="space-y-4">
          {recipe.steps.map((step, index) => (
            <article key={step.id} className="border border-black bg-white p-4 md:p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="text-sm font-black uppercase tracking-[0.18em] text-[#b21f2d]">Step {index + 1}</span>
                <div className="flex gap-2">
                  <button type="button" className="tool-tile" aria-label={`Move step ${index + 1} up`} disabled={index === 0}
                    onClick={() => onChange({ ...recipe, steps: move(recipe.steps, index, index - 1) })}>
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" className="tool-tile" aria-label={`Move step ${index + 1} down`} disabled={index === recipe.steps.length - 1}
                    onClick={() => onChange({ ...recipe, steps: move(recipe.steps, index, index + 1) })}>
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button type="button" className="tool-tile" aria-label={`Remove step ${index + 1}`}
                    onClick={() => onChange({
                      ...recipe,
                      steps: recipe.steps.length === 1 ? [emptyStep()] : recipe.steps.filter((item) => item.id !== step.id),
                    })}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <textarea
                aria-label={`Step ${index + 1} instruction`}
                className="field-control"
                rows={3}
                maxLength={1000}
                value={step.instruction}
                placeholder="Dice the onion and mince the garlic."
                onChange={(event) => updateStep(step.id, { instruction: event.target.value })}
              />
              <div className="mt-4 grid gap-4 md:grid-cols-[12rem_10rem_minmax(0,1fr)]">
                <div>
                  <label className="field-label">Type</label>
                  <select className="field-control" value={step.kind}
                    onChange={(event) => updateStep(step.id, { kind: event.target.value as StepKind })}>
                    {STEP_KINDS.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Timer (minutes)</label>
                  <input className="field-control" type="number" min={0} max={1440} value={step.duration_minutes}
                    onChange={(event) => updateStep(step.id, {
                      duration_minutes: Math.max(0, Math.min(1440, Number(event.target.value) || 0)),
                    })} />
                </div>
                <div>
                  <label className="field-label">While this runs (optional)</label>
                  <input className="field-control" maxLength={300} value={step.parallel_note}
                    placeholder="Chop the herbs while the oven heats."
                    onChange={(event) => updateStep(step.id, { parallel_note: event.target.value })} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border border-black bg-[#fff6f4] p-5">
        <div className="flex items-start gap-3">
          <Lightbulb className="mt-1 h-5 w-5 shrink-0 text-[#b21f2d]" />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-black">Optimization notes</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">Generate a starting plan, then edit every cue to match your kitchen.</p>
          </div>
          <button type="button" className="btn-secondary shrink-0" onClick={onOptimize}>Optimize</button>
        </div>
        <div className="mt-5 space-y-3">
          {recipe.optimization_notes.map((note, index) => (
            <div key={index} className="flex gap-2">
              <input
                className="field-control"
                aria-label={`Optimization note ${index + 1}`}
                maxLength={300}
                value={note}
                onChange={(event) => onChange({
                  ...recipe,
                  optimization_notes: recipe.optimization_notes.map((item, itemIndex) => itemIndex === index ? event.target.value : item),
                })}
              />
              <button type="button" className="tool-tile" aria-label={`Remove optimization note ${index + 1}`}
                onClick={() => onChange({
                  ...recipe,
                  optimization_notes: recipe.optimization_notes.filter((_, itemIndex) => itemIndex !== index),
                })}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button type="button" className="accent-link" onClick={() => onChange({
            ...recipe,
            optimization_notes: [...recipe.optimization_notes, ""],
          })}>Add your own note</button>
        </div>
      </section>

      <div className="sticky bottom-4 z-20 flex flex-wrap justify-end gap-3 border border-black bg-white p-3 shadow-[8px_8px_0_#111]">
        <button type="button" className="btn-secondary" onClick={onPlay}>
          <ChefHat className="h-4 w-4" /> Cook this recipe
        </button>
        <button type="button" className="btn-primary" disabled={saving} onClick={onSave}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save recipe"}
        </button>
      </div>
    </div>
  );
}
