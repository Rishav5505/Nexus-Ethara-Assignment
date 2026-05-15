import { useState } from "react";
import { Badge } from "@/components/ui-kit/Badge";
import { AvatarStack } from "@/components/ui-kit/Avatar";
import {
  Grid3x3,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Calendar,
  Loader2,
  X,
  Trash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const statusVariant = {
  active: "low",
  review: "medium",
  planning: "neutral",
} as const;
const colors = [
  "from-pink-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-violet-500 to-fuchsia-500",
  "from-rose-500 to-red-500",
];

export function ProjectsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planning");
  const [dueDate, setDueDate] = useState("");
  const [progress, setProgress] = useState(0);

  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.get("/projects", token || undefined),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (newProject: any) =>
      api.post("/projects", newProject, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (project: any) =>
      api.put(`/projects/${project._id}`, project, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/projects/${id}`, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const openModal = (project?: any) => {
    if (project) {
      setEditingProject(project);
      setTitle(project.title);
      setDescription(project.description || "");
      setStatus(project.status || "planning");
      setDueDate(
        project.due ? new Date(project.due).toISOString().split("T")[0] : "",
      );
      setProgress(project.progress || 0);
    } else {
      setEditingProject(null);
      setTitle("");
      setDescription("");
      setStatus("planning");
      setDueDate("");
      setProgress(0);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      description,
      status,
      due: dueDate || undefined,
      progress,
    };
    if (editingProject) {
      updateMutation.mutate({ ...editingProject, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredProjects = projects.filter((p: any) =>
    p.title?.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
            Workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} projects across your workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter…"
              className="h-9 pl-9 pr-4 rounded-xl bg-surface/60 border border-border text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "size-9 flex items-center justify-center",
                view === "grid"
                  ? "bg-primary/20 text-primary-glow"
                  : "text-muted-foreground hover:bg-surface",
              )}
            >
              <Grid3x3 className="size-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "size-9 flex items-center justify-center",
                view === "list"
                  ? "bg-primary/20 text-primary-glow"
                  : "text-muted-foreground hover:bg-surface",
              )}
            >
              <List className="size-4" />
            </button>
          </div>
          {user?.role === "admin" && (
            <button
              onClick={() => openModal()}
              className="h-9 px-4 rounded-xl text-sm gradient-brand text-white shadow-glow flex items-center gap-1.5 hover:scale-105 transition"
            >
              <Plus className="size-4" /> New project
            </button>
          )}
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map((p: any, i: number) => {
            const color = colors[i % colors.length];
            return (
              <div
                key={p._id}
                className="group glass rounded-2xl p-5 hover:border-primary/30 hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden relative"
                onClick={() => openModal(p)}
              >
                <div
                  className={cn(
                    "absolute -top-16 -right-16 size-40 rounded-full blur-3xl opacity-20 bg-gradient-to-br",
                    color,
                  )}
                />
                <div className="flex items-start justify-between mb-4 relative">
                  <div
                    className={cn(
                      "size-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-semibold",
                      color,
                    )}
                  >
                    {p.title?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete project?"))
                          deleteMutation.mutate(p._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center text-muted-foreground transition"
                    >
                      <Trash className="size-4" />
                    </button>
                    <button className="size-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground">
                      <MoreHorizontal className="size-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold tracking-tight mb-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 h-8">
                  {p.description || "No description provided."}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{p.progress || 0}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full bg-gradient-to-r",
                        color,
                      )}
                      style={{ width: `${p.progress || 0}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <AvatarStack
                    names={
                      p.members?.map((m: any) => m.name) || [
                        p.owner?.name || "U",
                      ]
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        statusVariant[p.status as keyof typeof statusVariant] ||
                        "low"
                      }
                    >
                      {p.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar className="size-3" />{" "}
                      {p.due ? new Date(p.due).toLocaleDateString() : "No date"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-5 py-3 font-medium">Project</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Progress</th>
                <th className="px-5 py-3 font-medium">Team</th>
                <th className="px-5 py-3 font-medium">Due</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p: any, i: number) => {
                const color = colors[i % colors.length];
                return (
                  <tr
                    key={p._id}
                    className="border-b border-border last:border-0 hover:bg-white/[0.02] transition cursor-pointer"
                    onClick={() => openModal(p)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "size-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xs font-semibold shrink-0",
                            color,
                          )}
                        >
                          {p.title?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{p.title}</div>
                          <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                            {p.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          statusVariant[
                            p.status as keyof typeof statusVariant
                          ] || "low"
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 w-32">
                        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={cn(
                              "h-full bg-gradient-to-r rounded-full",
                              color,
                            )}
                            style={{ width: `${p.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs">{p.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <AvatarStack
                        names={
                          p.members?.map((m: any) => m.name) || [
                            p.owner?.name || "U",
                          ]
                        }
                      />
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {p.due ? new Date(p.due).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete project?"))
                            deleteMutation.mutate(p._id);
                        }}
                        className="size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive inline-flex items-center justify-center transition"
                      >
                        <Trash className="size-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredProjects.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No projects found. Click + New project to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="glass rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-muted-foreground hover:text-white"
            >
              <X className="size-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingProject ? "Edit Project" : "New Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">
                  Project Title
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 w-full h-10 px-3 rounded-lg bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="e.g. Website Redesign"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 w-full p-3 rounded-lg bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  placeholder="What is this project about?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1.5 w-full h-10 px-3 rounded-lg bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="review">Review</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1.5 w-full h-10 px-3 rounded-lg bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 [color-scheme:dark]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground flex justify-between">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="mt-2 w-full accent-primary"
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="w-full h-10 rounded-lg gradient-brand text-white text-sm font-medium hover:opacity-90 transition flex items-center justify-center"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Save Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
