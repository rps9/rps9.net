import { useEffect, useRef, useState } from 'react';

type Mult = 1 | 2 | 3;
type Cell = number | 'BULL';

const ROWS: Cell[][] = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 'BULL'],
];

interface Props {
  onScore: (points: number, detail: { cell: Cell; mult: Mult; label: string; isDouble: boolean }) => void;
  onMiss: () => void;
  onUndo: () => void;
  disabled?: boolean;
  currentScore: number;
  doubledIn: boolean;
}

export default function X01ScoreKeeper({ onScore, onMiss, onUndo, disabled = false, currentScore, doubledIn }: Props) {
  const [mult, setMult] = useState<Mult>(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const flashTimer = useRef<number | null>(null);

  useEffect(() => () => { if (flashTimer.current) window.clearTimeout(flashTimer.current); }, []);

  const labelFor = (cell: Cell) => {
    if (cell === 'BULL') return mult === 2 ? 'DBULL' : 'BULL'; // no triple bull
    if (mult === 2) return `D${cell}`;
    if (mult === 3) return `T${cell}`;
    return String(cell);
  };

  const pointsFor = (cell: Cell, m: Mult) => (cell === 'BULL' ? (m === 2 ? 50 : 25) : (cell as number) * m);
  const isDoublePick = (cell: Cell, m: Mult) => (cell === 'BULL' ? m === 2 : m === 2);
  const keyFor = (cell: Cell) => (cell === 'BULL' ? 'BULL' : String(cell));
  const isUnavailableCell = (cell: Cell): boolean => cell === 'BULL' && mult === 3;

  // Disable rules for double-in / double-out and busts
  const isDisabledCell = (cell: Cell): boolean => {
    if (disabled) return true;
    if (isUnavailableCell(cell)) return true;
    const pts = pointsFor(cell, mult);
    const dbl = isDoublePick(cell, mult);
    const next = currentScore - pts;

    if (!doubledIn) {
      // must double-in; nothing else selectable
      if (!dbl) return true;
      if (next < 0) return true;       // bust on double-in attempt
      return false;                    // valid double-in (next can be 0 too)
    }
    // already in
    if (next < 0) return true;         // bust
    if (next === 0 && !dbl) return true; // must double-out exactly
    return false;
  };

  const handlePick = (cell: Cell, target: HTMLButtonElement) => {
    if (isDisabledCell(cell)) { target.blur(); return; }

    const label = labelFor(cell);
    const dbl = isDoublePick(cell, mult);
    const points = pointsFor(cell, mult);

    setSelected(label);

    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    const k = keyFor(cell);
    setFlash(k);
    flashTimer.current = window.setTimeout(() => setFlash(null), 100);

    onScore(points, { cell, mult, label, isDouble: dbl });
    target.blur();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Multiplier toggle */}
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((m) => (
        <button
          key={m}
          onClick={(e) => { setMult(m as Mult); (e.currentTarget as HTMLButtonElement).blur(); }}
          className={`h-10 border px-4 text-sm font-bold uppercase tracking-wide transition-colors
            ${mult === m
              ? 'border-black bg-black text-white'
              : 'border-black bg-white text-black hover:bg-neutral-100'}`}
          aria-pressed={mult === m}
          disabled={disabled}
        >
          x{m}
        </button>
      ))}

      {/* Miss & Undo */}
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => { if (!disabled) onMiss(); }}
          disabled={disabled}
          className="btn-secondary min-h-10 px-4 py-2 disabled:opacity-50"
          title="Record a miss (0 points)"
        >
          Miss
        </button>
        <button
          onClick={() => { if (!disabled) onUndo(); }}
          disabled={disabled}
          className="btn-secondary min-h-10 px-4 py-2 disabled:opacity-50"
          title="Undo last throw"
        >
          Undo
        </button>
      </div>
    </div>

      {/* Numbers grid */}
      <div className="mt-4 overflow-hidden border border-black bg-white">
        <div className="divide-y divide-black">
          {ROWS.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-7">
              {row.map((cell) => {
                const k = keyFor(cell);
                const unavailable = isUnavailableCell(cell);
                const cellDisabled = isDisabledCell(cell);
                const isFlashing = flash === k;
                if (unavailable) {
                  return (
                    <div
                      key={k}
                      aria-hidden="true"
                      className="relative border-r border-black bg-neutral-100 px-1 py-3 last:border-r-0 sm:px-2"
                    />
                  );
                }
                return (
                  <button
                    key={k}
                    onClick={(e) => handlePick(cell, e.currentTarget)}
                    onTouchEnd={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                    disabled={cellDisabled}
                    aria-disabled={cellDisabled}
                    className={`relative min-w-0 border-r border-black px-1 py-3 text-center text-xs font-bold text-black transition-colors last:border-r-0 sm:px-2 sm:text-base
                                ${cellDisabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-neutral-100'}
                                ${isFlashing ? 'ring-2 ring-blue-600 ring-inset bg-blue-50' : ''}
                                focus:outline-none`}
                  >
                    {labelFor(cell)}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Last selection */}
      <div className="mt-3 text-sm text-neutral-600">
        {selected ? (
          <>Selected: <span className="font-black text-black">{selected}</span></>
        ) : (
          <span className="text-neutral-500">Pick a number...</span>
        )}
      </div>
    </div>
  );
}
