import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const DesktopNavbar = () => {
const [token, setToken] =
useState(null);

const [user, setUser] =
useState(null);

useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  setToken(storedToken);

  if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
    try {
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("user");
    }
  }
}, []);

return ( <nav
   className="
     hidden
     md:flex
     bg-white
     shadow-sm
     px-10
     py-5
     justify-between
     items-center
     sticky
     top-0
     z-50
   "
 >
{/* Logo */} <h1 className="text-3xl font-bold">
MarketPlace </h1>


  {/* Links */}
  <div className="flex gap-8 items-center">
    <Link
      to="/"
      className="hover:text-indigo-600 transition"
    >
      Home
    </Link>

    <Link
      to="/products"
      className="hover:text-indigo-600 transition"
    >
      Products
    </Link>

    <Link
      to="/reels"
      className="hover:text-indigo-600 transition"
    >
      Reels
    </Link>

    {/* Cart Only For Normal Users */}
    {token &&
      user?.role ===
        "user" && (
        <Link
          to="/cart"
          className="hover:text-indigo-600 transition"
        >
          Cart
        </Link>
      )}

    {/* Profile / Auth */}
    {token ? (
      <Link
        to="/profile"
        className="
          bg-black
          text-white
          px-5
          py-2
          rounded-xl
          hover:bg-gray-800
          transition
        "
      >
        Profile
      </Link>
    ) : (
      <div className="flex gap-4">
        <Link
          to="/login"
          className="
            border
            px-5
            py-2
            rounded-xl
            hover:bg-gray-100
            transition
          "
        >
          Login
        </Link>

        <Link
          to="/register"
          className="
            bg-black
            text-white
            px-5
            py-2
            rounded-xl
            hover:bg-gray-800
            transition
          "
        >
          Register
        </Link>
      </div>
    )}
  </div>
</nav>


);
};

export default DesktopNavbar;
