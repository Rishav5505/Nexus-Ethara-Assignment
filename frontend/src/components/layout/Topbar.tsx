import {
  Search,
  Bell,
  Plus,
  Command,
  Check,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "@tanstack/react-router";

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifBtnRef = useRef<HTMLButtonElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);

  // Close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openNotif) {
          setOpenNotif(false);
          notifBtnRef.current?.focus();
        }
        if (openProfile) {
          setOpenProfile(false);
          profileBtnRef.current?.focus();
        }
        if (searchOpen) setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openNotif, openProfile, searchOpen]);

  // Click outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (openNotif && notifRef.current && !notifRef.current.contains(t))
        setOpenNotif(false);
      if (openProfile && profileRef.current && !profileRef.current.contains(t))
        setOpenProfile(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [openNotif, openProfile]);

  return (
    <header
      className="sticky top-0 z-30 h-16 border-b border-border bg-background/70 backdrop-blur-xl flex items-center px-3 sm:px-4 md:px-6 gap-2 sm:gap-3"
      role="banner"
    >
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <button
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="md:hidden size-10 rounded-xl border border-border bg-surface/60 hover:bg-surface flex items-center justify-center"
      >
        <Menu className="size-4" aria-hidden="true" />
      </button>

      <div className="flex-1 max-w-xl relative hidden sm:block">
        <label htmlFor="global-search" className="sr-only">
          Search projects, tasks, people
        </label>
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id="global-search"
          type="search"
          placeholder="Search projects, tasks, people…"
          className="w-full h-10 pl-10 pr-16 rounded-xl bg-surface/60 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
        />
        <div
          aria-hidden="true"
          className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-[10px] text-muted-foreground border border-border rounded-md px-1.5 py-0.5"
        >
          <Command className="size-3" /> K
        </div>
      </div>

      {/* Spacer to push right-side items to the corner */}
      <div className="flex-1" />

      <button
        onClick={() => setSearchOpen(true)}
        aria-label="Open search"
        className="sm:hidden size-10 rounded-xl border border-border bg-surface/60 hover:bg-surface flex items-center justify-center"
      >
        <Search className="size-4" aria-hidden="true" />
      </button>

      <button
        onClick={() => navigate({ to: "/tasks" })}
        className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-xl gradient-brand text-white text-sm font-medium shadow-glow hover:opacity-95 hover:scale-[1.02] active:scale-95 transition"
      >
        <Plus className="size-4" aria-hidden="true" /> New Task
      </button>

      {/* Theme Toggle */}
      <button
        onClick={() => {
          const isLight = document.documentElement.classList.contains("light");
          const newTheme = isLight ? "Dark" : "Light";
          localStorage.setItem("nexus-theme", newTheme);
          if (newTheme === "Light") {
            document.documentElement.classList.add("light");
          } else {
            document.documentElement.classList.remove("light");
          }
          window.dispatchEvent(new Event("theme-change"));
          // Force a re-render to flip the icon
          setSearchOpen(searchOpen);
        }}
        aria-label="Toggle Theme"
        className="size-10 rounded-xl border border-border bg-surface/60 hover:bg-surface flex items-center justify-center transition"
      >
        {document.documentElement.classList.contains("light") ? (
          <Moon className="size-4" />
        ) : (
          <Sun className="size-4" />
        )}
      </button>

      <div className="relative" ref={notifRef}>
        <button
          ref={notifBtnRef}
          onClick={() => {
            setOpenNotif(!openNotif);
            setOpenProfile(false);
          }}
          aria-label="Notifications, 3 unread"
          aria-haspopup="menu"
          aria-expanded={openNotif}
          className="size-10 rounded-xl border border-border bg-surface/60 hover:bg-surface flex items-center justify-center relative transition"
        >
          <Bell className="size-4" aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute top-2 right-2 size-2 rounded-full bg-primary-glow animate-pulse"
          />
        </button>
        {openNotif && (
          <div
            role="menu"
            aria-label="Notifications"
            className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm glass-strong rounded-2xl shadow-elevated p-2 z-50 animate-in fade-in slide-in-from-top-2"
          >
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-sm font-semibold">Notifications</span>
              <span className="text-[10px] text-muted-foreground">3 new</span>
            </div>
            {[
              { t: "Sarah commented on Onboarding flow", time: "2m" },
              { t: "Task 'API docs' marked complete", time: "1h" },
              { t: "New member joined Design team", time: "3h" },
            ].map((n, i) => (
              <button
                key={i}
                role="menuitem"
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer flex gap-3"
              >
                <div
                  className="size-8 rounded-lg gradient-brand flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <Check className="size-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">{n.t}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {n.time} ago
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative" ref={profileRef}>
        <button
          ref={profileBtnRef}
          onClick={() => {
            setOpenProfile(!openProfile);
            setOpenNotif(false);
          }}
          aria-label={`Account menu for ${user?.name || "User"}`}
          aria-haspopup="menu"
          aria-expanded={openProfile}
          className="flex items-center gap-2 pr-2 pl-1 py-1 rounded-xl hover:bg-surface/60 transition"
        >
          <div
            className="size-8 rounded-lg gradient-brand flex items-center justify-center text-xs font-semibold text-white"
            aria-hidden="true"
          >
            {user?.name?.[0] || "U"}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-medium leading-tight">
              {user?.name || "User"}
            </div>
            <div className="text-[10px] text-muted-foreground capitalize">
              {user?.role || "Member"}
            </div>
          </div>
        </button>
        {openProfile && (
          <div
            role="menu"
            aria-label="Account"
            className="absolute right-0 mt-2 w-56 glass-strong rounded-2xl shadow-elevated p-2 z-50 animate-in fade-in slide-in-from-top-2"
          >
            {[
              { label: "Profile", path: "/settings" },
              { label: "Settings", path: "/settings" },
              { label: "Billing", path: "/billing" },
            ].map((x) => (
              <button
                key={x.label}
                role="menuitem"
                onClick={() => {
                  navigate({ to: x.path });
                  setOpenProfile(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/5"
              >
                {x.label}
              </button>
            ))}
            <div className="h-px bg-border my-1" />
            <button
              onClick={logout}
              role="menuitem"
              className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-destructive/10 text-destructive"
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="sm:hidden fixed inset-0 z-50 bg-background/90 backdrop-blur-xl p-4 animate-in fade-in"
          onClick={() => setSearchOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <label htmlFor="mobile-search" className="sr-only">
              Search
            </label>
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="mobile-search"
              type="search"
              autoFocus
              placeholder="Search…"
              className="w-full h-12 pl-10 pr-12 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-lg hover:bg-white/5 flex items-center justify-center"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
