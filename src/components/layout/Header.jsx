// components/layout/Header.jsx
import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { fetchAdminProfile } from "../../services/auth"; 

export default function Header() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminProfile()
      .then((data) => setAdmin(data))
      .catch((err) => console.error("Profile error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-24 border-b border-gray-800 flex items-center justify-between px-6 bg-black text-white">
      {/* LEFT: Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Shield className="text-blue-400" size={22} />
        </div>

        <div>
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <p className="text-xs text-gray-400">Manage users & permissions</p>
        </div>
      </div>

      {/* RIGHT: Profile */}
      <div className="flex items-center gap-3">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : admin ? (
          <div className="flex items-center gap-3 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
              {admin.name?.charAt(0).toUpperCase()}
            </div>

            {/* Name + Email */}
            <div className="leading-tight">
              <p className="text-sm font-medium text-white">{admin.name}</p>
              <p className="text-xs text-gray-400">{admin.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-400">Failed to load</p>
        )}
      </div>
    </div>
  );
}
