
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
    setLoading(true);

    try {
      const response = await registerUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        fullName: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
        },
        role: formData.role,
      });

      console.log("Registration response:", response.status, response.data);

      alert("Registration request successful. Please log in.");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.status,
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Registration failed. Check the API and server logs."
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

          <input
            required
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl mb-4"
          />

          <input
            required
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl mb-4"
          />

          <input
            required
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl mb-4"
          />

          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl mb-4"
          />

          <input
            required
            minLength={6}
            type="password"
            name="password"
            placeholder="Password (minimum 6 characters)"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl mb-4"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl mb-6"
          >
            <option value="user">User</option>
            <option value="seller">Seller</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded-xl text-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="mt-6 text-center text-gray-500">
            Already have an account?
            <Link
              to="/login"
              className="text-black font-semibold ml-2 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
