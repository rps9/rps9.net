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
		<section className="site-section flex min-h-[calc(100svh-4rem)] flex-col items-center">
			<div className="mx-auto w-full max-w-xs py-20 sm:max-w-sm md:max-w-xl">
				<div className="page-panel">
					<div className="flex items-center justify-center gap-3 mb-6">
						<ShieldCheck className="h-6 w-6 text-[#b21f2d]" />
						<h1 className="text-4xl font-black text-black">Owner Controls</h1>
					</div>

					<form onSubmit={onSubmit} className="space-y-6">
						<div>
							<label htmlFor="username" className="field-label">
								Username
							</label>
							<input
								id="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								autoComplete="username"
								placeholder="enter username"
								className="field-control"
							/>
						</div>

						<div>
							<label htmlFor="role" className="field-label">
								Role
							</label>
							<select
								id="role"
								value={role}
								onChange={(e) => setRole(e.target.value as "user" | "admin" | "owner")}
								className="field-control"
							>
								<option value="user">user</option>
								<option value="admin">admin</option>
								<option value="owner">owner</option>
							</select>
						</div>

						<button
							type="submit"
							disabled={!canSubmit}
							className="btn-primary w-full"
						>
							{loading ? "Submitting..." : "Bestow Role"}
						</button>

						{error && (
							<div className="status-error">
								<p className="text-sm flex items-center gap-2">
									<AlertCircle className="h-4 w-4" />
									{error}
								</p>
							</div>
						)}
						{success && (
							<div className="status-success">
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
