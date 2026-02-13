import Header from '../components/Header';
import { useState } from "react";
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { setAuth } from "../utils/auth";

export default function SignUp() {
    const API_BASE = "https://rps9.net";

    const USERNAME_RE = /^(?![._-])(?!.*[._-]{2})(?!.*[._-]\s*$)[A-Za-z0-9._-]+(?:\s*)$/;
    const PASSWORD_RE = /^[\x21-\x7E]+$/;
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    type SignUpResponse = { ok: boolean; message: string; access_token: string; token_type: string; expires_at: number; role: string };
    type ApiError = { detail?: string; message?: string };

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({ username: false, email: false, password: false });
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    const usernameError =
        (touched.username && username.length < 3) ? "Username must be at least 3 characters." :
        (username && !USERNAME_RE.test(username)) ? "Use a-z, 0-9, dot, underscore, or hyphen (no edge/repeat symbols)." :
        null;

    const emailError =
        (touched.email && !email) ? "Email is required." :
        (email && !EMAIL_RE.test(email)) ? "Invalid email format." :
        null;

    const passwordError =
        (touched.password && password.length < 8) ? "Password must be at least 8 characters." :
        (password && (!PASSWORD_RE.test(password) || password.length > 64)) ? "8-64 visible ASCII chars (no spaces)." :
        null;

    const canSubmit = !!username && !!password && !!email && !usernameError && !passwordError && !emailError && !loading;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setTouched({ username: true, email: true, password: true });
        setFormError(null);
        setFormSuccess(null);

        if (!canSubmit) return;

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username.trim().toLowerCase(), password, email }),
            });

            const data: SignUpResponse & ApiError = await res.json().catch(() => ({} as any));

            if (res.ok) {
                setAuth(data.access_token, data.role, data.expires_at, remember);
                setFormSuccess("Signed up successfully. Redirecting…");
                setTimeout(() => {
                    window.location.assign("/home");
                }, 450);
                return;
            }

            if (res.status === 401) {
                setFormError(data.detail || "Invalid username or password.");
            } else if (res.status === 409) {
                setFormError("Username already in use.");
            } else {
                setFormError(data.detail || data.message || "Sign up failed. Please try again.");
            }
        } catch {
            setFormError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header />
            <section className="min-h-screen flex flex-col items-center relative px-4 bg-gradient-to-b from-gray-900 to-gray-800">
                <div className="max-w-md mx-auto w-full py-20">
                    <div className="bg-gray-800/60 backdrop-blur rounded-2xl border border-gray-700 shadow-xl p-8">
                        <h1 className="text-4xl font-bold text-white text-center mb-2">Sign up</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                                <input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onBlur={() => setTouched(t => ({ ...t, username: true }))}
                                    className="w-full rounded-xl bg-gray-900 text-gray-100 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 px-4 py-3"
                                    placeholder="username"
                                />
                                {usernameError && (
                                    <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" /> {usernameError}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPw ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onBlur={() => setTouched(t => ({ ...t, password: true }))}
                                        className="w-full rounded-xl bg-gray-900 text-gray-100 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 px-4 py-3 pr-12"
                                    />
                                    <button type="button" onClick={() => setShowPw(s => !s)}
                                        className="absolute inset-y-0 right-3 my-auto p-2 text-gray-400 hover:text-gray-200">
                                        {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {passwordError && (
                                    <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" /> {passwordError}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => setTouched(t => ({ ...t, email: true }))}
                                    className="w-full rounded-xl bg-gray-900 text-gray-100 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 px-4 py-3"
                                    placeholder="example@gmail.com"
                                />
                                {emailError && (
                                    <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" /> {emailError}
                                    </p>
                                )}
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center justify-between">
                                <label className="inline-flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-blue-500"
                                    />
                                    <span className="text-sm text-gray-400">Remember me</span>
                                </label>
                                <a href="/sign-in" className="text-sm text-blue-400 hover:underline">Sign In</a>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold px-4 py-3"
                            >
                                {loading ? <><Loader2 className="h-5 w-5 animate-spin" />Signing up</> : <><LogIn className="h-5 w-5" /> Sign up</>}
                            </button>

                            {formError && (
                                <div className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 px-4 py-3">
                                    <p className="text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {formError}</p>
                                </div>
                            )}
                            {formSuccess && (
                                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 px-4 py-3">
                                    <p className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {formSuccess}</p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
