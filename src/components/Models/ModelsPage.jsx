import { useState, useEffect } from "react";
import { Cpu, Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAllModels, deleteModel } from "../../services/Modelsapi.js";
import EditModal from "./EditModal.jsx";   // ← separate file

//  Badge 
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

//  ModelsPage 
export default function ModelsPage() {
  const [models,     setModels]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const navigate = useNavigate();

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
                {/* attribute count hint */}
                {model.model_attributes?.length > 0 && (
                  <p className="text-[10px] text-zinc-600 font-mono mt-0.5">
                    {model.model_attributes.filter((a) => a.isActive).length}/
                    {model.model_attributes.length} attributes active
                  </p>
                )}
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

      {/* Edit modal */}
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