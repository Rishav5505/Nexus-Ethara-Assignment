import { Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, Github, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginRole, setLoginRole] = useState<"admin" | "member">("member");
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

  const handleDemoLogin = async (role: "admin" | "member") => {
    setLoading(true);
    setError("");
    
    const defaultEmail = role === "admin" ? "alex@example.com" : "sarah@example.com";
    const defaultPassword = "password123";
    
    const demoEmail = localStorage.getItem(`demo_${role}_email`) || defaultEmail;
    const demoPassword = localStorage.getItem(`demo_${role}_password`) || defaultPassword;
    
    try {
      const data = await api.post("/auth/login", { email: demoEmail, password: demoPassword });
      if (data.token) {
        if (data.user && data.user.role) {
          localStorage.setItem(`demo_${data.user.role}_email`, demoEmail);
          localStorage.setItem(`demo_${data.user.role}_password`, demoPassword);
        }
        login(data.token, data.user);
        navigate({ to: "/dashboard" });
      } else {
        setError(data.msg || data.error || "Demo login failed.");
      }
    } catch (err) {
      console.error("Demo Login Error:", err);
      setError("Something went wrong with demo login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await api.post("/auth/login", { email, password });
      if (data.token) {
        if (data.user && data.user.role) {
          localStorage.setItem(`demo_${data.user.role}_email`, email);
          localStorage.setItem(`demo_${data.user.role}_password`, password);
        }
        login(data.token, data.user);
        navigate({ to: "/dashboard" });
      } else {
        setError(
          data.msg ||
          data.error ||
          "Login failed. Please check your credentials.",
        );
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual */}
      <div className="hidden lg:flex relative overflow-hidden bg-sidebar p-12 flex-col justify-between">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary/40 blur-[120px]" />
        <div className="absolute bottom-0 right-0 size-[500px] rounded-full bg-fuchsia-600/20 blur-[140px]" />

        <div className="relative flex items-center gap-3">
          <div className="size-10 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
            <Sparkles className="size-5 text-white" />
          </div>
          <div>
            <div className="font-semibold tracking-tight">Nexus</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Workspace
            </div>
          </div>
        </div>

        <div className="relative">
          <h2 className="text-4xl font-semibold tracking-tight leading-tight max-w-md">
            The <span className="gradient-text">execution engine</span> for
            ambitious teams.
          </h2>
          <p className="text-sm text-muted-foreground mt-4 max-w-sm">
            Plan, track, and ship with the clarity of a top-tier startup. Nexus
            brings projects, tasks, and team flow into one home.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {["S", "M", "P", "D"].map((n, i) => (
                <div
                  key={n}
                  className={`size-8 rounded-full ring-2 ring-sidebar bg-gradient-to-br ${["from-pink-500 to-rose-500", "from-violet-500 to-purple-600", "from-blue-500 to-cyan-500", "from-amber-500 to-orange-500"][i]} flex items-center justify-center text-xs text-white font-semibold`}
                >
                  {n}
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              Trusted by 12,000+ teams worldwide
            </div>
          </div>
        </div>

        <div className="relative text-[11px] text-muted-foreground">
          © 2026 Nexus Labs · SOC 2 · GDPR
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="size-10 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
              <Sparkles className="size-5 text-white" />
            </div>
            <div className="font-semibold">Nexus</div>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to your workspace to continue.
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
              <label className="text-xs text-muted-foreground">Login as</label>
              <div className="flex gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole("member");
                    setEmail("sarah@example.com");
                    setPassword("password123");
                  }}
                  className={`flex-1 h-10 rounded-lg text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${loginRole === "member"
                    ? "bg-primary text-white shadow-glow border border-transparent"
                    : "bg-surface/40 border border-border text-muted-foreground hover:bg-primary/10 hover:border-primary/40"
                    }`}
                >
                  Team Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole("admin");
                    setEmail("alex@example.com");
                    setPassword("password123");
                  }}
                  className={`flex-1 h-10 rounded-lg text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${loginRole === "admin"
                    ? "bg-primary text-white shadow-glow border border-transparent"
                    : "bg-surface/40 border border-border text-muted-foreground hover:bg-primary/10 hover:border-primary/40"
                    }`}
                >
                  Admin
                </button>
              </div>
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
              <div className="flex items-center justify-between mt-2">
                <label className="text-xs text-muted-foreground">
                  Password
                </label>
                <Link 
                  to="/forgot-password"
                  className="text-xs text-primary-glow hover:underline cursor-pointer"
                >
                  Forgot?
                </Link>
              </div>
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
            <label className="flex items-center gap-2 text-xs text-muted-foreground select-none">
              <input
                type="checkbox"
                className="accent-primary size-3.5 rounded"
                defaultChecked
              />
              Remember me for 30 days
            </label>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full h-11 rounded-xl gradient-brand text-white text-sm font-medium shadow-glow hover:opacity-95 transition disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                "Sign in"
              )}
            </button>

            <div className="relative flex items-center py-2 mt-2">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] text-muted-foreground uppercase tracking-widest">Demo Access</span>
              <div className="flex-grow border-t border-border"></div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('member')}
                disabled={loading}
                className="flex-1 h-10 rounded-xl bg-surface/60 border border-border hover:bg-primary/10 hover:border-primary/40 hover:text-white text-xs font-medium transition text-muted-foreground"
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
                className="flex-1 h-10 rounded-xl bg-surface/60 border border-border hover:bg-primary/10 hover:border-primary/40 hover:text-white text-xs font-medium transition text-muted-foreground"
              >
                Admin
              </button>
            </div>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary-glow hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
