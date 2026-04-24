import { useEffect, useState } from "react";
import {
  getVideoDetails,
  toggleDetailsSection,
  toggleDetailGroup,
  toggleDetailOpt,
} from "../../services/video";
import {
  fetchUserPermissions,
  toggleUserDetailsSection,
  toggleUserDetailsGroup,
  toggleUserDetailsOpt,
} from "../../services/users";
import { Toggle } from "../../components/Stepsection";

export default function VideoDetailsStep({ userId }) {
  const isUserMode = !!userId;

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionActive, setSectionActive] = useState(true);
  const [sectionBusy, setSectionBusy] = useState(false);
  const [groupBusy, setGroupBusy] = useState({});
  const [optBusy, setOptBusy] = useState({});

  // User permissions state
  const [userPerms, setUserPerms] = useState(null);
  // Structure: { allowedGroups: [groupId], allowedOpts: { [groupId]: [optId] }, isActive: bool }

  //  Load global data
  useEffect(() => {
    getVideoDetails()
      .then((data) => {
        setGroups(data.items);
        setSectionActive(data.isActive);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  //  Load user permissions if in user mode
  useEffect(() => {
    if (!userId) return;
    fetchUserPermissions(userId).then((data) => {
      const dp = data.permissions?.videoBuilder?.details ?? {
        isActive: true,
        allowedGroups: [], // [] = all allowed
        allowedOpts: {}, // { groupId: [optId, ...] } — [] = all allowed
      };
      setUserPerms(dp);
      setSectionActive(dp.isActive ?? true);
    });
  }, [userId]);

  //  Save user permissions helper
  const persistUserPerms = async (newDetailPerms) => {
    setUserPerms(newDetailPerms);
    await saveUserPermissions(userId, "details", newDetailPerms); //  "details" as sectionKey
  };

  //  Is group allowed for user?
  const isGroupAllowed = (groupId) => {
    if (!isUserMode || !userPerms) return true;
    const ag = userPerms.allowedGroups ?? [];
    return ag.length === 0 || ag.includes(groupId);
  };

  //  Is opt allowed for user?
  const isOptAllowed = (groupId, optId) => {
    if (!isUserMode || !userPerms) return true;
    const ao = userPerms.allowedOpts?.[groupId] ?? [];
    return ao.length === 0 || ao.includes(optId);
  };

  //  Display groups with user permissions overlaid
  const displayGroups =
    isUserMode && userPerms
      ? groups.map((g) => ({
          ...g,
          isActive: isGroupAllowed(g._id),
          opts: g.opts.map((o) => ({
            ...o,
            isActive: isOptAllowed(g._id, o._id),
          })),
        }))
      : groups;

  const displaySectionActive = isUserMode
    ? (userPerms?.isActive ?? true)
    : sectionActive;

  const handleSectionToggle = async () => {
    if (isUserMode) {
      const newActive = !displaySectionActive;
      setUserPerms((prev) => ({ ...prev, isActive: newActive }));
      await toggleUserDetailsSection(userId, newActive);
    } else {
      setSectionBusy(true);
      try {
        await toggleDetailsSection({ isActive: !sectionActive });
        setSectionActive((p) => !p);
      } finally {
        setSectionBusy(false);
      }
    }
  };

  const handleGroupToggle = async (group) => {
    const gId = group._id;
    setGroupBusy((p) => ({ ...p, [gId]: true }));
    try {
      if (isUserMode) {
        const currentAllowed = (userPerms?.allowedGroups ?? []).map(String);
        const isCurrentlyActive = currentAllowed.includes(String(gId));
        const newActive = !isCurrentlyActive;
        const newAllowed = newActive
          ? [...currentAllowed, String(gId)]
          : currentAllowed.filter((id) => id !== String(gId));
        setUserPerms((prev) => ({ ...prev, allowedGroups: newAllowed }));
        await toggleUserDetailsGroup(userId, gId, newActive);
      } else {
        await toggleDetailGroup(gId, { isActive: !group.isActive });
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

  const handleOptToggle = async (group, opt) => {
    const gId = group._id;
    const oId = opt._id;
    setOptBusy((p) => ({ ...p, [oId]: true }));
    try {
      if (isUserMode) {
        const currentAllowed = (userPerms?.allowedOpts?.[gId] ?? []).map(
          String,
        );
        const isCurrentlyActive = currentAllowed.includes(String(oId));
        const newActive = !isCurrentlyActive;
        const newAllowed = newActive
          ? [...currentAllowed, String(oId)]
          : currentAllowed.filter((id) => id !== String(oId));
        setUserPerms((prev) => ({
          ...prev,
          allowedOpts: { ...prev?.allowedOpts, [gId]: newAllowed },
        }));
        await toggleUserDetailsOpt(userId, gId, oId, newActive);
      } else {
        await toggleDetailOpt(gId, oId, { isActive: !opt.isActive });
        setGroups((prev) =>
          prev.map((g) =>
            g._id !== gId
              ? g
              : {
                  ...g,
                  opts: g.opts.map((o) =>
                    o._id === oId ? { ...o, isActive: !o.isActive } : o,
                  ),
                },
          ),
        );
      }
    } finally {
      setOptBusy((p) => ({ ...p, [oId]: false }));
    }
  };

  //
  // RENDER
  //
  return (
    <div className="mt-8">
      {/* Step header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 rounded-full">
            Step 3
          </span>
          <span className="text-sm font-medium text-slate-300">
            Details — smart multiple selection
          </span>
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
          Loading details…
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
                {/* Group header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-200">
                      {group.title}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-white/[0.05] px-1.5 py-0.5 rounded">
                      {group.group}
                    </span>
                    <span className="text-[10px] text-slate-600">
                      {group.opts.filter((o) => o.isActive).length}/
                      {group.opts.length} active
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

                {/* Opts */}
                <div className="flex flex-wrap gap-2 p-4">
                  {group.opts.map((opt) => {
                    const oBusy = !!optBusy[opt._id];
                    return (
                      <button
                        key={opt._id}
                        onClick={() => !oBusy && handleOptToggle(group, opt)}
                        disabled={oBusy}
                        className={[
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150",
                          opt.isActive
                            ? "bg-blue-500/15 border-blue-500/40 text-blue-200"
                            : "bg-white/[0.03] border-white/[0.07] text-slate-500",
                          oBusy
                            ? "opacity-50 cursor-wait"
                            : "cursor-pointer hover:border-white/20",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            opt.isActive ? "bg-blue-400" : "bg-slate-600",
                          ].join(" ")}
                        />
                        {opt.label}
                        {oBusy && (
                          <span className="ml-1 animate-pulse text-[10px]">
                            …
                          </span>
                        )}
                      </button>
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
