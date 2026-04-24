import API from "./api";

/** GET /admin/storyboard/types → { items, isActive } */
export const getStoryboardTypes = async () => {
  const res = await API.get("/admin/storyboard/types");
  return res.data.data;
};

/** PATCH /admin/storyboard/types/toggle */
export const toggleStoryboardTypesSection = async (payload) => {
  const res = await API.patch("/admin/storyboard/types/toggle", payload);
  return res.data;
};

/** PATCH /admin/storyboard/types/:itemId */
export const patchStoryboardType = async (itemId, payload) => {
  const res = await API.patch(`/admin/storyboard/types/${itemId}`, payload);
  return res.data;
};

/** GET /admin/storyboard/styles → { items, isActive } */
export const getStoryboardStyles = async () => {
  const res = await API.get("/admin/storyboard/styles");
  return res.data.data;
};

/** PATCH /admin/storyboard/styles/toggle */
export const toggleStoryboardStylesSection = async (payload) => {
  const res = await API.patch("/admin/storyboard/styles/toggle", payload);
  return res.data;
};

/** PATCH /admin/storyboard/styles/:itemId */
export const patchStoryboardStyle = async (itemId, payload) => {
  const res = await API.patch(`/admin/storyboard/styles/${itemId}`, payload);
  return res.data;
};

/** GET /admin/storyboard/frames → { items, isActive } */
export const getStoryboardFrames = async () => {
  const res = await API.get("/admin/storyboard/frames");
  return res.data.data;
};

/** PATCH /admin/storyboard/frames/toggle */
export const toggleStoryboardFramesSection = async (payload) => {
  const res = await API.patch("/admin/storyboard/frames/toggle", payload);
  return res.data;
};

/** PATCH /admin/storyboard/frames/:itemId */
export const patchStoryboardFrame = async (itemId, payload) => {
  const res = await API.patch(`/admin/storyboard/frames/${itemId}`, payload);
  return res.data;
};

/** GET /admin/storyboard/ratios → { items, isActive } */
export const getStoryboardRatios = async () => {
  const res = await API.get("/admin/storyboard/ratios");
  return res.data.data;
};

/** PATCH /admin/storyboard/ratios/toggle */
export const toggleStoryboardRatiosSection = async (payload) => {
  const res = await API.patch("/admin/storyboard/ratios/toggle", payload);
  return res.data;
};

/** PATCH /admin/storyboard/ratios/:itemId */
export const patchStoryboardRatio = async (itemId, payload) => {
  const res = await API.patch(`/admin/storyboard/ratios/${itemId}`, payload);
  return res.data;
};

// 
// STEP 5 — Storyboard Details
// 

/** GET /admin/storyboard/details → { items: [groupSchema], isActive } */
export const getStoryboardDetails = async () => {
  const res = await API.get("/admin/storyboard/details");
  return res.data.data;
};

/** PATCH /admin/storyboard/details/toggle */
export const toggleStoryboardDetailsSection = async (payload) => {
  const res = await API.patch("/admin/storyboard/details/toggle", payload);
  return res.data;
};

/** PATCH /admin/storyboard/details/group/:groupId/toggle */
export const toggleStoryboardDetailGroup = async (groupId, payload) => {
  const res = await API.patch(
    `/admin/storyboard/details/group/${groupId}/toggle`,
    payload,
  );
  return res.data;
};

/** PATCH /admin/storyboard/details/group/:groupId/opt/:optId/toggle */
export const toggleStoryboardDetailOpt = async (groupId, optId, payload) => {
  const res = await API.patch(
    `/admin/storyboard/details/group/${groupId}/opt/${optId}/toggle`,
    payload,
  );
  return res.data;
};
