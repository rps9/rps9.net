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
			<section className="site-section flex min-h-[calc(100dvh-4rem)] flex-col items-center py-20">
				<SongSearch onChange={(tracks) => setSelected(tracks)} />

				<div className="w-full max-w-4xl mx-auto mt-8">
					<label className="field-label">Optional instructions</label>
					<textarea
						value={instructions}
						onChange={(e) => setInstructions(e.target.value)}
						rows={3}
						placeholder="e.g., more 90s alt rock, no explicit lyrics, upbeat tempo"
						className="field-control p-4"
					/>
					<div className="mt-4 flex items-center justify-between">
						<div className="text-sm font-semibold text-neutral-600">
							{selected.length} seed{selected.length !== 1 ? "s" : ""} selected
						</div>
						<button
							onClick={getRecommendations}
							disabled={loading}
							className="btn-primary"
						>
							{loading ? (
								<span className="inline-flex items-center gap-2">
									<Loader2 className="h-4 w-4 animate-spin" /> Getting recommendations...
								</span>
							) : (
								"Get Recommendations"
							)}
						</button>
					</div>
					{err && (
						<div className="status-error mt-4 flex items-center gap-2">
							<AlertTriangle className="h-5 w-5" />
							<span>{err}</span>
						</div>
					)}
				</div>

				{/* Display results */}
				{recs && (
					<div className="w-full max-w-6xl mx-auto mt-10">
						<h2 className="section-title mb-6 text-center">Your Mix</h2>
						<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{recs.map((r, i) => (
								<li
									key={`${r.title}-${r.artist}-${i}`}
									className="border border-black bg-white p-4"
								>
									<div className="flex items-start gap-3">
										<div className="flex h-10 w-10 items-center justify-center border border-black bg-[#f6f3ed]">
											<Music2 className="h-5 w-5 text-[#b21f2d]" />
										</div>
										<div className="min-w-0">
											<div className="truncate font-bold text-black">{r.title}</div>
											<div className="truncate text-sm text-neutral-600">{r.artist}</div>
											{r.why && <p className="mt-2 text-sm leading-6 text-neutral-700">{r.why}</p>}
										</div>
										<div className="ml-auto text-sm font-bold text-[#b21f2d]">#{i + 1}</div>
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
