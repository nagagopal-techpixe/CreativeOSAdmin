// services/dashboard.js
import API from "./api";

export const fetchAllUsers = async () => {
  const res = await API.get("/auth/admin/users"); //  no authHeader needed
  return res.data;
};

export const createUserAPI = async (form) => {
  const res = await API.post("/auth/admin/users", form); //
  return res.data;
};

//  ADD THIS
export const fetchUserById = async (userId) => {
  const res = await API.get(`/auth/admin/users/${userId}`);
  return res.data;
};

export const deleteUserAPI = async (userId) => {
  const res = await API.delete(`/auth/admin/users/${userId}`);
  return res.data;
};
