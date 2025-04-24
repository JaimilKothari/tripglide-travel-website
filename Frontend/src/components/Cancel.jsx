import React from "react";
import { Link } from "react-router-dom";

const Cancel = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-red-600">Booking Cancelled</h1>
      <p className="mt-4 text-gray-600">Your booking was cancelled. Please try again if needed.</p>
      <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Back to Home
      </Link>
    </div>
  </div>
);

export default Cancel;