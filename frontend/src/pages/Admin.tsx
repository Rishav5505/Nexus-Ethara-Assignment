import { Badge } from "@/components/ui-kit/Badge";
import { Avatar } from "@/components/ui-kit/Avatar";
import { Search, Filter, Download, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const variant = {
  create: "low",
  update: "medium",
  delete: "high",
  system: "neutral",
  "started working on": "low",
} as const;

export function AdminPage() {
  const { token } = useAuth();

  const { data: activities = [], isLoading: loadingActivities } = useQuery({
    queryKey: ["activities"],
    queryFn: () => api.get("/activities", token || undefined),
    enabled: !!token,
  });

  const { data: stats = {}, isLoading: loadingStats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => api.get("/stats/overview", token || undefined),
    enabled: !!token,
  });

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => api.get("/auth/users", token || undefined),
    enabled: !!token,
  });

  if (loadingActivities || loadingStats || loadingUsers) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  const logs = [...activities].reverse().reduce((acc: any[], curr: any) => {
    const who = curr.user?.name || "System";
    const target = curr.target || "System";
    const action = curr.action || "Performed action";
    const type = action.includes("delete") ? "delete" : action.includes("create") ? "create" : "update";
    const time = curr.createdAt ? new Date(curr.createdAt).toLocaleString() : "Just now";

    const last = acc[acc.length - 1];
    if (last && last.who === who && last.target === target && type === "update" && last.type === "update") {
      const newState = action.split(" → ").pop();
      if (!last.action.includes(newState)) {
        last.action = last.action + " → " + newState;
      }
      last.time = time;
      return acc;
    }

    acc.push({ who, action, target, time, type });
    return acc;
  }, []).reverse();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
          Admin
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Control center
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage users, roles, and audit system activity.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            l: "Total Projects",
            v: stats.stats?.totalProjects?.toString() || "0",
          },
          { l: "Total Tasks", v: stats.stats?.totalTasks?.toString() || "0" },
          {
            l: "Completed Tasks",
            v: stats.stats?.completedTasks?.toString() || "0",
          },
          {
            l: "Overdue Tasks",
            v: stats.stats?.overdueTasks?.toString() || "0",
          },
        ].map((s) => (
          <div key={s.l} className="glass rounded-2xl p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              {s.l}
            </div>
            <div className="text-2xl font-semibold tracking-tight mt-2">
              {s.v}
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">User Management</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: any) => (
              <tr
                key={user._id}
                className="border-b border-border last:border-0 hover:bg-white/[0.02]"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={user.name} size={28} />
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {user.email}
                </td>
                <td className="px-5 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => {
                      if (confirm(`Change role to ${e.target.value}?`)) {
                        api
                          .patch(
                            `/auth/users/${user._id}`,
                            { role: e.target.value },
                            token || undefined,
                          )
                          .then(() => window.location.reload());
                      }
                    }}
                    className="bg-surface border border-border text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => {
                      if (
                        confirm(`Are you sure you want to delete ${user.name}?`)
                      ) {
                        api
                          .delete(`/auth/users/${user._id}`, token || undefined)
                          .then(() => window.location.reload());
                      }
                    }}
                    className="text-xs text-destructive hover:bg-destructive/10 px-2 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex flex-wrap items-center gap-3 justify-between">
          <h3 className="font-semibold">System activity log</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                placeholder="Search logs…"
                className="h-9 pl-9 pr-4 rounded-xl bg-surface/60 border border-border text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button className="h-9 px-3 rounded-xl text-sm border border-border hover:bg-surface flex items-center gap-1.5">
              <Filter className="size-4" />
              Filter
            </button>
            <button className="h-9 px-3 rounded-xl text-sm border border-border hover:bg-surface flex items-center gap-1.5">
              <Download className="size-4" />
              Export
            </button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="px-5 py-3 font-medium">Actor</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Action</th>
              <th className="px-5 py-3 font-medium">Target</th>
              <th className="px-5 py-3 font-medium text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l: any, i: number) => (
              <tr
                key={i}
                className="border-b border-border last:border-0 hover:bg-white/[0.02]"
              >
                <td className="px-5 py-3">
                  {(i === 0 || logs[i-1].who !== l.who || logs[i-1].target !== l.target) ? (
                    <div className="flex items-center gap-2.5">
                      <Avatar name={l.who} size={28} />
                      <span className="font-medium text-foreground">{l.who}</span>
                    </div>
                  ) : (
                    <div className="pl-9 h-1" />
                  )}
                </td>
                <td className="px-5 py-3">
                  <Badge
                    variant={
                      variant[l.type as keyof typeof variant] || "neutral"
                    }
                  >
                    {l.type}
                  </Badge>
                </td>
                <td className="px-5 py-3 font-medium">
                  <div className="flex items-center gap-2 flex-wrap">
                    {l.action.includes(" → ") ? (
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-muted-foreground italic">moved:</span>
                        {l.action.replace("moved task: ", "").split(" → ").map((step: string, idx: number, arr: any[]) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <Badge 
                              variant={step === "completed" ? "low" : "neutral"}
                              className={step === "completed" ? "!bg-emerald-500/10 !text-emerald-400 !border-emerald-500/20" : ""}
                            >
                              {step === "completed" ? "DONE" : step}
                            </Badge>
                            {idx < arr.length - 1 && <span className="text-muted-foreground opacity-40">→</span>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-foreground">{l.action}</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{l.target}</td>
                <td className="px-5 py-3 text-right text-muted-foreground">
                  {l.time}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No recent activity
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
