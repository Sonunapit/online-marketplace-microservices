import { useEffect, useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import { useNavigate } from "react-router-dom";
import { getCart, removeCartItem } from "../services/cart.service";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totals, setTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await getCart(token);

      console.log("CART RESPONSE =>", response.data);

      setCartItems(response.data.items || []);
      setTotals(response.data.totals || {});
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await removeCartItem(productId, token);

      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId),
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 py-10">
        <h1 className="text-4xl font-bold mb-10">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <EmptyState title="Cart Is Empty" />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white p-5 rounded-3xl shadow-sm flex flex-col md:flex-row gap-5"
                >
                  <img
                    src={item.image || "https://via.placeholder.com/180"}
                    alt={item.name}
                    className="w-full md:w-[180px] h-[180px] object-cover rounded-2xl"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{item.name}</h2>

                      <p className="text-gray-500 mt-2">
                        Quantity: {item.quantity}
                      </p>

                      <h3 className="text-2xl font-bold mt-4">₹{item.price}</h3>

                      <p className="text-green-600 font-semibold mt-2">
                        Total: ₹{item.lineTotal}
                      </p>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="bg-red-500 text-white px-6 py-3 rounded-2xl"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div>
              <div className="bg-white p-8 rounded-3xl shadow-sm sticky top-24">
                <h1 className="text-3xl font-bold mb-8">Summary</h1>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totals.subtotal || 0}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{totals.tax || 0}</span>
                  </div>

                  <div className="flex justify-between text-xl font-bold border-t pt-4">
                    <span>Total</span>
                    <span>₹{totals.total || 0}</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate("/checkout", {
                      state: {
                        cartItems,
                        totals,
                      },
                    })
                  }
                  className="w-full bg-black text-white p-4 rounded-2xl text-lg font-semibold mt-8"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
