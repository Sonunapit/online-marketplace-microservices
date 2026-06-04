import { useNavigate } from "react-router-dom";

const ProductDetails = ({
  product,
  handleAddToCart,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-5xl font-bold">
        {product.name || product.title}
      </h1>

      <p className="text-gray-500 text-lg mt-5">
        {product.description}
      </p>

      <h2 className="text-4xl font-bold mt-8">
        ₹ {product.price?.amount}
      </h2>

      <h3 className="text-xl mt-5">
        Stock: {product.stock}
      </h3>

      <div className="flex gap-4 mt-10">
        <button
          onClick={handleAddToCart}
          className="bg-black text-white px-8 py-4 rounded-2xl"
        >
          Add To Cart
        </button>

        <button
          className="border px-8 py-4 rounded-2xl"
          onClick={() =>
            navigate("/CheckoutPage", {
              state: {
                buyNow: true,
                product,
                quantity: 1,
              },
            })
          }
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;