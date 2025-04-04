import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaPlaneDeparture, FaHotel, FaCar } from "react-icons/fa";

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 pb-12">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mb-6">
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

      <div><h2 className="text-2xl font-bold mb-5">--- Complete your trip ---</h2></div>
      
      {/* Hotel Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mb-6">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-yellow-100 rounded-full p-4 mb-4">
            <FaHotel className="text-yellow-500 text-4xl" />
          </div>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Need a place to stay in?</h2>
          <p className="text-gray-700">Explore hotels in the best spots nearby.</p>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate("/hotels")}
            className="bg-blue-600 text-white px-8 py-2 cursor-pointer rounded-lg hover:bg-blue-700"
          >
            Explore hotels
          </button>
        </div>
      </div>
      
      {/* Car Hire Card */}
      <div className="bg-gray-100 rounded-lg shadow-lg p-6 max-w-lg w-full">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-blue-100 rounded-full p-4 mb-4">
            <FaCar className="text-blue-500 text-4xl" />
          </div>
          <h2 className="text-xl font-semibold">Complete your car journey</h2>
        </div>

        <div className="mb-6 text-center">
          <p className="text-gray-700">Skip the crowds on public transport and relax on the road.</p>
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

export default BookingConfirmation;