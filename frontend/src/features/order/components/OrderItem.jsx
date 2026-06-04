const OrderItem = ({ item }) => {
  return (
    <div className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm">

      <div className="flex-1">

        <h3 className="text-lg font-semibold">
          Product ID: {item.product}
        </h3>

        <p className="text-gray-500">
          Quantity: {item.quantity}
        </p>

        <p className="text-green-600 font-semibold mt-2">
          ₹{item.price?.amount}
        </p>

      </div>

    </div>
  );
};

export default OrderItem;