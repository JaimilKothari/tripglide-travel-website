import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaHotel,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaExclamationCircle,
  FaBed,
} from "react-icons/fa";

const HotelBooking = () => {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [bookingNumber, setBookingNumber] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate random booking number
  useEffect(() => {
    const generateBookingNumber = () => {
      return Math.floor(10000000 + Math.random() * 90000000).toString();
    };
    setBookingNumber(generateBookingNumber());
  }, []);

  // Retrieve booking details and user details from sessionStorage and localStorage
  useEffect(() => {
    // Try to get from sessionStorage first
    let storedDetails = sessionStorage.getItem("hotelBookingDetails");
    let storedUserDetails = sessionStorage.getItem("stripeUserDetails");

    // If not in sessionStorage, try localStorage as a backup
    if (!storedDetails) {
      storedDetails = localStorage.getItem("hotelBookingDetails");
      if (storedDetails) {
        sessionStorage.setItem("hotelBookingDetails", storedDetails);
      }
    }

    if (!storedUserDetails) {
      storedUserDetails = localStorage.getItem("stripeUserDetails");
      if (storedUserDetails) {
        sessionStorage.setItem("stripeUserDetails", storedUserDetails);
      }
    }

    // Set defaults for user details if not found
    let parsedUserDetails = null;
    if (storedUserDetails) {
      parsedUserDetails = JSON.parse(storedUserDetails);
    }

    // Set default user info if not available
    setUserDetails(
      parsedUserDetails || {
        name: "Moksha",
        email: "mokshabhavsar2004@gmail.com",
        phone: "Not provided",
      }
    );

    if (storedDetails) {
      const parsedDetails = JSON.parse(storedDetails);
      setBookingDetails(parsedDetails);
      // Save to localStorage for persistence across refreshes
      localStorage.setItem("hotelBookingDetails", storedDetails);
    }

    setIsLoaded(true);
  }, []);

  // Handle case where booking details are missing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (isLoaded && !bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
          <p>No booking details found. Please complete the booking process.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const { hotelName, arrival, checkInDate, checkOutDate, adults, children, rooms, roomType, totalAmount, pricePerNight } =
    bookingDetails;

  // Calculate number of nights
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 pb-12">
      {/* Main Booking Confirmation Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mb-6">
        {/* Header Section */}
        <div className="border-b pb-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 text-4xl mr-2" />
              <h2 className="text-2xl font-bold text-green-700">Booking Confirmed!</h2>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Booking Number</p>
              <p className="font-bold">{bookingNumber}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-2">
            Your hotel reservation has been confirmed. A confirmation email has been sent to your registered email address.
          </p>
          <p className="text-gray-600">
            For any changes to your booking, contact us 24/7 Toll Free: <span className="text-red-500 font-bold">800-525-0400</span>
          </p>
        </div>

        {/* Customer Information Section */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <FaUser className="text-gray-500 mr-2" />
              <div>
                <p className="text-gray-500 text-sm">Guest</p>
                <p className="font-semibold">{userDetails?.name || "Jaimil Kothari"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-gray-500 mr-2" />
              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                <p className="font-semibold">{userDetails?.phone || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="text-gray-500 mr-2" />
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-semibold">{userDetails?.email || "jaimilkothari2003@gmail.com"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <div>
                <p className="text-gray-500 text-sm">Booked On</p>
                <p className="font-semibold">
                  {new Date().toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hotel Summary Section */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Hotel Summary</h3>
          <div className="mb-4">
            <h4 className="font-semibold flex items-center mb-2">
              <FaHotel className="mr-2 text-blue-500" />
              Hotel Details
            </h4>
            <div className="border rounded-lg p-3 mb-3 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <FaHotel className="text-blue-500 mr-2" />
                  <span className="font-semibold">{hotelName}</span>
                </div>
                <div className="text-sm text-gray-500">{arrival}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Check-In</p>
                  <p className="font-semibold">{formatDate(checkInDate)}</p>
                  <p className="text-sm flex items-center">02:00 PM</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-Out</p>
                  <p className="font-semibold">{formatDate(checkOutDate)}</p>
                  <p className="text-sm flex items-center">11:00 AM</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Room Type</p>
                  <p className="font-semibold">{roomType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guests & Rooms</p>
                  <p className="font-semibold">
                    {adults + children} Guests, {rooms} Room{rooms > 1 ? "s" : ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nights</p>
                  <p className="font-semibold">{nights} Night{nights > 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Information Section */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Guest & Booking Information</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Number</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Preference</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Special Request</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{userDetails?.name || "Jaimil Kothari"}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{bookingNumber}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{roomType}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs flex items-start">
            <FaExclamationCircle className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">
              All special requests and room preferences are not guaranteed. Please contact the hotel to reconfirm that they have received this request and confirmed it.
            </p>
          </div>
        </div>

        {/* Payment Details Section */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Room Rate</p>
              <p className="font-semibold">₹{pricePerNight.toLocaleString()} per night</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Amount</p>
              <p className="font-semibold text-green-600">₹{totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Summary</p>
              <p className="font-semibold">
                {rooms} {roomType} Room{rooms > 1 ? "s" : ""} for {nights} Night{nights > 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Payment Method</p>
              <p className="font-semibold">Credit Card</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Thank you for your booking! A confirmation email has been sent to your registered email address.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Additional Offer Section (Optional) */}
      <div>
        <h2 className="text-2xl font-bold mb-5">--- Complete your trip ---</h2>
      </div>

      {/* Car Hire Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-blue-100 rounded-full p-4 mb-4">
            <FaBed className="text-blue-500 text-4xl" />
          </div>
          <h2 className="text-xl font-semibold">Need a car for your trip?</h2>
        </div>
        <div className="mb-6 text-center">
          <p className="text-gray-700">Explore car hire options to make your travel seamless.</p>
        </div>
        <div className="text-center">
          <button
            onClick={() => navigate("/carhire")}
            className="bg-blue-600 text-white px-8 py-2 cursor-pointer rounded-lg hover:bg-blue-700"
          >
            Find a car
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;