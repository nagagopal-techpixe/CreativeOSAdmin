import API from "./api";

/** GET /admin/voice/types → { items, isActive } */
export const getVoiceTypes = async () => {
  const res = await API.get("/admin/voice/types");
  return res.data.data;
};

/** PATCH /admin/voice/types/toggle */
export const toggleVoiceTypesSection = async (payload) => {
  const res = await API.patch("/admin/voice/types/toggle", payload);
  return res.data;
};

/** GET /admin/voice/tones → { items, isActive } */
export const getVoiceTones = async () => {
  const res = await API.get("/admin/voice/tones");
  return res.data.data;
};

/** PATCH /admin/voice/tones/toggle */
export const toggleVoiceTonesSection = async (payload) => {
  const res = await API.patch("/admin/voice/tones/toggle", payload);
  return res.data;
};

/** PATCH /admin/voice/tones/:itemId */
export const patchVoiceTone = async (itemId, payload) => {
  const res = await API.patch(`/admin/voice/tones/${itemId}`, payload);
  return res.data;
};

/** PATCH /admin/voice/types/:itemId */
export const patchVoiceType = async (itemId, payload) => {
  const res = await API.patch(`/admin/voice/types/${itemId}`, payload);
  return res.data;
};

export const getVoicePacing = async () => {
  const res = await API.get("/admin/voice/pacing");
  return res.data.data;
};

/** PATCH /admin/voice/pacing/toggle */
export const toggleVoicePacingSection = async (payload) => {
  const res = await API.patch("/admin/voice/pacing/toggle", payload);
  return res.data;
};

/** PATCH /admin/voice/pacing/:itemId */
export const patchVoicePacing = async (itemId, payload) => {
  const res = await API.patch(`/admin/voice/pacing/${itemId}`, payload);
  return res.data;
};
