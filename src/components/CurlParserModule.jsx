// components/CurlParserModule.jsx
import { useState } from "react";
import { Terminal, Rocket } from "lucide-react";

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

  const inputSource = body?.input ?? body ?? {};
  const schema = Object.keys(inputSource);

  return { url, method, headers, schema, inputSource };
}

export default function CurlParserModule({ onDeploy }) {
  const [input, setInput]   = useState("");
  const [result, setResult] = useState(null);

  const handleExtract = () => {
    if (!input.trim()) return;
    setResult(parseCurl(input));
  };

  const handleDeploy = () => {
    if (!result?.url) return;
    const model = {
      id: `m${Date.now()}`,
      name: "Parsed Model",
      provider: (() => {
        try { return new URL(result.url).hostname.split(".")[1] || "dynamic"; }
        catch { return "dynamic"; }
      })(),
      category: "text",
      endpoint: result.url,
      outputType: "text",
      status: "online",
      schema: Object.fromEntries(
        result.schema.map((k) => [k, { type: "text", default: result.inputSource[k] ?? "" }])
      ),
    };
    onDeploy?.(model);
  };

  return (
    <div className="flex flex-col items-center px-8 py-8 w-full">



      {/* SPLIT PANELS */}
      <div className="grid grid-cols-2 gap-8 w-full" style={{ height: "calc(100vh - 280px)", minHeight: 480 }}>

{/* LEFT — Source Code */}
<div className="flex flex-col gap-3">
  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
    Source Code
  </span>
  <div className="relative" style={{ height: "380px" }}>
    <textarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleExtract();
      }}
      placeholder={`curl -s -X POST \\\n  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -H "Prefer: wait" \\\n  -d $'{\n    "input": {\n      "prompt": "What is San Junipero?",\n      "temperature": 1\n    }\n  }' \\\n  https://api.replicate.com/v1/predictions`}
      className="w-full h-full bg-zinc-900 text-emerald-400 font-mono text-xs leading-relaxed p-5 pb-16 rounded-2xl border border-zinc-800 outline-none resize-none"
    />
    <button
      onClick={handleExtract}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap border border-zinc-600"
    >
      <Terminal size={16} />
      Extract Mapping
    </button>
  </div>
</div>

        {/* RIGHT — Generated Schema */}
<div className="flex flex-col gap-4">
  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
    Generated Schema
  </span>
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden" style={{ height: "380px" }}>

    {!result ? (
      <div className="flex-1 flex flex-col items-center justify-center opacity-20 gap-3">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
        <p className="text-[10px] font-black uppercase tracking-[0.18em]">Awaiting Injection</p>
      </div>
    ) : (
      <div className="flex flex-col h-full">

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Endpoint Detected */}
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
              Endpoint Detected
            </p>
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 font-mono text-xs text-zinc-200 break-all leading-relaxed">
              {result.url || <span className="text-red-400">No URL found</span>}
            </div>
          </div>

          {/* Input Attributes */}
          {result.schema.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                Input Attributes
              </p>
              <div className="flex flex-wrap gap-3">
                {result.schema.map((key) => (
                  <span
                    key={key}
                    className="bg-white text-black text-[10px] font-black italic uppercase px-3 py-1.5 rounded-lg"
                  >
                    {key}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Deploy button — pinned to bottom */}
        <div className="p-4 border-t border-zinc-800 shrink-0">
          <button
            onClick={handleDeploy}
            className="w-full bg-zinc-100 hover:bg-white text-black font-black text-xs uppercase tracking-[0.2em] py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Rocket size={16} />
            Deploy Model Instance
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