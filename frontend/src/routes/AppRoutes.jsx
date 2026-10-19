import { Routes, Route } from "react-router-dom";

// Pages
import HomePage from "../pages/Homepage";

import AiBuddyPage from "../features/aiBuddy/pages/AiBuddyPage"

import NotFound from "../pages/NotFound";

// Auth
import LoginPage from "../features/auth/pages/LoginPage";

import RegisterPage from "../features/auth/pages/RegisterPage";

// Products
import ProductPage from "../features/products/pages/ProductPage";

import ProductDetailsPage from "../features/products/pages/ProductDetailsPage";

import SellerProductsPage from "../features/products/pages/SellerProductsPage";

import CreateProductPage from "../features/products/pages/CreateProductPage";

// Cart
import CartPage from "../features/cart/pages/CartPage";

// Orders
import CheckoutPage from "../features/order/pages/CheckoutPage";
import OrdersPage from "../features/order/pages/OrdersPage";
import OrderDetailsPage from "../features/order/pages/OrderDetailsPage";

import PaymentSuccess from "../features/payment/components/PaymentSuccess";
import PaymentPage from "../features/payment/pages/PaymentPage";

// Reels
import ReelPage from "../features/reels/pages/ReelPage";

// Profile
import ProfilePage from "../features/profile/pages/ProfilePage";

import SellerDashboard from "../features/seller/pages/SellerDashboard";
import InventoryPage from "../features/seller/pages/InventoryPage";
import AnalyticsPage from "../features/seller/pages/AnalyticsPage";



// Protected Routes
import ProtectedRoute from "../components/ProtectedRoute";

import SellerRoute from "../components/SellerRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<HomePage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      {/* Products */}
      <Route path="/products" element={<ProductPage />} />

      <Route path="/products/:id" element={<ProductDetailsPage />} />

      {/* Reels */}
      <Route path="/reels" element={<ReelPage />} />

      {/* Protected User Routes */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Seller Routes */}
      <Route
        path="/seller/products"
        element={
          <SellerRoute>
            <SellerProductsPage />
          </SellerRoute>
        }
      />

      <Route
        path="/seller/create-product"
        element={
          <SellerRoute>
            <CreateProductPage />
          </SellerRoute>
        }
      />

      <Route path="/checkout" element={<CheckoutPage />} />

      <Route path="/orders" element={<OrdersPage />} />

      <Route path="/orders/:id" element={<OrderDetailsPage />} />
      <Route
        path="/payment/:orderId"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment-success"
        element={
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />

      <Route path="/seller" element={<SellerDashboard />} />

      <Route path="/seller/inventory" element={<InventoryPage />} />

      <Route path="/seller/analytics" element={<AnalyticsPage />} />

      <Route path="/ai-buddy" element={<AiBuddyPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
