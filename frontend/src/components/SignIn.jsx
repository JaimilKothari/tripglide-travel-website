import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const SignIn = ({ onSignIn, mockUsers }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Simulate authentication
    const user = mockUsers.find(
      (u) => u.username === data.username && u.password === data.password
    );

    if (user) {
      const userData = {
        username: user.username,
        email: user.email,
      };
      onSignIn(userData);
      navigate('/');
    } else {
      alert('Invalid username or password');
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const userObject = jwtDecode(credentialResponse.credential);
    const userData = {
      username: userObject.name,
      email: userObject.email,
    };

    // Check for duplicate email (Google sign-in)
    const emailExists = mockUsers.some((user) => user.email === userData.email);
    if (!emailExists) {
      // Add the Google user to mockUsers (simulate sign-up)
      mockUsers.push({ ...userData, password: 'google-auth' });
    }

    onSignIn(userData);
    navigate('/');
  };

  const handleGoogleError = () => {
    console.log('Google Sign In Failed');
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
        <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
        <p className="mt-1 text-sm text-gray-500">Enter your details to sign in to your account</p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters long',
                },
              })}
              placeholder="Enter your username"
              className={`mt-1 w-full px-3 py-2 border ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              } rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
              placeholder="Enter your password"
              className={`mt-1 w-full px-3 py-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="mt-4 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-2 text-sm text-gray-500">OR CONTINUE WITH</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Sign In */}
        <div className="mt-4 w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signin_with"
            width="100%"
          />
        </div>

        {/* Sign Up Link */}
        <p className="mt-4 text-sm text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;