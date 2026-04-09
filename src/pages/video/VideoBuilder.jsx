import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getVideoTypes,
  patchVideoType,
  toggleTypesSection,
} from "../../services/video";
import { fetchUserPermissions } from "../../services/users";
import { useStepPermissions } from "../../hooks/useStepPermissions";
import StepSection from "../../components/Stepsection";
import VideoStylesStep from "./Videostylesstep";
import VideoDetailsStep from "./Videodetailsstep";
import VideoDurationsStep from "./Videodurationsstep";
import VideoFormatsStep from "./VideoFormatsStep";
import VideoHooksStep from "./VideoHooksStep";

export default function VideoBuilder() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const [targetUser, setTargetUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patching, setPatching] = useState({});
  const [sectionActive, setSectionActive] = useState(true);
  const [sectionBusy, setSectionBusy] = useState(false);

  const {
    isUserMode,
    displayItems,
    displaySectionActive,
    userSectionToggle,
    userItemToggle,
  } = useStepPermissions({
    userId,
    sectionKey: "types",
    globalItems: items,
    globalIsActive: sectionActive,
    builderKey: "videoBuilder",
  });

  useEffect(() => {
    getVideoTypes()
      .then((data) => {
        setItems(data.items);
        setSectionActive(data.isActive);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchUserPermissions(userId).then((data) => {
      setTargetUser({ name: data.name, email: data.email });
    });
  }, [userId]);

  const handleSectionToggle = async () => {
    if (isUserMode) {
      await userSectionToggle(displaySectionActive);
    } else {
      setSectionBusy(true);
      try {
        await toggleTypesSection({ isActive: !sectionActive });
        setSectionActive((prev) => !prev);
      } finally {
        setSectionBusy(false);
      }
    }
  };

  const handleItemToggle = async (item) => {
    const itemId = item._id;
    setPatching((prev) => ({ ...prev, [itemId]: true }));
    try {
      if (isUserMode) {
        await userItemToggle(item);
      } else {
        await patchVideoType(itemId, { isActive: !item.isActive });
        setItems((prev) =>
          prev.map((t) =>
            t._id === itemId ? { ...t, isActive: !t.isActive } : t,
          ),
        );
      }
    } finally {
      setPatching((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  return (
    <div className="p-6 min-h-screen text-slate-200">
      <div className="mb-6 pb-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-slate-100 tracking-tight">
          Video Builder Controls
        </h2>

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

        {!isUserMode && (
          <p className="text-xs text-slate-500 mt-0.5">
            Global mode — changes affect all users.
          </p>
        )}
      </div>

      <StepSection
        step={1}
        title="What type of video?"
        items={displayItems}
        loading={loading}
        error={error}
        sectionActive={displaySectionActive}
        sectionBusy={sectionBusy}
        patching={patching}
        onSectionToggle={handleSectionToggle}
        onItemToggle={handleItemToggle}
        renderBadge={(item) =>
          item.tag ? (
            <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-300 border border-blue-500/25 px-1.5 py-0.5 rounded-full">
              {item.tag}
            </span>
          ) : null
        }
      />

      <VideoStylesStep userId={userId} />
      <VideoDetailsStep userId={userId} />
      <VideoDurationsStep userId={userId} />
      <VideoFormatsStep userId={userId} />
      <VideoHooksStep userId={userId} />
    </div>
  );
}
