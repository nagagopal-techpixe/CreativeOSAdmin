import { useEffect, useState } from "react";
import {
  getVoicePacing,
  patchVoicePacing,
  toggleVoicePacingSection,
} from "../../services/voice";
import { useStepPermissions } from "../../hooks/useStepPermissions";
import { Toggle } from "../../components/Stepsection";

export default function VoicePacingStep({ userId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectionActive, setSectionActive] = useState(true);
  const [sectionBusy, setSectionBusy] = useState(false);
  const [patching, setPatching] = useState({});

  const { isUserMode, displayItems, displaySectionActive, userSectionToggle, userItemToggle } =
    useStepPermissions({ userId, sectionKey: "pacing", globalItems: items, globalIsActive: sectionActive, builderKey: "voiceBuilder" });

  useEffect(() => {
    getVoicePacing()
      .then((data) => { setItems(data.items); setSectionActive(data.isActive); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSectionToggle = async () => {
    if (isUserMode) {
      await userSectionToggle(displaySectionActive);
    } else {
      setSectionBusy(true);
      try {
        await toggleVoicePacingSection({ isActive: !sectionActive });
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
        await patchVoicePacing(itemId, { isActive: !item.isActive });
        setItems((prev) =>
          prev.map((t) => (t._id === itemId ? { ...t, isActive: !t.isActive } : t))
        );
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setPatching((p) => ({ ...p, [itemId]: false }));
    }
  };

  return (
    <div className="mt-8">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 rounded-full">
            Step 3
          </span>
          <span className="text-sm font-medium text-slate-300">
            Delivery Pacing
          </span>
        </div>
        <div className="flex items-center gap-2">
          {sectionBusy && (
            <span className="text-[10px] text-slate-500 animate-pulse">Saving…</span>
          )}
          <Toggle
            active={displaySectionActive}
            onToggle={handleSectionToggle}
            busy={sectionBusy}
          />
        </div>
      </div>

      {loading && (
        <p className="text-center text-slate-500 text-sm py-10">Loading pacing…</p>
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
                title={item.val}
                className={[
                  "relative flex flex-col items-center justify-center gap-1.5 px-4 h-16 rounded-xl border cursor-pointer select-none transition-all duration-200",
                  item.isActive
                    ? "bg-blue-500/10 border-blue-500/40"
                    : "bg-white/[0.02] border-white/[0.07]",
                  busy ? "opacity-50 pointer-events-none" : "hover:border-white/20",
                ].join(" ")}
              >
                <span className={[
                  "text-sm font-bold leading-none whitespace-nowrap",
                  item.isActive ? "text-blue-200" : "text-slate-400",
                ].join(" ")}>
                  {item.label}
                </span>

                <span className="text-[10px] text-slate-600 leading-none line-clamp-1 max-w-[120px] text-center">
                  {item.val}
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