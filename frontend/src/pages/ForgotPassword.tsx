import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, Mail, Lock, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { api } from "../services/api";

export function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: Token/New Password
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/forgot-password", { email });
      // For demo purposes, we auto-fill the token if the backend returns it
      if (res.token) {
        console.log("DEMO MODE: Reset Token is", res.token);
        setToken(res.token);
      }
      setSuccess("If an account exists with this email, you will receive a reset token.");
      setStep(2);
    } catch (err: any) {
      setError(err.msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/reset-password", { email, token, newPassword });
      setSuccess("Password updated successfully!");
      setTimeout(() => navigate({ to: "/login" }), 2000);
    } catch (err: any) {
      setError(err.msg || "Invalid token or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden bg-sidebar p-12 flex-col justify-center">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary/40 blur-[120px]" />
        <div className="relative max-w-md">
          <h2 className="text-4xl font-semibold tracking-tight leading-tight">
            Secure your <span className="gradient-text">workspace</span> flow.
          </h2>
          <p className="text-sm text-muted-foreground mt-4">
            Resetting your password is quick and secure. Follow the steps to regain access to your projects and team.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/login" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-white mb-8 transition w-fit">
            <ArrowLeft className="size-3" /> Back to login
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="size-10 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
              <Sparkles className="size-5 text-white" />
            </div>
            <div className="font-semibold text-xl">Nexus</div>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            {step === 1 ? "Reset password" : "Create new password"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {step === 1 
              ? "Enter your email and we'll send you a reset token." 
              : "Enter the 6-digit token and your new secure password."}
          </p>

          <form className="mt-8 space-y-4" onSubmit={step === 1 ? handleRequestToken : handleResetPassword}>
            {error && (
              <p className="text-xs text-destructive bg-destructive/10 p-3 rounded-xl">
                {error}
              </p>
            )}
            {success && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
                <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {step === 1 ? (
              <div>
                <label className="text-xs text-muted-foreground">Email Address</label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs text-muted-foreground">Reset Token (6-digits)</label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    className="mt-1.5 w-full h-11 px-4 rounded-xl bg-surface/60 border border-border text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">New Password</label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full h-11 rounded-xl gradient-brand text-white text-sm font-medium shadow-glow hover:opacity-95 transition disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                step === 1 ? "Send reset token" : "Reset password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
