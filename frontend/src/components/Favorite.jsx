import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const Favorite = ({ allFlights, setAllFlights, tripType, returnDate }) => {
  const navigate = useNavigate();

  console.log("Favorite.jsx - Received allFlights:", allFlights); // Debug

  const favoriteFlights = allFlights
    ? allFlights.filter((flight) => flight.isFavorite)
    : [];

  console.log("Favorite.jsx - Filtered favoriteFlights:", favoriteFlights); // Debug

  if (!favoriteFlights.length) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Favorite Flights</h2>
          <p className="text-gray-600">You haven’t marked any flights as favorites yet.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const handleSelectFlight = (flight) => {
    navigate("/flight-cart", {
      state: {
        selectedFlight: flight,
        searchParams: {
          tripType,
          from: flight.departure,
          to: flight.arrival,
          departDate: flight.departureDate,
          returnDate,
          multiCityFlights: flight.multiCityFlights || [],
        },
      },
    });
  };

  const toggleFavorite = (flightId) => {
    const updatedFlights = allFlights.map((flight) =>
      flight.id === flightId ? { ...flight, isFavorite: !flight.isFavorite } : flight
    );
    setAllFlights(updatedFlights);
    console.log("Favorite.jsx - Updated flights after toggle:", updatedFlights); // Debug
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold mb-6">Your Favorite Flights ({favoriteFlights.length})</h2>
        <div className="space-y-4">
          {favoriteFlights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-lg transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <img src={flight.logo} alt={flight.airline} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-semibold">
                      {flight.airline} {flight.airlineCode}-{flight.flightNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {flight.departure} → {flight.arrival} • {flight.departureDate}
                    </p>
                    <p className="text-sm">
                      {flight.departureTime} - {flight.arrivalTime} • {flight.duration}
                    </p>
                  </div>
                </div>
                {tripType === "return" && flight.returnFlight && (
                  <div className="mt-2">
                    <p className="font-semibold">Return:</p>
                    <p className="text-sm text-gray-600">
                      {flight.returnFlight.departure} → {flight.returnFlight.arrival} • {returnDate}
                    </p>
                    <p className="text-sm">
                      {flight.returnFlight.departureTime} - {flight.returnFlight.arrivalTime} • {flight.duration}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-4 md:mt-0 md:text-right flex items-center space-x-4">
                <div>
                  <p className="text-lg font-bold">₹ {flight.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">per adult</p>
                </div>
                <button
                  onClick={() => toggleFavorite(flight.id)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <FaHeart size={20} />
                </button>
                <button
                  onClick={() => handleSelectFlight(flight)}
                  className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-blue-700"
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorite;