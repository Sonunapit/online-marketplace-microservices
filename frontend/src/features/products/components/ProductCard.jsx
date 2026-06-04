import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition"
    >
      <img
        src={
          product.images?.[0]?.url ||
          product.images?.[0] ||
          "https://via.placeholder.com/300"
        }
        alt={product.title}
        className="h-64 w-full object-cover"
      />

      <div className="p-5">
        <h1 className="text-2xl font-bold">{product.name}</h1>

        <p className="text-gray-500 mt-2 line-clamp-2">{product.description}</p>

        <div className="flex justify-between items-center mt-5">
          <h2 className="text-2xl font-bold">₹ {product.price?.amount}</h2>

          <button className="bg-black text-white px-5 py-2 rounded-xl">
            View
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
