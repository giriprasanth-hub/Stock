import api from "./api";

export const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data;
};

export const changeUserRole = async (id, role) => {
  const response = await api.patch(
    `/admin/users/${id}/role`,
    { role }
  );

  return response.data;
};

export const toggleUserStatus = async (id) => {
  const response = await api.patch(
    `/admin/users/${id}/status`
  );

  return response.data;
};