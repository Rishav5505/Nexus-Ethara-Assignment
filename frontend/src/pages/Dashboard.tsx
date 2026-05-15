import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { StatCard } from "@/components/ui-kit/StatCard";
import { AvatarStack, Avatar } from "@/components/ui-kit/Avatar";
import { Badge } from "@/components/ui-kit/Badge";
import {
  FolderKanban,
  ListTodo,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Activity,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "@tanstack/react-router";

const productivityData = [
  { d: "Mon", tasks: 24, completed: 18 },
  { d: "Tue", tasks: 32, completed: 28 },
  { d: "Wed", tasks: 28, completed: 22 },
  { d: "Thu", tasks: 41, completed: 36 },
  { d: "Fri", tasks: 38, completed: 30 },
  { d: "Sat", tasks: 18, completed: 16 },
  { d: "Sun", tasks: 12, completed: 11 },
];

const teamPerf = [
  { name: "Sarah", value: 92 },
  { name: "Marcus", value: 78 },
  { name: "Priya", value: 85 },
  { name: "Diego", value: 64 },
  { name: "Aisha", value: 88 },
];

const deadlines = [
  {
    title: "Q4 Marketing site relaunch",
    project: "Aurora",
    date: "Tomorrow",
    priority: "high" as const,
    day: 24,
  },
  {
    title: "API v2 migration",
    project: "Backend",
    date: "in 3 days",
    priority: "medium" as const,
    day: 26,
  },
  {
    title: "Design system v3 audit",
    project: "DS",
    date: "Next Mon",
    priority: "low" as const,
    day: 28,
  },
  {
    title: "Onboarding flow polish",
    project: "Growth",
    date: "Next Wed",
    priority: "medium" as const,
    day: 30,
  },
];

export function DashboardPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => api.get("/stats/overview", token || undefined),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  };
  const activity = data?.recentActivities || [];
  const teamMembers = data?.teamMembers || [];

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-surface/40 to-transparent p-6 sm:p-8">
        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-primary/30 blur-[100px] animate-pulse" />
        <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-fuchsia-500/20 blur-[100px]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />{" "}
              All systems on track
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              Good morning,{" "}
              <span className="gradient-text">
                {user?.name?.split(" ")[0] || "User"}
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              You have{" "}
              <span className="text-white font-medium">
                {stats.totalTasks} tasks
              </span>{" "}
              in total and{" "}
              <span className="text-white font-medium">
                {stats.overdueTasks} overdue
              </span>{" "}
              waiting on you.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none h-9 px-4 rounded-xl text-sm border border-border bg-surface/60 hover:bg-surface transition">
              This week
            </button>
            {user?.role === "admin" && (
              <button
                onClick={() => navigate({ to: "/projects" })}
                className="flex-1 sm:flex-none h-9 px-4 rounded-xl text-sm gradient-brand text-white shadow-glow hover:scale-[1.02] active:scale-95 transition"
              >
                + New Project
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Projects"
          value={stats.totalProjects.toString()}
          delta={12}
          icon={FolderKanban}
          accent="primary"
          spark={[3, 5, 4, 6, 5, 7, 8]}
        />
        <StatCard
          label="Total Tasks"
          value={stats.totalTasks.toString()}
          delta={8}
          icon={ListTodo}
          accent="info"
          spark={[6, 5, 7, 6, 8, 7, 9]}
        />
        <StatCard
          label="Completed"
          value={stats.completedTasks.toString()}
          delta={23}
          icon={CheckCircle2}
          accent="success"
          spark={[2, 4, 3, 6, 7, 8, 10]}
        />
        <StatCard
          label="Overdue"
          value={stats.overdueTasks.toString()}
          delta={-15}
          icon={AlertTriangle}
          accent="warning"
          spark={[8, 7, 9, 6, 5, 4, 3]}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Productivity</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tasks created vs. completed
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary-glow" />
                Created
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-success" />
                Completed
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b021a3" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#b021a3" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="d"
                  stroke="rgba(255,255,255,0.4)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.4)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(20,20,28,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="#d946c5"
                  fill="url(#g1)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#34d399"
                  fill="url(#g2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Team Performance</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Completion %
              </p>
            </div>
            <TrendingUp className="size-4 text-success" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamPerf} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(20,20,28,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="url(#barg)" />
                <defs>
                  <linearGradient id="barg" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#740968" />
                    <stop offset="100%" stopColor="#ff4fcb" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Deadlines */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-primary-glow" />
              <h3 className="font-semibold">Upcoming deadlines</h3>
            </div>
            <button className="text-xs text-muted-foreground hover:text-white flex items-center gap-1">
              All <ArrowRight className="size-3" />
            </button>
          </div>
          <div className="space-y-2">
            {deadlines.map((d) => (
              <div
                key={d.title}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition cursor-pointer"
              >
                <div className="size-9 rounded-lg gradient-brand flex flex-col items-center justify-center text-white shrink-0">
                  <span className="text-[8px] uppercase">Nov</span>
                  <span className="text-xs font-bold leading-none">
                    {d.day}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{d.title}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {d.project} • {d.date}
                  </div>
                </div>
                <Badge
                  variant={
                    d.priority === "high"
                      ? "high"
                      : d.priority === "medium"
                        ? "medium"
                        : "low"
                  }
                >
                  {d.priority}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-info" />
              <h3 className="font-semibold">Recent activity</h3>
            </div>
            <span className="text-[10px] text-success flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />{" "}
              Live
            </span>
          </div>
          <div className="space-y-3">
            {activity.length > 0 ? (
              activity.map((a: any, i: number) => {
                const name = a.user?.name || a.who || "Unknown";
                const action = a.action || a.what || "updated";
                const target = a.target || "something";
                const time = a.createdAt
                  ? new Date(a.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : a.time || "Just now";

                return (
                  <div key={a._id || i} className="flex gap-3">
                    <Avatar name={name} size={32} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{name}</span>{" "}
                        <span className="text-muted-foreground">{action}</span>{" "}
                        <span className="text-primary-glow">{target}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {time}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-sm text-muted-foreground py-4">
                No recent activity
              </div>
            )}
          </div>
        </div>

        {/* Team panel */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Team online</h3>
            <AvatarStack
              names={["Sarah", "Marcus", "Priya", "Diego", "Aisha"]}
            />
          </div>

          <div className="space-y-3 mb-5">
            {teamMembers.length > 0 ? (
              teamMembers.map((m: any) => (
                <div key={m._id || m.name} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar name={m.name || "User"} size={36} />
                    <span
                      className={`absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-sidebar ${m.online !== false ? "bg-success" : "bg-muted-foreground"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {m.role || "Member"}
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {m.tasks || 0} tasks
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-muted-foreground py-4">
                No team members found
              </div>
            )}
          </div>

          <div className="rounded-xl bg-gradient-to-br from-primary/15 to-transparent border border-primary/20 p-4">
            <p className="text-xs text-muted-foreground mb-1">This sprint</p>
            <p className="text-2xl font-semibold">87%</p>
            <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full gradient-brand rounded-full"
                style={{ width: "87%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
