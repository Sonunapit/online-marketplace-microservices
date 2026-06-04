export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">

      <img
        src={
          product.images?.[0] ||
          "https://via.placeholder.com/300"
        }
        alt={product.title}
        className="h-48 w-full object-cover rounded-xl"
      />

      <h2 className="font-bold mt-3">
        {product.title}
      </h2>

      <p className="text-sm text-gray-500">
        {product.description}
      </p>

      <div className="mt-2 font-bold text-green-600">
        ₹ {product.priceAmount}
      </div>

    </div>
  );
}