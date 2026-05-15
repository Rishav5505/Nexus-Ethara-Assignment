import { useState } from "react";
import { Avatar } from "@/components/ui-kit/Avatar";
import { Camera, Shield, Bell, Palette, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Profile", icon: Camera },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "password", label: "Password", icon: Lock },
];

export function SettingsPage() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
          Account
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <nav className="glass rounded-2xl p-2 h-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition",
                tab === t.id
                  ? "bg-primary/20 text-white"
                  : "text-muted-foreground hover:bg-white/5",
              )}
            >
              <t.icon className="size-4" /> {t.label}
            </button>
          ))}
        </nav>

        <div className="glass rounded-2xl p-6">
          {tab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold">Profile</h3>
                <p className="text-xs text-muted-foreground">
                  This is how others see you in the workspace.
                </p>
              </div>
              <div className="flex items-center gap-5">
                <div className="relative">
                  <Avatar name="Alex Kim" size={80} />
                  <button className="absolute bottom-0 right-0 size-7 rounded-full gradient-brand flex items-center justify-center text-white shadow-glow">
                    <Camera className="size-3.5" />
                  </button>
                </div>
                <div>
                  <button className="h-9 px-4 rounded-xl text-sm gradient-brand text-white shadow-glow">
                    Upload new
                  </button>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    JPG, PNG. Max 2MB.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ["Full name", "Alex Kim"],
                  ["Email", "alex@nexus.io"],
                  ["Role", "Admin"],
                  ["Timezone", "PST (UTC−8)"],
                ].map(([l, v]) => (
                  <div key={l}>
                    <label className="text-xs text-muted-foreground">{l}</label>
                    <input
                      defaultValue={v}
                      className="mt-1.5 w-full h-10 px-3 rounded-xl bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Bio</label>
                <textarea
                  rows={3}
                  defaultValue="Designer & engineer building delightful things."
                  className="mt-1.5 w-full px-3 py-2 rounded-xl bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="flex justify-end">
                <button className="h-9 px-5 rounded-xl text-sm gradient-brand text-white shadow-glow">
                  Save changes
                </button>
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="space-y-5">
              <h3 className="font-semibold">Notifications</h3>
              {[
                [
                  "Task assignments",
                  "Get notified when a task is assigned to you",
                ],
                ["Mentions", "Notify me when I'm @mentioned in a comment"],
                [
                  "Weekly digest",
                  "Summary of your team's activity each Monday",
                ],
                ["Marketing", "Product updates and tips"],
              ].map(([t, d], i) => (
                <div
                  key={t}
                  className="flex items-center justify-between p-4 rounded-xl bg-surface/40 border border-border"
                >
                  <div>
                    <div className="text-sm font-medium">{t}</div>
                    <div className="text-xs text-muted-foreground">{d}</div>
                  </div>
                  <Toggle defaultOn={i < 3} />
                </div>
              ))}
            </div>
          )}

          {tab === "security" && (
            <div className="space-y-5">
              <h3 className="font-semibold">Security</h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface/40 border border-border">
                <div>
                  <div className="text-sm font-medium">
                    Two-factor authentication
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Add an extra layer of security to your account
                  </div>
                </div>
                <Toggle defaultOn />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface/40 border border-border">
                <div>
                  <div className="text-sm font-medium">Active sessions</div>
                  <div className="text-xs text-muted-foreground">
                    3 devices currently signed in
                  </div>
                </div>
                <button className="text-xs text-primary-glow">Manage</button>
              </div>
            </div>
          )}

          {tab === "appearance" && (
            <div className="space-y-5">
              <h3 className="font-semibold">Appearance</h3>
              <div className="grid grid-cols-3 gap-3">
                {["Dark", "Light", "System"].map((t) => {
                  const currentTheme =
                    localStorage.getItem("nexus-theme") || "System";
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        localStorage.setItem("nexus-theme", t);
                        if (
                          t === "Light" ||
                          (t === "System" &&
                            !window.matchMedia("(prefers-color-scheme: dark)")
                              .matches)
                        ) {
                          document.documentElement.classList.add("light");
                        } else {
                          document.documentElement.classList.remove("light");
                        }
                        // Force re-render for UI update
                        setTab("appearance");
                      }}
                      className={cn(
                        "p-4 rounded-xl border text-sm transition",
                        currentTheme === t
                          ? "border-primary bg-primary/10 text-white shadow-glow"
                          : "border-border bg-surface/40 hover:border-primary/30",
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "password" && (
            <div className="space-y-4 max-w-md">
              <h3 className="font-semibold">Change password</h3>
              {["Current password", "New password", "Confirm new password"].map(
                (l) => (
                  <div key={l}>
                    <label className="text-xs text-muted-foreground">{l}</label>
                    <input
                      type="password"
                      className="mt-1.5 w-full h-10 px-3 rounded-xl bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                ),
              )}
              <button className="h-9 px-5 rounded-xl text-sm gradient-brand text-white shadow-glow">
                Update password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={cn(
        "w-11 h-6 rounded-full p-0.5 transition",
        on ? "gradient-brand" : "bg-white/10",
      )}
    >
      <div
        className={cn(
          "size-5 rounded-full bg-white transition-transform",
          on && "translate-x-5",
        )}
      />
    </button>
  );
}
