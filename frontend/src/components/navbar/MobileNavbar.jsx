import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

const MobileNavbar = () => {

  const location = useLocation();

  const [token, setToken] =
    useState(null);

  // Check Login
  useEffect(() => {

    const storedToken =
      localStorage.getItem("token");

    setToken(storedToken);

  }, []);

  return (

    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl z-50">

      <div className="flex justify-around items-center py-4">

        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center ${
            location.pathname === "/"
              ? "text-black"
              : "text-gray-400"
          }`}
        >

          <span className="text-2xl">
            🏠
          </span>

          <span className="text-xs">
            Home
          </span>

        </Link>

        {/* Products */}
        <Link
          to="/products"
          className={`flex flex-col items-center ${
            location.pathname === "/products"
              ? "text-black"
              : "text-gray-400"
          }`}
        >

          <span className="text-2xl">
            🛍️
          </span>

          <span className="text-xs">
            Products
          </span>

        </Link>

        {/* Reels */}
        <Link
          to="/reels"
          className={`flex flex-col items-center ${
            location.pathname === "/reels"
              ? "text-black"
              : "text-gray-400"
          }`}
        >

          <span className="text-2xl">
            🎬
          </span>

          <span className="text-xs">
            Reels
          </span>

        </Link>

        {/* Cart Only Login */}
        {
          token && (

            <Link
              to="/cart"
              className={`flex flex-col items-center ${
                location.pathname === "/cart"
                  ? "text-black"
                  : "text-gray-400"
              }`}
            >

              <span className="text-2xl">
                🛒
              </span>

              <span className="text-xs">
                Cart
              </span>

            </Link>

          )
        }

        {/* Profile */}
        <Link
          to={
            token
              ? "/profile"
              : "/login"
          }
          className={`flex flex-col items-center ${
            location.pathname === "/profile"
              ? "text-black"
              : "text-gray-400"
          }`}
        >

          <span className="text-2xl">
            👤
          </span>

          <span className="text-xs">
            {
              token
                ? "Profile"
                : "Login"
            }
          </span>

        </Link>

      </div>

    </nav>

  );

};

export default MobileNavbar;