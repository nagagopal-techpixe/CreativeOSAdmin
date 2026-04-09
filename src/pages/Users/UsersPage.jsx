// pages/Users/UsersPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserAPI } from "../../services/dashboard"; // ✅ use service

export default function UsersPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await createUserAPI(form); // ✅ clean API call

      setSuccess(
        `User "${data.name}" created! Credentials sent to ${form.email}.`,
      );

      setForm({ name: "", email: "" });

      // ✅ navigate after success
      setTimeout(() => {
        navigate(`/admin/videos?userId=${data._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen text-slate-200">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-slate-100 tracking-tight">
          User Management
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Create users and manage their access to builder tools.
        </p>
      </div>

      {/* Create User Card */}
      <div className="max-w-md">
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">
            Create New User
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium">
                Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Jane Doe"
                className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="user@example.com"
                className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Success */}
            {success && (
              <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                ✓ {success}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg py-2.5 transition"
            >
              {loading ? "Creating…" : "Create User & Go to Videos →"}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-[11px] text-slate-600 mt-3 leading-relaxed">
          A password will be auto-generated and emailed to the user. They can
          change it after logging in.
        </p>
      </div>
    </div>
  );
}
