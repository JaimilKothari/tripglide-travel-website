import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const SignUp = ({ onSignUp, mockUsers }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Watch the password field to compare with confirm password
  const password = watch('password');

  const onSubmit = (data) => {
    // Load existing users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("mockUsers")) || [];
    console.log("Users before signup:", storedUsers);


     // Check if the email or username already exists
  const userExists = storedUsers.some(
    (user) => user.username === data.username || user.email === data.email
  );

  if (userExists) {
    alert("Username or email already exists");
    return;
  }

    // Create user data for the mock database with all fields
    const userData = {
      email: data.email,
      username: data.username,
      password: data.password,
    };

      // Add new user to the stored users list
  const updatedUsers = [...storedUsers, userData];
  console.log("Saving users:", updatedUsers);

  // Save updated users back to localStorage
  localStorage.setItem("mockUsers", JSON.stringify(updatedUsers));

    // Store complete user data in mockUsers (similar to how SignIn adds Google users)
    mockUsers.push(userData);

    // Pass user data to onSignUp (only username and email are stored in the state)
    onSignUp({
      username: userData.username,
      email: userData.email,
    });
    
    navigate('/');
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const userObject = jwtDecode(credentialResponse.credential);
    const userData = {
      username: userObject.name,
      email: userObject.email,
      password: 'google-auth', // Same as in SignIn
    };

    // Check for duplicate email (Google sign-up)
    const emailExists = mockUsers.some((user) => user.email === userData.email);
    if (emailExists) {
      alert('Email already exists');
      return;
    }

    // Store complete user data in mockUsers
    mockUsers.push(userData);

    onSignUp({
      username: userData.username,
      email: userData.email,
    });
    
    navigate('/');
  };

  const handleGoogleError = () => {
    console.log('Google Sign Up Failed');
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
        <h2 className="text-xl font-semibold text-gray-900">Create account</h2>
        <p className="mt-1 text-sm text-gray-500">Sign up to access your account</p>

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
            <label className="block text-sm font-medium text-gray-700">Password</label>
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

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              placeholder="Confirm your password"
              className={`mt-1 w-full px-3 py-2 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
          >
            SIGN UP
          </button>
        </form>

        {/* Divider */}
        <div className="mt-4 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-2 text-sm text-gray-500">OR CONTINUE WITH</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Sign Up */}
        <div className="mt-4 w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signup_with"
            width="100%"
          />
        </div>

        {/* Sign In Link */}
        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign in
          </Link>
          {' | '}
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
