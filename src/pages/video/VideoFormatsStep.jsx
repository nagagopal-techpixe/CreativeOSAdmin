// pages/video/VideoFormatsStep.jsx
import { useEffect, useState } from "react";
import {
  getVideoFormats,
  toggleFormatsSection,
  patchFormat,
} from "../../services/video";
import { useStepPermissions } from "../../hooks/useStepPermissions";
import { Toggle } from "../../components/Stepsection";

export default function VideoFormatsStep({ userId }) {
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
    sectionKey: "formats",
    globalItems: items,
    globalIsActive: sectionActive,
  });

  useEffect(() => {
    getVideoFormats()
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
        await toggleFormatsSection({ isActive: !sectionActive });
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
        await patchFormat(itemId, { isActive: !item.isActive });
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
      {/* Step 5 header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 rounded-full">
            Step 5
          </span>
          <span className="text-sm font-medium text-slate-300">
            Format / Platform
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
          Loading formats…
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
                  "relative flex flex-col items-center justify-center gap-2 w-24 rounded-xl border cursor-pointer select-none transition-all duration-200 py-3 px-2",
                  item.isActive
                    ? "bg-blue-500/10 border-blue-500/40"
                    : "bg-white/[0.02] border-white/[0.07]",
                  busy
                    ? "opacity-50 pointer-events-none"
                    : "hover:border-white/20",
                ].join(" ")}
              >
                <div className="flex items-center justify-center w-11 h-11">
                  <div
                    style={{ width: item.w, height: item.h }}
                    className={[
                      "rounded-sm border-2 transition-colors duration-200",
                      item.isActive
                        ? "border-blue-400 bg-blue-500/20"
                        : "border-slate-600 bg-white/[0.03]",
                    ].join(" ")}
                  />
                </div>

                <span
                  className={[
                    "text-base font-bold leading-none",
                    item.isActive ? "text-blue-200" : "text-slate-500",
                  ].join(" ")}
                >
                  {item.label}
                </span>

                <span
                  className={[
                    "text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full leading-none text-center",
                    item.isActive
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-white/[0.04] text-slate-600",
                  ].join(" ")}
                >
                  {item.use}
                </span>

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
