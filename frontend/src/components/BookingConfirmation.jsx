import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaPlaneDeparture } from "react-icons/fa";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);

  // Retrieve booking details from sessionStorage on component mount
  useEffect(() => {
    const storedDetails = sessionStorage.getItem("bookingDetails");
    if (storedDetails) {
      setBookingDetails(JSON.parse(storedDetails));
      // Clear sessionStorage to avoid stale data
      sessionStorage.removeItem("bookingDetails");
    }
  }, []);

  // Handle case where booking details are missing
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

  const { selectedFlight, selectedFare, searchParams } = bookingDetails;
  const { tripType, from, to, departDate, returnDate, multiCityFlights } = searchParams;
  const firstLeg = tripType === "multicity" ? selectedFlight.multiCityFlights?.[0] : selectedFlight;

  let flightSummary = "";
  if (tripType === "multicity" && multiCityFlights) {
    flightSummary = multiCityFlights
      .map((flight) => `${flight.from} → ${flight.to} • ${flight.depart}`)
      .join(" | ");
  } else if (tripType === "return") {
    flightSummary = `${from} → ${to} • ${departDate} - ${returnDate}`;
  } else if (tripType === "oneway") {
    flightSummary = `${from} → ${to} • ${departDate}`;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <div className="flex items-center justify-center mb-4">
          <FaCheckCircle className="text-green-500 text-4xl mr-2" />
          <h2 className="text-2xl font-bold text-green-700">Booking Confirmed!</h2>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FaPlaneDeparture className="mr-2 text-blue-500" />
            Flight Details
          </h3>
          {tripType === "multicity" && selectedFlight.multiCityFlights ? (
            selectedFlight.multiCityFlights.map((leg, index) => (
              <p key={index} className="text-gray-700">
                {leg.departure} → {leg.arrival} • {leg.airline} • {leg.departureDate} • Departure at {leg.departureTime} - Arrival at {leg.arrivalTime}
              </p>
            ))
          ) : tripType === "return" && selectedFlight.returnFlight ? (
            <>
              <p className="text-gray-700">
                Outbound: {firstLeg.departure} → {firstLeg.arrival} • {firstLeg.airline} • {departDate} • Departure at {firstLeg.departureTime} - Arrival at {firstLeg.arrivalTime}
              </p>
              <p className="text-gray-700">
                Return: {selectedFlight.returnFlight.departure} → {selectedFlight.returnFlight.arrival} • {selectedFlight.returnFlight.airline} • {returnDate} • Departure at {selectedFlight.returnFlight.departureTime} - Arrival at {selectedFlight.returnFlight.arrivalTime}
              </p>
            </>
          ) : (
            <p className="text-gray-700">
              {firstLeg.departure} → {firstLeg.arrival} • {firstLeg.airline} • {departDate} • Departure at {firstLeg.departureTime} - Arrival at {firstLeg.arrivalTime}
            </p>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Fare Details</h3>
          <p className="text-gray-700">
            Fare Type: {selectedFare.type} • ₹{selectedFare.price.toLocaleString()}
          </p>
          <p className="text-gray-700">Trip Type: {tripType === "oneway" ? "One Way" : tripType === "return" ? "Return" : "Multi-city"}</p>
          <p className="text-gray-700">Summary: {flightSummary}</p>
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

export default BookingConfirmation;