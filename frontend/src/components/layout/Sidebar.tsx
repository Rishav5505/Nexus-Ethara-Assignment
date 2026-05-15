import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Users,
  Shield,
  Settings,
  ChevronLeft,
  Sparkles,
  BarChart3,
  X,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Tasks", url: "/tasks", icon: ListTodo },
  { title: "Team", url: "/team", icon: Users },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

const adminItemsList = [{ title: "Admin", url: "/admin", icon: Shield }];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();

  // Close mobile drawer on route change
  useEffect(() => {
    onMobileClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const navItems =
    user?.role === "admin" ? [...mainItems, ...adminItemsList] : mainItems;

  const content = (isMobile: boolean) => (
    <>
      <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
        <div className="size-9 rounded-xl gradient-brand flex items-center justify-center shadow-glow shrink-0">
          <Sparkles className="size-5 text-white" />
        </div>
        {(!collapsed || isMobile) && (
          <div className="flex-1">
            <div className="font-semibold text-sm tracking-tight">Nexus</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Workspace
            </div>
          </div>
        )}
        {isMobile && (
          <button
            onClick={onMobileClose}
            aria-label="Close navigation menu"
            className="size-8 rounded-lg hover:bg-sidebar-accent flex items-center justify-center"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <nav
        className="flex-1 px-3 py-5 space-y-1 overflow-y-auto scrollbar-thin"
        aria-label="Primary"
      >
        {navItems.map((it) => {
          const active = path.startsWith(it.url);
          return (
            <Link
              key={it.url}
              to={it.url}
              aria-current={active ? "page" : undefined}
              aria-label={collapsed && !isMobile ? it.title : undefined}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative",
                active
                  ? "text-white bg-gradient-to-r from-primary/30 to-primary/5 shadow-[inset_0_1px_0_oklch(1_0_0_/_0.08)]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white",
              )}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full gradient-brand"
                />
              )}
              <it.icon
                aria-hidden="true"
                className={cn(
                  "size-[18px] shrink-0",
                  active && "text-primary-glow",
                )}
              />
              {(!collapsed || isMobile) && <span>{it.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-3">
        {(!collapsed || isMobile) && (
          <div className="p-3 rounded-xl bg-surface/40 border border-border flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-semibold border border-primary/20">
                {user?.name?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">
                  {user?.name || "User"}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {user?.role || "Member"}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <LogOut className="size-3" /> Sign out
            </button>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className="w-full flex items-center justify-center h-9 rounded-lg hover:bg-sidebar-accent text-muted-foreground transition"
          >
            <ChevronLeft
              aria-hidden="true"
              className={cn(
                "size-4 transition-transform",
                collapsed && "rotate-180",
              )}
            />
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 sticky top-0 h-screen",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        {content(false)}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in"
            onClick={onMobileClose}
          />
          <aside className="relative w-72 h-full bg-sidebar border-r border-sidebar-border flex flex-col animate-in slide-in-from-left">
            {content(true)}
          </aside>
        </div>
      )}
    </>
  );
}
