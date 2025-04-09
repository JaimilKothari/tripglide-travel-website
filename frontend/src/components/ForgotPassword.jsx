import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const ForgotPassword = ({ mockUsers }) => {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Load stored users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("mockUsers")) || [];
  
    console.log("Current mockUsers in ForgotPassword:", storedUsers);
  
    // Check if the email exists
    const userExists = storedUsers.some(
      (user) => user.email.toLowerCase() === data.email.toLowerCase()
    );
  
    if (userExists) {
      console.log("Email found, sending reset link");
      setEmailSent(true);
    } else {
      console.log("Email not found:", data.email);
      alert("No account found with that email address");
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW5zfGVufDB8fDB8fHww')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        
        {!emailSent ? (
          <>
            <h2 className="text-xl font-semibold text-gray-900">Forgot Password</h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter your email address and we'll send you a link to reset your password
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  placeholder="name@example.com"
                  className={`mt-1 w-full px-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Send Reset Link Button */}
              <button
                type="submit"
                className="w-full py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
              >
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <h2 className="mt-2 text-xl font-semibold text-gray-900">Check your email</h2>
              <p className="mt-1 text-sm text-gray-500">
                We've sent a password reset link to your email address
              </p>
              <button
                onClick={() => navigate('/signin')}
                className="mt-4 w-full py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
              >
                Back to Sign In
              </button>
            </div>
          </>
        )}

        {/* Sign In Link */}
        {!emailSent && (
          <p className="mt-4 text-sm text-center">
            Remember your password?{' '}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;