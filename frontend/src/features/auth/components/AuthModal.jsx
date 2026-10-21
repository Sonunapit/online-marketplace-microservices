
import { useState } from "react";
import { loginUser, registerUser } from "../services/auth.service";

const AuthModal = ({ setShowAuthModal }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (isLogin) {
        response = await loginUser({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await registerUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: {
            firstName: formData.firstName,
            lastName: formData.lastName,
          },
          role,
        });
      }

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response.data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      setShowAuthModal(false);
      window.location.reload();
    } catch (error) {
      console.error(
        "Authentication error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] max-w-[95vw] p-8 rounded-3xl relative">
        <button
          type="button"
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-5 text-3xl"
        >
          ×
        </button>

        <h1 className="text-3xl font-bold mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        <div className="flex gap-3 mb-5">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 p-3 rounded-xl ${
              isLogin ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 p-3 rounded-xl ${
              !isLogin ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            Register
          </button>
        </div>

        {!isLogin && (
          <>
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex-1 p-3 rounded-xl ${
                  role === "user" ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                User
              </button>

              <button
                type="button"
                onClick={() => setRole("seller")}
                className={`flex-1 p-3 rounded-xl ${
                  role === "seller" ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                Seller
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              Seller registration should also be validated by your backend.
            </p>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                required
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              />

              <input
                required
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              />

              <input
                required
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              />
            </>
          )}

          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            required
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-xl disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
