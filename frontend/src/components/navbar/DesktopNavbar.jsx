import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const DesktopNavbar = () => {

  const [token, setToken] =
    useState(null);

  useEffect(() => {

    const storedToken =
      localStorage.getItem("token");

    setToken(storedToken);

  }, []);

  return (

    <nav className="hidden md:flex bg-white shadow-sm px-10 py-5 justify-between items-center sticky top-0 z-50">

      {/* Logo */}
      <h1 className="text-3xl font-bold">
        MarketPlace
      </h1>

      {/* Links */}
      <div className="flex gap-8 items-center">

        <Link to="/">
          Home
        </Link>

        <Link to="/products">
          Products
        </Link>

        <Link to="/reels">
          Reels
        </Link>

        {/* Cart Only Logged User */}
        {
          token && (

            <Link to="/cart">
              Cart
            </Link>

          )
        }

        {/* Profile */}
        {
          token ? (

            <Link
              to="/profile"
              className="bg-black text-white px-5 py-2 rounded-xl"
            >
              Profile
            </Link>

          ) : (

            <div className="flex gap-4">

              <Link
                to="/login"
                className="border px-5 py-2 rounded-xl"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-black text-white px-5 py-2 rounded-xl"
              >
                Register
              </Link>

            </div>

          )
        }

      </div>

    </nav>

  );

};

export default DesktopNavbar;