import { Link } from "react-router-dom";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderCard = ({ order }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <div className="flex justify-between items-center">
        <h2 className="font-bold">
          Order #{order._id}
        </h2>

        <OrderStatusBadge status={order.status} />
      </div>

      <p className="mt-3">
        Items: {order.items?.length || 0}
      </p>

      <p className="font-semibold">
        ₹{order.totalPrice?.amount || 0}
      </p>

      <Link
        to={`/orders/${order._id}`}
        className="inline-block mt-4 bg-black text-white px-4 py-2 rounded-lg"
      >
        View Details
      </Link>
    </div>
  );
};

export default OrderCard;