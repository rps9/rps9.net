import Header from '../components/Header';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type Game = 'cricket' | 'X01';

const GAME_OPTIONS: { value: Game; label: string }[] = [
  { value: 'cricket', label: 'Cricket' },
  { value: 'X01',     label: 'X01' }
];

export default function Darts() {
  const [game, setGame] = useState<Game>('cricket');

  const selected = GAME_OPTIONS.find(o => o.value === game)!;
  const targetPath = game === 'cricket' ? '/darts/cricket' : '/darts/x01';

  return (
    <div className="site-shell">
    <Header />
    <section className="site-section flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center">
      <div className="max-w-3xl w-full mx-auto text-center">
        <p className="editorial-kicker text-center">Scorekeepers</p>
        <h1 className="editorial-title mx-auto text-center">
          Darts <span className="text-[#b21f2d]">Games</span>
        </h1>
        <p className="mt-6 text-neutral-600">Choose a game to get started.</p>

        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-md text-left">
            <label htmlFor="game" className="field-label">
              Game format
            </label>

            <div className="relative">
              <select
                id="game"
                value={game}
                onChange={(e) => setGame(e.target.value as Game)}
                className="field-control appearance-none pr-10"
              >
                {GAME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* chevron */}
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 24 24" className="text-neutral-600">
                  <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Selected + Play button */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            to={targetPath}
            className="btn-primary px-8"
            aria-label={`Play ${selected.label}`}
          >
            Play {selected.label}
          </Link>
        </div>
      </div>
    </section>
    </div>
  );
}
