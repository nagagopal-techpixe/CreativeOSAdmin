// pages/tools/ModelsPage.jsx
import { useState } from "react";
import { Cpu, Plus, Pencil,Play, Rocket, X, Save, Globe, Lock, Terminal, Sliders, Trash2, Activity, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const INITIAL_MODELS = [
  {
    id: "m1",
    name: "Stable Diffusion XL",
    provider: "Replicate",
    category: "images",
    endpoint: "https://api.replicate.com/v1/predictions",
    outputType: "image",
    status: "online",
  },
  {
    id: "m3",
    name: "MiniMax Music-01",
    provider: "MiniMax",
    category: "music",
    endpoint: "https://api.replicate.com/v1/models/minimax/music-01/predictions",
    outputType: "audio",
    status: "online",
  },
  {
    id: "m4",
    name: "GPT-5 Nano",
    provider: "OpenAI",
    category: "text",
    endpoint: "https://api.replicate.com/v1/models/openai/gpt-5-nano/predictions",
    outputType: "text",
    status: "online",
  },
];

const Badge = ({ status }) => {
  const colors = {
    online: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    offline: "bg-zinc-800 text-zinc-500 border border-zinc-700",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${colors[status] || colors.online}`}>
      {status}
    </span>
  );
};

const InputGroup = ({ label, children, description }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">{label}</label>
    {children}
    {description && <p className="text-[10px] text-zinc-600">{description}</p>}
  </div>
);

export default function ModelsPage() {
  const [models, setModels]         = useState(INITIAL_MODELS);
  const [showForm, setShowForm]     = useState(false);
   const navigate = useNavigate();

  const handleDelete = (id) => setModels((prev) => prev.filter((m) => m.id !== id));

  return (
    <div className="flex flex-col w-full min-h-screen text-white">

      {/* PAGE HEADER */}
      <div className="px-8 py-8 border-b border-zinc-800 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Models</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">
            Active core models
          </p>
        </div>
        <button
        //   onClick={() => setShowForm(true)}
         onClick={() => navigate("/admin/tool/curl-parser")}
          className="flex items-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-zinc-200 transition-colors"
        >
          <Plus size={16} />
          New Model
        </button>
      </div>

      {/* MODEL LIST */}
      <div className="flex-1 px-8 py-6 space-y-3">
        {models.map((model) => (
          <div
            key={model.id}
            className="flex items-center justify-between p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-600 transition-all group"
          >
            <div className="flex items-center gap-5">
              <div className="p-3 rounded-xl bg-zinc-800 text-zinc-500 group-hover:text-white transition-colors">
                <Cpu size={22} />
              </div>
              <div>
                <h4 className="font-black text-base">{model.name}</h4>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  ID: {model.id} · {model.provider} · {model.outputType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Badge status={model.status} />
              <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-4 py-2 rounded-lg border border-zinc-700 transition-colors">
  <Pencil size={14} />
  Edit
</button>
              <button
                onClick={() => handleDelete(model.id)}
                className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
              >
                <Trash2 size={20} />
              </button>
          
            </div>
          </div>
        ))}

        {models.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 opacity-30 gap-3">
            <Cpu size={40} />
            <p className="text-xs font-black uppercase tracking-widest">No models yet</p>
          </div>
        )}
      </div>
{/* 
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh]">

            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 rounded-t-[2rem]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-black">
                  <Plus size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black">New Model</h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Provider configuration</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white transition-colors p-1">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">

              <div className="grid grid-cols-2 gap-5">
                <InputGroup label="Model Name">
                  <input className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-600 text-white" placeholder="e.g. Runway Gen-3" />
                </InputGroup>
                <InputGroup label="Provider">
                  <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none text-white">
                    {["Replicate", "OpenAI", "Runway", "ElevenLabs", "Anthropic"].map((p) => (
                      <option key={p} className="bg-zinc-900">{p}</option>
                    ))}
                  </select>
                </InputGroup>
              </div>

              <div className="space-y-4">
                <InputGroup label="Endpoint URL">
                  <div className="flex gap-3">
                    <div className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-black text-zinc-300">POST</div>
                    <input className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-mono text-white outline-none focus:border-zinc-600" placeholder="https://api.provider.com/v1/..." />
                  </div>
                </InputGroup>
                <div className="grid grid-cols-2 gap-5">
                  <InputGroup label="Auth Strategy">
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none text-white">
                      {["Bearer Token", "API Key Header", "Basic Auth"].map((a) => (
                        <option key={a} className="bg-zinc-900">{a}</option>
                      ))}
                    </select>
                  </InputGroup>
                  <InputGroup label="Token Variable">
                    <input className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-mono text-white outline-none focus:border-zinc-600" placeholder="REPLICATE_API_TOKEN" />
                  </InputGroup>
                </div>
              </div>

              <InputGroup label="Output Type">
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none">
                  {["image", "video", "audio", "text"].map((t) => (
                    <option key={t} className="bg-zinc-900">{t}</option>
                  ))}
                </select>
              </InputGroup>

            </div>

      
            <div className="p-6 bg-zinc-900/80 border-t border-zinc-800 flex gap-4 rounded-b-[2rem]">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-bold transition-colors border border-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setModels((prev) => [...prev, {
                    id: `m${Date.now()}`,
                    name: "New Model",
                    provider: "Custom",
                    category: "text",
                    endpoint: "",
                    outputType: "text",
                    status: "online",
                  }]);
                  setShowForm(false);
                }}
                className="flex-[2] py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
              >
                <Rocket size={16} />
                Deploy Model
              </button>
            </div>

          </div>
        </div>
      )} */}
    </div>
  );
}