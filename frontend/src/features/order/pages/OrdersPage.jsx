import { useEffect, useState } from "react";

import Navbar from "../../../components/navbar/Navbar";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";

import { getMyOrders } from "../services/order.service";
import OrderCard from "../components/OrderCart";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await getMyOrders(token);

      console.log("ORDERS =>", response.data);

      setOrders(response.data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 py-10">
        <h1 className="text-4xl font-bold mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <EmptyState title="No Orders Found" />
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;