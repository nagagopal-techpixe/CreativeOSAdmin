// pages/image/ImageCategoriesStep.jsx
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import {
  getImageCategories,
  toggleImageCategoriesSection,
  toggleImageCategoryGroup,
  toggleImageCategoryItem,
} from "../../services/image";
import {
  fetchUserPermissions,
  toggleImageCategoriesSection as toggleUserImageCategoriesSection,
  toggleImageCategoriesGroup,
  toggleImageCategoriesItem,
} from "../../services/users";
import { Toggle } from "../../components/Stepsection";

function LucideIcon({ name, className }) {
  const Icon = Icons[name];
  if (!Icon) return null;
  return <Icon className={className} size={16} />;
}

export default function ImageCategoriesStep({ userId }) {
  const isUserMode = !!userId;

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionActive, setSectionActive] = useState(true);
  const [sectionBusy, setSectionBusy] = useState(false);
  const [groupBusy, setGroupBusy] = useState({});
  const [itemBusy, setItemBusy] = useState({});
  const [userPerms, setUserPerms] = useState(null);

  // ── Load global data
  useEffect(() => {
    getImageCategories()
      .then((data) => {
        setGroups(data.items);
        setSectionActive(data.isActive);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Load user permissions
  useEffect(() => {
    if (!userId) return;
    fetchUserPermissions(userId).then((data) => {
      const cp = data.permissions?.imageBuilder?.categories ?? {
        isActive: true,
        allowedGroups: null,
        allowedOpts: {},
      };
      setUserPerms(cp);
      setSectionActive(cp.isActive ?? true);
    });
  }, [userId]);

  // ── Derived display
  const isGroupAllowed = (groupId) => {
    if (!isUserMode || !userPerms) return true;
    const ag = userPerms.allowedGroups;
    if (ag === null || ag === undefined) return true; // null = all allowed
    return ag.map(String).includes(String(groupId)); // [] = none allowed
  };

  const isItemAllowed = (groupId, itemId) => {
    if (!isUserMode || !userPerms) return true;
    const ao = userPerms.allowedOpts;

    if (!ao) return true; // allowedOpts missing → all allowed
    if (!(groupId in ao)) return true; // group key missing → all allowed

    const groupOpts = ao[groupId];
    if (groupOpts === null || groupOpts === undefined) return true; // null = all allowed

    return groupOpts.map(String).includes(String(itemId)); // [] = none allowed
  };

  const displayGroups =
    isUserMode && userPerms
      ? groups.map((g) => ({
          ...g,
          isActive: isGroupAllowed(g._id),
          items: g.items.map((i) => ({
            ...i,
            isActive: isItemAllowed(g._id, i._id),
          })),
        }))
      : groups;

  const displaySectionActive = isUserMode
    ? (userPerms?.isActive ?? true)
    : sectionActive;

  // ── Section toggle
  const handleSectionToggle = async () => {
    if (isUserMode) {
      const newActive = !displaySectionActive;
      setUserPerms((prev) => ({ ...prev, isActive: newActive }));
      setSectionActive(newActive);
      await toggleUserImageCategoriesSection(userId, newActive);
    } else {
      setSectionBusy(true);
      try {
        await toggleImageCategoriesSection({ isActive: !sectionActive });
        setSectionActive((p) => !p);
      } finally {
        setSectionBusy(false);
      }
    }
  };

  // ── Group toggle
  const handleGroupToggle = async (group) => {
    const gId = String(group._id);
    setGroupBusy((p) => ({ ...p, [gId]: true }));

    try {
      if (isUserMode) {
        const currentAllowed = userPerms?.allowedGroups;

        let newAllowed;
        if (currentAllowed === null || currentAllowed === undefined) {
          // null = all on → turning one OFF = all except this one
          newAllowed = groups
            .map((g) => String(g._id))
            .filter((id) => id !== gId);
        } else {
          // explicit array → normal toggle
          const isAllowed = currentAllowed.map(String).includes(gId);
          newAllowed = isAllowed
            ? currentAllowed.filter((id) => id !== gId)
            : [...currentAllowed, gId];
        }

        setUserPerms((prev) => ({ ...prev, allowedGroups: newAllowed }));
        await toggleImageCategoriesGroup(userId, gId, newAllowed.includes(gId));
      } else {
        await toggleImageCategoryGroup(gId, { isActive: !group.isActive });
        setGroups((prev) =>
          prev.map((g) =>
            g._id === gId ? { ...g, isActive: !g.isActive } : g,
          ),
        );
      }
    } finally {
      setGroupBusy((p) => ({ ...p, [gId]: false }));
    }
  };

  // ── Item toggle
  const handleItemToggle = async (group, item) => {
    const gId = String(group._id);
    const iId = String(item._id);
    setItemBusy((p) => ({ ...p, [iId]: true }));

    try {
      if (isUserMode) {
        const ao = userPerms?.allowedOpts;
        const currentAllowed =
          !ao || !(gId in ao) || ao[gId] === null || ao[gId] === undefined
            ? null
            : ao[gId].map(String);

        let newAllowed;
        if (currentAllowed === null) {
          // null / missing key = all on → turning one OFF = all items except this one
          const allItemIds =
            groups
              .find((g) => String(g._id) === gId)
              ?.items.map((i) => String(i._id)) ?? [];
          newAllowed = allItemIds.filter((id) => id !== iId);
        } else {
          // explicit array → normal toggle
          const isAllowed = currentAllowed.includes(iId);
          newAllowed = isAllowed
            ? currentAllowed.filter((id) => id !== iId)
            : [...currentAllowed, iId];
        }

        setUserPerms((prev) => ({
          ...prev,
          allowedOpts: { ...prev.allowedOpts, [gId]: newAllowed },
        }));
        await toggleImageCategoriesItem(
          userId,
          gId,
          iId,
          newAllowed.includes(iId),
        );
      } else {
        await toggleImageCategoryItem(gId, iId, { isActive: !item.isActive });
        setGroups((prev) =>
          prev.map((g) =>
            g._id !== group._id
              ? g
              : {
                  ...g,
                  items: g.items.map((i) =>
                    i._id === iId ? { ...i, isActive: !i.isActive } : i,
                  ),
                },
          ),
        );
      }
    } finally {
      setItemBusy((p) => ({ ...p, [iId]: false }));
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 rounded-full">
            Step A
          </span>
          <span className="text-sm font-medium text-slate-300">Categories</span>
        </div>
        <div className="flex items-center gap-2">
          {sectionBusy && (
            <span className="text-[10px] text-slate-500 animate-pulse">
              Saving…
            </span>
          )}
          <Toggle
            active={displaySectionActive}
            onToggle={handleSectionToggle}
            busy={sectionBusy}
          />
        </div>
      </div>

      {loading && (
        <p className="text-center text-slate-500 text-sm py-10">
          Loading categories…
        </p>
      )}
      {error && (
        <p className="text-center text-red-400 text-sm py-10">{error}</p>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-4">
          {displayGroups.map((group) => {
            const gBusy = !!groupBusy[group._id];
            return (
              <div
                key={group._id}
                className={[
                  "rounded-xl border transition-all duration-200",
                  group.isActive
                    ? "border-white/10 bg-white/[0.02]"
                    : "border-white/[0.05] bg-white/[0.01] opacity-60",
                ].join(" ")}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-200 capitalize">
                      {group.id}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-white/[0.05] px-1.5 py-0.5 rounded">
                      {group.id}
                    </span>
                    <span className="text-[10px] text-slate-600">
                      {group.items.filter((i) => i.isActive).length}/
                      {group.items.length} active
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {gBusy && (
                      <span className="text-[10px] text-slate-500 animate-pulse">
                        Saving…
                      </span>
                    )}
                    <Toggle
                      active={group.isActive}
                      onToggle={() => !gBusy && handleGroupToggle(group)}
                      busy={gBusy}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
                  {group.items.map((item) => {
                    const iBusy = !!itemBusy[item._id];
                    return (
                      <div
                        key={item._id}
                        onClick={() => !iBusy && handleItemToggle(group, item)}
                        className={[
                          "relative flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer select-none transition-all duration-150",
                          item.isActive
                            ? "bg-white/[0.03] border-white/10"
                            : "bg-transparent border-white/[0.05] opacity-50",
                          iBusy
                            ? "pointer-events-none"
                            : "hover:border-white/20",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150",
                            item.isActive
                              ? item.color
                              : "bg-white/[0.04] text-slate-600",
                          ].join(" ")}
                        >
                          <LucideIcon name={item.icon} className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={[
                              "text-xs font-semibold leading-tight truncate",
                              item.isActive
                                ? "text-slate-100"
                                : "text-slate-500",
                            ].join(" ")}
                          >
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-600 leading-tight truncate mt-0.5">
                            {item.desc}
                          </p>
                        </div>

                        <div className="shrink-0 flex flex-col items-end gap-1">
                          <span className="text-[10px] text-slate-600 font-mono">
                            {item.count}
                          </span>
                          <span
                            className={[
                              "w-1.5 h-1.5 rounded-full",
                              item.isActive ? "bg-blue-400" : "bg-slate-700",
                            ].join(" ")}
                          />
                        </div>

                        {iBusy && (
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400 animate-pulse bg-black/20 rounded-lg">
                            …
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
