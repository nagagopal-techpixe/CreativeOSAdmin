import API from "./api";

/** GET /admin/music/types → { items, isActive } */
export const getMusicTypes = async () => {
  const res = await API.get("/admin/music/types");
  return res.data.data;
};

/** PATCH /admin/music/types/toggle */
export const toggleMusicTypesSection = async (payload) => {
  const res = await API.patch("/admin/music/types/toggle", payload);
  return res.data;
};

/** PATCH /admin/music/types/:itemId */
export const patchMusicType = async (itemId, payload) => {
  const res = await API.patch(`/admin/music/types/${itemId}`, payload);
  return res.data;
};

/** GET /admin/music/genres → { items, isActive } */
export const getMusicGenres = async () => {
  const res = await API.get("/admin/music/genres");
  return res.data.data;
};

/** PATCH /admin/music/genres/toggle */
export const toggleMusicGenresSection = async (payload) => {
  const res = await API.patch("/admin/music/genres/toggle", payload);
  return res.data;
};

/** PATCH /admin/music/genres/:itemId */
export const patchMusicGenre = async (itemId, payload) => {
  const res = await API.patch(`/admin/music/genres/${itemId}`, payload);
  return res.data;
};

/** GET /admin/music/details → { items: [groupSchema], isActive } */
export const getMusicDetails = async () => {
  const res = await API.get("/admin/music/details");
  return res.data.data;
};

/** PATCH /admin/music/details/toggle */
export const toggleMusicDetailsSection = async (payload) => {
  const res = await API.patch("/admin/music/details/toggle", payload);
  return res.data;
};

/** PATCH /admin/music/details/group/:groupId/toggle */
export const toggleMusicDetailGroup = async (groupId, payload) => {
  const res = await API.patch(
    `/admin/music/details/group/${groupId}/toggle`,
    payload,
  );
  return res.data;
};

/** PATCH /admin/music/details/group/:groupId/opt/:optId/toggle */
export const toggleMusicDetailOpt = async (groupId, optId, payload) => {
  const res = await API.patch(
    `/admin/music/details/group/${groupId}/opt/${optId}/toggle`,
    payload,
  );
  return res.data;
};

/** GET /admin/music/durations → { items, isActive } */
export const getMusicDurations = async () => {
  const res = await API.get("/admin/music/durations");
  return res.data.data;
};

/** PATCH /admin/music/durations/toggle */
export const toggleMusicDurationsSection = async (payload) => {
  const res = await API.patch("/admin/music/durations/toggle", payload);
  return res.data;
};

/** PATCH /admin/music/durations/:itemId */
export const patchMusicDuration = async (itemId, payload) => {
  const res = await API.patch(`/admin/music/durations/${itemId}`, payload);
  return res.data;
};
