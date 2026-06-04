import {
  useParams,
} from "react-router-dom";

import PaymentButton
from "../components/PaymentButton";

const PaymentPage = () => {

  const { orderId } =
    useParams();

  return (

    <div className="min-h-screen flex items-center justify-center">

      <PaymentButton
        orderId={orderId}
      />

    </div>

  );

};

export default PaymentPage;