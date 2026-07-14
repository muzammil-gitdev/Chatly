"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Ban, CalendarDays, CheckCircle2, Edit3, Mail, Plus, RefreshCw, Search, Trash2, UserPlus, X } from "lucide-react";

type AdminUser = {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string | null;
  designation?: string;
  phone?: string;
  location?: string;
  bio?: string;
  status?: string;
  isActivated: boolean;
  isSuspended: boolean;
  createdAt?: string | null;
};

type UserForm = {
  displayName: string;
  email: string;
  password: string;
  phone: string;
  designation: string;
  location: string;
  bio: string;
};

type ConfirmState =
  | { type: "suspend"; user: AdminUser }
  | { type: "delete"; user: AdminUser }
  | null;

const emptyForm: UserForm = {
  displayName: "",
  email: "",
  password: "",
  phone: "",
  designation: "",
  location: "",
  bio: "",
};

function formatDate(value?: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function toForm(user: AdminUser): UserForm {
  return {
    displayName: user.displayName || "",
    email: user.email || "",
    password: "",
    phone: user.phone || "",
    designation: user.designation || "",
    location: user.location || "",
    bio: user.bio || "",
  };
}

function getInitial(user: AdminUser) {
  return (user.displayName || user.email || "Z").slice(0, 1).toUpperCase();
}

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busyUid, setBusyUid] = useState("");
  const [error, setError] = useState("");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  async function loadUsers() {
    setError("");
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Failed to load users.");
    setUsers(data.users || []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers()
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch = !term || [user.displayName, user.email, user.phone, user.designation, user.location].some((value) => value?.toLowerCase().includes(term));
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !user.isSuspended && user.isActivated) ||
        (statusFilter === "inactive" && !user.isSuspended && !user.isActivated) ||
        (statusFilter === "suspended" && user.isSuspended);
      return matchesSearch && matchesStatus;
    });
  }, [query, statusFilter, users]);

  function openAdd() {
    setEditingUser(null);
    setForm(emptyForm);
    setFormMode("add");
  }

  function openEdit(user: AdminUser) {
    setEditingUser(user);
    setForm(toForm(user));
    setFormMode("edit");
  }

  function closeForm() {
    setFormMode(null);
    setEditingUser(null);
    setForm(emptyForm);
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const isEdit = formMode === "edit" && editingUser;
    const endpoint = isEdit ? `/api/admin/users/${editingUser.uid}` : "/api/admin/users";
    const body = isEdit ? { ...form, action: "update" } : form;

    setBusyUid(isEdit ? editingUser.uid : "new");
    try {
      const response = await fetch(endpoint, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Failed to save user.");
      closeForm();
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save user.");
    } finally {
      setBusyUid("");
    }
  }

  async function updateUser(uid: string, action: "suspend" | "activate") {
    setBusyUid(uid);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Failed to update user.");
      setConfirm(null);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user.");
    } finally {
      setBusyUid("");
    }
  }

  async function deleteUser(user: AdminUser) {
    setBusyUid(user.uid);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${user.uid}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Failed to delete user.");
      setConfirm(null);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user.");
    } finally {
      setBusyUid("");
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-500">Admin Portal</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">User Management</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-500">View, add, edit, suspend, reactivate, or delete Chatly users.</p>
        </div>
      </div>

      <div className="mb-6 grid gap-3 lg:grid-cols-[1fr_150px_auto_auto]">
        <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm dark:border-white/10 dark:bg-[#080b15]">
          <Search className="h-5 w-5 text-slate-400 dark:text-zinc-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, phone, designation, location..."
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-zinc-100 dark:placeholder:text-zinc-600"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm outline-none dark:border-white/10 dark:bg-[#080b15] dark:text-zinc-200"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        <button
          onClick={() => loadUsers().catch((err) => setError(err instanceof Error ? err.message : "Failed to load users."))}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-[#080b15] dark:text-zinc-300 dark:hover:bg-white/5"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
        <button
          onClick={openAdd}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-black text-white shadow-xl shadow-slate-950/10 hover:bg-slate-800 dark:bg-emerald-500 dark:text-[#061111] dark:hover:bg-emerald-400"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {error ? <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{error}</p> : null}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#080b15]">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {loading ? (
                <tr><td className="px-6 py-10 text-center text-slate-500 dark:text-zinc-500" colSpan={4}>Loading users...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td className="px-6 py-10 text-center text-slate-500 dark:text-zinc-500" colSpan={4}>No users found.</td></tr>
              ) : filtered.map((user) => (
                <tr key={user.uid} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-black text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
                        {user.photoURL ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.photoURL} alt={user.displayName || user.email} className="h-full w-full rounded-full object-cover" />
                        ) : (
                          getInitial(user)
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-black text-slate-950 dark:text-zinc-100">{user.displayName || "Unnamed user"}</p>
                        <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500 dark:text-zinc-500">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                      user.isSuspended
                        ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                        : user.isActivated
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                    }`}>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {user.isSuspended ? "Suspended" : user.isActivated ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                      {formatDate(user.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {user.isSuspended ? (
                        <button disabled={busyUid === user.uid} onClick={() => updateUser(user.uid, "activate")} className="inline-flex h-9 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs font-black text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300" title="Reactivate">
                          Reactivate
                        </button>
                      ) : (
                        <button disabled={busyUid === user.uid} onClick={() => setConfirm({ type: "suspend", user })} className="inline-flex h-9 items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 text-xs font-black text-amber-700 hover:bg-amber-100 disabled:opacity-50 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300" title="Suspend">
                          <Ban className="h-4 w-4" />
                          Suspend
                        </button>
                      )}
                      <button disabled={busyUid === user.uid} onClick={() => openEdit(user)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-black text-blue-700 hover:bg-blue-100 disabled:opacity-50 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300" title="Edit">
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                      <button disabled={busyUid === user.uid} onClick={() => setConfirm({ type: "delete", user })} className="inline-flex h-9 items-center rounded-lg border border-red-200 bg-red-50 px-3 text-red-700 hover:bg-red-100 disabled:opacity-50 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {formMode ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <form onSubmit={submitForm} className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0d111d]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950 dark:text-white">{formMode === "add" ? "Add User" : "Edit User"}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">{formMode === "add" ? "Creates an active Firebase user without OTP verification." : "Update user profile information."}</p>
              </div>
              <button type="button" onClick={closeForm} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/5">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["displayName", "Display Name", "text"],
                ["email", "Email", "email"],
                ["password", formMode === "add" ? "Password" : "Password unchanged", "password"],
                ["phone", "Phone", "text"],
                ["designation", "Designation / Role", "text"],
                ["location", "Location", "text"],
              ].map(([key, label, type]) => (
                <label key={key} className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-zinc-500">{label}</span>
                  <input
                    type={type}
                    value={form[key as keyof UserForm]}
                    disabled={formMode === "edit" && (key === "email" || key === "password")}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none disabled:bg-slate-100 disabled:text-slate-400 dark:border-white/10 dark:bg-[#080b15] dark:text-zinc-100 dark:disabled:bg-white/5"
                    required={key === "displayName" || key === "email" || (formMode === "add" && key === "password")}
                  />
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-zinc-500">Bio</span>
                <textarea
                  value={form.bio}
                  onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                  className="min-h-24 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none dark:border-white/10 dark:bg-[#080b15] dark:text-zinc-100"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={closeForm} className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-black text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5">Cancel</button>
              <button disabled={Boolean(busyUid)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-black text-[#061111] hover:bg-emerald-400 disabled:opacity-60">
                <Plus className="h-4 w-4" />
                {busyUid ? "Saving..." : formMode === "add" ? "Create User" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {confirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0d111d]">
            <div className="flex gap-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                confirm.type === "suspend" ? "bg-amber-500 text-white" : "bg-red-500 text-white"
              }`}>
                <AlertTriangle className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-xl font-black text-slate-950 dark:text-white">{confirm.type === "suspend" ? "Suspend User" : "Delete User"}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-zinc-400">
                  {confirm.type === "suspend"
                    ? `This will suspend "${confirm.user.displayName || confirm.user.email}". They can be reactivated later.`
                    : `This will permanently delete "${confirm.user.displayName || confirm.user.email}" from Firebase Auth and Firestore.`}
                </p>
              </div>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button onClick={() => setConfirm(null)} className="h-12 rounded-xl border border-slate-200 text-sm font-black text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5">Cancel</button>
              <button
                disabled={busyUid === confirm.user.uid}
                onClick={() => confirm.type === "suspend" ? updateUser(confirm.user.uid, "suspend") : deleteUser(confirm.user)}
                className={`h-12 rounded-xl text-sm font-black text-white shadow-xl disabled:opacity-60 ${
                  confirm.type === "suspend" ? "bg-amber-500 hover:bg-amber-400" : "bg-red-500 hover:bg-red-400"
                }`}
              >
                {busyUid === confirm.user.uid ? "Working..." : confirm.type === "suspend" ? "Confirm Suspend" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
