import { paymentAPI } from "../../../api/axios";

export const createPayment = async (
  orderId,
  token
) => {

  return paymentAPI.post(
    `/payments/create/${orderId}`,
    {},
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

};

export const verifyPayment = async (
  data,
  token
) => {

  return paymentAPI.post(
    "/payments/verify",
    data,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

};