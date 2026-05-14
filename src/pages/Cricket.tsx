import { useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import Header from '../components/Header';
import cricketMarkSlash from '../assets/cricket_mark_slash.svg';
import cricketMarkX from '../assets/cricket_mark_x.svg';
import cricketMarkClosed from '../assets/cricket_mark_closed.svg';

type Target = 20 | 19 | 18 | 17 | 16 | 15 | 'BULL';
type Mult = 1 | 2 | 3;
type Marks = Record<Target, number>;
type GameMode = 'points' | 'no-points';

type Player = {
  id: number;
  name: string;
  score: number;
  marks: Marks;
};

type ThrowRecord = {
  prevPlayers: Player[];
  prevActiveId: number | null;
  prevThrowsThisTurn: number;
  prevGameOver: { winnerId: number } | null;
};

const TARGETS: Target[] = [20, 19, 18, 17, 16, 15, 'BULL'];
const MULTS: Mult[] = [1, 2, 3];

const emptyMarks = (): Marks => ({
  20: 0,
  19: 0,
  18: 0,
  17: 0,
  16: 0,
  15: 0,
  BULL: 0,
});

const clonePlayers = (players: Player[]): Player[] =>
  players.map((p) => ({ ...p, marks: { ...p.marks } }));

const allClosed = (marks: Marks): boolean => TARGETS.every((t) => marks[t] >= 3);

const pointsForTarget = (target: Target): number => (target === 'BULL' ? 25 : target);

const marksFromThrow = (target: Target, mult: Mult): number => {
  if (target === 'BULL') return mult === 2 ? 2 : 1;
  return mult;
};

const cricketMarkGlyph = (marks: number) => {
  const clamped = Math.max(0, Math.min(3, marks));
  if (clamped === 0) {
    return <span className="text-sm text-neutral-500">-</span>;
  }
  const src = clamped === 1 ? cricketMarkSlash : clamped === 2 ? cricketMarkX : cricketMarkClosed;
  const alt = clamped === 1 ? 'slash mark' : clamped === 2 ? 'x mark' : 'closed mark';
  return <img src={src} alt={alt} className="h-6 w-6 object-contain" />;
};

export default function Cricket() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [throwsThisTurn, setThrowsThisTurn] = useState(0);
  const [history, setHistory] = useState<ThrowRecord[]>([]);
  const [gameOver, setGameOver] = useState<{ winnerId: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [removeMode, setRemoveMode] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('points');
  const nextId = useRef(1);

  const activePlayer = activeId !== null ? players.find((p) => p.id === activeId) : undefined;
  const canAdd = players.length < 4 && !gameOver;

  const addPlayer = () => {
    if (!canAdd) return;
    const id = nextId.current++;
    setPlayers((prev) => {
      const next = [...prev, { id, name: `Player ${prev.length + 1}`, score: 0, marks: emptyMarks() }];
      if (activeId === null) setActiveId(id);
      return next;
    });
  };

  const updatePlayerName = (id: number, name: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const removePlayer = (id: number) => {
    if (!removeMode || gameOver) return;
    setPlayers((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (activeId === id) {
        setActiveId(next.length ? next[0].id : null);
        setThrowsThisTurn(0);
      }
      return next;
    });
  };

  const winnerFrom = (candidatePlayers: Player[]): number | null => {
    if (gameMode === 'no-points') {
      const closer = candidatePlayers.find((p) => allClosed(p.marks));
      return closer ? closer.id : null;
    }
    for (const p of candidatePlayers) {
      if (!allClosed(p.marks)) continue;
      const strictlyAhead = candidatePlayers.every((o) => o.id === p.id || p.score > o.score);
      if (strictlyAhead) return p.id;
    }
    return null;
  };

  const endTurn = (currentPlayers: Player[]) => {
    if (!currentPlayers.length || activeId === null) return;
    const idx = currentPlayers.findIndex((p) => p.id === activeId);
    const nextIdx = (idx + 1) % currentPlayers.length;
    setActiveId(currentPlayers[nextIdx].id);
    setThrowsThisTurn(0);
  };

  const recordSnapshot = () => {
    setHistory((prev) => [
      ...prev,
      {
        prevPlayers: clonePlayers(players),
        prevActiveId: activeId,
        prevThrowsThisTurn: throwsThisTurn,
        prevGameOver: gameOver,
      },
    ]);
  };

  const registerMiss = () => {
    if (gameOver || activeId === null) return;
    recordSnapshot();
    const nextThrow = throwsThisTurn + 1;
    if (nextThrow >= 3) {
      endTurn(players);
      return;
    }
    setThrowsThisTurn(nextThrow);
  };

  const registerThrow = (target: Target, mult: Mult) => {
    if (gameOver || activeId === null) return;
    if (target === 'BULL' && mult === 3) return;

    recordSnapshot();

    const marksHit = marksFromThrow(target, mult);
    const targetValue = pointsForTarget(target);
    const nextPlayers = clonePlayers(players);
    const active = nextPlayers.find((p) => p.id === activeId);

    if (!active) return;

    const currentMarks = active.marks[target];
    const rawNextMarks = currentMarks + marksHit;
    const overflow = Math.max(0, rawNextMarks - 3);
    active.marks[target] = Math.min(3, rawNextMarks);

    if (gameMode === 'points' && overflow > 0) {
      active.score += overflow * targetValue;
    }

    setPlayers(nextPlayers);
    setSelected(`${mult === 1 ? '' : mult === 2 ? 'D' : 'T'}${target === 'BULL' ? 'BULL' : target}`);

    const winnerId = winnerFrom(nextPlayers);
    if (winnerId !== null) {
      setGameOver({ winnerId });
      return;
    }

    const nextThrow = throwsThisTurn + 1;
    if (nextThrow >= 3) {
      endTurn(nextPlayers);
      return;
    }
    setThrowsThisTurn(nextThrow);
  };

  const undoLast = () => {
    setHistory((prev) => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      setPlayers(last.prevPlayers);
      setActiveId(last.prevActiveId);
      setThrowsThisTurn(last.prevThrowsThisTurn);
      setGameOver(last.prevGameOver);
      return prev.slice(0, -1);
    });
  };

  const restartGame = () => {
    if (!players.length) return;
    const firstId = players[0].id;
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        score: 0,
        marks: emptyMarks(),
      }))
    );
    setActiveId(firstId);
    setThrowsThisTurn(0);
    setSelected(null);
    setHistory([]);
    setGameOver(null);
    setRemoveMode(false);
  };

  const controlsDisabled = !!gameOver || activeId === null || removeMode;
  const modeLocked = history.length > 0 || !!gameOver;

  return (
    <div className="site-shell">
      <Header />
      <section className="site-section-tight min-h-[calc(100svh-4rem)]">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="editorial-kicker mb-1">Darts</p>
              <h1 className="section-title">Cricket</h1>
              <span className="text-sm font-semibold text-neutral-600">Up to 4 players</span>
              <div className="w-full max-w-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="field-label mb-0">Scoring mode</span>
                </div>
                <div className="segmented grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setGameMode('points')}
                    disabled={modeLocked}
                    className={`segmented-button ${
                      gameMode === 'points'
                        ? 'segmented-button-active'
                        : ''
                    }`}
                  >
                    Points
                  </button>
                  <button
                    type="button"
                    onClick={() => setGameMode('no-points')}
                    disabled={modeLocked}
                    className={`segmented-button ${
                      gameMode === 'no-points'
                        ? 'segmented-button-active'
                        : ''
                    }`}
                  >
                    No points
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={addPlayer}
                disabled={!canAdd}
                className="btn-primary"
              >
                Add player {players.length > 0 ? `(${players.length}/4)` : ''}
              </button>
              <button
                onClick={() => setRemoveMode((m) => !m)}
                disabled={!!gameOver || players.length === 0}
                className={`inline-flex min-h-11 items-center justify-center border px-5 py-3 text-sm font-bold uppercase tracking-wide transition
                  ${
                    removeMode
                      ? 'border-[#b21f2d] bg-white text-[#b21f2d] hover:bg-[#fff6f4]'
                      : 'border-[#b21f2d] bg-[#b21f2d] text-white hover:bg-black'
                  }
                  disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Remove Player
              </button>
            </div>
          </div>

          <div className="status-note mt-4">
            {gameOver ? (
              <span className="font-semibold text-emerald-800">
                Game over - Winner: {players.find((p) => p.id === gameOver.winnerId)?.name}
                <button
                  onClick={restartGame}
                  className="btn-secondary ml-3 min-h-9 px-3 py-2"
                  title="Restart game"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restart?
                </button>
              </span>
            ) : activePlayer ? (
              <>
                Turn: <span className="font-black text-black">{activePlayer.name}</span>
                <span className="ml-3 text-neutral-600">Dart {throwsThisTurn + 1} of 3</span>
              </>
            ) : (
              <span className="text-neutral-500">Add a player to begin</span>
            )}
          </div>

          <div className="mt-6 w-full max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={registerMiss}
                  disabled={controlsDisabled}
                  className="btn-secondary min-h-10 px-4 py-2 disabled:opacity-50"
                >
                  Miss
                </button>
                <button
                  onClick={undoLast}
                  disabled={history.length === 0}
                  className="btn-secondary min-h-10 px-4 py-2 disabled:opacity-50"
                >
                  Undo
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-hidden border border-black bg-white">
              <div className="divide-y divide-black">
                {MULTS.map((m) => (
                  <div key={m} className="grid grid-cols-7 divide-x divide-black">
                    {TARGETS.map((target) => {
                      if (target === 'BULL' && m === 3) {
                        return <div key={`${m}-${target}`} className="bg-neutral-100 px-2 py-3" />;
                      }
                      const disabled = controlsDisabled;
                      const prefix = m === 1 ? '' : m === 2 ? 'D' : 'T';
                      const label = `${prefix}${target === 'BULL' ? 'BULL' : target}`;
                      return (
                        <button
                          key={`${m}-${target}`}
                          onClick={() => registerThrow(target, m)}
                          disabled={disabled}
                          className="px-2 py-3 text-center font-bold text-black hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 text-sm text-neutral-600">
              {selected ? (
                <>
                  Selected: <span className="font-black text-black">{selected}</span>
                </>
              ) : (
                <span className="text-neutral-500">Pick a target...</span>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {players.map((p, idx) => (
              <div
                key={p.id}
                onClick={removeMode ? () => removePlayer(p.id) : () => setActiveId(p.id)}
                className={`min-w-0 w-full border border-black bg-white p-4 text-black shadow-none ${
                  removeMode
                    ? 'cursor-pointer hover:bg-[#fff6f4] ring-2 ring-[#b21f2d]'
                    : p.id === activeId && !gameOver
                      ? 'ring-2 ring-blue-600'
                      : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    id={`cricket-player-name-${p.id}`}
                    type="text"
                    value={p.name}
                    onChange={(e) => updatePlayerName(p.id, e.target.value)}
                    placeholder={`Player ${idx + 1}`}
                    autoComplete="off"
                    className="field-control min-w-0 flex-1 px-2 py-2 text-sm leading-5"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="score-pill">
                    <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">Score</span>
                    <span className="text-sm font-black text-black">{p.score}</span>
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2">
                  {TARGETS.map((target) => (
                    <div key={`${p.id}-${target}`} className="border border-black bg-[#f6f3ed] px-2 py-2 text-center">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-600">{target === 'BULL' ? 'BULL' : target}</div>
                      <div className="mt-1 flex items-center justify-center">{cricketMarkGlyph(p.marks[target])}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
