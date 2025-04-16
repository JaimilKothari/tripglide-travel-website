import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [identifierType, setIdentifierType] = useState(null);

  const API_URL = "http://localhost:5001/api";

  const isEmail = (str) => /^[\w\.-]+@[\w\.-]+\.\w+$/.test(str);
  const isPhone = (str) => /^\d{10}$/.test(str);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
    if (name === "identifier") {
      setIdentifierType(isEmail(value) ? "email" : isPhone(value) ? "phone" : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identifier, password, confirm_password } = formData;

    if (!identifier || !password || !confirm_password) {
      setError("All fields are required");
      return;
    }
    if (!isEmail(identifier) && !isPhone(identifier)) {
      setError("Invalid email or 10-digit phone number");
      return;
    }
    if (password !== confirm_password) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const res = await response.json();

      if (res.success) {
        alert("Signup successful! Please log in.");
        navigate("/login");
      } else {
        setError(res.error || "Signup failed");
      }
    } catch (err) {
      setError("Server error: " + err.message);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const buttonVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="bg-white shadow-lg rounded-xl p-6 sm:p-8 w-full max-w-md"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-800 mb-6 text-center"
        >
          Sign Up
        </motion.h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700">
                {identifierType === "email" ? "Email" : identifierType === "phone" ? "Phone" : "Email or Phone"}
              </label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter your email or phone"
              />
              {formData.identifier && (
                <p className="text-xs text-gray-500 mt-1">
                  {identifierType === "email"
                    ? "Valid email format"
                    : identifierType === "phone"
                    ? "Valid 10-digit phone"
                    : "Enter a valid email or 10-digit phone number"}
                </p>
              )}
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter your password"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Confirm your password"
              />
            </motion.div>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition glow-button"
            >
              Sign Up
            </motion.button>
          </motion.div>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm text-gray-600 text-center"
        >
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log In</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Signup;
