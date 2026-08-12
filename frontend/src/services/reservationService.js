import api from "./api";

export const createReservation = async (productId, quantity) => {
  const response = await api.post("/reservations", {
    productId,
    quantity,
  });

  return response.data;
};

export const getReservations = async ({
  page = 0,
  size = 10,
} = {}) => {
  const response = await api.get("/reservations", {
    params: {
      page,
      size,
    },
  });

  return response.data;
};

export const getReservationById = async (id) => {
  const response = await api.get(`/reservations/${id}`);
  return response.data;
};

export const confirmReservation = async (id) => {
  const response = await api.post(
    `/reservations/${id}/confirm`
  );

  return response.data;
};

export const cancelReservation = async (id) => {
  const response = await api.post(
    `/reservations/${id}/cancel`
  );

  return response.data;
};

export const getAllReservations = async ({
  page = 0,
  size = 10,
} = {}) => {
  const response = await api.get("/reservations", {
    params: {
      page,
      size,
    },
  });

  return response.data;
};