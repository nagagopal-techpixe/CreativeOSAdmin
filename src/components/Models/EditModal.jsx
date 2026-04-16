import { useState } from "react";
import { Pencil, X, Save, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { updateModel } from "../../services/Modelsapi.js";

// ─── EditModal ────────────────────────────────────────────────────────────────
const EditModal = ({ model, onClose, onSave }) => {
  const [form, setForm] = useState({
    model_name: model.model_name,
    link:       model.link,
  });

  const [attributes, setAttributes] = useState(
    Array.isArray(model.model_attributes) && model.model_attributes.length > 0
      ? model.model_attributes.map((a) => ({ ...a }))
      : []
  );

  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  // ── form field change ──────────────────────────────────────────────────────
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ── attribute helpers ──────────────────────────────────────────────────────
  const addAttribute = () =>
    setAttributes((prev) => [
      ...prev,
      { name: "", dtype: "", value: "", isActive: true },
    ]);

  const removeAttribute = (idx) =>
    setAttributes((prev) => prev.filter((_, i) => i !== idx));

  const updateAttribute = (idx, field, value) =>
    setAttributes((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
    );

  const toggleActive = (idx) =>
    setAttributes((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, isActive: !a.isActive } : a))
    );

  // ── submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.model_name.trim() || !form.link.trim()) {
      setError("Model name and link are required");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const payload = {
        ...form,
        model_attributes: attributes.filter((a) => a.name.trim() && a.dtype.trim()),
      };
      const res = await updateModel(model._id, payload);
      onSave(res.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh]">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 rounded-t-[2rem] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-black">
              <Pencil size={16} />
            </div>
            <div>
              <h2 className="text-lg font-black">Edit Model</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                {model._id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-1"
          >
            <X size={22} />
          </button>
        </div>

        {/* ── Scrollable Body ────────────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 p-8 space-y-7">

          {/* Model Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
              Model Name
            </label>
            <input
              name="model_name"
              value={form.model_name}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-600 text-white"
              placeholder="e.g. GPT-4o"
            />
          </div>

          {/* Endpoint Link */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
              Endpoint Link
            </label>
            <input
              name="link"
              value={form.link}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-mono outline-none focus:border-zinc-600 text-white"
              placeholder="https://api.provider.com/v1/..."
            />
          </div>

          {/* ── Attributes ────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Attributes
              </label>
              {/* <button
                onClick={addAttribute}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus size={12} /> Add
              </button> */}
            </div>

            {attributes.length === 0 && (
              <p className="text-[11px] text-zinc-600 font-mono text-center py-4 border border-dashed border-zinc-800 rounded-xl">
                No attributes — click Add to define one
              </p>
            )}

            {/* Column headers */}
            {attributes.length > 0 && (
              <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 px-1">
                {["Key", "Type", "Value", "Active", ""].map((h) => (
                  <span
                    key={h}
                    className="text-[9px] font-black text-zinc-600 uppercase tracking-widest"
                  >
                    {h}
                  </span>
                ))}
              </div>
            )}

            {/* Attribute rows */}
            <div className="space-y-2">
              {attributes.map((attr, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 items-center p-3 rounded-xl border transition-colors ${
                    attr.isActive
                      ? "bg-zinc-900 border-zinc-800"
                      : "bg-zinc-900/40 border-zinc-800/50 opacity-60"
                  }`}
                >
                  {/* name */}
                  <input
                    value={attr.name}
                    onChange={(e) => updateAttribute(idx, "name", e.target.value)}
                    placeholder="e.g. temperature"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-zinc-500 text-white w-full"
                  />

                  {/* dtype */}
                  <input
                    value={attr.dtype}
                    onChange={(e) => updateAttribute(idx, "dtype", e.target.value)}
                    placeholder="e.g. float"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-zinc-500 text-white w-full"
                  />

                  {/* value */}
                  <input
                    value={attr.value ?? ""}
                    onChange={(e) => updateAttribute(idx, "value", e.target.value)}
                    placeholder="e.g. 0.7"
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-zinc-500 text-white w-full"
                  />

                  {/* isActive toggle */}
                  <button
                    onClick={() => toggleActive(idx)}
                    className={`transition-colors ${
                      attr.isActive
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-zinc-600 hover:text-zinc-400"
                    }`}
                    title={attr.isActive ? "Active — click to disable" : "Inactive — click to enable"}
                  >
                    {attr.isActive ? (
                      <ToggleRight size={26} />
                    ) : (
                      <ToggleLeft size={26} />
                    )}
                  </button>

                  {/* remove */}
                  {/* <button
                    onClick={() => removeAttribute(idx)}
                    className="text-zinc-600 hover:text-red-400 transition-colors"
                    title="Remove attribute"
                  >
                    <Trash2 size={16} />
                  </button> */}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 font-mono">{error}</p>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="p-6 bg-zinc-900/80 border-t border-zinc-800 flex gap-4 rounded-b-[2rem] shrink-0">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-bold transition-colors border border-zinc-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-[2] py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditModal;