import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../services/order.service";

const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const handleSubmit = async () => {
    try {
      if (
        !address.street ||
        !address.city ||
        !address.state ||
        !address.pincode ||
        !address.country
      ) {
        return alert("Please fill all address fields");
      }

      setLoading(true);

      const token = localStorage.getItem("token");

      console.log("ADDRESS =>", address);

      const response = await createOrder(
        {
          shippingAddress: address,
        },
        token
      );

      console.log("ORDER RESPONSE =>", response.data);

      alert("Order Created Successfully");

      navigate("/orders");
    } catch (error) {
      console.log(
        "ERROR =>",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to create order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow">

        {/* Buy Now Product */}
        {state?.buyNow && (
          <div className="border rounded-2xl p-5 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Buy Now Product
            </h2>

            <div className="flex gap-4 items-center">

              <img
                src={
                  state.product?.images?.[0]?.url ||
                  state.product?.image
                }
                alt={
                  state.product?.title
                }
                className="w-28 h-28 rounded-xl object-cover"
              />

              <div>
                <h3 className="text-xl font-semibold">
                  {state.product?.title}
                </h3>

                <p className="text-gray-500">
                  Qty: {state.quantity}
                </p>

                <p className="font-bold text-2xl mt-2">
                  ₹
                  {
                    state.product?.price
                      ?.amount
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6">
          Shipping Address
        </h1>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Street"
            value={address.street}
            onChange={(e) =>
              setAddress({
                ...address,
                street: e.target.value,
              })
            }
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) =>
              setAddress({
                ...address,
                city: e.target.value,
              })
            }
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="State"
            value={address.state}
            onChange={(e) =>
              setAddress({
                ...address,
                state: e.target.value,
              })
            }
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) =>
              setAddress({
                ...address,
                pincode: e.target.value,
              })
            }
            className="w-full border rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Country"
            value={address.country}
            onChange={(e) =>
              setAddress({
                ...address,
                country: e.target.value,
              })
            }
            className="w-full border rounded-xl p-3"
          />

        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-2xl mt-8 font-semibold"
        >
          {loading
            ? "Creating Order..."
            : "Place Order"}
        </button>

      </div>
    </div>
  );
};

export default CheckoutPage;