
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import { registerUser } from "../services/auth.service";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      await registerUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        fullName: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
        },
        role: formData.role,
      });

      alert("Registration successful! Please log in.");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Registration error:", error);

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again."
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
          className="w-full max-w-[450px] rounded-3xl bg-white p-6 shadow-xl md:p-10"
        >
          <h1 className="mb-6 text-center text-3xl font-bold md:text-4xl">
            Register
          </h1>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            required
            className="mb-4 w-full rounded-xl border p-3 outline-none focus:border-black"
          />

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            autoComplete="given-name"
            required
            className="mb-4 w-full rounded-xl border p-3 outline-none focus:border-black"
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            autoComplete="family-name"
            required
            className="mb-4 w-full rounded-xl border p-3 outline-none focus:border-black"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            className="mb-4 w-full rounded-xl border p-3 outline-none focus:border-black"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
            className="mb-4 w-full rounded-xl border p-3 outline-none focus:border-black"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mb-6 w-full rounded-xl border p-3 outline-none focus:border-black"
          >
            <option value="user">User</option>
            <option value="seller">Seller</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black p-3 text-lg font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Already have an account?
              <Link
                to="/login"
                className="ml-2 font-semibold text-black hover:underline"
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
