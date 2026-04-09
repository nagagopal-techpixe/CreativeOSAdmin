import { useState, useEffect } from "react";
import { fetchUserPermissions } from "../services/users";
//  import toggleNavItemPerm, NOT toggleNavItem
import { toggleNavSection, toggleNavItemPerm } from "../services/nav";

export function useNavPermissions({ userId, globalItems, globalIsActive }) {
  const isUserMode = !!userId;
  const [userPerms, setUserPerms] = useState(null);

  useEffect(() => {
    if (!userId) {
      setUserPerms(null);
      return;
    }
    fetchUserPermissions(userId).then((data) => {
      setUserPerms(data.permissions?.navItems ?? {});
    });
  }, [userId]);

  const isItemAllowed = (itemId) => {
    if (!isUserMode || !userPerms) return true;
    const allowed = (userPerms.allowedItems ?? []).map(String);
    return allowed.includes(String(itemId));
  };

  const displayItems = globalItems.map((item) => ({
    ...item,
    isActive: isUserMode ? isItemAllowed(item._id ?? item.id) : item.isActive,
  }));

  const displaySectionActive = isUserMode
    ? (userPerms?.isActive ?? true)
    : globalIsActive;

  const userSectionToggle = async (currentActive) => {
    const newActive = !currentActive;
    setUserPerms((prev) => ({ ...prev, isActive: newActive }));
    await toggleNavSection(userId, newActive);
  };

  const userItemToggle = async (item) => {
    const itemId = String(item._id ?? item.id);
    const currentAllowed = (userPerms?.allowedItems ?? []).map(String);
    const isCurrentlyActive = currentAllowed.includes(itemId);
    const newActive = !isCurrentlyActive;

    const newAllowed = newActive
      ? [...currentAllowed, itemId]
      : currentAllowed.filter((id) => id !== itemId);

    setUserPerms((prev) => ({ ...prev, allowedItems: newAllowed }));
    await toggleNavItemPerm(userId, itemId, newActive); //  correct function
  };

  return {
    isUserMode,
    displayItems,
    displaySectionActive,
    userSectionToggle,
    userItemToggle,
  };
}