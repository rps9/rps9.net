import Header from '../components/Header';
import { useState } from "react";
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { setAuth } from "../utils/auth";

export default function SignIn() {
    const API_BASE = "https://rps9.net";

    const USERNAME_RE = /^(?![._-])(?!.*[._-]{2})(?!.*[._-]\s*$)[A-Za-z0-9._-]+(?:\s*)$/;
    const PASSWORD_RE = /^[\x21-\x7E]+$/;

    type SignInResponse = { access_token: string; token_type: string; expires_at: number; role: string };
    type ApiError = { detail?: string; message?: string };

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({ username: false, password: false });
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    const usernameError =
        (touched.username && username.length < 3) ? "Username must be at least 3 characters." :
        (username && !USERNAME_RE.test(username)) ? "Use a-z, 0-9, dot, underscore, or hyphen (no edge/repeat symbols)." :
        null;

    const passwordError =
        (touched.password && password.length < 8) ? "Password must be at least 8 characters." :
        (password && (!PASSWORD_RE.test(password) || password.length > 64)) ? "8-64 visible ASCII chars (no spaces)." :
        null;

    const canSubmit = !!username && !!password && !usernameError && !passwordError && !loading;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setTouched({ username: true, password: true });
        setFormError(null);
        setFormSuccess(null);

        if (!canSubmit) return;

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/auth/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username.trim().toLowerCase(), password }),
            });

            const data: SignInResponse & ApiError = await res.json().catch(() => ({
                access_token: "",
                token_type: "",
                expires_at: 0,
                role: "",
            }));

            if (res.ok) {
                setAuth(data.access_token, data.role, data.expires_at, remember);
                setFormSuccess("Signed in successfully. Redirecting…");
                setTimeout(() => {
                    window.location.assign("/home");
                }, 450);
                return;
            }

            if (res.status === 401) {
                setFormError(data.detail || "Invalid username or password.");
            } else if (res.status === 403) {
                setFormError("Email not verified. Check your inbox for the verification link.");
            } else {
                setFormError(data.detail || data.message || "Sign in failed. Please try again.");
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
            <section className="site-section flex min-h-[calc(100dvh-4rem)] flex-col items-center">
                <div className="mx-auto w-full max-w-xs py-20 sm:max-w-sm md:max-w-md">
                    <div className="page-panel">
                        <p className="editorial-kicker text-center">Account</p>
                        <h1 className="mb-8 text-center text-4xl font-black text-black">Sign in</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="field-label">Username</label>
                                <input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onBlur={() => setTouched(t => ({ ...t, username: true }))}
                                    className="field-control"
                                    placeholder="username"
                                />
                                {usernameError && (
                                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-[#8f1420]">
                                        <AlertCircle className="h-4 w-4" /> {usernameError}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="field-label">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPw ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onBlur={() => setTouched(t => ({ ...t, password: true }))}
                                        className="field-control pr-12"
                                        placeholder="password"
                                    />
                                    <button type="button" onClick={() => setShowPw(s => !s)}
                                        className="absolute inset-y-0 right-3 my-auto p-2 text-neutral-600 hover:text-[#b21f2d]">
                                        {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {passwordError && (
                                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-[#8f1420]">
                                        <AlertCircle className="h-4 w-4" /> {passwordError}
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
                                        className="h-4 w-4 border-black text-[#b21f2d]"
                                    />
                                    <span className="text-sm text-neutral-600">Remember me</span>
                                </label>
                                <a href="/sign-up" className="text-sm font-bold text-[#b21f2d] hover:text-black">Create account</a>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={!canSubmit}

                                className="btn-primary w-full"
                            >
                                {loading ? <><Loader2 className="h-5 w-5 animate-spin" />Loading profile</> : <><LogIn className="h-5 w-5" /> Sign in</>}
                            </button>

                            {formError && (
                                <div className="status-error">
                                    <p className="text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {formError}</p>
                                </div>
                            )}
                            {formSuccess && (
                                <div className="status-success">
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
