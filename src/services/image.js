import API from "./api";

/** GET /admin/image/types → { items, isActive } */
export const getImageTypes = async () => {
  const res = await API.get("/admin/image/types");
  return res.data.data;
};

/** PATCH /admin/image/types/toggle */
export const toggleImageTypesSection = async (payload) => {
  const res = await API.patch("/admin/image/types/toggle", payload);
  return res.data;
};

/** PATCH /admin/image/types/:itemId */
export const patchImageType = async (itemId, payload) => {
  const res = await API.patch(`/admin/image/types/${itemId}`, payload);
  return res.data;
};

/** GET /admin/image/styles → { items, isActive } */
export const getImageStyles = async () => {
  const res = await API.get("/admin/image/styles");
  return res.data.data;
};

/** PATCH /admin/image/styles/toggle */
export const toggleImageStylesSection = async (payload) => {
  const res = await API.patch("/admin/image/styles/toggle", payload);
  return res.data;
};

/** PATCH /admin/image/styles/:itemId */
export const patchImageStyle = async (itemId, payload) => {
  const res = await API.patch(`/admin/image/styles/${itemId}`, payload);
  return res.data;
};

/** GET /admin/image/details → { items: [groupSchema], isActive } */
export const getImageDetails = async () => {
  const res = await API.get("/admin/image/details");
  return res.data.data;
};

/** PATCH /admin/image/details/toggle */
export const toggleImageDetailsSection = async (payload) => {
  const res = await API.patch("/admin/image/details/toggle", payload);
  return res.data;
};

/** PATCH /admin/image/details/group/:groupId/toggle */
export const toggleImageDetailGroup = async (groupId, payload) => {
  const res = await API.patch(
    `/admin/image/details/group/${groupId}/toggle`,
    payload,
  );
  return res.data;
};

/** PATCH /admin/image/details/group/:groupId/opt/:optId/toggle */
export const toggleImageDetailOpt = async (groupId, optId, payload) => {
  const res = await API.patch(
    `/admin/image/details/group/${groupId}/opt/${optId}/toggle`,
    payload,
  );
  return res.data;
};

/** GET /admin/image/ratios → { items, isActive } */
export const getImageRatios = async () => {
  const res = await API.get("/admin/image/ratios");
  return res.data.data;
};

/** PATCH /admin/image/ratios/toggle */
export const toggleImageRatiosSection = async (payload) => {
  const res = await API.patch("/admin/image/ratios/toggle", payload);
  return res.data;
};

/** PATCH /admin/image/ratios/:itemId */
export const patchImageRatio = async (itemId, payload) => {
  const res = await API.patch(`/admin/image/ratios/${itemId}`, payload);
  return res.data;
};

/** GET /admin/image/categories → { items: [groupSchema], isActive } */
export const getImageCategories = async () => {
  const res = await API.get("/admin/image/categories");
  return res.data.data;
};

/** PATCH /admin/image/categories/toggle */
export const toggleImageCategoriesSection = async (payload) => {
  const res = await API.patch("/admin/image/categories/toggle", payload);
  return res.data;
};

/** PATCH /admin/image/categories/group/:groupId/toggle */
export const toggleImageCategoryGroup = async (groupId, payload) => {
  const res = await API.patch(
    `/admin/image/categories/group/${groupId}/toggle`,
    payload,
  );
  return res.data;
};

/** PATCH /admin/image/categories/group/:groupId/item/:itemId/toggle */
export const toggleImageCategoryItem = async (groupId, itemId, payload) => {
  const res = await API.patch(
    `/admin/image/categories/group/${groupId}/item/${itemId}/toggle`,
    payload,
  );
  return res.data;
};
