import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimes, FaCheckCircle, FaTimesCircle, FaSuitcaseRolling, FaChair, FaUtensils } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe with your publishable key
const stripePromise = loadStripe("pk_test_51R9No7RtOB964nOwbCnB8DQSDfS5G66dozt3WRe0mwu3E5hwlxsObPZHYORqKrmWuVVhpn8EYUsWi075a1WYCshV00IbVFQLYi"); // Replace with your Stripe Publishable Key

// Utility function to calculate duration between two times
const calculateDuration = (depTime, arrTime) => {
  if (!depTime || !arrTime) return "N/A";

  const [depHours, depMinutes] = depTime.split(":").map(Number);
  const [arrHours, arrMinutes] = arrTime.split(":").map(Number);

  const depTotalMinutes = depHours * 60 + depMinutes;
  let arrTotalMinutes = arrHours * 60 + arrMinutes;

  if (arrTotalMinutes < depTotalMinutes) {
    arrTotalMinutes += 24 * 60; // Add 24 hours (in minutes)
  }

  const diffMinutes = arrTotalMinutes - depTotalMinutes;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours}h ${minutes}m`;
};

const FlightCart = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedFlight, searchParams } = location.state || {};
  const [selectedFare, setSelectedFare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debug logs to inspect the data
  console.log("FlightCart location.state:", location.state);
  console.log("FlightCart selectedFlight.returnFlight:", selectedFlight?.returnFlight);
  console.log("FlightCart user:", user);

  if (!selectedFlight || !selectedFlight.price) {
    return <div className="p-4 text-center">No valid flight selected. Please go back and select a flight.</div>;
  }

  const { tripType, from, to, departDate, returnDate, multiCityFlights } = searchParams || {};
  const firstLeg = tripType === "multicity" && selectedFlight.multiCityFlights ? selectedFlight.multiCityFlights[0] : selectedFlight;

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

  const fareOptions = [
    {
      type: "Saver",
      price: selectedFlight.price - 1500,
      baggage: { cabin: "7 Kgs Cabin Baggage", checkIn: "15 Kgs Check-in Baggage" },
      flexibility: {
        refund: "No refund on Cancellation",
        dateChange: `Date Change fee starts at ₹ 3,250 (up to 4 days before departure)`,
      },
      seatsMeals: { seats: "Chargeable Seats", meals: "Chargeable Meals" },
    },
    {
      type: "Flexi",
      price: selectedFlight.price + 500,
      baggage: { cabin: "7 Kgs Cabin Baggage", checkIn: "15 Kgs Check-in Baggage" },
      flexibility: {
        refund: "Cancellation fee starts at ₹ 4,139 (up to 4 days before departure)",
        dateChange: `Lower Date Change fee ₹ 299 (up to 4 days before departure)`,
      },
      seatsMeals: { seats: "Free Seats", meals: "Complimentary Meals" },
    },
    {
      type: "Light",
      price: selectedFlight.price - 1250,
      baggage: { cabin: "12 Kgs Cabin Baggage", checkIn: "23 Kgs (1 Piece x 23 Kgs) Check-in Baggage" },
      flexibility: { refund: "No refund on Cancellation", dateChange: `Date Change fee starts at ₹ 3,111` },
      seatsMeals: { seats: "Seat information not available", meals: "Meals information not available" },
    },
    {
      type: "Standard",
      price: selectedFlight.price,
      baggage: { cabin: "12 Kgs Cabin Baggage", checkIn: "46 Kgs (2 Pieces x 23 Kgs) Check-in Baggage" },
      flexibility: { refund: "No refund on Cancellation", dateChange: `Date Change fee starts at ₹ 4,111` },
      seatsMeals: { seats: "Seat information not available", meals: "Meals information not available" },
    },
  ];

  useEffect(() => {
    if (!selectedFare && fareOptions.length > 0) {
      setSelectedFare(fareOptions.find((fare) => fare.type === "Standard"));
    }
  }, [fareOptions]);

  const handleSelectFare = (fare) => {
    setSelectedFare(fare);
  };

  const handleBookNow = async () => {
    if (!selectedFare) {
      console.error("No fare selected. Please select a fare option.");
      setError("Please select a fare option.");
      return;
    }

    // Check if user is logged in
    const isLoggedIn = user || localStorage.getItem("user");
    if (!isLoggedIn) {
      console.log("User not logged in, redirecting to login");
      navigate("/login", {
        state: {
          redirectTo: "/flight-cart",
          selectedFlight,
          searchParams,
        },
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Creating checkout session with amount:", selectedFare.price * 100);
      console.log("Request body:", {
        amount: selectedFare.price * 100,
        description: `${tripType === "multicity" ? "Multi-city Flight" : tripType === "return" ? "Return Flight" : "One-way Flight"} - ${flightSummary}`,
      });

      const bookingDetails = {
        selectedFlight,
        selectedFare,
        searchParams,
      };
      sessionStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

      const response = await fetch("http://localhost:5002/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedFare.price * 100,
          description: `${tripType === "multicity" ? "Multi-city Flight" : tripType === "return" ? "Return Flight" : "One-way Flight"} - ${flightSummary}`,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const { sessionId } = await response.json();
      console.log("Received sessionId:", sessionId);

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(`Stripe redirect error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setError(`Failed to initiate payment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    console.log("handleGoBack called, navigating back with state:", location.state);
    navigate(-1, {
      state: { selectedFlight, searchParams: { tripType, from, to, departDate, returnDate, multiCityFlights } },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl relative">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">TRIP TYPE</span>
            <span className="text-sm font-medium">
              {tripType === "oneway" ? "One Way" : tripType === "return" ? "Return" : "Multi-city"}
            </span>
          </div>
          <button onClick={handleGoBack} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <FaTimes size={20} />
          </button>
        </div>

        {tripType === "multicity" && selectedFlight.multiCityFlights ? (
          selectedFlight.multiCityFlights.map((leg, index) => (
            <div key={index} className="p-4 border-b">
              <h3 className="text-lg font-semibold">
                {leg.departure} → {leg.arrival} • {leg.airline} • {leg.departureDate || departDate} • Departure at {leg.departureTime || "N/A"} - Arrival at {leg.arrivalTime || "N/A"} • Duration: {calculateDuration(leg.departureTime, leg.arrivalTime)}
              </h3>
            </div>
          ))
        ) : tripType === "return" && selectedFlight.returnFlight ? (
          <>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">
                Outbound: {firstLeg.departure} → {firstLeg.arrival} • {firstLeg.airline} • {departDate} • Departure at {firstLeg.departureTime || "N/A"} - Arrival at {firstLeg.arrivalTime || "N/A"} • Duration: {calculateDuration(firstLeg.departureTime, firstLeg.arrivalTime)}
              </h3>
            </div>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">
                Return: {selectedFlight.returnFlight.departure} → {selectedFlight.returnFlight.arrival} • {selectedFlight.returnFlight.airline} • {returnDate} • Departure at {selectedFlight.returnFlight.departureTime || "N/A"} - Arrival at {selectedFlight.returnFlight.arrivalTime || "N/A"} • Duration: {selectedFlight.returnFlight.duration || "N/A"}
              </h3>
            </div>
          </>
        ) : (
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">
              {firstLeg.departure} → {firstLeg.arrival} • {firstLeg.airline} • {departDate} • Departure at {firstLeg.departureTime || "N/A"} - Arrival at {firstLeg.arrivalTime || "N/A"} • Duration: {calculateDuration(firstLeg.departureTime, firstLeg.arrivalTime)}
            </h3>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {fareOptions.map((fare, index) => (
            <div
              key={index}
              onClick={() => handleSelectFare(fare)}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedFare?.type === fare.type ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-blue-600 flex items-center justify-center">
                    <div className={selectedFare?.type === fare.type ? "w-4 h-4 bg-blue-600 rounded-full" : ""}></div>
                  </div>
                  <h4 className="text-lg font-semibold">{fare.type.toUpperCase()}</h4>
                </div>
                <p className="text-lg font-bold">₹ {fare.price.toLocaleString()} <span className="text-sm font-normal">per adult</span></p>
              </div>

              <div className="mb-4">
                <h5 className="font-medium mb-2">Baggage</h5>
                <p className="text-sm flex items-center">
                  <FaSuitcaseRolling className="text-green-500 mr-2" />
                  {fare.baggage.cabin}
                </p>
                <p className="text-sm flex items-center">
                  <FaSuitcaseRolling className="text-green-500 mr-2" />
                  {fare.baggage.checkIn}
                </p>
              </div>

              <div className="mb-4">
                <h5 className="font-medium mb-2">Flexibility</h5>
                <p className="text-sm flex items-center">
                  {fare.flexibility.refund.includes("No refund") ? (
                    <FaTimesCircle className="text-red-500 mr-2" />
                  ) : (
                    <FaCheckCircle className="text-green-500 mr-2" />
                  )}
                  {fare.flexibility.refund}
                </p>
                <p className="text-sm flex items-center">
                  <FaCheckCircle className="text-yellow-500 mr-2" />
                  {fare.flexibility.dateChange}
                </p>
              </div>

              <div>
                <h5 className="font-medium mb-2">Seats, Meals & More</h5>
                <p className="text-sm flex items-center">
                  {fare.seatsMeals.seats.includes("Free") ? (
                    <FaChair className="text-green-500 mr-2" />
                  ) : fare.seatsMeals.seats.includes("Chargeable") ? (
                    <FaChair className="text-yellow-500 mr-2" />
                  ) : (
                    <FaTimesCircle className="text-red-500 mr-2" />
                  )}
                  {fare.seatsMeals.seats}
                </p>
                <p className="text-sm flex items-center">
                  {fare.seatsMeals.meals.includes("Complimentary") ? (
                    <FaUtensils className="text-green-500 mr-2" />
                  ) : fare.seatsMeals.meals.includes("Chargeable") ? (
                    <FaUtensils className="text-yellow-500 mr-2" />
                  ) : (
                    <FaTimesCircle className="text-red-500 mr-2" />
                  )}
                  {fare.seatsMeals.meals}
                </p>
              </div>
            </div>
          ))}
        </div>

        {error && <div className="p-4 text-red-500">{error}</div>}

        <div className="flex justify-between items-center p-4 border-t">
          <p className="text-xl font-bold">
            ₹ {selectedFare ? selectedFare.price.toLocaleString() : selectedFlight.price.toLocaleString()}{" "}
            <span className="text-sm font-normal">FOR 1 ADULT</span>
          </p>
          <div>
            <button
              onClick={handleBookNow}
              className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              disabled={!selectedFare || loading}
            >
              {loading ? "Processing..." : "BOOK NOW"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightCart;