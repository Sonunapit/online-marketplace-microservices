import { useEffect, useState } from "react";

import {
  getSellerMetrics,
} from "../services/seller.service";

import AnalyticsCard from "../components/AnalyticsCard";

export default function AnalyticsPage() {
  const [metrics, setMetrics] =
    useState({});

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    const data =
      await getSellerMetrics();

    setMetrics(data);
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Analytics
      </h1>

      <div className="grid md:grid-cols-4 gap-5">

        <AnalyticsCard
          title="Total Sales"
          value={metrics.totalSales || 0}
        />

        <AnalyticsCard
          title="Total Revenue"
          value={metrics.revenue || 0}
        />

        <AnalyticsCard
          title="Orders"
          value={metrics.orders || 0}
        />

        <AnalyticsCard
          title="Products"
          value={metrics.products || 0}
        />

      </div>

    </div>
  );
}