import Header from '../components/Header';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';

type Game = 'cricket' | 'X01';

const GAME_OPTIONS: { value: Game; label: string }[] = [
  { value: 'cricket', label: 'Cricket' },
  { value: 'X01',     label: 'X01' }
];

export default function Darts() {
  const [game, setGame] = useState<Game>('cricket');
  const [gameMenuOpen, setGameMenuOpen] = useState(false);
  const gameMenuRef = useRef<HTMLDivElement>(null);

  const selected = GAME_OPTIONS.find(o => o.value === game)!;
  const targetPath = game === 'cricket' ? '/darts/cricket' : '/darts/x01';

  useEffect(() => {
    const closeGameMenu = (event: MouseEvent) => {
      if (!gameMenuRef.current?.contains(event.target as Node)) {
        setGameMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setGameMenuOpen(false);
    };

    window.addEventListener('click', closeGameMenu);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('click', closeGameMenu);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <div className="site-shell">
    <Header />
    <section className="site-section flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
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

            <div className="relative" ref={gameMenuRef}>
              <button
                id="game"
                type="button"
                className="field-control flex items-center justify-between pr-3 text-left"
                aria-haspopup="listbox"
                aria-expanded={gameMenuOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setGameMenuOpen((open) => !open);
                }}
              >
                <span>{selected.label}</span>
                <ChevronDown
                  className={`h-5 w-5 text-neutral-600 transition-transform ${
                    gameMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {gameMenuOpen && (
                <div
                  role="listbox"
                  aria-label="Game format"
                  className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden border border-black bg-white shadow-[8px_8px_0_#111]"
                >
                  {GAME_OPTIONS.map((opt) => {
                    const active = opt.value === game;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={active}
                        className={`flex w-full items-center gap-3 border-b border-neutral-200 px-4 py-3 text-left font-semibold text-black transition last:border-b-0 hover:bg-neutral-100 ${
                          active ? 'text-[#b21f2d]' : ''
                        }`}
                        onClick={() => {
                          setGame(opt.value);
                          setGameMenuOpen(false);
                        }}
                      >
                        <Check className={`h-4 w-4 ${active ? 'opacity-100' : 'opacity-0'}`} />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}
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
