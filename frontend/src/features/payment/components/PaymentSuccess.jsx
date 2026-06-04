import {
  Link,
} from "react-router-dom";

const PaymentSuccess = () => {

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5">

      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full">

        {/* Success Icon */}
        <div className="h-24 w-24 mx-auto bg-green-500 rounded-full flex items-center justify-center text-white text-5xl">

          ✓

        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mt-6">

          Payment Successful

        </h1>

        {/* Message */}
        <p className="text-gray-500 mt-4">

          Your order has been placed successfully.
          Thank you for shopping with us.

        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4 mt-8">

          <Link
            to="/products"
            className="bg-black text-white py-3 rounded-2xl font-semibold"
          >

            Continue Shopping

          </Link>

          <Link
            to="/profile"
            className="border py-3 rounded-2xl font-semibold"
          >

            View Profile

          </Link>

        </div>

      </div>

    </div>

  );

};

export default PaymentSuccess;