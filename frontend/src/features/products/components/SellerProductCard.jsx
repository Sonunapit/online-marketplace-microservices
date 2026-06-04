import { Link } from "react-router-dom";

const SellerProductCard = ({ product, handleDelete }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
      {/* Image */}
      <img
        src={
          product.images?.[0]?.url ||
          product.images?.[0] ||
          "https://via.placeholder.com/300"
        }
        alt={product.name}
        className="w-full h-[250px] object-cover"
      />

      {/* Content */}
      <div className="p-5">
        <h1 className="text-2xl font-bold">{product.name}</h1>

        <p className="text-gray-500 mt-2 line-clamp-2">{product.description}</p>

        <div className="flex justify-between items-center mt-5">
          <h2 className="text-2xl font-bold">₹ {product.price?.amount}</h2>

          <h3 className="text-lg">
            Stock:
            {product.stock}
          </h3>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Link
            to={`/products/${product._id}`}
            className="flex-1 border text-center py-3 rounded-2xl"
          >
            View
          </Link>

          <button className="flex-1 bg-black text-white py-3 rounded-2xl">
            Edit
          </button>

          <button
            onClick={() => handleDelete(product._id)}
            className="flex-1 bg-red-500 text-white py-3 rounded-2xl"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProductCard;
