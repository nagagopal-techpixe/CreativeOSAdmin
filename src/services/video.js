import API from "./api";

export const getVideoTypes = async () => {
  const res = await API.get("/admin/video/types");
  return res.data.data;
};

export const toggleTypesSection = async (payload) => {
  const res = await API.patch("/admin/video/types/toggle", payload);
  return res.data;
};

export const patchVideoType = async (itemId, payload) => {
  const res = await API.patch(`/admin/video/types/item/${itemId}`, payload);
  return res.data;
};

/** GET /admin/video/durations → { items, isActive } */
export const getVideoDurations = async () => {
  const res = await API.get("/admin/video/durations");
  return res.data.data;
};

/** PATCH /admin/video/durations/toggle */
export const toggleDurationsSection = async (payload) => {
  const res = await API.patch("/admin/video/durations/toggle", payload);
  return res.data;
};

/** PATCH /admin/video/durations/item/:itemId */
export const patchVideoDuration = async (itemId, payload) => {
  const res = await API.patch(`/admin/video/durations/item/${itemId}`, payload);
  return res.data;
};

/** GET /admin/video/details → { items: [groupSchema], isActive: bool } */
export const getVideoDetails = async () => {
  const res = await API.get("/admin/video/details");
  return res.data.data; // { items: [...], isActive: bool }
};

/** PATCH /admin/video/details/toggle */
export const toggleDetailsSection = async (payload) => {
  const res = await API.patch("/admin/video/details/toggle", payload);
  return res.data;
};

/** PATCH /admin/video/details/group/:groupId/toggle */
export const toggleDetailGroup = async (groupId, payload) => {
  const res = await API.patch(
    `/admin/video/details/group/${groupId}/toggle`,
    payload,
  );
  return res.data;
};

/** PATCH /admin/video/details/group/:groupId/opt/:optId/toggle */
export const toggleDetailOpt = async (groupId, optId, payload) => {
  const res = await API.patch(
    `/admin/video/details/group/${groupId}/opt/${optId}/toggle`,
    payload,
  );
  return res.data;
};

export const getVideoStyles = async () => {
  const res = await API.get("/admin/video/styles");
  return res.data.data;
};

export const toggleStylesSection = async (payload) => {
  const res = await API.patch("/admin/video/styles/toggle", payload);
  return res.data;
};

export const patchVideoStyle = async (itemId, payload) => {
  const res = await API.patch(`/admin/video/styles/item/${itemId}`, payload);
  return res.data;
};

export const getVideoFormats = async () => {
  const res = await API.get("/admin/video/formats");
  return res.data.data;
};

export const toggleFormatsSection = async (payload) => {
  const res = await API.patch("/admin/video/formats/toggle", payload);
  return res.data;
};

export const patchFormat = async (itemId, payload) => {
  const res = await API.patch(`/admin/video/formats/item/${itemId}`, payload);
  return res.data;
};

export const getVideoHooks = async () => {
  const res = await API.get("/admin/video/hooks");
  return res.data.data;
};

/** PATCH /admin/video/hooks/toggle */
export const toggleHooksSection = async (payload) => {
  const res = await API.patch("/admin/video/hooks/toggle", payload);
  return res.data;
};

/** PATCH /admin/video/hooks/item/:itemId */
export const patchHook = async (itemId, payload) => {
  const res = await API.patch(`/admin/video/hooks/item/${itemId}`, payload);
  return res.data;
};
