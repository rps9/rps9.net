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
    return <span className="text-sm text-gray-500">-</span>;
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
    <>
      <Header />
      <section className="min-h-screen px-4 py-8 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">Cricket</h1>
              <span className="text-sm text-gray-400">Up to 4 players</span>
              <div className="w-full max-w-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="block text-sm font-medium text-gray-400">Scoring mode</span>
                </div>
                <div className="grid grid-cols-2 rounded-xl border border-gray-700 bg-gray-900/70 p-1">
                  <button
                    type="button"
                    onClick={() => setGameMode('points')}
                    disabled={modeLocked}
                    className={`w-full h-10 px-4 rounded-lg text-sm font-medium transition-colors ${
                      gameMode === 'points'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-300 hover:bg-gray-800/70'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    Points
                  </button>
                  <button
                    type="button"
                    onClick={() => setGameMode('no-points')}
                    disabled={modeLocked}
                    className={`w-full h-10 px-4 rounded-lg text-sm font-medium transition-colors ${
                      gameMode === 'no-points'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-300 hover:bg-gray-800/70'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
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
                className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm border border-blue-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add player {players.length > 0 ? `(${players.length}/4)` : ''}
              </button>
              <button
                onClick={() => setRemoveMode((m) => !m)}
                disabled={!!gameOver || players.length === 0}
                className={`inline-flex items-center justify-center h-11 px-5 rounded-lg shadow-sm border
                  ${
                    removeMode
                      ? 'bg-red-500/60 text-white border-red-400/30 hover:bg-red-500/70'
                      : 'bg-red-600 text-white border-red-500 hover:bg-red-500'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Remove Player
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-300">
            {gameOver ? (
              <span className="text-green-400 font-semibold">
                Game over - Winner: {players.find((p) => p.id === gameOver.winnerId)?.name}
                <button
                  onClick={restartGame}
                  className="inline-flex items-center justify-center ml-3 h-9 px-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors shadow-sm border border-gray-600"
                  title="Restart game"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restart?
                </button>
              </span>
            ) : activePlayer ? (
              <>
                Turn: <span className="text-white font-semibold">{activePlayer.name}</span>
                <span className="ml-3 text-gray-400">Dart {throwsThisTurn + 1} of 3</span>
              </>
            ) : (
              <span className="text-gray-500">Add a player to begin</span>
            )}
          </div>

          <div className="mt-6 w-full max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={registerMiss}
                  disabled={controlsDisabled}
                  className="h-10 px-4 rounded-lg border border-gray-700 bg-gray-800/80 text-gray-200 hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Miss
                </button>
                <button
                  onClick={undoLast}
                  disabled={history.length === 0}
                  className="h-10 px-4 rounded-lg border border-gray-700 bg-gray-800/80 text-gray-200 hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Undo
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-gray-700 bg-gray-900/70 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-800">
                {MULTS.map((m) => (
                  <div key={m} className="grid grid-cols-7 divide-x divide-gray-800">
                    {TARGETS.map((target) => {
                      if (target === 'BULL' && m === 3) {
                        return <div key={`${m}-${target}`} className="py-3 px-2 bg-gray-900/50" />;
                      }
                      const disabled = controlsDisabled;
                      const prefix = m === 1 ? '' : m === 2 ? 'D' : 'T';
                      const label = `${prefix}${target === 'BULL' ? 'BULL' : target}`;
                      return (
                        <button
                          key={`${m}-${target}`}
                          onClick={() => registerThrow(target, m)}
                          disabled={disabled}
                          className="py-3 px-2 text-center text-gray-100 hover:bg-gray-800/70 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-300">
              {selected ? (
                <>
                  Selected: <span className="font-semibold text-white">{selected}</span>
                </>
              ) : (
                <span className="text-gray-500">Pick a target...</span>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {players.map((p, idx) => (
              <div
                key={p.id}
                onClick={removeMode ? () => removePlayer(p.id) : () => setActiveId(p.id)}
                className={`min-w-0 w-full bg-gray-900/70 border border-gray-700 rounded-xl p-4 text-gray-200 shadow-sm ${
                  removeMode
                    ? 'cursor-pointer hover:bg-gray-800/70 ring-1 ring-red-500/60'
                    : p.id === activeId && !gameOver
                      ? 'ring-1 ring-green-500/60'
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
                    className="flex-1 min-w-0 text-sm leading-5 bg-gray-900/70 text-white border border-gray-700 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/70 px-3 py-2">
                    <span className="text-xs text-gray-400">Score</span>
                    <span className="text-sm text-white font-semibold">{p.score}</span>
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2">
                  {TARGETS.map((target) => (
                    <div key={`${p.id}-${target}`} className="rounded-lg border border-gray-700 bg-gray-800/70 px-2 py-2 text-center">
                      <div className="text-[11px] text-gray-400">{target === 'BULL' ? 'BULL' : target}</div>
                      <div className="mt-1 flex items-center justify-center">{cricketMarkGlyph(p.marks[target])}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
