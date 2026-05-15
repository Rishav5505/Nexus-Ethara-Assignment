import { Avatar } from "@/components/ui-kit/Avatar";
import { Badge } from "@/components/ui-kit/Badge";
import {
  MoreHorizontal,
  Plus,
  Mail,
  Loader2,
  Trash,
  Shield,
  ShieldAlert,
  User,
} from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const dot = {
  online: "bg-success",
  away: "bg-warning",
  offline: "bg-muted-foreground",
};

export function TeamPage() {
  const [invite, setInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteName, setInviteName] = useState("");
  const [search, setSearch] = useState("");

  const { token, user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/auth/users", token || undefined),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/auth/users/${id}`, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api.patch(`/auth/users/${id}`, { role }, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const inviteMutation = useMutation({
    mutationFn: (newMember: any) =>
      api.post(
        "/auth/register",
        { ...newMember, password: "password123" },
        token || undefined,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setInvite(false);
      setInviteEmail("");
      setInviteName("");
    },
  });

  const handleInvite = () => {
    if (!inviteEmail || !inviteName) return;
    inviteMutation.mutate({
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
    });
  };

  const filteredMembers = members.filter(
    (m: any) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
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
          <h1 className="text-3xl font-semibold tracking-tight">
            Team Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {members.length} members across roles.
          </p>
        </div>
        {currentUser?.role === "admin" && (
          <button
            onClick={() => setInvite(true)}
            className="h-9 px-4 rounded-xl text-sm gradient-brand text-white shadow-glow flex items-center gap-1.5 hover:scale-105 transition"
          >
            <Plus className="size-4" /> Invite member
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {members.slice(0, 3).map((m: any) => (
          <div
            key={m._id}
            className="glass rounded-2xl p-5 hover:border-primary/30 transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Avatar name={m.name} size={48} />
                <span
                  className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-background ${m.role === "admin" ? dot.online : dot.offline}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{m.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {m.email}
                </div>
              </div>
              <Badge variant={m.role === "admin" ? "high" : "low"}>
                {m.role}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Joined
                </div>
                <div className="text-sm font-semibold mt-0.5">
                  {new Date(m.createdAt || Date.now()).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Status
                </div>
                <div className="text-sm font-semibold mt-0.5 capitalize">
                  {m.role === "admin" ? "Online" : "Offline"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">All members</h3>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members…"
            className="h-8 px-3 rounded-lg bg-surface/60 border border-border text-xs w-56 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium text-right">
                  Actions (Admin)
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m: any) => (
                <tr
                  key={m._id}
                  className="border-b border-border last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar name={m.name} size={32} />
                        <span
                          className={`absolute bottom-0 right-0 size-2 rounded-full ring-2 ring-background ${m.role === "admin" ? dot.online : dot.offline}`}
                        />
                      </div>
                      <div>
                        <div className="font-medium">
                          {m.name} {m._id === currentUser?.id && "(You)"}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {m.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      disabled={
                        currentUser?.role !== "admin" ||
                        m._id === currentUser?.id
                      }
                      value={m.role}
                      onChange={(e) =>
                        roleMutation.mutate({ id: m._id, role: e.target.value })
                      }
                      className="bg-transparent border border-border rounded-lg text-xs px-2 py-1 outline-none focus:border-primary/50 disabled:opacity-50 appearance-none"
                    >
                      <option value="member" className="bg-background">
                        Member
                      </option>
                      <option value="admin" className="bg-background">
                        Admin
                      </option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {new Date(m.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {currentUser?.role === "admin" &&
                      m._id !== currentUser?.id && (
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to remove this user?",
                              )
                            ) {
                              deleteMutation.mutate(m._id);
                            }
                          }}
                          className="size-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive inline-flex items-center justify-center transition"
                        >
                          <Trash className="size-4" />
                        </button>
                      )}
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {invite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setInvite(false)}
          />
          <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md shadow-elevated animate-in zoom-in-95">
            <h2 className="text-lg font-semibold mb-1">Invite team member</h2>
            <p className="text-xs text-muted-foreground mb-5">
              Create a new account for your workspace.
            </p>

            <label className="text-xs text-muted-foreground">Full Name</label>
            <div className="relative mt-1.5 mb-4">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <label className="text-xs text-muted-foreground">
              Email address
            </label>
            <div className="relative mt-1.5 mb-4">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <label className="text-xs text-muted-foreground">Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full h-10 mt-1.5 px-3 rounded-xl bg-surface/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 mb-6 appearance-none"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setInvite(false)}
                className="h-9 px-4 rounded-xl text-sm border border-border hover:bg-surface transition"
              >
                Cancel
              </button>
              <button
                disabled={
                  inviteMutation.isPending || !inviteEmail || !inviteName
                }
                onClick={handleInvite}
                className="h-9 px-4 rounded-xl text-sm gradient-brand text-white shadow-glow flex items-center justify-center min-w-[100px] disabled:opacity-50"
              >
                {inviteMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Send invite"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
