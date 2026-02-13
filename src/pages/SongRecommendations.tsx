import { useState } from "react";
import Header from "../components/Header";
import SongSearch from "../components/SongSearch";
import { authHeader } from "../utils/auth";
import { Loader2, AlertTriangle, Music2 } from "lucide-react";

type Rec = { title: string; artist: string; why: string };

export default function SongRecommendations() {
	const API_BASE = "https://rps9.net";

	const [selected, setSelected] = useState<{ name: string; artists: string; image?: string }[]>([]);
	const [instructions, setInstructions] = useState("");
	const [recs, setRecs] = useState<Rec[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState<string | null>(null);

	async function getRecommendations() {
		if (selected.length === 0) {
			setErr("Pick at least one seed song.");
			return;
		}
		setLoading(true);
		setErr(null);
		setRecs(null);

		const body = {
			song_input: selected.map((t) => `${t.name} - ${t.artists}`),
			...(instructions.trim() ? { additional_instructions: instructions.trim() } : {}),
		};

		try {
			const res = await fetch(`${API_BASE}/api/admin/songrecs`, {
				method: "POST",
				headers: { "Content-Type": "application/json", ...authHeader() },
				body: JSON.stringify(body),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data?.detail || `HTTP ${res.status}`);

			const arr = Array.isArray(data?.recommendations) ? data.recommendations : [];
			setRecs(arr);
		} catch {
			setErr("Recommendation request failed.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Header />
			<section className="min-h-screen flex flex-col items-center relative px-4 bg-gradient-to-b from-gray-900 to-gray-800 py-20">
				<SongSearch onChange={(tracks) => setSelected(tracks)} />

				<div className="w-full max-w-4xl mx-auto mt-8">
					<label className="block text-sm text-gray-400 mb-2">Optional instructions</label>
					<textarea
						value={instructions}
						onChange={(e) => setInstructions(e.target.value)}
						rows={3}
						placeholder="e.g., more 90s alt rock, no explicit lyrics, upbeat tempo"
						className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<div className="mt-4 flex items-center justify-between">
						<div className="text-sm text-gray-400">
							{selected.length} seed{selected.length !== 1 ? "s" : ""} selected
						</div>
						<button
							onClick={getRecommendations}
							disabled={loading}
							className="px-5 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold transition-colors"
						>
							{loading ? (
								<span className="inline-flex items-center gap-2">
									<Loader2 className="h-4 w-4 animate-spin" /> Getting recommendations…
								</span>
							) : (
								"Get Recommendations"
							)}
						</button>
					</div>
					{err && (
						<div className="mt-4 flex items-center gap-2 text-yellow-400">
							<AlertTriangle className="h-5 w-5" />
							<span>{err}</span>
						</div>
					)}
				</div>

				{/* Display results */}
				{recs && (
					<div className="w-full max-w-6xl mx-auto mt-10">
						<h2 className="text-3xl font-bold text-white mb-4 text-center">Your Mix</h2>
						<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{recs.map((r, i) => (
								<li
									key={`${r.title}-${r.artist}-${i}`}
									className="bg-gray-800 border border-gray-700 rounded-2xl p-4"
								>
									<div className="flex items-start gap-3">
										<div className="h-10 w-10 rounded-xl bg-gray-700 flex items-center justify-center">
											<Music2 className="h-5 w-5 text-blue-400" />
										</div>
										<div className="min-w-0">
											<div className="text-white font-semibold truncate">{r.title}</div>
											<div className="text-sm text-gray-400 truncate">{r.artist}</div>
											{r.why && <p className="mt-2 text-sm text-gray-300">{r.why}</p>}
										</div>
										<div className="ml-auto text-gray-500 text-sm">#{i + 1}</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}
			</section>
		</>
	);
}
