const CartItem = ({
  item,
  handleRemove,
}) => {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm flex flex-col md:flex-row gap-5">

      {/* Product Image */}
    <img
        src={
          product.images?.[0]?.url ||
          product.images?.[0] ||
          "https://via.placeholder.com/300"
        }
        alt={product.title}
        className="h-64 w-full object-cover"
      />

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            {item.name}
          </h1>

          <h2 className="text-2xl font-bold mt-4">
            ₹{item.price}
          </h2>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">

          {/* Quantity */}
          <div className="flex items-center gap-4">

            <button className="bg-gray-200 px-4 py-2 rounded-xl">
              -
            </button>

            <span className="text-xl font-semibold">
              {item.quantity}
            </span>

            <button className="bg-gray-200 px-4 py-2 rounded-xl">
              +
            </button>

          </div>

          <div>
            <p className="font-bold text-green-600">
              Total: ₹{item.lineTotal}
            </p>
          </div>

          {/* Remove */}
          <button
            onClick={() =>
              handleRemove(item.productId)
            }
            className="bg-red-500 text-white px-6 py-3 rounded-2xl"
          >
            Remove
          </button>

        </div>

      </div>

    </div>
  );
};

export default CartItem;