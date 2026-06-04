import { useEffect, useState } from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import Navbar from "../../../components/navbar/Navbar";
import Loader from "../../../components/common/Loader";

import {
  getOrderById,
  cancelOrder,
} from "../services/order.service";

import OrderItem from "../components/OrderItem";
import OrderStatusBadge from "../components/OrderStatusBadge";

const OrderDetailsPage = () => {

  const { id } =
    useParams();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchOrder();

  }, []);

  const fetchOrder =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await getOrderById(
            id,
            token
          );

        setOrder(
          response.data.order
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  const handleCancelOrder =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await cancelOrder(
          id,
          token
        );

        alert(
          "Order Cancelled"
        );

        fetchOrder();

      } catch (error) {

        console.log(error);

        alert(
          "Failed to cancel order"
        );

      }

    };

  if (loading) {

    return <Loader />;

  }

  if (!order) {

    return (

      <div>

        <Navbar />

        <div className="p-10">

          Order not found

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        <div className="bg-white rounded-3xl p-8 shadow-sm">

          {/* Header */}

          <div className="flex justify-between items-center mb-8">

            <div>

              <h1 className="text-3xl font-bold">

                Order Details

              </h1>

              <p className="text-gray-500 mt-2">

                #{order._id}

              </p>

            </div>

            <OrderStatusBadge
              status={order.status}
            />

          </div>

          {/* Shipping Address */}

          <div className="mb-8">

            <h2 className="text-xl font-bold mb-4">

              Shipping Address

            </h2>

            <div className="text-gray-600 space-y-1">

              <p>
                {order.shippingAddress?.street}
              </p>

              <p>
                {order.shippingAddress?.city}
              </p>

              <p>
                {order.shippingAddress?.state}
              </p>

              <p>
                {order.shippingAddress?.pincode}
              </p>

              <p>
                {order.shippingAddress?.country}
              </p>

            </div>

          </div>

          {/* Order Items */}

          <div>

            <h2 className="text-xl font-bold mb-4">

              Order Items

            </h2>

            <div className="space-y-4">

              {
                order.items?.map(
                  (item, index) => (

                    <OrderItem
                      key={index}
                      item={item}
                    />

                  )
                )
              }

            </div>

          </div>

          {/* Total */}

          <div className="mt-10 border-t pt-6">

            <div className="flex justify-between text-2xl font-bold">

              <span>

                Total

              </span>

              <span>

                ₹
                {order.totalPrice?.amount}

              </span>

            </div>

            {/* Payment Status */}

            <div className="mt-5">

              <span className="font-semibold">

                Payment Status:

              </span>

              <span
                className={`ml-3 px-3 py-1 rounded-lg text-white ${
                  order.paymentStatus === "PAID"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}
              >

                {
                  order.paymentStatus ||
                  "PENDING"
                }

              </span>

            </div>

          </div>

          {/* Action Buttons */}

          {
            order.status === "PENDING" &&
            order.paymentStatus !== "PAID" && (

              <div className="flex flex-wrap gap-4 mt-8">

                {/* Pay Now */}

                <Link
                  to={`/payment/${order._id}`}
                  className="bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-green-700 transition"
                >

                  Pay Now

                </Link>

                {/* Cancel Order */}

                <button
                  onClick={
                    handleCancelOrder
                  }
                  className="bg-red-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-red-600 transition"
                >

                  Cancel Order

                </button>

              </div>

            )
          }

          {/* Payment Success */}

          {
            order.paymentStatus === "PAID" && (

              <div className="mt-8">

                <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded-2xl">

                  ✅ Payment Successful

                </div>

              </div>

            )
          }

        </div>

      </div>

    </div>

  );

};

export default OrderDetailsPage;