import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const Favorite = ({ allFlights, toggleFavorite }) => {
  const navigate = useNavigate();

  const favoriteFlights = allFlights.filter((flight) => flight.isFavorite);

  const handleSelectFlight = (flight) => {
    navigate("/flight-cart", { state: { selectedFlight: flight, searchParams: {} } });
  };

  return (
    <div className="bg-blue-50 min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="text-2xl font-bold mb-6">Your Favorite Flights ({favoriteFlights.length})</h2>

        {favoriteFlights.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-lg">No favorite flights yet.</p>
            <p className="text-gray-600 mt-2">Add some flights to your favorites to see them here!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {favoriteFlights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {flight.favoritedTripType === "multicity" && flight.multiCityFlights ? (
                      flight.multiCityFlights.map((leg, index) => (
                        <span key={index} className="text-sm text-gray-500">
                          {leg.airline || "Unknown Airline"} {leg.airlineCode || ""}
                          {leg.flightNumber || ""}
                          {index < flight.multiCityFlights.length - 1 ? " | " : ""}
                        </span>
                      ))
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {flight.airline || "Unknown Airline"}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {flight.airlineCode || ""}{flight.flightNumber || ""}
                        </span>
                        {flight.favoritedTripType === "return" && flight.returnFlight && (
                          <span className="text-sm text-gray-500">
                            | {flight.returnFlight.airline || flight.airline || "Unknown Airline"}{" "}
                            {flight.returnFlight.airlineCode || flight.airlineCode || ""}
                            {flight.returnFlight.flightNumber || flight.flightNumber || ""}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFavorite(flight.id)}
                    className="text-red-500 hover:text-gray-400 transition-colors"
                  >
                    <FaHeart size={20} />
                  </button>
                </div>

                {flight.favoritedTripType === "multicity" && flight.multiCityFlights ? (
                  flight.multiCityFlights.map((leg, index) => (
                    <div
                      key={index}
                      className={`flex flex-col md:flex-row gap-6 ${
                        index > 0 ? "mt-4 pt-4 border-t border-gray-200" : ""
                      }`}
                    >
                      <div className="md:w-1/5 flex items-center space-x-3">
                        <img
                          src={leg.logo || flight.logo || "default-logo.png"}
                          alt={leg.airline || flight.airline || "Unknown"}
                          className="h-8 w-8 object-contain"
                        />
                        <div>
                          <p className="font-medium">{leg.airline || flight.airline || "Unknown Airline"}</p>
                          <p className="text-sm text-gray-500">
                            {(leg.airlineCode || flight.airlineCode || "") +
                              (leg.flightNumber || flight.flightNumber || "")}
                          </p>
                        </div>
                      </div>
                      <div className="md:w-2/5 flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-lg font-bold">{leg.departureTime || "N/A"}</p>
                          <p className="text-sm">{leg.departure || "N/A"}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center px-4">
                          <div className="text-xs text-gray-500">{leg.duration || "N/A"}</div>
                          <div className="w-24 md:w-32 h-px bg-gray-300 relative my-2">
                            {(leg.stops || flight.stops || 0) > 0 && (
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {(leg.stops || flight.stops || 0) === 0 ? "Direct" : `${leg.stops || flight.stops} stop`}
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{leg.arrivalTime || "N/A"}</p>
                          <p className="text-sm">{leg.arrival || "N/A"}</p>
                        </div>
                      </div>
                      <div className="md:w-2/5 flex flex-col-reverse md:flex-row items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{flight.cabinClass || "N/A"}</p>
                          {(leg.stops || flight.stops || 0) > 0 && (
                            <p className="text-xs text-gray-500">
                              via {(leg.stopCities || flight.stopCities || []).join(", ") || "N/A"}
                            </p>
                          )}
                        </div>
                        {index === flight.multiCityFlights.length - 1 && (
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">
                              ₹{flight.price.toLocaleString()}
                            </p>
                            <button
                              onClick={() => handleSelectFlight(flight)}
                              className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                            >
                              Select
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/5 flex items-center space-x-3">
                        <img
                          src={flight.logo || "default-logo.png"}
                          alt={flight.airline || "Unknown"}
                          className="h-8 w-8 object-contain"
                        />
                        <div>
                          <p className="font-medium">{flight.airline || "Unknown Airline"}</p>
                          <p className="text-sm text-gray-500">
                            {(flight.airlineCode || "") + (flight.flightNumber || "")}
                          </p>
                        </div>
                      </div>
                      <div className="md:w-2/5 flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-lg font-bold">{flight.departureTime || "N/A"}</p>
                          <p className="text-sm">{flight.departure || "N/A"}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center px-4">
                          <div className="text-xs text-gray-500">{flight.duration || "N/A"}</div>
                          <div className="w-24 md:w-32 h-px bg-gray-300 relative my-2">
                            {(flight.stops || 0) > 0 && (
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {(flight.stops || 0) === 0 ? "Direct" : `${flight.stops} stop`}
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{flight.arrivalTime || "N/A"}</p>
                          <p className="text-sm">{flight.arrival || "N/A"}</p>
                        </div>
                      </div>
                      <div className="md:w-2/5 flex flex-col-reverse md:flex-row items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{flight.cabinClass || "N/A"}</p>
                          {(flight.stops || 0) > 0 && (
                            <p className="text-xs text-gray-500">
                              via {(flight.stopCities || []).join(", ") || "N/A"}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            ₹{flight.price.toLocaleString()}
                          </p>
                          <button
                            onClick={() => handleSelectFlight(flight)}
                            className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    </div>

                    {flight.favoritedTripType === "return" && flight.returnFlight && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-1/5 flex items-center space-x-3">
                            <img
                              src={flight.returnFlight.logo || flight.logo || "default-logo.png"}
                              alt={flight.returnFlight.airline || flight.airline || "Unknown"}
                              className="h-8 w-8 object-contain"
                            />
                            <div>
                              <p className="font-medium">
                                {flight.returnFlight.airline || flight.airline || "Unknown Airline"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {(flight.returnFlight.airlineCode || flight.airlineCode || "") +
                                  (flight.returnFlight.flightNumber || flight.flightNumber || "")}
                              </p>
                            </div>
                          </div>
                          <div className="md:w-2/5 flex items-center justify-between">
                            <div className="text-center">
                              <p className="text-lg font-bold">
                                {flight.returnFlight.departureTime || "N/A"}
                              </p>
                              <p className="text-sm">{flight.returnFlight.departure || "N/A"}</p>
                            </div>
                            <div className="flex flex-col items-center justify-center px-4">
                              <div className="text-xs text-gray-500">
                                {flight.returnFlight.duration || "N/A"}
                              </div>
                              <div className="w-24 md:w-32 h-px bg-gray-300 relative my-2">
                                {(flight.returnFlight.stops || flight.stops || 0) > 0 && (
                                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {(flight.returnFlight.stops || flight.stops || 0) === 0
                                  ? "Direct"
                                  : `${flight.returnFlight.stops || flight.stops} stop`}
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold">
                                {flight.returnFlight.arrivalTime || "N/A"}
                              </p>
                              <p className="text-sm">{flight.returnFlight.arrival || "N/A"}</p>
                            </div>
                          </div>
                          <div className="md:w-2/5 flex flex-col-reverse md:flex-row items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">{flight.cabinClass || "N/A"}</p>
                              {(flight.returnFlight.stops || flight.stops || 0) > 0 && (
                                <p className="text-xs text-gray-500">
                                  via{" "}
                                  {(flight.returnFlight.stopCities || flight.stopCities || []).join(", ") || "N/A"}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorite;