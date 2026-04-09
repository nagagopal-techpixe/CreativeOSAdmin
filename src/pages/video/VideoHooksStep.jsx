import { useEffect, useState } from "react";
import {
  getVideoHooks,
  toggleHooksSection,
  patchHook,
} from "../../services/video";
import { useStepPermissions } from "../../hooks/useStepPermissions";
import { Toggle } from "../../components/Stepsection";

export default function VideoHooksStep({ userId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionActive, setSectionActive] = useState(true);
  const [sectionBusy, setSectionBusy] = useState(false);
  const [patching, setPatching] = useState({});

  const {
    isUserMode,
    displayItems,
    displaySectionActive,
    userSectionToggle,
    userItemToggle,
  } = useStepPermissions({
    userId,
    sectionKey: "hooks",
    globalItems: items,
    globalIsActive: sectionActive,
  });

  useEffect(() => {
    getVideoHooks()
      .then((data) => {
        setItems(data.items);
        setSectionActive(data.isActive);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSectionToggle = async () => {
    if (isUserMode) {
      await userSectionToggle(displaySectionActive);
    } else {
      setSectionBusy(true);
      try {
        await toggleHooksSection({ isActive: !sectionActive });
        setSectionActive((p) => !p);
      } catch (err) {
        console.error(err.message);
      } finally {
        setSectionBusy(false);
      }
    }
  };

  const handleItemToggle = async (item) => {
    const itemId = item._id;
    setPatching((p) => ({ ...p, [itemId]: true }));
    try {
      if (isUserMode) {
        await userItemToggle(item);
      } else {
        await patchHook(itemId, { isActive: !item.isActive });
        setItems((prev) =>
          prev.map((t) =>
            t._id === itemId ? { ...t, isActive: !t.isActive } : t,
          ),
        );
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setPatching((p) => ({ ...p, [itemId]: false }));
    }
  };

  const activeCount = displayItems.filter((i) => i.isActive).length;

  return (
    <div className="mt-8">
      {/* Step 6 header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 rounded-full">
            Step 6
          </span>
          <span className="text-sm font-medium text-slate-300">
            Quick hooks
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

      {/* States */}
      {loading && (
        <p className="text-center text-slate-500 text-sm py-10">
          Loading hooks…
        </p>
      )}
      {error && (
        <p className="text-center text-red-400 text-sm py-10">{error}</p>
      )}

      {/* Single group panel */}
      {!loading && !error && (
        <div
          className={[
            "rounded-xl border transition-all duration-200",
            displaySectionActive
              ? "border-white/10 bg-white/[0.02]"
              : "border-white/[0.05] bg-white/[0.01] opacity-60",
          ].join(" ")}
        >
          {/* Group-style header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-200">
                Opening hooks
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-white/[0.05] px-1.5 py-0.5 rounded">
                hooks
              </span>
              <span className="text-[10px] text-slate-600">
                {activeCount}/{displayItems.length} active
              </span>
            </div>
          </div>

          {/* Pill chips */}
          <div className="flex flex-wrap gap-2 p-4">
            {displayItems.map((item) => {
              const busy = !!patching[item._id];
              return (
                <button
                  key={item._id}
                  onClick={() => !busy && handleItemToggle(item)}
                  disabled={busy}
                  title={item.val}
                  className={[
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150",
                    item.isActive
                      ? "bg-blue-500/15 border-blue-500/40 text-blue-200"
                      : "bg-white/[0.03] border-white/[0.07] text-slate-500",
                    busy
                      ? "opacity-50 cursor-wait"
                      : "cursor-pointer hover:border-white/20",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      item.isActive ? "bg-blue-400" : "bg-slate-600",
                    ].join(" ")}
                  />

                  {item.label}

                  {busy && (
                    <span className="ml-1 animate-pulse text-[10px]">…</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
