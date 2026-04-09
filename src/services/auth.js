import API from "./api";

export const adminLogin = async (data) => {
  const res = await API.post("/auth/admin/login", data);
  return res.data;
};

export const fetchAdminProfile = async () => {
  const res = await API.get("/auth/admin/profile");
  return res.data.data;
};
