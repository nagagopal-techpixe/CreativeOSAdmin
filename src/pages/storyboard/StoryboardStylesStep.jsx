import { useEffect, useState } from "react";
import {
  getStoryboardStyles,
  patchStoryboardStyle,
  toggleStoryboardStylesSection,
} from "../../services/storyboard";
import { useStepPermissions } from "../../hooks/useStepPermissions";
import StepSection from "../../components/Stepsection";

export default function StoryboardStylesStep({ userId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patching, setPatching] = useState({});
  const [sectionActive, setSectionActive] = useState(true);
  const [sectionBusy, setSectionBusy] = useState(false);

  useEffect(() => {
    getStoryboardStyles()
      .then((data) => {
        setItems(data.items);
        setSectionActive(data.isActive);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const {
    isUserMode,
    displayItems,
    displaySectionActive,
    userSectionToggle,
    userItemToggle,
  } = useStepPermissions({
    userId,
    sectionKey: "styles",
    globalItems: items,
    globalIsActive: sectionActive,
    builderKey: "storyboardBuilder",
  });

  const handleSectionToggle = async () => {
    setSectionBusy(true);
    try {
      if (isUserMode) {
        await userSectionToggle(displaySectionActive);
      } else {
        await toggleStoryboardStylesSection({ isActive: !sectionActive });
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
        await patchStoryboardStyle(itemId, { isActive: !item.isActive });
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
      step={2}
      title="Art Style"
      items={displayItems}
      loading={loading}
      error={error}
      sectionActive={displaySectionActive}
      sectionBusy={sectionBusy}
      patching={patching}
      onSectionToggle={handleSectionToggle}
      onItemToggle={handleItemToggle}
      renderBadge={() => null}
    />
  );
}
