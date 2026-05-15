import { useRef, useState } from 'react';
import X01Player from '../components/X01Player';
import X01ScoreKeeper from '../components/X01ScoreKeeper';
import Header from '../components/Header';
import { RotateCcw } from "lucide-react";


type Player = { id: number; name: string; score: number; doubledIn: boolean };

type ThrowRecord = {
    playerId: number;
    prevScore: number;
    prevDoubledIn: boolean;
    prevActiveId: number | null;
    prevThrowsThisTurn: number;
    prevGameOver: { winnerId: number } | null;
    points: number;
    isDouble: boolean;
};

export default function X01() {
    const [, setHistory] = useState<ThrowRecord[]>([]);
    const [startScore, setStartScore] = useState<number>(301);
    const [players, setPlayers] = useState<Player[]>([]);
    const [removeMode, setRemoveMode] = useState(false);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [throwsThisTurn, setThrowsThisTurn] = useState(0);
    const [gameOver, setGameOver] = useState<{ winnerId: number } | null>(null);
    const nextId = useRef(1);

    const canAdd = players.length < 4 && !gameOver;

    const addPlayer = () => {
        if (!canAdd) return;
        const id = nextId.current++;
        setPlayers(prev => {
        const next = [...prev, { id, name: `Player ${prev.length + 1}`, score: startScore, doubledIn: false }];
        if (activeId === null) setActiveId(id);
        return next;
        });
    };

    const activePlayer = activeId !== null ? players.find(p => p.id === activeId) : undefined;


    const updatePlayerName = (id: number, name: string) => {
        setPlayers(prev => prev.map(p => (p.id === id ? { ...p, name } : p)));
    };

    const removePlayer = (id: number) => {
        if (!removeMode || gameOver) return;
        setPlayers(prev => {
        const next = prev.filter(p => p.id !== id);
        if (activeId === id) {
            setActiveId(next.length ? next[0].id : null);
            setThrowsThisTurn(0);
        }
        return next;
        });
    };

    const endTurn = () => {
        if (!players.length || activeId === null) return;
        const idx = players.findIndex(p => p.id === activeId);
        const nextIdx = (idx + 1) % players.length;
        setActiveId(players[nextIdx].id);
        setThrowsThisTurn(0);
    };

    const registerThrow = (points: number, { isDouble }: { isDouble: boolean }) => {
        if (gameOver || activeId === null || !players.length) return;

        const curr = players.find(p => p.id === activeId)!;
        const prevScore = curr.score;
        const prevDoubledIn = curr.doubledIn;

        let winnerId: number | null = null;

        setPlayers(prev => prev.map(p => {
            if (p.id !== activeId) return p;

            // Not doubled-in yet
            if (!p.doubledIn) {
                if (!isDouble) {
                    return p;
                }
                const ns = p.score - points;
                return { ...p, score: ns, doubledIn: true };
            }

            // Already doubled-in
            const ns = p.score - points;
            if (ns === 0) winnerId = p.id;
            return { ...p, score: ns };
        }));

        //History
        const rec: ThrowRecord = {
            playerId: activeId,
            prevScore,
            prevDoubledIn,
            prevActiveId: activeId,
            prevThrowsThisTurn: throwsThisTurn,
            prevGameOver: gameOver,
            points,
            isDouble,
        };
        setHistory(h => [...h, rec]);

        if (winnerId) { setGameOver({ winnerId }); return; }

        // Use the dart
        const nextThrow = throwsThisTurn + 1;
        if (nextThrow >= 3) {
            endTurn();
        } else {
            setThrowsThisTurn(nextThrow);
        }
    };

    // Undo last throw or miss
    const undoLast = () => {
        setHistory(h => {
            if (h.length === 0) return h;
            const last = h[h.length - 1];

            setPlayers(prev =>
                prev.map(p =>
                    p.id === last.playerId
                    ? { ...p, score: last.prevScore, doubledIn: last.prevDoubledIn }
                    : p
                )
            );

            setActiveId(last.prevActiveId);
            setThrowsThisTurn(last.prevThrowsThisTurn);
            setGameOver(last.prevGameOver);

            return h.slice(0, -1);
        });
    };

    const restartGame = () => {
        if (!players.length) return;
        const firstId = players[0].id; // Player 1 stays first in order

        setPlayers(prev =>
            prev.map(p => ({ ...p, score: startScore, doubledIn: false }))
        );

        setActiveId(firstId);
        setThrowsThisTurn(0);
        setGameOver(null);
        setRemoveMode(false);
        setHistory([]);
    };

    return (
        <div className="site-shell">
        <Header />
        <section className="site-section-tight min-h-[calc(100vh-4rem)]">
        
        <div className="w-full max-w-6xl mx-auto">
            {/* Top controls */}
            <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
                <p className="editorial-kicker mb-1">Darts</p>
                <h1 className="section-title">X01</h1>

                <div className="w-full max-w-xs">
                <label htmlFor="x01-start" className="field-label">
                    Starting score
                </label>
                <input
                    id="x01-start"
                    type="number"
                    inputMode="numeric"
                    placeholder="X01"
                    value={startScore}
                    onChange={(e) => setStartScore(Number(e.target.value || 0))}
                    className="field-control"
                    disabled={!!players.length || !!gameOver}
                />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                onClick={addPlayer}
                disabled={!canAdd}
                className="btn-primary"
                aria-disabled={!canAdd}
                >
                Add player {players.length > 0 ? `(${players.length}/4)` : ''}
                </button>

                <button
                onClick={() => setRemoveMode(m => !m)}
                disabled={!!gameOver || players.length === 0}
                className={`inline-flex min-h-11 items-center justify-center border px-5 py-3 text-sm font-bold uppercase tracking-wide transition
                    ${removeMode
                    ? 'border-[#b21f2d] bg-white text-[#b21f2d] hover:bg-[#fff6f4]'
                    : 'border-[#b21f2d] bg-[#b21f2d] text-white hover:bg-black'}
                    disabled:cursor-not-allowed disabled:opacity-50`}
                aria-pressed={removeMode}
                title={removeMode ? 'Click a player to remove (active)' : 'Toggle remove mode'}
                >
                Remove Player
                </button>
            </div>
            </div>

            {/* Turn HUD */}
            <div className="status-note mt-4">
            {gameOver && activeId !== null ? (
                <span className="font-semibold text-emerald-800">
                Game over - Winner: {players.find(p => p.id === gameOver.winnerId)?.name}
                <button
                onClick={restartGame}
                disabled={players.length === 0}
                className="btn-secondary ml-3 min-h-9 px-3 py-2"
                title="Restart game"
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Restart?
                </button>
                </span>
            ) : activeId !== null ? (
                <>
                Turn: <span className="font-black text-black">{players.find(p => p.id === activeId)?.name}</span>
                <span className="ml-3 text-neutral-600">Dart {throwsThisTurn + 1} of 3</span>
                </>
            ) : (
                <span className="text-neutral-500">Add a player to begin</span>
            )}
            </div>

            {/* Score keeper */}
            <div className="mt-6">
                <X01ScoreKeeper
                    onScore={(points, detail) => registerThrow(points, { isDouble: detail.isDouble })}
                    onMiss={() => registerThrow(0, { isDouble: false })}
                    onUndo={undoLast}
                    disabled={removeMode || !players.length || activeId === null || !!gameOver}
                    currentScore={activePlayer ? activePlayer.score : 0}
                    doubledIn={activePlayer ? activePlayer.doubledIn : false}
                />
            </div>

            {/* Players stacked vertically */}
            <div className="mt-8 flex flex-col gap-4">
            {players.map((p, idx) => (
                <X01Player
                key={p.id}
                id={p.id}
                name={p.name}
                score={p.score}
                indexLabel={`Player ${idx + 1}`}
                onNameChange={(next) => updatePlayerName(p.id, next)}
                onRemove={() => removePlayer(p.id)}
                removeMode={removeMode}
                isActive={p.id === activeId}
                onActivate={() => setActiveId(p.id)}
                />
            ))}
            </div>
        </div>
        </section>
        </div>
    );
}
