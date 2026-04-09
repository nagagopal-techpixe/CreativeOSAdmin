// pages/storyboard/StoryboardDetailsStep.jsx
import { useEffect, useState } from "react";
import {
  getStoryboardDetails,
  toggleStoryboardDetailsSection,
  toggleStoryboardDetailGroup,
  toggleStoryboardDetailOpt,
} from "../../services/storyboard";
import {
  fetchUserPermissions,
  toggleStoryboardDetailsSection as toggleUserStoryboardDetailsSection,
  toggleStoryboardDetailsGroup,
  toggleStoryboardDetailsOpt,
} from "../../services/users";
import { Toggle } from "../../components/Stepsection";

export default function StoryboardDetailsStep({ userId }) {
  const isUserMode = !!userId;

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionActive, setSectionActive] = useState(true);
  const [sectionBusy, setSectionBusy] = useState(false);
  const [groupBusy, setGroupBusy] = useState({});
  const [optBusy, setOptBusy] = useState({});
  const [userPerms, setUserPerms] = useState(null);

  // ── Load global data
  useEffect(() => {
    getStoryboardDetails()
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
      const dp = data.permissions?.storyboardBuilder?.details ?? {
        isActive: true,
        allowedGroups: [],
        allowedOpts: {},
      };
      setUserPerms(dp);
      setSectionActive(dp.isActive ?? true);
    });
  }, [userId]);

  // ── Derived display
  const isGroupAllowed = (groupId) => {
    if (!isUserMode || !userPerms) return true;

    const ag = userPerms.allowedGroups;

    //  undefined → allow all (initial load)
    if (ag === undefined) return true;

    //  empty → none selected
    return ag.map(String).includes(String(groupId));
  };

  const isOptAllowed = (groupId, optId) => {
    if (!isUserMode || !userPerms) return true;

    const ao = userPerms.allowedOpts?.[groupId];

    //  undefined → allow all
    if (ao === undefined) return true;

    return ao.map(String).includes(String(optId));
  };

  const displayGroups =
    isUserMode && userPerms
      ? groups.map((g) => ({
          ...g,
          isActive: g.isActive && isGroupAllowed(g._id), //  FIX
          opts: g.opts.map((o) => ({
            ...o,
            isActive: o.isActive && isOptAllowed(g._id, o._id), //  FIX
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

      //  only update userPerms
      setUserPerms((prev) => ({ ...prev, isActive: newActive }));

      await toggleUserStoryboardDetailsSection(userId, newActive);
    } else {
      setSectionBusy(true);
      try {
        await toggleStoryboardDetailsSection({ isActive: !sectionActive });
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
        const currentAllowed = (userPerms?.allowedGroups ?? []).map(String);

        let newAllowed;
        if (currentAllowed.length === 0) {
          // empty = all allowed → expand to all then remove this one
          newAllowed = groups
            .map((g) => String(g._id))
            .filter((id) => id !== gId);
        } else {
          const isAllowed = currentAllowed.includes(gId);
          newAllowed = isAllowed
            ? currentAllowed.filter((id) => id !== gId)
            : [...currentAllowed, gId];
        }

        setUserPerms((prev) => ({ ...prev, allowedGroups: newAllowed }));
        await toggleStoryboardDetailsGroup(
          userId,
          gId,
          newAllowed.includes(gId),
        );
      } else {
        await toggleStoryboardDetailGroup(gId, { isActive: !group.isActive });
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

  // ── Opt toggle
  const handleOptToggle = async (group, opt) => {
    const gId = String(group._id);
    const oId = String(opt._id);
    setOptBusy((p) => ({ ...p, [oId]: true }));
    try {
      if (isUserMode) {
        const currentAllowed = (userPerms?.allowedOpts?.[gId] ?? []).map(
          String,
        );
        const isAllowed = currentAllowed.includes(oId);
        const newAllowed = isAllowed
          ? currentAllowed.filter((id) => id !== oId)
          : [...currentAllowed, oId];

        setUserPerms((prev) => ({
          ...prev,
          allowedOpts: { ...prev.allowedOpts, [gId]: newAllowed },
        }));
        await toggleStoryboardDetailsOpt(userId, gId, oId, !isAllowed);
      } else {
        await toggleStoryboardDetailOpt(gId, oId, { isActive: !opt.isActive });
        setGroups((prev) =>
          prev.map((g) =>
            g._id !== group._id
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

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 rounded-full">
            Step 4
          </span>
          <span className="text-sm font-medium text-slate-300">
            Elements & Annotations
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

                <div className="flex flex-wrap gap-2 p-4">
                  {group.opts.map((opt) => {
                    const oBusy = !!optBusy[opt._id];
                    return (
                      <button
                        key={opt._id}
                        onClick={() => !oBusy && handleOptToggle(group, opt)}
                        disabled={oBusy}
                        title={opt.val}
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
