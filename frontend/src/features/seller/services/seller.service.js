import { sellerAPI } from "../../../api/axios";

export const getSellerMetrics = async () => {
  const res = await sellerAPI.get("/metrics");
  return res.data;
};

export const getSellerOrders = async () => {
  const res = await sellerAPI.get("/orders");
  return res.data;
};

export const getSellerProducts = async () => {
  const res = await sellerAPI.get("/products");
  return res.data;
};