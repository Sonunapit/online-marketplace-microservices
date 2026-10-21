import { useState } from "react";
import { loginUser } from "../services/auth.service";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";

const LoginPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Debug: deployed site pe check karo backend kya bhej raha hai
      console.log("login response:", response.data);

      const { token, user } = response.data || {};

      if (!token) {
        throw new Error("Login response did not contain a token.");
      }

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user"); // "undefined" kabhi save nahi hoga
      }

      alert("Login Successful");
      navigate("/profile", { replace: true });
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);

      alert(error.response?.data?.message || error.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex items-center justify-center px-5 pt-20 pb-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-[400px]"
        >
          <h1 className="text-4xl font-bold mb-6 text-center">Login</h1>

          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl mb-4 outline-none focus:border-black"
          />

          <input
            required
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl mb-6 outline-none focus:border-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-xl text-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="mt-6 text-center text-gray-500">
            Don't have an account?
            <Link
              to="/register"
              className="text-black font-semibold ml-2 hover:underline"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;