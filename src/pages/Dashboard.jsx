// pages/Dashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAllUsers,
  createUserAPI,
  deleteUserAPI,
} from "../services/dashboard";

export default function Dashboard() {
  const navigate = useNavigate();

  const [mode, setMode] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMode = (selected) => {
    if (selected === "user") fetchUsers();
    setMode(selected);
    setSuccess(null);
    setError(null);
  };

  const handleSelectUser = (user) => {
    navigate(`/admin/items?userId=${user._id}`);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await createUserAPI(form);
      setSuccess(`User "${data.name}" created! Redirecting…`);
      setForm({ name: "", email: "" });
      setTimeout(() => navigate(`/admin/items?userId=${data._id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setCreating(false);
    }
  };
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!confirmDelete) return;

    try {
      await deleteUserAPI(userId);

      // ✅ remove user from UI instantly
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };
  return (
    <div className="p-6 min-h-screen text-slate-200">
      {/*  Mode selection  */}
      {!mode && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
          {/* Global */}
          <button
            onClick={() => navigate("/admin/items")}
            className="flex flex-col gap-3 p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-200 text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl">
              🌐
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
                Global Mode
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Toggle builder items globally for all users.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-blue-400 transition-colors">
              Manage globally →
            </span>
          </button>

          {/* User mode */}
          <button
            onClick={() => handleSelectMode("user")}
            className="flex flex-col gap-3 p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-green-500/40 hover:bg-green-500/5 transition-all duration-200 text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100 group-hover:text-green-300 transition-colors">
                User Mode
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Customize permissions for a specific user.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-green-400 transition-colors">
              Select user →
            </span>
          </button>

          {/* Create user */}
          <button
            onClick={() => handleSelectMode("create")}
            className="flex flex-col gap-3 p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-purple-500/40 hover:bg-purple-500/5 transition-all duration-200 text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl">
              ➕
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
                Create User
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Add a new user and set their permissions.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-purple-400 transition-colors">
              Create new →
            </span>
          </button>
        </div>
      )}

      {/*  User list  */}
      {mode === "user" && (
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setMode(null)}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Back
            </button>
            <h3 className="text-sm font-semibold text-slate-200">
              Select a User
            </h3>
          </div>

          {loading && (
            <p className="text-slate-500 text-sm py-10 text-center">
              Loading users…
            </p>
          )}
          {!loading && users.length === 0 && (
            <p className="text-slate-500 text-sm py-10 text-center">
              No users found.
            </p>
          )}
          {!loading && users.length > 0 && (
            <div className="flex flex-col gap-2">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-green-500/40 hover:bg-green-500/5 transition-all duration-150 group"
                >
                  {/* LEFT CLICK (select user) */}
                  <button
                    onClick={() => handleSelectUser(user)}
                    className="flex items-center gap-4 flex-1 text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-100 group-hover:text-green-300 transition-colors">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </button>

                  {/* 🔥 DELETE BUTTON */}
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-xs text-red-400 hover:text-red-500 px-2 py-1 rounded-md border border-red-500/20 hover:bg-red-500/10 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/*  Create User  */}
      {mode === "create" && (
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setMode(null)}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Back
            </button>
            <h3 className="text-sm font-semibold text-slate-200">
              Create New User
            </h3>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">
                  Full Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  placeholder="e.g. Jane Doe"
                  className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  placeholder="user@example.com"
                  className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                  ✓ {success}
                </p>
              )}

              <button
                type="submit"
                disabled={creating}
                className="mt-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg py-2.5 transition"
              >
                {creating ? "Creating…" : "Create User & Set Permissions →"}
              </button>
            </form>
          </div>

          <p className="text-[11px] text-slate-600 mt-3 leading-relaxed">
            A password will be auto-generated and emailed to the user.
          </p>
        </div>
      )}
    </div>
  );
}
