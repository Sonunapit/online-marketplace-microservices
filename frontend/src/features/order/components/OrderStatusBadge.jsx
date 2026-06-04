const OrderStatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";

      case "SHIPPED":
        return "bg-purple-100 text-purple-700";

      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusClass()}`}
    >
      {status}
    </span>
  );
};

export default OrderStatusBadge;