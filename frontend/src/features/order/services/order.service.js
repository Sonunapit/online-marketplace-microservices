import { orderAPI } from "../../../api/axios";

// POST /api/orders
export const createOrder = async (data, token) => {
  return orderAPI.post("/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// GET /api/orders/me
export const getMyOrders = async (token) => {
  return orderAPI.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// GET /api/orders/:id
export const getOrderById = async (id, token) => {
  return orderAPI.get(`/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// POST /api/orders/:id/cancel
export const cancelOrder = async (id, token) => {
  return orderAPI.post(`/${id}/cancel`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// PATCH /api/orders/:id/address
export const updateOrderAddress = async (
  id,
  address,
  token
) => {
  return orderAPI.patch(
    `/orders/${id}/address`,
    {
      shippingAddress: address,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};