import {
  productAPI,
} from "../../../api/axios";

// Get Products
export const getProducts =
  async () => {

    return productAPI.get(
      "/products"
    );

};

// Get Product By Id
export const getProductById =
  async (id) => {

    return productAPI.get(
      `/products/${id}`
    );

};

// Create Product
export const createProduct =
  async (data, token) => {

    return productAPI.post(
      "/products",
      data,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

};

// Seller Products
export const getSellerProducts =
  async (token) => {

    return productAPI.get(
      "/products/seller",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

};

// Delete Product
export const deleteProduct =
  async (id, token) => {

    return productAPI.delete(
      `/products/${id}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

};