// src/pages/Register.jsx – Register page with validation
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api.js";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate form fields
  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
      await API.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        avatar: formData.avatar,
      });
      // After successful registration, redirect to login page
      navigate("/login");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const password = formData.password || "";

  const passwordRules = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 mt-[-40px]">
      <div className="w-full max-w-md bg-white border border-gray-700 rounded-xl px-8 py-10 shadow-lg">
        <h1 className="text-center text-2xl font-semibold mb-2 text-black">
          Create Account
        </h1>
        <p className="text-center text-sm text-gray-900 mb-6">
          to continue to YouTube
        </p>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500 rounded-md p-3 text-center text-red-500 text-sm mb-4">
            {serverError}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              className="px-4 py-3 bg-gray-50 border border-gray-600 rounded-md text-black text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            {errors.username && (
              <span className="text-red-500 text-xs">{errors.username}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-3 bg-gray-50 border border-gray-600 rounded-md text-black text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            {/* Password rules */}
            <div className="text-xs space-y-1 mb-1">
              <p
                className={
                  passwordRules.length ? "text-green-500" : "text-gray-400"
                }
              >
                {passwordRules.length ? "✔" : "•"} Minimum 6 characters
              </p>

              <p
                className={
                  passwordRules.uppercase ? "text-green-500" : "text-gray-400"
                }
              >
                {passwordRules.uppercase ? "✔" : "•"} One uppercase letter
              </p>

              <p
                className={
                  passwordRules.number ? "text-green-500" : "text-gray-400"
                }
              >
                {passwordRules.number ? "✔" : "•"} One number
              </p>
            </div>

            <input
              type="password"
              name="password"
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-3 bg-gray-50 border border-gray-600 rounded-md text-black text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />

            {errors.password && (
              <span className="text-red-500 text-xs">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="px-4 py-3 bg-gray-50 border border-gray-600 rounded-md text-black text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Avatar (Image URL)
            </label>

            <input
              type="text"
              name="avatar"
              placeholder="Paste your avatar image link"
              value={formData.avatar}
              onChange={handleChange}
              className="px-4 py-3 bg-gray-50 border border-gray-600 rounded-md text-black text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />

            {errors.avatar && (
              <span className="text-red-500 text-xs">{errors.avatar}</span>
            )}
          </div>

          {formData.avatar && (
            <div className="mt-3 flex justify-center">
              <img
                src={formData.avatar}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full object-cover border border-gray-600"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
