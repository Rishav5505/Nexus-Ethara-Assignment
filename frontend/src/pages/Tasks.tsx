import { useState, useMemo } from "react";
import { Badge } from "@/components/ui-kit/Badge";
import { Avatar } from "@/components/ui-kit/Avatar";
import {
  Plus,
  MessageSquare,
  Paperclip,
  Calendar,
  MoreHorizontal,
  Loader2,
  X,
  Trash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

type Priority = "high" | "medium" | "low";
type Status = "pending" | "progress" | "review" | "completed";

const columns: { id: Status; label: string; accent: string }[] = [
  { id: "pending", label: "Pending", accent: "bg-muted-foreground" },
  { id: "progress", label: "In Progress", accent: "bg-info" },
  { id: "review", label: "Review", accent: "bg-warning" },
  { id: "completed", label: "Completed", accent: "bg-success" },
];

const nextStatusMap: Record<Status, Status | null> = {
  pending: "progress",
  progress: "review",
  review: "completed",
  completed: null
};

const nextStatusLabel: Record<Status, string> = {
  pending: "Start Work",
  progress: "Submit Review",
  review: "Approve Task",
  completed: ""
};

export function TasksPage() {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  const [drag, setDrag] = useState<{ id: string; from: Status } | null>(null);
  const [openTask, setOpenTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<Status>("pending");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [tags, setTags] = useState("");

  const { data: tasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.get("/tasks", token || undefined),
    enabled: !!token,
    refetchInterval: 3000, // Poll every 3s for real-time updates
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.get("/projects", token || undefined),
    enabled: !!token,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/auth/users", token || undefined),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post("/tasks", data, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: any }) =>
      api.patch(`/tasks/${data.id}`, data.updates, token || undefined),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setOpenTask(null);
    },
  });

  // Group tasks by status
  const board = useMemo(() => {
    const b: Record<Status, any[]> = {
      pending: [],
      progress: [],
      review: [],
      completed: [],
    };
    tasks.forEach((t: any) => {
      const status = t.status as Status;
      if (b[status]) b[status].push(t);
      else b.pending.push(t);
    });
    return b;
  }, [tasks]);

  const onDrop = (to: Status) => {
    if (!drag || drag.from === to) {
      setDrag(null);
      return;
    }
    // Optimistic update logic could go here, but we'll just fire the mutation
    updateMutation.mutate({ id: drag.id, updates: { status: to } });
    setDrag(null);
  };

  const openModal = (task?: any) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority || "medium");
      setStatus(task.status || "pending");
      setDueDate(
        task.due ? new Date(task.due).toISOString().split("T")[0] : "",
      );
      setProjectId(task.project?._id || task.project || "");
      setAssigneeIds(task.assignees?.map((a: any) => a._id || a) || []);
      setTags(task.tags?.join(", ") || "");
    } else {
      setEditingTask(null);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("pending");
      setDueDate("");
      setProjectId(projects[0]?._id || "");
      setAssigneeIds([]);
      setTags("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      priority,
      status,
      due: dueDate || undefined,
      project: projectId,
      assignees: assigneeIds,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (editingTask) {
      updateMutation.mutate({ id: editingTask._id, updates: payload });
      closeModal();
    } else {
      createMutation.mutate(payload);
    }
  };

  const toggleAssignee = (uid: string) => {
    setAssigneeIds((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid],
    );
  };

  if (loadingTasks) {
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
          <h1 className="text-3xl font-semibold tracking-tight">Task Board</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag to move tasks between columns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-4 rounded-xl text-sm border border-border bg-surface/60 hover:bg-surface">
            Filter
          </button>
          {user?.role === "admin" && (
            <button
              onClick={() => openModal()}
              className="h-9 px-4 rounded-xl text-sm gradient-brand text-white shadow-glow flex items-center gap-1.5 hover:scale-105 transition"
            >
              <Plus className="size-4" /> New task
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => (
          <div
            key={col.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(col.id)}
            className="glass rounded-2xl p-3 flex flex-col min-h-[60vh]"
          >
            <div className="flex items-center justify-between px-2 py-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full", col.accent)} />
                <h3 className="text-sm font-semibold">{col.label}</h3>
                <span className="text-[11px] text-muted-foreground">
                  {board[col.id].length}
                </span>
              </div>
              {user?.role === "admin" && (
                <button
                  onClick={() => {
                    setStatus(col.id);
                    openModal();
                  }}
                  className="size-6 rounded-md hover:bg-white/5 flex items-center justify-center"
                >
                  <Plus className="size-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            <div className="space-y-2 flex-1 scrollbar-thin overflow-y-auto pr-1">
              {board[col.id].map((t) => (
                <div
                  key={t._id}
                  draggable
                  onDragStart={() => setDrag({ id: t._id, from: col.id })}
                  onClick={() => setOpenTask(t)}
                  className="group bg-surface/80 hover:bg-surface-elevated border border-border rounded-xl p-3.5 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant={
                        t.priority === "high"
                          ? "high"
                          : t.priority === "medium"
                            ? "medium"
                            : "low"
                      }
                    >
                      {t.priority}
                    </Badge>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(t);
                      }}
                      className="opacity-0 group-hover:opacity-100 size-6 rounded hover:bg-white/5 flex items-center justify-center transition"
                    >
                      <MoreHorizontal className="size-3.5 text-muted-foreground" />
                    </button>
                  </div>
                  <h4 className="text-sm font-medium leading-snug mb-1">
                    {t.title}
                  </h4>
                  {t.description && (
                    <p className="text-[11px] text-muted-foreground mb-2 line-clamp-2">
                      {t.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {t.tags?.map((tg: string) => (
                      <span
                        key={tg}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground"
                      >
                        #{tg}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {t.assignees?.map((a: any) => (
                        <div
                          key={a._id || a}
                          className="flex items-center gap-1.5 bg-white/5 pl-1 pr-2.5 py-0.5 rounded-full border border-white/5 hover:border-primary/20 transition-all group/assignee"
                        >
                          <Avatar name={a.name} size={18} className="ring-0" />
                          <span className="text-[10px] font-medium text-muted-foreground group-hover/assignee:text-primary-glow transition-colors whitespace-nowrap">
                            {a.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      {t.due && (
                        <span className="flex items-center gap-0.5">
                          <Calendar className="size-3" />
                          {new Date(t.due).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  {user?.role !== "admin" && nextStatusMap[col.id] && t.assignees?.some((a: any) => a._id === user?._id || a === user?._id || a.id === user?.id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateMutation.mutate({ id: t._id, updates: { status: nextStatusMap[col.id] } });
                      }}
                      className="mt-3 w-full py-1.5 rounded-lg text-xs font-medium border border-border bg-surface/40 hover:bg-primary/20 hover:text-primary-glow hover:border-primary/30 transition-all"
                    >
                      {nextStatusLabel[col.id]} →
                    </button>
                  )}
                </div>
              ))}
              {board[col.id].length === 0 && (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-border/50 rounded-xl text-muted-foreground text-xs">
                  Drop here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task detail drawer */}
      {openTask && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          onClick={() => setOpenTask(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md h-full bg-background border-l border-border p-6 overflow-y-auto animate-in slide-in-from-right"
          >
            <div className="flex items-center gap-2 mb-6">
              <Badge
                variant={
                  openTask.priority === "high"
                    ? "high"
                    : openTask.priority === "medium"
                      ? "medium"
                      : "low"
                }
              >
                {openTask.priority}
              </Badge>
              <span className="text-xs text-muted-foreground">
                #{openTask._id.slice(-6).toUpperCase()}
              </span>
              <button
                onClick={() => {
                  if (confirm("Delete task?"))
                    deleteMutation.mutate(openTask._id);
                }}
                className="ml-auto text-destructive hover:bg-destructive/10 p-1.5 rounded text-sm flex items-center transition"
              >
                <Trash className="size-4" />
              </button>
              <button
                onClick={() => setOpenTask(null)}
                className="text-muted-foreground hover:text-white p-1.5"
              >
                <X className="size-5" />
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-2">{openTask.title}</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {openTask.description ?? "No description provided yet."}
            </p>

            <dl className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                  Due Date
                </dt>
                <dd className="text-sm">
                  {openTask.due
                    ? new Date(openTask.due).toLocaleDateString()
                    : "None"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                  Status
                </dt>
                <dd className="text-sm capitalize">{openTask.status}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                  Assignees
                </dt>
                <dd className="flex items-center gap-2 mt-2">
                  {openTask.assignees?.map((a: any) => (
                    <div
                      key={a._id}
                      className="flex items-center gap-2 bg-surface px-2 py-1 rounded-full border border-border"
                    >
                      <Avatar name={a.name} size={20} />
                      <span className="text-xs font-medium pr-1">{a.name}</span>
                    </div>
                  ))}
                  {(!openTask.assignees || openTask.assignees.length === 0) && (
                    <span className="text-xs text-muted-foreground">
                      Unassigned
                    </span>
                  )}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                  Tags
                </dt>
                <dd className="flex flex-wrap gap-1 mt-1">
                  {openTask.tags?.map((t: string) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-border"
                    >
                      #{t}
                    </span>
                  ))}
                  {(!openTask.tags || openTask.tags.length === 0) && (
                    <span className="text-xs text-muted-foreground">
                      No tags
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="glass rounded-2xl w-full max-w-lg p-6 relative shadow-2xl animate-in zoom-in-95 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-muted-foreground hover:text-white"
            >
              <X className="size-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingTask ? "Edit Task" : "New Task"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">
                  Task Title
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 w-full h-10 px-3 rounded-lg bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="e.g. Design Landing Page"
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
                  placeholder="Task details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">
                    Project
                  </label>
                  <select
                    required
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="mt-1.5 w-full h-10 px-3 rounded-lg bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none"
                  >
                    <option value="" disabled>
                      Select Project
                    </option>
                    {projects.map((p: any) => (
                      <option key={p._id} value={p._id}>
                        {p.title}
                      </option>
                    ))}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="mt-1.5 w-full h-10 px-3 rounded-lg bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                    className="mt-1.5 w-full h-10 px-3 rounded-lg bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">
                  Assignees
                </label>
                <div className="mt-2 flex flex-wrap gap-2 p-2 rounded-lg bg-surface/40 border border-border max-h-32 overflow-y-auto">
                  {users.map((u: any) => (
                    <button
                      type="button"
                      key={u._id}
                      onClick={() => toggleAssignee(u._id)}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1 rounded-full text-xs transition",
                        assigneeIds.includes(u._id)
                          ? "bg-primary text-white"
                          : "bg-surface hover:bg-surface-elevated text-muted-foreground",
                      )}
                    >
                      <Avatar name={u.name} size={18} />
                      {u.name}
                    </button>
                  ))}
                  {users.length === 0 && (
                    <span className="text-xs text-muted-foreground">
                      No users available
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">
                  Tags (comma separated)
                </label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="mt-1.5 w-full h-10 px-3 rounded-lg bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="e.g. backend, urgent"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="w-full h-10 rounded-lg gradient-brand text-white text-sm font-medium shadow-glow hover:opacity-90 transition flex items-center justify-center"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Save Task"
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
