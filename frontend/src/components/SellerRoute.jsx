import {
  Navigate,
} from "react-router-dom";

const SellerRoute = ({
  children,
}) => {

  // Token
  const token =
    localStorage.getItem(
      "token"
    );

  // User
  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  // Not Logged In
  if (!token) {

    return (
      <Navigate to="/login" />
    );

  }

  // No User Data
  if (!user) {

    return (
      <Navigate to="/login" />
    );

  }

  // Not Seller
  if (
    user.role !== "seller"
  ) {

    return (
      <Navigate to="/" />
    );

  }

  return children;

};

export default SellerRoute;