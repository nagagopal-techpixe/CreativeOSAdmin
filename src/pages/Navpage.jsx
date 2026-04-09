import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getNav,
  toggleGlobalNavItem,
  toggleGlobalNavSection,
  toggleNavSection,
  toggleNavItemPerm,
} from "../services/nav.js";
import { fetchUserPermissions } from "../services/users.js";
import StepSection from "../components/Stepsection.jsx";

const colorIconMap = {
  emerald: "🖼️",
  blue: "🎬",
  amber: "🎙️",
  rose: "🎵",
  indigo: "🧑",
  purple: "🎞️",
  cyan: "✨",
  orange: "",
};

export default function NavPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId") || null;
  const isUserMode = !!userId;

  const [targetUser, setTargetUser] = useState(null);
  const [items, setItems] = useState([]);
  const [userPerms, setUserPerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patching, setPatching] = useState({});
  const [sectionActive, setSectionActive] = useState(true);
  const [sectionBusy, setSectionBusy] = useState(false);

  // ── fetch global nav
  useEffect(() => {
    getNav()
      .then((res) => {
        const data = res.data.data ?? res.data;

        //  FIX: handle array response
        if (Array.isArray(data)) {
          setItems(data);
          setSectionActive(true); // or default
        } else {
          setItems(data.items ?? data.navItems ?? []);
          setSectionActive(data.isActive ?? true);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ── fetch user permissions ─
  useEffect(() => {
    if (!userId) {
      setUserPerms(null);
      setTargetUser(null);
      return;
    }
    fetchUserPermissions(userId).then((data) => {
      setUserPerms(
        data.permissions?.navItems ?? { isActive: true, allowedItems: [] },
      );
      setTargetUser({ name: data.name, email: data.email });
    });
  }, [userId]);

  const isItemAllowed = (itemId) => {
    if (!isUserMode || !userPerms) return true;
    const allowed = (userPerms.allowedItems ?? []).map(String);
    return allowed.includes(String(itemId));
  };

  const displayItems = items.map((item) => ({
    ...item,
    name: item.label,
    icon: colorIconMap[item.color] ?? "🔗",
    desc: item.path,
    isActive: isUserMode ? isItemAllowed(item._id) : item.isActive,
  }));

  const displaySectionActive = isUserMode
    ? (userPerms?.isActive ?? true)
    : sectionActive;

  // ── section toggle
  const handleSectionToggle = async () => {
    if (isUserMode) {
      const newActive = !displaySectionActive;
      setUserPerms((prev) => ({ ...prev, isActive: newActive }));
      await toggleNavSection(userId, newActive);
    } else {
      const newActive = !sectionActive;
      setSectionBusy(true);
      try {
        //  call global section toggle API
        await toggleGlobalNavSection(newActive);
        setSectionActive(newActive);
        //  flip all items locally
        setItems((prev) => prev.map((n) => ({ ...n, isActive: newActive })));
      } finally {
        setSectionBusy(false);
      }
    }
  };

  // ── item toggle
  const handleItemToggle = async (item) => {
    const itemId = item._id;
    setPatching((prev) => ({ ...prev, [itemId]: true }));
    try {
      if (isUserMode) {
        const currentAllowed = (userPerms?.allowedItems ?? []).map(String);
        const isCurrentlyActive = currentAllowed.includes(String(itemId));
        const newActive = !isCurrentlyActive;
        const newAllowed = newActive
          ? [...currentAllowed, String(itemId)]
          : currentAllowed.filter((id) => id !== String(itemId));

        setUserPerms((prev) => ({ ...prev, allowedItems: newAllowed }));
        await toggleNavItemPerm(userId, itemId, newActive);
      } else {
        //  use item._id (MongoDB ObjectId) not item.id (string)
        const newActive = !item.isActive;
        await toggleGlobalNavItem(itemId, { isActive: newActive });
        setItems((prev) =>
          prev.map((n) =>
            String(n._id) === String(itemId)
              ? { ...n, isActive: newActive }
              : n,
          ),
        );
      }
    } finally {
      setPatching((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  return (
    <div className="p-6 min-h-screen text-slate-200">
      <div className="mb-6 pb-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-slate-100 tracking-tight">
          Navigation Controls
        </h2>

        {isUserMode && targetUser && (
          <div className="mt-3 flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 rounded-lg px-3 py-2">
            <span className="text-blue-400 text-sm">👤</span>
            <p className="text-xs text-blue-300">
              Editing permissions for{" "}
              <span className="font-semibold">{targetUser.name}</span>
              <span className="text-blue-400/60 ml-1">
                ({targetUser.email})
              </span>
              {" — "}toggles here only affect this user.
            </p>
          </div>
        )}

        {!isUserMode && (
          <p className="text-xs text-slate-500 mt-0.5">
            Global mode — changes affect all users.
          </p>
        )}
      </div>

      <StepSection
        step={1}
        title="Navigation Items"
        items={displayItems}
        loading={loading}
        error={error}
        sectionActive={displaySectionActive}
        sectionBusy={sectionBusy}
        patching={patching}
        onSectionToggle={handleSectionToggle}
        onItemToggle={handleItemToggle}
      />
    </div>
  );
}
