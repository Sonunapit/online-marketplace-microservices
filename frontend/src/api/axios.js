import axios from "axios";

// Auth Service
export const authAPI = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// Product Service
export const productAPI = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

// Cart Service
export const cartAPI = axios.create({
  baseURL: "http://localhost:3002/api",
  withCredentials: true,
});

export const orderAPI = axios.create({
  baseURL: "http://localhost:3003/api/orders",
  withCredentials: true,
});

export const paymentAPI = axios.create({
  baseURL: "http://localhost:3004/api",
  withCredentials: true,
});

// AI Buddy Service
export const aiBuddyAPI = axios.create({
  baseURL: "http://localhost:3005/api",
  withCredentials: true,
});
// Notification Service
export const notificationAPI = axios.create({
  baseURL: "http://localhost:3006/api",
  withCredentials: true,
});

// Seller Dashboard Service
export const sellerAPI = axios.create({
  baseURL: "http://localhost:3007/api/seller/dashboard",
  withCredentials: true,
});
