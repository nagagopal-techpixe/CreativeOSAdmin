import { useEffect, useState } from "react";
import {
  getStoryboardTypes,
  patchStoryboardType,
  toggleStoryboardTypesSection,
} from "../../services/storyboard";
import { useStepPermissions } from "../../hooks/useStepPermissions";
import StepSection from "../../components/Stepsection";

export default function StoryboardTypesStep({ userId }) {
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
    builderKey: "storyboardBuilder",
  });

  useEffect(() => {
    getStoryboardTypes()
      .then((data) => {
        setItems(data.items);
        setSectionActive(data.isActive);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSectionToggle = async () => {
    setSectionBusy(true);
    try {
      if (isUserMode) {
        await userSectionToggle(displaySectionActive);
      } else {
        await toggleStoryboardTypesSection({ isActive: !sectionActive });
        setSectionActive((p) => !p);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setSectionBusy(false);
    }
  };

  const handleItemToggle = async (item) => {
    const itemId = item._id;
    setPatching((p) => ({ ...p, [itemId]: true }));
    try {
      if (isUserMode) {
        await userItemToggle(item);
      } else {
        await patchStoryboardType(itemId, { isActive: !item.isActive });
        setItems((prev) =>
          prev.map((t) =>
            t._id === itemId ? { ...t, isActive: !t.isActive } : t,
          ),
        );
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setPatching((p) => ({ ...p, [itemId]: false }));
    }
  };

  return (
    <StepSection
      step={1}
      title="Scene Type"
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
  );
}
