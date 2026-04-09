// components/layout/Sidebar.jsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getNav } from "../../services/nav.js";
import * as Icons from "lucide-react";

export default function Sidebar() {
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading]   = useState(true);
  const location  = useLocation();
  const navigate  = useNavigate();

  const userId = new URLSearchParams(location.search).get("userId");

  const withUser = (path) => {
    const fullPath = `/admin${path}`;
    return userId ? `${fullPath}?userId=${userId}` : fullPath;
  };

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const res = await getNav();
        const data = res.data.data ?? res.data;

        setNavItems(
          Array.isArray(data) ? data : data.items ?? data.navItems ?? []
        );
      } catch (err) {
        console.error("Failed to fetch nav:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNav();
  }, []);

  const handleDashboard = () => {
    navigate("/admin/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const isActivePath = (path) => {
    return location.pathname.startsWith(`/admin${path}`);
  };

  const isDashboard = location.pathname === "/admin/dashboard";

  return (
    <div className="w-64 bg-black border-r border-gray-800 p-4 text-white flex flex-col justify-between">
      
      {/* TOP SECTION */}
      <div>
        <h1 className="text-xl font-bold mb-6">Admin  CreativeOS </h1>

        {/* USER INFO */}
        {userId && (
          <div className="mb-4 px-2 py-1.5 bg-blue-500/10 border border-blue-500/25 rounded-lg">
            <p className="text-[10px] text-blue-300 font-medium uppercase tracking-wider">
              Editing user
            </p>
            <p className="text-[11px] text-blue-400 truncate mt-0.5">
              {userId}
            </p>
          </div>
        )}

        <nav className="space-y-2">
          
          {/* DASHBOARD */}
          <button
            onClick={handleDashboard}
            className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors
              ${
                isDashboard
                  ? "bg-green-500/10 text-green-400 border border-green-500/30"
                  : "hover:text-green-400"
              }`}
          >
            <Icons.Home size={16} />
            <span>Dashboard</span>
          </button>

          {/* STATIC ITEMS LINK */}
          <Link
            to={withUser("/items")}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors
              ${
                isActivePath("/items")
                  ? "bg-green-500/10 text-green-400 border border-green-500/30"
                  : "hover:text-green-400"
              }`}
          >
            <Icons.Package size={16} />
            <span>Items</span>
          </Link>

          {/* DYNAMIC NAV ITEMS */}
          {loading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : (
            navItems.map((item) => {
              const Icon = Icons[item.icon] || Icons.Circle;
              const active = isActivePath(item.path);

              return (
                <Link
                  key={item.id}
                  to={withUser(item.path)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors
                    ${
                      active
                        ? "bg-green-500/10 text-green-400 border border-green-500/30"
                        : "hover:text-green-400"
                    }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })
          )}
        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className="pt-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full text-left text-red-400 hover:text-red-500 transition-colors flex items-center gap-2"
        >
          <Icons.LogOut size={16} />
          Logout
        </button>
      </div>

    </div>
  );
} 