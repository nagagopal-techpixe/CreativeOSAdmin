// pages/CurlParserPage.jsx
import { useNavigate } from "react-router-dom";
import CurlParserModule from "../../components/CurlParserModule.jsx";

export default function CurlParserPage() {
  const navigate = useNavigate();

  const handleDeploy = (model) => {
    // console.log("Deployed model:", model);
    navigate("/admin/tool/models");
  };

  return (
    <div className="flex flex-col flex-1 text-white min-h-screen overflow-y-auto">

      {/* PAGE HEADER — pinned top */}
      <div className="text-center py-2 shrink-0">
        <h1 className="text-4xl font-black tracking-tight mb-2 text-white">
          cURL Injector
        </h1>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
          Paste raw code to generate dynamic forms
        </p>
      </div>

      {/* MODULE — panels only, no title inside */}
      <CurlParserModule onDeploy={handleDeploy} />

    </div>
  );
}