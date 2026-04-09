import { useSearchParams } from "react-router-dom";
import { fetchUserPermissions } from "../../services/users";
import { useEffect, useState } from "react";
import CharacterTypesStep from "./CharacterTypesStep";
import CharacterStylesStep from "./CharacterStylesStep";
import CharacterDetailsStep from "./CharacterDetailsStep";
import CharacterPosesStep from "./CharacterPosesStep";

export default function CharacterBuilder() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    if (!userId) return;
    fetchUserPermissions(userId).then((data) => {
      setTargetUser({ name: data.name, email: data.email });
    });
  }, [userId]);

  return (
    <div className="p-6 min-h-screen text-slate-200">
      <div className="mb-6 pb-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-slate-100 tracking-tight">
          Character Builder Controls
        </h2>

        {userId && targetUser && (
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

        {!userId && (
          <p className="text-xs text-slate-500 mt-0.5">
            Global mode — changes affect all users.
          </p>
        )}
      </div>

      <CharacterTypesStep userId={userId} />
      <CharacterStylesStep userId={userId} />
      <CharacterDetailsStep userId={userId} />
      <CharacterPosesStep userId={userId} />
    </div>
  );
}
