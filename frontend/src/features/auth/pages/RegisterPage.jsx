import { useState } from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import Navbar from "../../../components/navbar/Navbar";

import {
  registerUser,
} from "../services/auth.service";

const RegisterPage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "user",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      await registerUser({

        username: formData.username,

        email: formData.email,

        password: formData.password,

        fullName: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },

        role: formData.role,

      });

      alert("Register Successful");

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Register Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex items-center justify-center px-5 py-16">

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-10 rounded-3xl shadow-xl w-full max-w-[450px]"
        >

          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">

            Register

          </h1>

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full border p-3 rounded-xl mb-4 outline-none focus:border-black"
            onChange={handleChange}
          />

          {/* First Name */}
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="w-full border p-3 rounded-xl mb-4 outline-none focus:border-black"
            onChange={handleChange}
          />

          {/* Last Name */}
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="w-full border p-3 rounded-xl mb-4 outline-none focus:border-black"
            onChange={handleChange}
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-3 rounded-xl mb-4 outline-none focus:border-black"
            onChange={handleChange}
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-3 rounded-xl mb-4 outline-none focus:border-black"
            onChange={handleChange}
          />

          {/* Role */}
          <select
            name="role"
            className="w-full border p-3 rounded-xl mb-6 outline-none focus:border-black"
            onChange={handleChange}
          >

            <option value="user">
              User
            </option>

            <option value="seller">
              Seller
            </option>

          </select>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-xl text-lg font-semibold hover:opacity-90 transition"
          >

            {
              loading
                ? "Registering..."
                : "Register"
            }

          </button>

          {/* Login Link */}
          <div className="mt-6 text-center">

            <p className="text-gray-500">

              Already have an account?

              <Link
                to="/login"
                className="text-black font-semibold ml-2 hover:underline"
              >
                Login
              </Link>

            </p>

          </div>

        </form>

      </div>

    </div>

  );

};

export default RegisterPage;