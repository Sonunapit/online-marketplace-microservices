
import axios from "axios";

const isLocal = import.meta.env.DEV;

// Auth Service — Local: 3000
export const authAPI = axios.create({
  baseURL: isLocal
    ? "http://localhost:3000/api"
    : "https://online-marketplace-microservices.onrender.com/api",
  withCredentials: true,
});

// Product Service — Local: 3001
export const productAPI = axios.create({
  baseURL: isLocal
    ? "http://localhost:3001/api"
    : "https://online-marketplace-microservices-1.onrender.com/api",
  withCredentials: true,
});

// Cart Service — Local: 3002
export const cartAPI = axios.create({
  baseURL: isLocal
    ? "http://localhost:3002/api"
    : "https://online-marketplace-microservices-cart.onrender.com/api",
  withCredentials: true,
});

// Order Service — Local: 3003
export const orderAPI = axios.create({
  baseURL: isLocal
    ? "http://localhost:3003/api/orders"
    : "https://online-marketplace-microservices-or.vercel.app/api/orders",
  withCredentials: true,
});

// Payment Service — Local: 3004
export const paymentAPI = axios.create({
  baseURL: isLocal
    ? "http://localhost:3004/api"
    : "https://online-marketplace-microservices-pa.vercel.app/api",
  withCredentials: true,
});

// AI Service — Local: 3005
export const aiAPI = axios.create({
  baseURL: isLocal
    ? "http://localhost:3005/api"
    : "https://online-marketplace-microservices-ai.vercel.app/api",
  withCredentials: true,
});

// Seller Dashboard — Local: 3007
export const sellerAPI = axios.create({
  baseURL: isLocal
    ? "http://localhost:3007/api/seller/dashboard"
    : "https://online-marketplace-microservices-se.vercel.app/api/seller/dashboard",
  withCredentials: true,
});
