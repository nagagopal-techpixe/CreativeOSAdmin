import { useState, useEffect } from "react";
import { fetchUserPermissions, toggleUserSection, toggleUserItem } from "../services/users";

export function useStepPermissions({ userId, sectionKey, globalItems, globalIsActive, builderKey = "videoBuilder" }) {
  const isUserMode = !!userId;
  const [userPerms, setUserPerms] = useState(null);

  //  builder path mapping
  const builderPathMap = {
    videoBuilder:     "video",
    voiceBuilder:     "voice",
    characterBuilder: "character",
    musicBuilder:     "music",
    storyboardBuilder:"storyboard",
    imageBuilder:     "image",
  };

  const builderPath = builderPathMap[builderKey] ?? "video";

  useEffect(() => {
    if (!userId) return;

    fetchUserPermissions(userId).then((data) => {
      setUserPerms(data.permissions?.[builderKey] ?? {});
    });
  }, [userId, builderKey]);

  //  FIXED FUNCTION
  const isItemAllowed = (itemId) => {
    if (!isUserMode || !userPerms?.[sectionKey]) return true;

    const allowed = (userPerms[sectionKey].allowedItems ?? []).map(String);

    // ❌ OLD BUG:
    // return allowed.length === 0 || allowed.includes(String(itemId));

    //  FIX:
    return allowed.includes(String(itemId));
  };

  const displayItems = isUserMode
    ? globalItems.map((item) => ({
        ...item,
        isActive: isItemAllowed(item._id),
      }))
    : globalItems;

  const displaySectionActive = isUserMode
    ? (userPerms?.[sectionKey]?.isActive ?? true)
    : globalIsActive;

  const userSectionToggle = async (currentActive) => {
    const newActive = !currentActive;

    setUserPerms((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev?.[sectionKey],
        isActive: newActive,
      },
    }));

    await toggleUserSection(userId, builderPath, sectionKey, newActive);
  };

  const userItemToggle = async (item) => {
    const itemId = String(item._id);

    const currentAllowed = (userPerms?.[sectionKey]?.allowedItems ?? []).map(String);
    const isCurrentlyActive = currentAllowed.includes(itemId);
    const newActive = !isCurrentlyActive;

    const newAllowed = newActive
      ? [...currentAllowed, itemId]
      : currentAllowed.filter((id) => id !== itemId);

    setUserPerms((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev?.[sectionKey],
        allowedItems: newAllowed,
      },
    }));

    await toggleUserItem(userId, builderPath, sectionKey, itemId, newActive);
  };

  return {
    isUserMode,
    displayItems,
    displaySectionActive,
    userSectionToggle,
    userItemToggle,
  };
}