// Shared Toggle switch used across all steps
export const Toggle = ({ active, onToggle, busy }) => (
  <button
    onClick={() => !busy && onToggle()}
    role="switch"
    aria-checked={active}
    className="focus:outline-none shrink-0"
  >
    <div
      className={[
        "flex items-center w-10 h-5 rounded-full px-0.5 transition-colors duration-200",
        busy ? "opacity-50" : "",
        active ? "bg-blue-500" : "bg-slate-600",
      ].join(" ")}
    >
      <div
        className={[
          "w-4 h-4 bg-white rounded-full shadow transition-transform duration-200",
          active ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </div>
  </button>
);

export default function StepSection({
  step,
  title,
  items,
  loading,
  error,
  sectionActive,
  sectionBusy,
  patching,
  onSectionToggle,
  onItemToggle,
  renderBadge,
}) {
  return (
    <div className="mt-8">
      {/* Step header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 bg-blue-500/15 border border-blue-500/25 px-2 py-0.5 rounded-full">
            Step {step}
          </span>
          <span className="text-sm font-medium text-slate-300">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          {sectionBusy && (
            <span className="text-[10px] text-slate-500 animate-pulse">
              Saving…
            </span>
          )}
          <Toggle
            active={sectionActive}
            onToggle={onSectionToggle}
            busy={sectionBusy}
          />
        </div>
      </div>

      {/* States */}
      {loading && (
        <p className="text-center text-slate-500 text-sm py-10">Loading…</p>
      )}
      {error && (
        <p className="text-center text-red-400 text-sm py-10">{error}</p>
      )}

      {/* Card grid */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map((item) => {
            const busy = !!patching[item._id];
            return (
              <div
                key={item._id}
                className={[
                  "relative flex flex-col gap-2 rounded-lg border p-3 bg-white/[0.03] transition-all duration-200",
                  item.isActive ? "border-blue-500/40" : "border-white/[0.07]",
                  busy ? "opacity-60 pointer-events-none" : "",
                ].join(" ")}
              >
                {/* Optional badge (e.g. tag) */}
                {renderBadge?.(item)}

                <span className="text-xl leading-none">{item.icon}</span>

                <span className="text-xs font-semibold text-slate-100 leading-tight pr-6">
                  {item.name}
                </span>

                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 m-0">
                  {item.desc}
                </p>

                <div className="flex items-center gap-2 mt-auto pt-1">
                  <Toggle
                    active={item.isActive}
                    onToggle={() => onItemToggle(item)}
                    busy={busy}
                  />
                  <span className="text-[10px] text-slate-500">
                    {busy ? (
                      <span className="animate-pulse">Saving…</span>
                    ) : item.isActive ? (
                      "On"
                    ) : (
                      "Off"
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
