// pages/video/VideoDurationsStep.jsx
import { useEffect, useState } from "react";
import {
  getVideoDurations,
  toggleDurationsSection,
  patchVideoDuration,
} from "../../services/video";
import { useStepPermissions } from "../../hooks/useStepPermissions";
import { Toggle } from "../../components/Stepsection";

export default function VideoDurationsStep({ userId }) {
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
    sectionKey: "durations",
    globalItems: items,
    globalIsActive: sectionActive,
  });

  useEffect(() => {
    getVideoDurations()
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
        await toggleDurationsSection({ isActive: !sectionActive });
        setSectionActive((p) => !p);
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
        await patchVideoDuration(itemId, { isActive: !item.isActive });
        setItems((prev) =>
          prev.map((t) =>
            t._id === itemId ? { ...t, isActive: !t.isActive } : t,
          ),
        );
      }
    } finally {
      setPatching((p) => ({ ...p, [itemId]: false }));
    }
  };

  return (
    <div className="mt-8">
      {/* Step 4 header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 rounded-full">
            Step 4
          </span>
          <span className="text-sm font-medium text-slate-300">
            Video duration
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
          Loading durations…
        </p>
      )}
      {error && (
        <p className="text-center text-red-400 text-sm py-10">{error}</p>
      )}

      {!loading && !error && (
        <div className="flex flex-wrap gap-3">
          {displayItems.map((item) => {
            const busy = !!patching[item._id];
            return (
              <div
                key={item._id}
                onClick={() => !busy && handleItemToggle(item)}
                className={[
                  "relative flex flex-col items-center justify-center gap-1 w-24 h-24 rounded-xl border cursor-pointer select-none transition-all duration-200",
                  item.isActive
                    ? "bg-blue-500/10 border-blue-500/40 text-blue-100"
                    : "bg-white/[0.02] border-white/[0.07] text-slate-500",
                  busy
                    ? "opacity-50 pointer-events-none"
                    : "hover:border-white/20",
                ].join(" ")}
              >
                <span
                  className={[
                    "text-xl font-bold leading-none",
                    item.isActive ? "text-blue-200" : "text-slate-400",
                  ].join(" ")}
                >
                  {item.label}
                </span>

                <span className="text-[10px] text-slate-500 leading-none">
                  {item.val}
                </span>

                {item.unit && (
                  <span
                    className={[
                      "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full mt-0.5",
                      item.isActive
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-white/[0.04] text-slate-600",
                    ].join(" ")}
                  >
                    {item.unit}
                  </span>
                )}

                {busy && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400 animate-pulse bg-black/20 rounded-xl">
                    …
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
