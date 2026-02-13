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
			} catch (e: any) {
				if (e.name !== "AbortError") {
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
		<div className="py-5 w-full text-gray-300">
			<h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
				Song <span className="text-blue-400">Picker</span>
			</h1>

			{/* Search input + overlay dropdown (no layout shift) */}
			<div ref={wrapRef} className="relative max-w-2xl mx-auto">
				<input
					value={q}
					onChange={(e) => setQ(e.target.value)}
					onFocus={() => setShowResults(hits.length > 0)}
					onKeyDown={(e) => e.key === "Escape" && setShowResults(false)}
					placeholder="Search songs…"
					className="w-full bg-gray-800 border border-gray-700 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
				/>
				<Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

				{showResults && (
					<div className="absolute left-0 right-0 mt-2 z-50 bg-gray-800/95 backdrop-blur border border-gray-700 rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
						<ul className="py-2">
							{loading && <li className="px-4 py-3 text-gray-400">Searching…</li>}
							{!loading && err && (
								<li className="px-4 py-3 text-yellow-400 flex items-center gap-2">
									<AlertTriangle className="h-5 w-5" />
									<span>{err}</span>
								</li>
							)}
							{!loading && !err && hits.length === 0 && q.trim() && (
								<li className="px-4 py-3 text-gray-400">No results</li>
							)}
							{hits.map((t, i) => (
								<li key={`${t.name}-${t.artists}-${i}`}>
									<button
										onClick={() => {
											add(t);
											setShowResults(false);
										}}
										className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700/70 text-left"
									>
										{t.image ? (
											<img src={t.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
										) : (
											<div className="h-10 w-10 rounded-lg bg-gray-700" />
										)}
										<div className="flex-1 min-w-0">
											<div className="text-white font-semibold truncate">{t.name}</div>
											<div className="text-sm text-gray-400 truncate">{t.artists}</div>
										</div>
										<Plus className="h-5 w-5 text-blue-400 shrink-0" />
									</button>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>

			{/* Selected list (stable, no dependency on overlay height) */}
			<div className="max-w-4xl mx-auto mt-8">
				<h2 className="text-2xl font-bold text-white mb-4 text-center md:text-left">Selected</h2>
				{picked.length === 0 ? (
					<p className="text-gray-400 text-center md:text-left">Nothing yet — pick songs above.</p>
				) : (
					<ul className="space-y-3">
						{picked.map((t, idx) => (
							<li
								key={`${t.name}-${idx}`}
								className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-2xl p-3"
							>
								<div className="flex items-center gap-3 min-w-0">
									{t.image ? (
										<img src={t.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
									) : (
										<div className="h-10 w-10 rounded-lg bg-gray-700" />
									)}
									<div className="min-w-0">
										<div className="text-white font-medium truncate">{t.name}</div>
										<div className="text-sm text-gray-400 truncate">{t.artists}</div>
									</div>
								</div>
								<button
									onClick={() => removeAt(idx)}
									className="p-2 rounded-xl hover:bg-gray-700 transition-colors"
									aria-label="Remove"
								>
									<X className="h-5 w-5 text-gray-400" />
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
