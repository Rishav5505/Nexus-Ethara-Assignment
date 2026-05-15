import { Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  Github,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ChevronDown,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token and user in URL (from Google OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userStr = params.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        login(token, user);
        navigate({ to: "/dashboard" });
      } catch (err) {
        console.error("OAuth parse error:", err);
      }
    }
  }, [login, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      if (data.token) {
        login(data.token, data.user);
        navigate({ to: "/dashboard" });
      } else {
        setError(
          data.msg || data.error || "Registration failed. Please try again.",
        );
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-10 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
              <Sparkles className="size-5 text-white" />
            </div>
            <div className="font-semibold">Nexus</div>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Start your journey with Nexus Workspace.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-8">
            <button className="h-11 rounded-xl bg-[#24292e] hover:bg-[#2c3238] text-white text-sm flex items-center justify-center gap-2 transition shadow-sm">
              <Github className="size-4" /> GitHub
            </button>
            <button
              onClick={() => {
                window.location.href = "http://localhost:5000/api/auth/google";
              }}
              className="h-11 rounded-xl bg-white hover:bg-gray-100 text-gray-900 text-sm flex items-center justify-center gap-2 transition shadow-sm border border-gray-200"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
          </div>

          <div className="flex items-center gap-3 my-6 text-[11px] text-muted-foreground uppercase tracking-widest">
            <div className="flex-1 h-px bg-border" /> or{" "}
            <div className="flex-1 h-px bg-border" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <p className="text-xs text-destructive bg-destructive/10 p-3 rounded-xl">
                {error}
              </p>
            )}
            
            <div>
              <label className="text-xs text-muted-foreground">Sign up as</label>
              <div className="flex gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => setRole("member")}
                  className={`flex-1 h-10 rounded-lg text-xs font-medium transition-all ${role === "member"
                    ? "bg-primary text-white shadow-glow"
                    : "bg-surface/40 border border-border text-muted-foreground hover:bg-white/5"
                    }`}
                >
                  Team Member
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex-1 h-10 rounded-lg text-xs font-medium transition-all ${role === "admin"
                    ? "bg-primary text-white shadow-glow"
                    : "bg-surface/40 border border-border text-muted-foreground hover:bg-white/5"
                    }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Full Name</label>
              <input
                type="text"
                placeholder="Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1.5 w-full h-11 px-4 rounded-xl bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 w-full h-11 px-4 rounded-xl bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Password</label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-11 px-4 rounded-xl bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full h-11 rounded-xl gradient-brand text-white text-sm font-medium shadow-glow hover:opacity-95 transition disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-glow hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex relative overflow-hidden bg-sidebar p-12 flex-col justify-center order-1 lg:order-2">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-primary/40 blur-[120px]" />
        <div className="absolute bottom-0 left-0 size-[500px] rounded-full bg-violet-600/20 blur-[140px]" />
        <div className="relative max-w-md">
          <h2 className="text-4xl font-semibold tracking-tight leading-tight">
            Built for teams that{" "}
            <span className="gradient-text">ship fast.</span>
          </h2>
          <ul className="mt-8 space-y-3">
            {[
              "Unlimited projects on every plan",
              "Real-time collaboration & comments",
              "Powerful Kanban, calendar & timeline",
              "SSO, SOC 2, role-based permissions",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm">
                <span className="size-5 rounded-full gradient-brand flex items-center justify-center shrink-0">
                  <Check className="size-3 text-white" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
