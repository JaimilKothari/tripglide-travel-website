import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaHotel } from "react-icons/fa";

const HotelBooking = () => {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const storedDetails = sessionStorage.getItem("hotelBookingDetails");
    if (storedDetails) {
      setBookingDetails(JSON.parse(storedDetails));
      sessionStorage.removeItem("hotelBookingDetails");
    }
  }, []);

  if (!bookingDetails) {
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

  const { hotelName, arrival, checkInDate, checkOutDate, adults, children, rooms, roomType, totalAmount, pricePerNight } = bookingDetails;

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <div className="flex items-center justify-center mb-4">
          <FaCheckCircle className="text-green-500 text-4xl mr-2" />
          <h2 className="text-2xl font-bold text-green-700">Booking Confirmed!</h2>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FaHotel className="mr-2 text-blue-500" />
            Hotel Details
          </h3>
          <p className="text-gray-700">
            {hotelName} • {arrival} • {roomType} Room
          </p>
          <p className="text-gray-700">
            Check-In: {checkIn.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' })} at 02:00 PM
          </p>
          <p className="text-gray-700">
            Check-Out: {checkOut.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' })} at 11:00 AM
          </p>
          <p className="text-gray-700">
            Guests: {adults + children} • Rooms: {rooms} • Nights: {nights}
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Payment Details</h3>
          <p className="text-gray-700">
            Room Rate: ₹{pricePerNight.toLocaleString()} per night
          </p>
          <p className="text-gray-700">
            Total Amount: ₹{totalAmount.toLocaleString()}
          </p>
          <p className="text-gray-700">
            Summary: {rooms} {roomType} Room{rooms > 1 ? 's' : ''} for {nights} Night{nights > 1 ? 's' : ''}
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">Thank you for your booking! A confirmation email has been sent to your registered email address.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;