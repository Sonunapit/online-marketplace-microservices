import { useState } from "react";
import {
  loginUser,
  registerUser,
} from "../services/auth.service";

const AuthModal = ({ setShowAuthModal }) => {

  const [isLogin, setIsLogin] =
    useState(true);

  const [role, setRole] =
    useState("user");

  const [formData, setFormData] =
    useState({
      username: "",
      email: "",
      password: "",
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // LOGIN
      if (isLogin) {

        const response =
          await loginUser({
            email: formData.email,
            password: formData.password,
          });

        localStorage.setItem(
          "token",
          response.data.token
        );

      }

      // REGISTER
      else {

        const response =
          await registerUser({
            username: formData.username,
            email: formData.email,
            password: formData.password,

            fullName: {
              firstName: "Sonu",
              lastName: "Thakur",
            },

            role,
          });

        localStorage.setItem(
          "token",
          response.data.token
        );

      }

      window.location.reload();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

  };

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-[400px] p-8 rounded-3xl relative">

        {/* Close */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-5 text-3xl"
        >
          ×
        </button>

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-6">

          {
            isLogin
              ? "Welcome Back"
              : "Create Account"
          }

        </h1>

        {/* Tabs */}
        <div className="flex gap-3 mb-5">

          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 p-3 rounded-xl ${
              isLogin
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 p-3 rounded-xl ${
              !isLogin
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            Register
          </button>

        </div>

        {/* Role */}
        {
          !isLogin && (

            <div className="flex gap-3 mb-5">

              <button
                onClick={() => setRole("user")}
                className={`flex-1 p-3 rounded-xl ${
                  role === "user"
                    ? "bg-black text-white"
                    : "bg-gray-200"
                }`}
              >
                User
              </button>

              <button
                onClick={() => setRole("seller")}
                className={`flex-1 p-3 rounded-xl ${
                  role === "seller"
                    ? "bg-black text-white"
                    : "bg-gray-200"
                }`}
              >
                Seller
              </button>

            </div>

          )
        }

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {
            !isLogin && (
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full border p-3 rounded-xl"
                onChange={handleChange}
              />
            )
          }

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-3 rounded-xl"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-3 rounded-xl"
            onChange={handleChange}
          />

          <button className="w-full bg-black text-white p-3 rounded-xl">

            {
              isLogin
                ? "Login"
                : "Register"
            }

          </button>

        </form>

      </div>

    </div>

  );

};

export default AuthModal;