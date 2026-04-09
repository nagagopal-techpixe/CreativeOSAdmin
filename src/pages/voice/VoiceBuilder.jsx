import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import VoiceTypesStep from "./VoiceTypesStep";
import VoiceTonesStep from "./VoiceTonesStep";
import VoicePacingStep from "./VoicePacingStep";

import { fetchUserPermissions } from "../../services/users"; // ✅ same as VideoBuilder

export default function VoiceBuilder() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const [targetUser, setTargetUser] = useState(null);

  const isUserMode = Boolean(userId);

  //  fetch user details (same pattern as VideoBuilder)
  useEffect(() => {
    if (!userId) return;

    fetchUserPermissions(userId)
      .then((data) => {
        setTargetUser({
          name: data.name,
          email: data.email,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err.message);
      });
  }, [userId]);

  return (
    <div className="p-6 min-h-screen text-slate-200">

      {/*  HEADER (MATCHED WITH VIDEO BUILDER) */}
      <div className="mb-6 pb-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-slate-100 tracking-tight">
          Voice Builder Controls
        </h2>

        {/* USER MODE */}
        {isUserMode && targetUser && (
          <div className="mt-3 flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 rounded-lg px-3 py-2">
            <span className="text-blue-400 text-sm">👤</span>
            <p className="text-xs text-blue-300">
              Editing permissions for{" "}
              <span className="font-semibold">{targetUser.name}</span>
              <span className="text-blue-400/60 ml-1">
                ({targetUser.email})
              </span>
              {" — "}toggles here only affect this user.
            </p>
          </div>
        )}

        {/* GLOBAL MODE */}
        {!isUserMode && (
          <p className="text-xs text-slate-500 mt-0.5">
            Global mode — changes affect all users.
          </p>
        )}
      </div>

      {/* STEPS */}
      <VoiceTypesStep  userId={userId} />
      <VoiceTonesStep  userId={userId} />
      <VoicePacingStep userId={userId} />

    </div>
  );
}