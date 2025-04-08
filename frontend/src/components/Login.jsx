import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
        setError("Username and password are required.");
        return;
      }

      setError("");
      navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen"
    style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW5zfGVufDB8fDB8fHww')",
        backgroundSize: "cover",
    }}>
      <div className="bg-gray-300 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              pattern=".{6,}"
              title="Password must be at least 6 characters long"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white p-2 rounded-md hover:bg-blue-800"
            
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <p>
            Forgot Password?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
