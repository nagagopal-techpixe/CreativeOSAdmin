// pages/video/VideoStylesStep.jsx
import { useEffect, useState } from "react";
import {
  getVideoStyles,
  patchVideoStyle,
  toggleStylesSection,
} from "../../services/video";
import { useStepPermissions } from "../../hooks/useStepPermissions";
import StepSection from "../../components/Stepsection";

export default function VideoStylesStep({ userId }) {
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
    sectionKey: "styles",
    globalItems: items,
    globalIsActive: sectionActive,
  });

  useEffect(() => {
    getVideoStyles()
      .then((data) => {
        setItems(data.items);
        setSectionActive(data.isActive);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSectionToggle = async () => {
    if (isUserMode) {
      await userSectionToggle(displaySectionActive);
    } else {
      setSectionBusy(true);
      try {
        await toggleStylesSection({ isActive: !sectionActive });
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
        await patchVideoStyle(itemId, { isActive: !item.isActive });
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
    <StepSection
      step={2}
      title="What style?"
      items={displayItems}
      loading={loading}
      error={error}
      sectionActive={displaySectionActive}
      sectionBusy={sectionBusy}
      patching={patching}
      onSectionToggle={handleSectionToggle}
      onItemToggle={handleItemToggle}
    />
  );
}
