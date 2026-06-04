import { useEffect, useState } from "react";

import {
  getSellerMetrics,
  getSellerOrders,
  getSellerProducts,
} from "../services/seller.service";

import AnalyticsCard from "../components/AnalyticsCard";
import ProductTable from "../components/ProductTable";

export default function SellerDashboard() {
  const [metrics, setMetrics] = useState({});
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const metricsData =
        await getSellerMetrics();

      const ordersData =
        await getSellerOrders();

      const productsData =
        await getSellerProducts();

      setMetrics(metricsData);
      setOrders(
        ordersData.orders || []
      );
      setProducts(
        productsData.products || []
      );

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Seller Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-5 mb-8">

        <AnalyticsCard
          title="Total Sales"
          value={metrics.totalSales || 0}
        />

        <AnalyticsCard
          title="Orders"
          value={orders.length}
        />

        <AnalyticsCard
          title="Products"
          value={products.length}
        />

      </div>

      <ProductTable
        products={products}
      />

    </div>
  );
}