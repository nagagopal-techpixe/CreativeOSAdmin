// components/CurlParserModule.jsx
import { useState, useEffect } from "react";
import { Terminal, Rocket, ChevronDown, Tag, Zap, Link, Layers } from "lucide-react";
import { fetchCategories, createModel } from "../services/Modelsapi.js";
// ── dtype inference ───────────────────────────────────────────────────────────
const KNOWN_FLOATS = new Set([
  "top_p", "temperature", "presence_penalty",
  "frequency_penalty", "top_k", "repetition_penalty"
]);

const IMAGE_NAME_PATTERN = /image|img|photo|picture|thumbnail|avatar|portrait|frame|snapshot/i;
const VIDEO_NAME_PATTERN = /video|clip|footage|film|reel|recording/i;

function inferDtype(name, value) {
  if (KNOWN_FLOATS.has(name))                       return "float";
  if (typeof value === "boolean")                   return "boolean";
  if (typeof value === "number")
    return Number.isInteger(value)                  ? "integer" : "float";

  // ← check image/video by name pattern BEFORE array check
  // because Replicate sends image/video fields as [] by default
  if (Array.isArray(value) || value === null || value === "") {
    if (IMAGE_NAME_PATTERN.test(name))              return "image";
    if (VIDEO_NAME_PATTERN.test(name))              return "video";
  }

  if (Array.isArray(value))                         return "array";
  if (typeof value === "object" && value !== null)  return "object";
  return "string";
}
// ── curl parser 
function parseCurl(raw) {
  const clean = raw.replace(/\\\s*\n/g, " ").trim();

  const urlMatch =
    clean.match(/'(https?:\/\/[^']+)'/) ||
    clean.match(/"(https?:\/\/[^"]+)"/) ||
    clean.match(/https?:\/\/[^\s]+/);
  const url = urlMatch ? (urlMatch[1] || urlMatch[0]).replace(/['"]/g, "").trim() : "";

  const methodMatch = clean.match(/-X\s+([A-Z]+)/);
  const method = methodMatch ? methodMatch[1].toUpperCase() : "POST";

  const headerMatches = [...clean.matchAll(/-H\s+['"]([^'"]+)['"]/g)];
  const headers = {};
  headerMatches.forEach((m) => {
    const idx = m[1].indexOf(":");
    if (idx === -1) return;
    headers[m[1].slice(0, idx).trim()] = m[1].slice(idx + 1).trim();
  });

  let bodyRaw = "";
  const patterns = [
    /-(?:d|-data-raw|-data-binary|-data)\s+\$'((?:[^'\\]|\\.)*)'/, 
    /-(?:d|-data-raw|-data-binary|-data)\s+'((?:[^'\\]|\\.)*)'/, 
    /-(?:d|-data-raw|-data-binary|-data)\s+"((?:[^"\\]|\\.)*)"/, 
  ];
  for (const p of patterns) {
    const m = clean.match(p);
    if (m) { bodyRaw = m[1].replace(/\\'/g, "'").replace(/\\n/g, "\n"); break; }
  }

  let body = {};
  if (bodyRaw) {
    try { body = JSON.parse(bodyRaw); } catch { body = { _raw: bodyRaw }; }
  }

// AFTER
const rawInput = body?.input ?? body ?? {};

// If input is an array (e.g. OpenAI messages format), treat it as a single "messages" field
const inputSource = Array.isArray(rawInput)
  ? { messages: rawInput }
  : rawInput;

const schema = Object.entries(inputSource).map(([name, value]) => ({
  name,
  dtype: inferDtype(name, value),
}));

  return { url, method, headers, schema, inputSource };
}

export default function CurlParserModule({ onDeploy }) {
  const [input, setInput]                 = useState("");
  const [result, setResult]               = useState(null);
  const [categories, setCategories]       = useState([]);
  const [selectedCat, setSelectedCat]     = useState("");
  const [modelName, setModelName]         = useState("");
  const [deploying, setDeploying]         = useState(false);
  const [deployError, setDeployError]     = useState("");
  const [deploySuccess, setDeploySuccess] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then((res) => {
        const list = res.data?.data ?? [];
        setCategories(list);
        if (list.length > 0) setSelectedCat(list[0]._id);
      })
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  const handleExtract = () => {
    if (!input.trim()) return;
    setDeployError("");
    setDeploySuccess(false);
    setResult(parseCurl(input));
  };

  const handleDeploy = async () => {
    if (!result?.url) return;
    if (!modelName.trim()) { setDeployError("Model name is required."); return; }
    if (!selectedCat)      { setDeployError("Please select a category."); return; }

    setDeploying(true);
    setDeployError("");
    setDeploySuccess(false);

    try {
      const payload = {
        model_name:       modelName.trim(),
        category:         selectedCat,
        link:             result.url,
        model_attributes: result.schema,   // [{ name, dtype }]
      };
      const res = await createModel(payload);
      setDeploySuccess(true);
      setModelName("");
      onDeploy?.(res.data?.data ?? payload);
    } catch (err) {
      setDeployError(err.response?.data?.message ?? "Deploy failed. Please try again.");
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="flex flex-col px-8 py-6 w-full h-full">

      {/* SPLIT PANELS */}
      <div className="grid grid-cols-2 gap-6 w-full" style={{ minHeight: "600px" }}>

        {/* ── LEFT — Source Code ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Terminal size={12} className="text-zinc-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
              Source Code
            </span>
          </div>

          <div className="relative" style={{ height: "calc(100vh - 240px)", minHeight: "580px" }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleExtract();
              }}
              placeholder={`curl -s -X POST \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -H "Prefer: wait" \\\n  -d $'{\n    "input": {\n      "prompt": "What is San Junipero?",\n      "temperature": 1\n    }\n  }' \\\n  https://api.replicate.com/v1/predictions`}
              className="w-full h-full bg-zinc-900 text-emerald-400 font-mono text-xs leading-relaxed p-5 pb-16 rounded-2xl border border-zinc-800 outline-none resize-none focus:border-zinc-700 transition-colors"
            />
            <button
              onClick={handleExtract}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-700 hover:bg-zinc-600 active:scale-95 text-white font-bold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap border border-zinc-600"
            >
              <Zap size={14} className="text-emerald-400" />
              Extract Mapping
            </button>
          </div>
        </div>

        {/* ── RIGHT — Generated Schema ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Layers size={12} className="text-zinc-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
              Generated Schema
            </span>
          </div>

          <div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden"
            style={{ height: "calc(100vh - 240px)", minHeight: "580px" }}
          >

            {/* ── EMPTY STATE ── */}
            {!result ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center opacity-40">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div className="text-center opacity-30 space-y-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em]">Awaiting Injection</p>
                  <p className="text-[10px] text-zinc-500 font-mono">Paste a cURL and click Extract</p>
                </div>
              </div>
            ) : (

              /* ── RESULT STATE ── */
              <div className="flex flex-col h-full">

                {/* Scrollable top */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">

                  {/* Endpoint */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Link size={10} className="text-zinc-500" />
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                        Endpoint Detected
                      </p>
                    </div>
                    <div className="bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-4 py-3 font-mono text-[11px] text-emerald-400 break-all leading-relaxed">
                      {result.url || <span className="text-red-400">No URL found</span>}
                    </div>
                  </div>

                  {/* Input Attributes — only line changed: key and content use attr.name */}
                  {result.schema.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                          Input Attributes
                        </p>
                        <span className="text-[9px] font-bold text-zinc-600 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">
                          {result.schema.length} fields
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.schema.map((attr) => (
                          <span
                            key={attr.name}
                            className="bg-white text-black text-[10px] font-black italic uppercase px-3 py-1.5 rounded-lg tracking-wide"
                          >
                            {attr.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deploy Configuration */}
                  <div className="border-t border-zinc-800 pt-5 space-y-4">

                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                      Deploy Configuration
                    </p>

                    {/* Model Name */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-600">
                        Model Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={modelName}
                        onChange={(e) => {
                          setModelName(e.target.value);
                          setDeployError("");
                          setDeploySuccess(false);
                        }}
                        placeholder="e.g. GPT-4o Vision"
                        className="w-full bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-zinc-500 text-white text-xs font-mono placeholder-zinc-600 px-4 py-3 rounded-xl outline-none transition-colors"
                      />
                    </div>

                    {/* Category Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-600">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                        <select
                          value={selectedCat}
                          onChange={(e) => {
                            setSelectedCat(e.target.value);
                            setDeployError("");
                            setDeploySuccess(false);
                          }}
                          className="w-full appearance-none bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-zinc-500 text-white text-xs font-mono pl-8 pr-8 py-3 rounded-xl outline-none transition-colors cursor-pointer"
                        >
                          <option value="" disabled>Select a category...</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.category_name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                      </div>
                    </div>

                  </div>
                </div>

                {/* ── Pinned bottom — feedback + deploy ── */}
                <div className="px-5 pb-5 pt-3 border-t border-zinc-800 shrink-0 space-y-3">

                  {deployError && (
                    <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                      <span className="text-red-400 font-black text-base leading-none">✕</span>
                      <p className="text-[10px] text-red-400 font-bold uppercase tracking-wide">{deployError}</p>
                    </div>
                  )}

                  {deploySuccess && (
                    <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                      <span className="text-emerald-400 font-black text-base leading-none">✓</span>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wide">Model deployed successfully</p>
                    </div>
                  )}

                  <button
                    onClick={handleDeploy}
                    disabled={deploying}
                    className="w-full bg-white hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-black font-black text-xs uppercase tracking-[0.2em] py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    {deploying ? (
                      <>
                        <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Rocket size={15} />
                        Deploy Model Instance
                      </>
                    )}
                  </button>

                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
} 