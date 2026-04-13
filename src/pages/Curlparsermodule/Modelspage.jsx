import { useState, useEffect } from "react";
import { Cpu, Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAllModels, updateModel,deleteModel  } from "../../services/Modelsapi.js";

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const colors = {
    online:  "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    offline: "bg-zinc-800 text-zinc-500 border border-zinc-700",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${colors[status] || colors.online}`}>
      {status}
    </span>
  );
};

// ─── EditModal ────────────────────────────────────────────────────────────────
const EditModal = ({ model, onClose, onSave }) => {
  const [form, setForm] = useState({
    model_name: model.model_name,
    link:       model.link,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.model_name.trim() || !form.link.trim()) {
      setError("Model name and link are required");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const res = await updateModel(model._id, form);
      onSave(res.data.data);          // pass updated doc back to parent
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-[2rem] shadow-2xl flex flex-col">

        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 rounded-t-[2rem]">
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
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-1">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-5">

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

          {error && (
            <p className="text-xs text-red-400 font-mono">{error}</p>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 bg-zinc-900/80 border-t border-zinc-800 flex gap-4 rounded-b-[2rem]">
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

// ─── ModelsPage ───────────────────────────────────────────────────────────────
export default function ModelsPage() {
  const [models, setModels]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [editTarget, setEditTarget] = useState(null); // model being edited
  const navigate                    = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAllModels();
        setModels(res.data.data);
      } catch (err) {
        setError(err.message || "Failed to load models");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Merge updated model back into list (no re-fetch needed)
  const handleSave = (updated) =>
    setModels((prev) =>
      prev.map((m) => (m._id === updated._id ? updated : m))
    );

const handleDelete = async (id) => {
    try {
        await deleteModel(id);
        setModels((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
        console.error("Delete failed:", err.response?.data?.message || err.message);
    }
};

  return (
    <div className="flex flex-col w-full min-h-screen text-white">

      {/* Header */}
      <div className="px-8 py-8 border-b border-zinc-800 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Models</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">
            Active core models
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/tool/curl-parser")}
          className="flex items-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-zinc-200 transition-colors"
        >
          <Plus size={16} /> New Model
        </button>
      </div>

      {/* Model list */}
      <div className="flex-1 px-8 py-6 space-y-3">

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 opacity-40">
            <Cpu size={36} className="animate-pulse" />
            <p className="text-xs font-black uppercase tracking-widest">Loading…</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-16">
            <p className="text-xs text-red-400 font-mono">{error}</p>
          </div>
        )}

        {!loading && !error && models.map((model) => (
          <div
            key={model._id}
            className="flex items-center justify-between p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-600 transition-all group"
          >
            <div className="flex items-center gap-5">
              <div className="p-3 rounded-xl bg-zinc-800 text-zinc-500 group-hover:text-white transition-colors">
                <Cpu size={22} />
              </div>
              <div>
                <h4 className="font-black text-base">{model.model_name}</h4>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  ID: {model._id.slice(-8)} · {model.category?.category_name} · {model.link}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Badge status="online" />
              <button
                onClick={() => setEditTarget(model)}
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-4 py-2 rounded-lg border border-zinc-700 transition-colors"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={() => handleDelete(model._id)}
                className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {!loading && !error && models.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 opacity-30 gap-3">
            <Cpu size={40} />
            <p className="text-xs font-black uppercase tracking-widest">No models yet</p>
          </div>
        )}

      </div>

      {/* Edit modal — rendered only when a model is selected */}
      {editTarget && (
        <EditModal
          model={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSave}
        />
      )}

    </div>
  );
}