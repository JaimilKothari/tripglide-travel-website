import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const IndividualHotelDeals = () => {
  const { hotel, arrival } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize state with location.state or sessionStorage
  const sessionBookingData = JSON.parse(sessionStorage.getItem("hotelBookingDetails")) || {};
  const {
    hotel: hotelData,
    checkInDate: initialCheckInDate = sessionBookingData.checkInDate,
    checkOutDate: initialCheckOutDate = sessionBookingData.checkOutDate,
    adults = sessionBookingData.adults || 1,
    children = sessionBookingData.children || 0,
    rooms = sessionBookingData.rooms || 1,
  } = location.state || {};

  const [checkInDate, setCheckInDate] = useState(initialCheckInDate || "");
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOutDate || "");
  const today = new Date().toISOString().split("T")[0];

  // Function to initiate Stripe checkout
  const initiateStripeCheckout = async (bookingData) => {
    try {
      const response = await axios.post("http://localhost:5003/create-checkout-session", bookingData);
      const sessionId = response.data.id;

      const stripe = window.Stripe("pk_test_51RA20B4D8TqxSjMO2AL0EwDRq7G1h3JF3CvdcasP9nE34rF4w5jNrSFbUPtbsoHsvGf7X2dkIUFZ4ETqGdjAfcjZ00UOI1COTA");
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe redirect error:", error);
        alert("Failed to redirect to payment page. Please try again.");
      }
    } catch (err) {
      console.error("Error initiating checkout:", err);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  // If hotelData is missing, show an error but don't redirect immediately
  if (!hotelData) {
    return (
      <div className="text-center py-8">
        Hotel details not found. Please try again from the hotels page.
        <button
          onClick={() => navigate("/hotels")}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          Go to Hotels
        </button>
      </div>
    );
  }

  const handleCheckInDateChange = (event) => {
    setCheckInDate(event.target.value);
    if (checkOutDate && event.target.value > checkOutDate) {
      setCheckOutDate("");
    }
  };

  const handleCheckOutDateChange = (event) => {
    setCheckOutDate(event.target.value);
  };

  const renderRoomSection = () => {
    // Parse price from hotelData.price (e.g., "₹18,236" -> 18236)
    const pricePerNight = parseFloat(hotelData.price.replace(/[^0-9.]/g, ""));
    const nights = checkInDate && checkOutDate ? Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)) : 1;
    const hotelCharges = pricePerNight * nights * rooms;
    const discountPerRoom = 2240;
    const discount = discountPerRoom * rooms;
    const gstPerRoom = 1440;
    const gst = gstPerRoom * rooms;
    const convenienceFeePerRoom = 300;
    const convenienceFee = convenienceFeePerRoom * rooms;
    const totalAmount = hotelCharges - discount + gst + convenienceFee;

    // Simplified amenities (since hotelData doesn't provide them)
    const amenities = ["Wi-Fi", "Breakfast Included", "Free Cancellation"];

    const handleBookNow = () => {
      if (!checkInDate || !checkOutDate) {
        alert("Please select check-in and check-out dates to proceed with booking.");
        return;
      }

      const bookingData = {
        hotelName: hotelData.name,
        totalAmount: totalAmount,
        checkInDate,
        checkOutDate,
        adults,
        children,
        rooms,
        roomType: "Standard",
        pricePerNight,
        arrival: decodeURIComponent(arrival),
      };

      // Check if user is logged in
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        // Not logged in, navigate to login with booking data
        navigate("/login", {
          state: {
            redirectTo: `/individual-hotel-deals/${encodeURIComponent(hotel)}/${encodeURIComponent(arrival)}`,
            bookingData,
            checkInDate,
            checkOutDate,
            adults,
            children,
            rooms,
            hotel: hotelData,
          },
        });
        return;
      }

      // User is logged in, store booking data and proceed to Stripe
      sessionStorage.setItem("hotelBookingDetails", JSON.stringify(bookingData));
      initiateStripeCheckout(bookingData);
    };

    return (
      <div className="mb-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-xl font-semibold mb-4">Standard Room</h3>
          <div>
            <h2 className="text-xl font-semibold">{hotelData.name}</h2>
            <p className="text-sm text-gray-600">{decodeURIComponent(arrival)}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-yellow-500">{'★'.repeat(Math.floor(hotelData.rating))}</span>
              <span className="text-sm text-gray-600">{hotelData.rating} ({hotelData.reviews})</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{hotelData.distance} from city centre</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Check-In</p>
              {checkInDate ? (
                <p className="text-blue-600 font-semibold">
                  {new Date(checkInDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                  })} | 02:00 PM
                </p>
              ) : (
                <input
                  type="date"
                  className="w-full p-2 rounded-lg border border-gray-300 text-black"
                  min={today}
                  value={checkInDate}
                  onChange={handleCheckInDateChange}
                  required
                />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">Check-Out</p>
              {checkOutDate ? (
                <p className="text-blue-600 font-semibold">
                  {new Date(checkOutDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                  })} | 11:00 AM
                </p>
              ) : (
                <input
                  type="date"
                  className="w-full p-2 rounded-lg border border-gray-300 text-black"
                  min={checkInDate || today}
                  value={checkOutDate}
                  onChange={handleCheckOutDateChange}
                  disabled={!checkInDate}
                  required
                />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">{nights}N/{nights + 1}D</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {adults + children} Guests | {rooms} Room{rooms > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Room Details</h3>
            <p className="text-sm text-gray-600">
              {rooms} x Standard Room - Only Room
            </p>
            {amenities.map((amenity, index) => (
              <p key={index} className="text-sm text-green-600 flex items-center gap-1">
                <span>✔</span> {amenity}
              </p>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Cancellation Policy</h3>
            <p className="text-sm text-gray-600">
              Free cancellation up to 48 hours before check-in.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-4">Price Breakup</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Room Rate</p>
              <p className="text-sm font-semibold">
                ₹{pricePerNight.toLocaleString()} per night
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">
                Hotel Charges ({rooms} Room{rooms > 1 ? "s" : ""} × {nights} Night
                {nights > 1 ? "s" : ""})
              </p>
              <p className="text-sm font-semibold">
                ₹{hotelCharges.toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between text-green-600">
              <p className="text-sm">Discounts</p>
              <p className="text-sm font-semibold">
                (-) ₹{discount.toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Hotel GST</p>
              <p className="text-sm font-semibold">₹{gst.toLocaleString()}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Convenience Fee</p>
              <p className="text-sm font-semibold">
                ₹{convenienceFee.toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between border-t pt-2">
              <p className="text-lg font-semibold">Total Amount</p>
              <p className="text-lg font-semibold">
                ₹{totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between text-green-600">
              <p className="text-sm">Your Savings</p>
              <p className="text-sm font-semibold">
                ₹{discount.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={handleBookNow}
            className={`w-full mt-4 font-semibold py-2 px-4 rounded-lg transition duration-300 ${
              checkInDate && checkOutDate
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!checkInDate || !checkOutDate}
          >
            Book Now
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-2 text-sm text-gray-600">
        <span>Home</span>
        <span className="mx-1">{">"}</span>
        <span>Hotels in {decodeURIComponent(arrival)}</span>
        <span className="mx-1">{">"}</span>
        <span>{decodeURIComponent(hotel)}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">{renderRoomSection()}</div>
    </div>
  );
};

export default IndividualHotelDeals;