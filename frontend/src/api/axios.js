
import axios from "axios";

// Auth Service
export const authAPI = axios.create({
  baseURL: `${import.meta.env.VITE_AUTH_API_URL}/api`,
  withCredentials: true,
});

// Product Service
export const productAPI = axios.create({
  baseURL: `${import.meta.env.VITE_PRODUCT_API_URL}/api`,
  withCredentials: true,
});

// Cart Service
export const cartAPI = axios.create({
  baseURL: `${import.meta.env.VITE_CART_API_URL}/api`,
  withCredentials: true,
});

// Order Service
export const orderAPI = axios.create({
  baseURL: `${import.meta.env.VITE_ORDER_API_URL}/api/orders`,
  withCredentials: true,
});

// Payment Service
export const paymentAPI = axios.create({
  baseURL: `${import.meta.env.VITE_PAYMENT_API_URL}/api`,
  withCredentials: true,
});

// Notification Service
export const notificationAPI = axios.create({
  baseURL: `${import.meta.env.VITE_NOTIFICATION_API_URL}/api`,
  withCredentials: true,
});

// Seller Dashboard Service
export const sellerAPI = axios.create({
  baseURL: `${import.meta.env.VITE_SELLER_API_URL}/api/seller/dashboard`,
  withCredentials: true,
});

// AI Service
export const aiAPI = axios.create({
  baseURL: `${import.meta.env.VITE_AI_API_URL}/api`,
  withCredentials: true,
});
