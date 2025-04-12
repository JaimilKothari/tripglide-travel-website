import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";

const Login = ({ onLogIn, mockUsers }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get location to check redirectTo
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [verificationData, setVerificationData] = useState({ identifier: "", code: "" });
  const [verificationError, setVerificationError] = useState("");
  const [pendingUser, setPendingUser] = useState(null);
  const [identifiers, setIdentifiers] = useState([]);

  const API_URL = "http://localhost:5001/api";

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setShowVerificationPopup(false);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        console.log("Login failed with error:", data.error);
        setError(data.error || "Server error occurred");
        return;
      }

      if (data.requires_verification) {
        console.log("OTP required, showing popup");
        setPendingUser(data.user);
        setIdentifiers(data.identifiers);
        setVerificationData({ identifier: data.identifiers[0].identifier, code: "" });
        setShowVerificationPopup(true);
      } else {
        console.log("Unexpected response, no verification required:", data);
        setError(data.error || "Login failed unexpectedly");
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      setError("Server unavailable: " + err.message);
    }
  };

  const handleVerificationChange = (e) => setVerificationData({ ...verificationData, [e.target.name]: e.target.value });

  const handleVerifyCode = async () => {
    try {
      const response = await fetch(`${API_URL}/verify_code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verificationData),
      });
      const data = await response.json();
      console.log("Verify code response:", data);

      if (response.ok && data.success) {
        const userData = data.user || pendingUser;
        localStorage.setItem("user", JSON.stringify(userData));
        onLogIn(userData);
        setShowVerificationPopup(false);
        setVerificationData({ identifier: "", code: "" });

        // Check if redirected from FlightCart
        const redirectTo = location.state?.redirectTo || "/dashboard";
        navigate(redirectTo, { state: location.state }); // Preserve original state
      } else {
        setVerificationError(data.error || "Invalid code");
      }
    } catch (err) {
      console.error("Verify code error:", err);
      setVerificationError("Server error: " + err.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-100"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200"
          >
            {error}
          </motion.div>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone</label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
              placeholder="Enter email or phone number"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
              placeholder="Enter password"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="text-right">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </motion.div>
          <motion.button
            type="submit"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </motion.button>
        </form>
        <motion.div variants={itemVariants} className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </motion.div>

      {showVerificationPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Verify OTP</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowVerificationPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </motion.button>
            </div>
            {verificationError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200"
              >
                {verificationError}
              </motion.div>
            )}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Identifier</label>
                <select
                  name="identifier"
                  value={verificationData.identifier}
                  onChange={handleVerificationChange}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                >
                  {identifiers.map((id, index) => (
                    <option key={index} value={id.identifier}>
                      {id.identifier} ({id.type})
                    </option>
                  ))}
                </select>
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                <input
                  type="text"
                  name="code"
                  value={verificationData.code}
                  onChange={handleVerificationChange}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                  placeholder={`Enter OTP sent to ${verificationData.identifier}`}
                />
              </motion.div>
            </motion.div>
            <div className="flex justify-end mt-6">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleVerifyCode}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Verify
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
