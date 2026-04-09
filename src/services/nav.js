import API from "./api.js";

// ── Global nav (admin)
export const getNav = () => API.get("/admin/nav");
export const patchNavItem = (itemId, payload) =>
  API.patch(`/admin/nav/item/${itemId}`, payload);
export const toggleGlobalNavItem = (itemId, payload) =>
  API.patch(`/admin/nav/item/${itemId}/toggle`, payload);
export const toggleGlobalNavSection = (isActive) =>
  API.patch("/admin/nav/section/toggle", { isActive });

// ── User-level nav permissions ─
export const toggleNavSection = (userId, isActive) =>
  API.patch(`/auth/admin/users/${userId}/permissions/nav/toggle`, { isActive });

export const toggleNavItemPerm = (userId, itemId, isActive) =>
  API.patch(`/auth/admin/users/${userId}/permissions/nav/items/${itemId}`, {
    isActive,
  });
