import API from "./api";

/** GET /admin/character/types → { items, isActive } */
export const getCharacterTypes = async () => {
  const res = await API.get("/admin/character/types");
  return res.data.data;
};

/** PATCH /admin/character/types/toggle */
export const toggleCharacterTypesSection = async (payload) => {
  const res = await API.patch("/admin/character/types/toggle", payload);
  return res.data;
};

/** PATCH /admin/character/types/:itemId */
export const patchCharacterType = async (itemId, payload) => {
  const res = await API.patch(`/admin/character/types/${itemId}`, payload);
  return res.data;
};

/** GET /admin/character/styles → { items, isActive } */
export const getCharacterStyles = async () => {
  const res = await API.get("/admin/character/styles");
  return res.data.data;
};

/** PATCH /admin/character/styles/toggle */
export const toggleCharacterStylesSection = async (payload) => {
  const res = await API.patch("/admin/character/styles/toggle", payload);
  return res.data;
};

/** PATCH /admin/character/styles/:itemId */
export const patchCharacterStyle = async (itemId, payload) => {
  const res = await API.patch(`/admin/character/styles/${itemId}`, payload);
  return res.data;
};

/** GET /admin/character/details → { items: [groupSchema], isActive } */
export const getCharacterDetails = async () => {
  const res = await API.get("/admin/character/details");
  return res.data.data;
};

/** PATCH /admin/character/details/toggle */
export const toggleCharacterDetailsSection = async (payload) => {
  const res = await API.patch("/admin/character/details/toggle", payload);
  return res.data;
};

/** PATCH /admin/character/details/group/:groupId/toggle */
export const toggleCharacterDetailGroup = async (groupId, payload) => {
  const res = await API.patch(
    `/admin/character/details/group/${groupId}/toggle`,
    payload,
  );
  return res.data;
};

/** PATCH /admin/character/details/group/:groupId/opt/:optId/toggle */
export const toggleCharacterDetailOpt = async (groupId, optId, payload) => {
  const res = await API.patch(
    `/admin/character/details/group/${groupId}/opt/${optId}/toggle`,
    payload,
  );
  return res.data;
};

/** GET /admin/character/poses → { items, isActive } */
export const getCharacterPoses = async () => {
  const res = await API.get("/admin/character/poses");
  return res.data.data;
};

/** PATCH /admin/character/poses/toggle */
export const toggleCharacterPosesSection = async (payload) => {
  const res = await API.patch("/admin/character/poses/toggle", payload);
  return res.data;
};

/** PATCH /admin/character/poses/:itemId */
export const patchCharacterPose = async (itemId, payload) => {
  const res = await API.patch(`/admin/character/poses/${itemId}`, payload);
  return res.data;
};
