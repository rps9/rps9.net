import { useState } from "react";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { authHeader } from "../utils/auth";
import Header from '../components/Header';

const API_BASE = "https://rps9.net";

export default function OwnerControls() {
	const [username, setUsername] = useState("");
	const [role, setRole] = useState<"user" | "admin" | "owner">("admin");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const canSubmit = username.trim().length >= 3 && !loading;

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!canSubmit) return;
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const res = await fetch(`${API_BASE}/api/owner/bestow-role`, {
				method: "POST",
				headers: { "Content-Type": "application/json", ...authHeader() },
				body: JSON.stringify({ username: username, role }),
			});
			const data = await res.json().catch(() => ({}));

			if (!res.ok) {
				setError(typeof data?.detail === "string" ? data.detail : `Request failed (${res.status})`);
				return;
			}
			setSuccess(data?.message ?? "Role updated.");
		} catch {
			setError("Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
        <>
        <Header />
		<section className="min-h-screen flex flex-col items-center relative px-4 bg-gradient-to-b from-gray-900 to-gray-800">
			<div className="max-w-xl mx-auto w-full py-20">
				<div className="bg-gray-800/60 backdrop-blur rounded-2xl border border-gray-700 shadow-xl p-8">
					<div className="flex items-center justify-center gap-3 mb-6">
						<ShieldCheck className="h-6 w-6 text-blue-400" />
						<h1 className="text-4xl font-bold text-white">Owner Controls</h1>
					</div>

					<form onSubmit={onSubmit} className="space-y-6">
						<div>
							<label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
								Username
							</label>
							<input
								id="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								autoComplete="username"
								placeholder="enter username"
								className="w-full rounded-xl bg-gray-900 text-gray-100 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 px-4 py-3"
							/>
						</div>

						<div>
							<label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
								Role
							</label>
							<select
								id="role"
								value={role}
								onChange={(e) => setRole(e.target.value as "user" | "admin" | "owner")}
								className="w-full rounded-xl bg-gray-900 text-gray-100 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 px-4 py-3"
							>
								<option value="user">user</option>
								<option value="admin">admin</option>
								<option value="owner">owner</option>
							</select>
						</div>

						<button
							type="submit"
							disabled={!canSubmit}
							className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold px-4 py-3 transition"
						>
							{loading ? "Submitting…" : "Bestow Role"}
						</button>

						{error && (
							<div className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 px-4 py-3">
								<p className="text-sm flex items-center gap-2">
									<AlertCircle className="h-4 w-4" />
									{error}
								</p>
							</div>
						)}
						{success && (
							<div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 px-4 py-3">
								<p className="text-sm flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4" />
									{success}
								</p>
							</div>
						)}
					</form>
				</div>
			</div>
		</section>
        </>
	);
}
