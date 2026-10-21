
import axios from "axios";

// Auth Service
export const authAPI = axios.create({
  baseURL: "https://online-marketplace-microservices.onrender.com/api",
  withCredentials: true,
});

// Product Service
export const productAPI = axios.create({
  baseURL: "https://online-marketplace-microservices-1.onrender.com/api",
  withCredentials: true,
});

// Cart Service
export const cartAPI = axios.create({
  baseURL: "https://online-marketplace-microservices-cart.onrender.com/api",
  withCredentials: true,
});

// Order Service
export const orderAPI = axios.create({
  baseURL: "https://online-marketplace-microservices-or.vercel.app/api/orders",
  withCredentials: true,
});

// Payment Service
export const paymentAPI = axios.create({
  baseURL: "https://online-marketplace-microservices-pa.vercel.app/api",
  withCredentials: true,
});

// Seller Dashboard Service
export const sellerAPI = axios.create({
  baseURL: "https://online-marketplace-microservices-se.vercel.app/api/seller/dashboard",
  withCredentials: true,
});

// AI Service
export const aiAPI = axios.create({
  baseURL: "https://online-marketplace-microservices-ai.vercel.app/api",
  withCredentials: true,
});
