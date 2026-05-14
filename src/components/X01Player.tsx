interface X01PlayerProps {
    id: number;
    name: string;
    onNameChange: (next: string) => void;
    score: number | '';
    className?: string;
    indexLabel?: string;
    removeMode?: boolean;
    onRemove?: () => void;
    isActive?: boolean;
    onActivate?: () => void; 
}

export default function X01Player({
    id, name, onNameChange, score, className = '', indexLabel,
    removeMode = false, onRemove, isActive = false, onActivate,
}: X01PlayerProps) {
    const inputId = `x01-player-name-${id}`;

    const clickableRemove = removeMode && !!onRemove;
    const clickableActivate = !removeMode && !!onActivate;

    return (
        <div
        onClick={clickableRemove ? onRemove : clickableActivate ? onActivate : undefined}
        className={[
            "min-w-0 w-full border border-black bg-white p-4",
            "text-black shadow-none flex flex-col",
            clickableRemove ? "cursor-pointer hover:bg-[#fff6f4] ring-2 ring-[#b21f2d]" : "",
            !clickableRemove && isActive ? "ring-2 ring-blue-600" : "",
            className,
        ].join(" ")}
        role={clickableRemove ? "button" : undefined}
        aria-label={clickableRemove ? `Remove ${name}` : undefined}
        tabIndex={clickableRemove ? 0 : -1}
        onKeyDown={(e) => {
            if (clickableRemove && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onRemove?.();
            }
            // Prevent activating/removing when typing in the input
            // (Input itself stops propagation for space/enter below)
        }}
        >
        {/* Top row: Name (editable) + Score */}
        <div className="flex items-center gap-3">
            <input
            id={inputId}
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={indexLabel}
            autoComplete="off"
            className="field-control min-w-0 flex-1 px-2 py-2 text-sm leading-5"
            // prevent remove/activate when interacting with the input
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') e.stopPropagation();
            }}
            />

            <div className="shrink-0">
            <span className="score-pill">
                <span className="text-xs font-bold uppercase tracking-wide text-neutral-500">Score</span>
                <span className="text-sm font-black text-black">{score === '' ? '-' : score}</span>
            </span>
            </div>
        </div>
        </div>
    );
}
