import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const ForgotPassword = ({ mockUsers, setMockUsers }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Identifier, 2: Verify Password, 3: New Password, 4: OTP, 5: Success
  const [identifier, setIdentifier] = useState("");
  const [userDetails, setUserDetails] = useState({ email: "", phone: "" });
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const API_URL = "http://localhost:5001/api";

  // Step 1: Check Identifier
  const onSubmitIdentifier = async (data) => {
    try {
      const response = await fetch(`${API_URL}/forgot_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: data.identifier }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setIdentifier(data.identifier);
        setUserDetails({ email: result.email, phone: result.phone });
        setStep(2);
      } else {
        setError(result.error || "No account found");
      }
    } catch (err) {
      setError("Server unavailable: " + err.message);
    }
  };

  // Step 2: Verify Current Password
  const onSubmitPassword = async (data) => {
    try {
      const response = await fetch(`${API_URL}/reset_password_request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          current_password: data.currentPassword,
          new_password: data.newPassword,
        }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setNewPassword(data.newPassword);
        setOtpSent(true);
        setStep(4); // Skip to OTP step
      } else {
        setError(result.error || "Invalid current password");
      }
    } catch (err) {
      setError("Server error: " + err.message);
    }
  };

  // Step 4: Verify OTP
  const onSubmitOtp = async (data) => {
    try {
      const response = await fetch(`${API_URL}/reset_password_verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          code: data.otp,
          new_password: newPassword,
        }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem("user", JSON.stringify(result.user));
        setStep(5);
        setTimeout(() => navigate("/dashboard"), 2000); // Auto-login after 2 seconds
      } else {
        setError(result.error || "Invalid OTP");
      }
    } catch (err) {
      setError("Server error: " + err.message);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-blue-50 bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={() => navigate('/')}
          className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold text-gray-900">Forgot Password</h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter your email or phone to reset your password
            </p>
            <form onSubmit={handleSubmit(onSubmitIdentifier)} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email or Phone</label>
                <input
                  type="text"
                  {...register('identifier', {
                    required: 'Identifier is required',
                  })}
                  placeholder="name@example.com or 9876543210"
                  className={`mt-1 w-full px-3 py-2 border ${
                    errors.identifier ? 'border-red-500' : 'border-gray-300'
                  } rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-800`}
                />
                {errors.identifier && (
                  <p className="mt-1 text-sm text-red-500">{errors.identifier.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-2 cursor-pointer bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-900"
              >
                Next
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 cursor-pointer">Verify Your Account</h2>
            <p className="mt-1 text-sm text-gray-500">
              Your details: Email: {userDetails.email || "N/A"}, Phone: {userDetails.phone || "N/A"}
            </p>
            <form onSubmit={handleSubmit(onSubmitPassword)} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  {...register('currentPassword', { required: 'Current password is required' })}
                  className={`mt-1 w-full px-3 py-2 border ${
                    errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-800`}
                />
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.currentPassword.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 cursor-pointer">New Password</label>
                <input
                  type="password"
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className={`mt-1 w-full px-3 py-2 border ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-800`}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-gray-800 text-white rounded-md text-sm font-medium cursor-pointer hover:bg-gray-900"
              >
                Verify and Send OTP
              </button>
            </form>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-xl font-semibold text-gray-900">Enter OTP</h2>
            <p className="mt-1 text-sm text-gray-500">
              An OTP has been sent to {identifier}
            </p>
            <form onSubmit={handleSubmit(onSubmitOtp)} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">OTP</label>
                <input
                  type="text"
                  {...register('otp', { required: 'OTP is required' })}
                  className={`mt-1 w-full px-3 py-2 border ${
                    errors.otp ? 'border-red-500' : 'border-gray-300'
                  } rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-800`}
                />
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-900 cursor-pointer"
              >
                Verify OTP
              </button>
            </form>
          </>
        )}

        {step === 5 && (
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <h2 className="mt-2 text-xl font-semibold text-gray-900">Password Reset Successful</h2>
            <p className="mt-1 text-sm text-gray-500">
              Your password has been updated. Redirecting to dashboard...
            </p>
          </div>
        )}

        {step === 1 && (
          <p className="mt-4 text-sm text-center">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 hover:underline cursor-pointer">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;