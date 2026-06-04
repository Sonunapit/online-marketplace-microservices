import { useState } from "react";

import {
  loginUser,
} from "../services/auth.service";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import Navbar
from "../../../components/navbar/Navbar";

const LoginPage = () => {

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange =
    (e) => {

      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value,
      });

    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setLoading(true);

      try {

        const response =
          await loginUser(
            formData
          );

        // Save Token
        localStorage.setItem(
          "token",
          response.data.token
        );

        // Save User
        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );

        alert(
          "Login Successful"
        );

        // Redirect
        navigate("/profile");

        // Refresh Navbar
        window.location.reload();

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
          "Login Failed"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex items-center justify-center px-5 pt-20">

        <form
          onSubmit={
            handleSubmit
          }
          className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-[400px]"
        >

          <h1 className="text-4xl font-bold mb-6 text-center">

            Login

          </h1>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-3 rounded-xl mb-4 outline-none focus:border-black"
            onChange={
              handleChange
            }
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-3 rounded-xl mb-6 outline-none focus:border-black"
            onChange={
              handleChange
            }
          />

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-xl text-lg font-semibold hover:opacity-90 transition"
          >

            {
              loading
                ? "Logging..."
                : "Login"
            }

          </button>

          {/* Register */}
          <div className="mt-6 text-center">

            <p className="text-gray-500">

              Don't have an
              account?

              <Link
                to="/register"
                className="text-black font-semibold ml-2 hover:underline"
              >

                Register

              </Link>

            </p>

          </div>

        </form>

      </div>

    </div>

  );

};

export default LoginPage;