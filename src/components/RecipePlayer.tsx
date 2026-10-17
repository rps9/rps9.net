import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChefHat, Clock3, Pause, Play, RotateCcw } from "lucide-react";
import type { Ingredient, IngredientGroup, RecipeDraft } from "../types/recipes";

type Props = {
  recipe: RecipeDraft;
  onExit: () => void;
};

const GROUP_LABELS: Record<IngredientGroup, string> = {
  dry: "Dry bowl",
  wet: "Wet bowl",
  other: "On the bench",
};

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function RecipePlayer({ recipe, onExit }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const currentStep = recipe.steps[stepIndex];
  const initialSeconds = (currentStep?.duration_minutes ?? 0) * 60;
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    setRunning(false);
    setRemaining((recipe.steps[stepIndex]?.duration_minutes ?? 0) * 60);
  }, [recipe.steps, stepIndex]);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const timer = window.setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [remaining, running]);

  const groupedIngredients = useMemo(() => {
    const groups: Record<IngredientGroup, Ingredient[]> = { dry: [], wet: [], other: [] };
    recipe.ingredients.forEach((ingredient) => groups[ingredient.group].push(ingredient));
    return groups;
  }, [recipe.ingredients]);

  if (complete) {
    return (
      <div className="page-panel text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center border border-black bg-[#b21f2d] text-white">
          <Check className="h-8 w-8" />
        </div>
        <p className="editorial-kicker mt-6 text-center">Service</p>
        <h2 className="text-4xl font-black">Dinner is ready.</h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-600">You finished {recipe.title || "your recipe"}. Take a breath, plate it up, and enjoy.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn-secondary" onClick={() => {
            setComplete(false);
            setStepIndex(0);
          }}><RotateCcw className="h-4 w-4" /> Cook again</button>
          <button type="button" className="btn-primary" onClick={onExit}>Back to editor</button>
        </div>
      </div>
    );
  }

  const progress = ((stepIndex + 1) / recipe.steps.length) * 100;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button type="button" className="btn-secondary" onClick={onExit}>
          <ArrowLeft className="h-4 w-4" /> Back to editor
        </button>
        <span className="text-sm font-bold uppercase tracking-[0.16em] text-neutral-600">
          Step {stepIndex + 1} of {recipe.steps.length}
        </span>
      </div>

      <section className="border border-black bg-white">
        <div className="h-2 bg-neutral-200" aria-label={`${Math.round(progress)} percent complete`}>
          <div className="h-full bg-[#b21f2d] transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="p-6 md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <p className="editorial-kicker">{currentStep.kind} / {currentStep.duration_minutes ? `${currentStep.duration_minutes} min` : "no timer"}</p>
              <h2 className="text-3xl font-black leading-tight md:text-5xl">{currentStep.instruction}</h2>
            </div>
            {initialSeconds > 0 && (
              <div className="w-full shrink-0 border border-black bg-[#f6f3ed] p-5 text-center md:w-56">
                <Clock3 className="mx-auto h-5 w-5 text-[#b21f2d]" />
                <div className="my-3 font-mono text-4xl font-black tabular-nums">{formatTime(remaining)}</div>
                <div className="flex justify-center gap-2">
                  <button type="button" className="btn-primary !min-h-0 !px-3 !py-2" disabled={remaining === 0}
                    onClick={() => setRunning((value) => !value)}>
                    {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {running ? "Pause" : "Start"}
                  </button>
                  <button type="button" className="btn-secondary !min-h-0 !px-3 !py-2" aria-label="Reset timer"
                    onClick={() => {
                      setRunning(false);
                      setRemaining(initialSeconds);
                    }}>
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {currentStep.parallel_note && (
            <div className="mt-8 border-l-4 border-[#b21f2d] bg-[#fff6f4] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b21f2d]">While this runs</p>
              <p className="mt-2 font-semibold leading-7">{currentStep.parallel_note}</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-neutral-300 pt-5">
            <button type="button" className="btn-secondary" disabled={stepIndex === 0}
              onClick={() => setStepIndex((value) => Math.max(0, value - 1))}>Previous</button>
            <button type="button" className="btn-primary" onClick={() => {
              if (stepIndex === recipe.steps.length - 1) setComplete(true);
              else setStepIndex((value) => value + 1);
            }}>
              <Check className="h-4 w-4" /> {stepIndex === recipe.steps.length - 1 ? "Finish recipe" : "Complete step"}
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className="page-panel">
          <div className="flex items-center gap-3">
            <ChefHat className="h-5 w-5 text-[#b21f2d]" />
            <h3 className="text-xl font-black">Ingredient stations</h3>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {(Object.keys(GROUP_LABELS) as IngredientGroup[]).map((group) => groupedIngredients[group].length > 0 && (
              <div key={group} className="border-t border-black pt-3">
                <h4 className="text-xs font-black uppercase tracking-[0.16em] text-[#b21f2d]">{GROUP_LABELS[group]}</h4>
                <ul className="mt-3 space-y-2 text-sm">
                  {groupedIngredients[group].map((ingredient) => (
                    <li key={ingredient.id}><span className="font-bold">{ingredient.amount}</span> {ingredient.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="page-panel">
          <h3 className="text-xl font-black">Kitchen game plan</h3>
          {recipe.optimization_notes.length > 0 ? (
            <ul className="mt-5 space-y-3">
              {recipe.optimization_notes.map((note, index) => (
                <li key={index} className="flex gap-3 text-sm leading-6">
                  <span className="font-black text-[#b21f2d]">{String(index + 1).padStart(2, "0")}</span>
                  {note}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm leading-6 text-neutral-600">No optimization notes yet. You can add them in the editor at any time.</p>
          )}
        </section>
      </div>
    </div>
  );
}
