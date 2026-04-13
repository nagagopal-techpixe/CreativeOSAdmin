import API from "./api.js";

// GET - all categories (for dropdown)
export const fetchCategories = () => API.get("/admin/categories");

// POST - create new model (called on Deploy)
export const createModel = (payload) => API.post("/admin/models", payload);

// GET - all models
export const fetchAllModels = () => API.get("/admin/models");

// GET - single model by ID
export const fetchModelById = (id) => API.get(`/admin/models/${id}`);

// GET - models by category
export const fetchModelsByCategory = (categoryId) =>
  API.get(`/admin/models/category/${categoryId}`);

// PATCH - update model
export const updateModel = (id, payload) => API.patch(`/admin/models/${id}`, payload);

export const deleteModel = (id) => API.delete(`/admin/models/${id}`);