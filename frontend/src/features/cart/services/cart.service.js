import { cartAPI } from "../../../api/axios";

// GET /api/cart/
export const getCart = async (token) => {
  return cartAPI.get("/cart", { // This matches your GET route in cart.routes.js
    headers: { Authorization: `Bearer ${token}` },
  });
};

// POST /api/cart/items
export const addToCart = async (data, token) => {
  const payload = {
    productId: data.productId,
    qty: data.quantity ?? data.qty,  // 👈 quantity → qty
  };
  console.log('Sending to cart:', payload);
  return cartAPI.post("/cart/items", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// DELETE /api/cart/items/:id (Assuming you add a delete route)
export const removeCartItem = async (id, token) => {
  // Update the endpoint here:
  return cartAPI.delete(`/cart/items/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};