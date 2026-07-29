"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TIER_LABELS } from "@/lib/constants";
import EditMemberModal from "./EditMemberModal";

function LoginForm({ onLoggedIn }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      onLoggedIn();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto py-24 px-6">
      <p className="uppercase tracking-[0.3em] text-gold text-xs mb-2 text-center">
        The Possible Woman
      </p>
      <h1 className="font-heading text-3xl text-plum-deep mb-6 text-center">
        Admin Login
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="rounded-md border border-mauve/40 bg-white px-4 py-2.5 text-plum-deep focus:outline-none focus:ring-2 focus:ring-gold"
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-plum-deep text-blush py-2.5 font-medium hover:bg-plum transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

function PendingCard({ member, onAction, highlighted }) {
  return (
    <div
      className={`rounded-lg border p-4 bg-white flex flex-col md:flex-row md:items-center gap-3 justify-between ${
        highlighted ? "border-gold ring-2 ring-gold" : "border-mauve/30"
      }`}
    >
      <div>
        <p className="text-xs uppercase tracking-wide text-gold font-medium">
          {TIER_LABELS[member.tier]}
        </p>
        <p className="font-heading text-xl text-plum-deep">
          {member.firstName} {member.lastName}
        </p>
        <p className="text-sm text-muted">{member.companyName}</p>
        <p className="text-xs text-mauve mt-1">
          {member.email || "no email"} &middot; {member.cityState || "no location"} &middot;{" "}
          {member.industry || "no industry"}
        </p>
        {member.bio && (
          <p className="text-sm text-plum-deep/80 mt-2 line-clamp-2 max-w-md">{member.bio}</p>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onAction(member.id, "approve")}
          className="rounded-md bg-plum-deep text-blush px-4 py-2 text-sm font-medium hover:bg-plum transition-colors"
        >
          Approve
        </button>
        <button
          onClick={() => onAction(member.id, "reject")}
          className="rounded-md border border-muted text-muted px-4 py-2 text-sm font-medium hover:bg-blush transition-colors"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

function LiveMemberRow({ member, onEdit, onRemove }) {
  return (
    <div className="rounded-lg border border-mauve/20 p-3 bg-white flex items-center justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-mauve font-medium">
          {TIER_LABELS[member.tier]}
        </p>
        <p className="font-heading text-lg text-plum-deep leading-tight">
          {member.firstName} {member.lastName}
        </p>
        <p className="text-sm text-muted">{member.companyName}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onEdit(member)}
          className="rounded-md border border-mauve/40 text-muted px-3 py-1.5 text-sm hover:bg-blush transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onRemove(member.id)}
          className="rounded-md border border-red-300 text-red-700 px-3 py-1.5 text-sm hover:bg-red-50 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");

  const [authState, setAuthState] = useState("loading"); // loading | out | in
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [rejectedVisible, setRejectedVisible] = useState(false);

  const loadMembers = async () => {
    const res = await fetch("/api/admin/members");
    if (res.status === 401) {
      setAuthState("out");
      return;
    }
    const data = await res.json();
    setMembers(data.members || []);
    setAuthState("in");
  };

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = async (id, action) => {
    await fetch(`/api/admin/members/${id}/${action}`, { method: "POST" });
    loadMembers();
  };

  const handleRemove = async (id) => {
    if (!confirm("Remove this listing? This cannot be undone.")) return;
    await fetch(`/api/admin/members/${id}`, { method: "DELETE" });
    loadMembers();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthState("out");
    setMembers([]);
  };

  if (authState === "loading") {
    return <div className="py-24 text-center text-muted">Loading...</div>;
  }

  if (authState === "out") {
    return <LoginForm onLoggedIn={loadMembers} />;
  }

  const pending = members.filter((m) => m.status === "pending");
  const approved = members.filter((m) => m.status === "approved");
  const rejected = members.filter((m) => m.status === "rejected");

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="uppercase tracking-[0.3em] text-gold text-xs mb-1">
            The Possible Woman
          </p>
          <h1 className="font-heading text-3xl text-plum-deep">Admin Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-muted hover:text-plum-deep underline"
        >
          Log out
        </button>
      </div>

      <section className="mb-10">
        <h2 className="font-heading text-2xl text-plum-deep mb-3">
          Pending Submissions ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-muted">Nothing waiting for review.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((m) => (
              <PendingCard
                key={m.id}
                member={m}
                onAction={handleAction}
                highlighted={m.id === highlightId}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mb-10">
        <h2 className="font-heading text-2xl text-plum-deep mb-3">
          Live Members ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-sm text-muted">No live listings yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {approved.map((m) => (
              <LiveMemberRow
                key={m.id}
                member={m}
                onEdit={setEditingMember}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </section>

      {rejected.length > 0 && (
        <section>
          <button
            onClick={() => setRejectedVisible((v) => !v)}
            className="text-sm text-muted underline mb-3"
          >
            {rejectedVisible ? "Hide" : "Show"} rejected submissions ({rejected.length})
          </button>
          {rejectedVisible && (
            <div className="flex flex-col gap-2">
              {rejected.map((m) => (
                <LiveMemberRow
                  key={m.id}
                  member={m}
                  onEdit={setEditingMember}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSaved={() => {
            setEditingMember(null);
            loadMembers();
          }}
        />
      )}
    </div>
  );
}
