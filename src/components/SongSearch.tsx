import { useEffect, useRef, useState } from "react";
import { Search, Plus, X, AlertTriangle } from "lucide-react";
import { authHeader } from "../utils/auth";

type Track = { name: string; artists: string; image?: string };

export default function SongSearch({ onChange }: { onChange?: (tracks: Track[]) => void }) {
	const API_BASE = "https://rps9.net";

	const [q, setQ] = useState("");
	const [hits, setHits] = useState<Track[]>([]);
	const [picked, setPicked] = useState<Track[]>([]);
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState<string | null>(null);
	const [showResults, setShowResults] = useState(false);

	const timerRef = useRef<number | null>(null);
	const ctrlRef = useRef<AbortController | null>(null);
	const wrapRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		onChange?.(picked);
	}, [picked, onChange]);

	useEffect(() => {
		if (timerRef.current) window.clearTimeout(timerRef.current);

		const trimmed = q.trim();
		if (!trimmed) {
			setHits([]);
			setErr(null);
			setLoading(false);
			setShowResults(false);
			return;
		}

		timerRef.current = window.setTimeout(async () => {
			if (ctrlRef.current) ctrlRef.current.abort();
			const ctrl = new AbortController();
			ctrlRef.current = ctrl;
			setLoading(true);
			setErr(null);
			try {
				const res = await fetch(`${API_BASE}/api/spotify/search?q=${encodeURIComponent(trimmed)}`, {
					method: "GET",
					headers: { "Content-Type": "application/json", ...authHeader() },
					signal: ctrl.signal,
				});
				if (!res.ok) {
					const text = await res.text();
					throw new Error(text || `HTTP ${res.status}`);
				}
				const data = await res.json();
				if (data?.error === "rate_limited") {
					setErr("Rate limited by Spotify. Try again in a minute.");
					setHits([]);
					setShowResults(false);
				} else {
					const nextHits = Array.isArray(data?.tracks) ? data.tracks : [];
					setHits(nextHits);
					setShowResults(nextHits.length > 0);
				}
			} catch (e: unknown) {
				if (!(e instanceof DOMException && e.name === "AbortError")) {
					setErr("Search failed");
					setHits([]);
					setShowResults(false);
				}
			} finally {
				setLoading(false);
			}
		}, 350);

		return () => {
			if (timerRef.current) window.clearTimeout(timerRef.current);
		};
	}, [q]);

	useEffect(() => {
		const onDown = (e: MouseEvent) => {
			if (!wrapRef.current) return;
			if (!wrapRef.current.contains(e.target as Node)) setShowResults(false);
		};
		window.addEventListener("mousedown", onDown);
		return () => window.removeEventListener("mousedown", onDown);
	}, []);

	const add = (t: Track) => {
		setPicked((prev) =>
			prev.find((p) => p.name === t.name && p.artists === t.artists) ? prev : [...prev, t]
		);
	};

	const removeAt = (idx: number) => {
		setPicked((prev) => prev.filter((_, i) => i !== idx));
	};

	return (
		<div className="w-full py-5 text-black">
			<h1 className="mb-8 text-center text-4xl font-black text-black md:text-5xl">
				Song <span className="text-[#b21f2d]">Picker</span>
			</h1>

			{/* Search input + overlay dropdown (no layout shift) */}
			<div ref={wrapRef} className="relative max-w-2xl mx-auto">
				<input
					value={q}
					onChange={(e) => setQ(e.target.value)}
					onFocus={() => setShowResults(hits.length > 0)}
					onKeyDown={(e) => e.key === "Escape" && setShowResults(false)}
					placeholder="Search songs..."
					className="field-control py-3 pl-12 pr-4"
				/>
				<Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />

				{showResults && (
					<div className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto border border-black bg-white shadow-[8px_8px_0_#111]">
						<ul className="py-2">
							{loading && <li className="px-4 py-3 text-neutral-500">Searching...</li>}
							{!loading && err && (
								<li className="flex items-center gap-2 px-4 py-3 text-[#8f1420]">
									<AlertTriangle className="h-5 w-5" />
									<span>{err}</span>
								</li>
							)}
							{!loading && !err && hits.length === 0 && q.trim() && (
								<li className="px-4 py-3 text-neutral-500">No results</li>
							)}
							{hits.map((t, i) => (
								<li key={`${t.name}-${t.artists}-${i}`}>
									<button
										onClick={() => {
											add(t);
											setShowResults(false);
										}}
										className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-neutral-100"
									>
										{t.image ? (
											<img src={t.image} alt="" className="h-10 w-10 border border-black object-cover" />
										) : (
											<div className="h-10 w-10 border border-black bg-neutral-100" />
										)}
										<div className="flex-1 min-w-0">
											<div className="truncate font-bold text-black">{t.name}</div>
											<div className="truncate text-sm text-neutral-600">{t.artists}</div>
										</div>
										<Plus className="h-5 w-5 shrink-0 text-[#b21f2d]" />
									</button>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>

			{/* Selected list (stable, no dependency on overlay height) */}
			<div className="max-w-4xl mx-auto mt-8">
				<h2 className="mb-4 border-t border-black pt-4 text-center text-2xl font-black text-black md:text-left">Selected</h2>
				{picked.length === 0 ? (
					<p className="text-center text-neutral-600 md:text-left">Nothing yet - pick songs above.</p>
				) : (
					<ul className="space-y-3">
						{picked.map((t, idx) => (
							<li
								key={`${t.name}-${idx}`}
								className="flex items-center justify-between border border-black bg-white p-3"
							>
								<div className="flex items-center gap-3 min-w-0">
									{t.image ? (
										<img src={t.image} alt="" className="h-10 w-10 border border-black object-cover" />
									) : (
										<div className="h-10 w-10 border border-black bg-neutral-100" />
									)}
									<div className="min-w-0">
										<div className="truncate font-bold text-black">{t.name}</div>
										<div className="truncate text-sm text-neutral-600">{t.artists}</div>
									</div>
								</div>
								<button
									onClick={() => removeAt(idx)}
									className="border border-transparent p-2 transition-colors hover:border-black hover:bg-neutral-100"
									aria-label="Remove"
								>
									<X className="h-5 w-5 text-neutral-700" />
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
