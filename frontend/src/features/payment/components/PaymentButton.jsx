import loadRazorpay from "../utils/loadRazorpay";

import {
  createPayment,
  verifyPayment,
} from "../services/payment.service";

import {
  useNavigate,
} from "react-router-dom";

const PaymentButton = ({
  orderId,
}) => {

  const navigate =
    useNavigate();

  const handlePayment =
    async () => {

      try {

        const loaded =
          await loadRazorpay();

        if (!loaded) {

          alert(
            "Razorpay SDK Failed To Load"
          );

          return;

        }

        const token =
          localStorage.getItem(
            "token"
          );

        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

        const response =
          await createPayment(
            orderId,
            token
          );

        const payment =
          response.data.payment;

        console.log(
          "PAYMENT =>",
          payment
        );

        const options = {

          key:
            import.meta.env
              .VITE_RAZORPAY_KEY,

          amount:
            payment.price.amount,

          currency:
            payment.price.currency,

          order_id:
            payment.razorpayOrderId,

          name:
            "Online Market",

          description:
            "Order Payment",

          image:
            "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",

          prefill: {

            name:
              user?.fullName
                ? `${user.fullName.firstName} ${user.fullName.lastName}`
                : "",

            email:
              user?.email ||
              "",

            contact:
              user?.phone ||
              "",

          },

          notes: {

            orderId:
              orderId,

            userId:
              user?._id,

          },

          theme: {
            color:
              "#000000",
          },

          handler:
            async (
              razorpayResponse
            ) => {

              try {

                console.log(
                  razorpayResponse
                );

                await verifyPayment(
                  {

                    razorpayOrderId:
                      razorpayResponse.razorpay_order_id,

                    paymentId:
                      razorpayResponse.razorpay_payment_id,

                    signature:
                      razorpayResponse.razorpay_signature,

                  },

                  token
                );

                alert(
                  "Payment Successful"
                );

                navigate(
                  "/payment-success"
                );

              } catch (error) {

                console.log(
                  error
                );

                alert(
                  "Payment Verification Failed"
                );

              }

            },

          modal: {

            ondismiss:
              function () {

                alert(
                  "Payment Cancelled"
                );

              },

          },

        };

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.open();

      } catch (error) {

        console.log(error);

        alert(
          "Payment Failed"
        );

      }

    };

  return (

    <button
      onClick={
        handlePayment
      }
      className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-semibold"
    >

      Pay Now

    </button>

  );

};

export default PaymentButton;