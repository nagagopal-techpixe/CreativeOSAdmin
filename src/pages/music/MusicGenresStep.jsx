// pages/music/MusicGenresStep.jsx
import { useEffect, useState } from "react";
import {
  getMusicGenres,
  patchMusicGenre,
  toggleMusicGenresSection,
} from "../../services/music";
import { useStepPermissions } from "../../hooks/useStepPermissions";
import StepSection from "../../components/Stepsection";

export default function MusicGenresStep({ userId }) {
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
    sectionKey: "genres",
    globalItems: items,
    globalIsActive: sectionActive,
    builderKey: "musicBuilder",
  });

  useEffect(() => {
    getMusicGenres()
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
        await toggleMusicGenresSection({ isActive: !sectionActive });
        setSectionActive((p) => !p);
      } finally {
        setSectionBusy(false);
      }
    }
  };

  const handleItemToggle = async (item) => {
    const itemId = item._id;
    setPatching((p) => ({ ...p, [itemId]: true }));
    try {
      if (isUserMode) {
        await userItemToggle(item);
      } else {
        await patchMusicGenre(itemId, { isActive: !item.isActive });
        setItems((prev) =>
          prev.map((t) =>
            t._id === itemId ? { ...t, isActive: !t.isActive } : t,
          ),
        );
      }
    } finally {
      setPatching((p) => ({ ...p, [itemId]: false }));
    }
  };

  return (
    <StepSection
      step={2}
      title="Music genre"
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
