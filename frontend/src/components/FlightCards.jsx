import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaExchangeAlt,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaCalendarAlt,
  FaPlane,
} from "react-icons/fa";

const FlightCards = ({
  filteredFlights,
  tripType,
  returnDate,
  selectedFilter,
  setSelectedFilter,
  expandedFlightId,
  setExpandedFlightId,
  toggleFavorite,
}) => {
  const [visibleFlights, setVisibleFlights] = useState(6);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {};

  const toggleFlightDetails = (flightId) => {
    setExpandedFlightId(expandedFlightId === flightId ? null : flightId);
  };

  const handleViewMore = () => {
    setVisibleFlights(filteredFlights.length);
  };

  const handleSelectFlight = (flight) => {
    navigate("/flight-cart", { state: { selectedFlight: flight, searchParams } });
  };

  const sortFlights = (flights) => {
    if (selectedFilter === "cheapest") {
      return [...flights].sort((a, b) => a.price - b.price);
    } else if (selectedFilter === "fastest") {
      return [...flights].sort((a, b) => {
        const durationA = parseInt(a.duration.split('h')[0]) * 60 + (parseInt(a.duration.split(' ')[1]?.split('m')[0]) || 0);
        const durationB = parseInt(b.duration.split('h')[0]) * 60 + (parseInt(b.duration.split(' ')[1]?.split('m')[0]) || 0);
        return durationA - durationB;
      });
    }
    return flights; // "best" or default
  };

  const sortedFlights = sortFlights(filteredFlights);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter); // Ensure this updates the parent state
  };

  return (
    <div className="flex-1">
      <div className="bg-white rounded-xl p-4 mb-6 flex flex-wrap gap-2">
        {["best", "cheapest", "fastest"].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 cursor-pointer rounded-lg ${
              selectedFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => handleFilterClick(filter)} 
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Rest of the component remains unchanged */}
      <div className="space-y-4">
        {sortedFlights.length > 0 ? (
          sortedFlights.slice(0, visibleFlights).map((flight) => (
            <div
              key={flight.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {tripType === "multicity" && flight.multiCityFlights ? (
                      flight.multiCityFlights.map((leg, index) => (
                        <span key={index} className="text-sm text-gray-500">
                          {leg.airline} {leg.airlineCode}{leg.flightNumber}
                          {index < flight.multiCityFlights.length - 1 ? " | " : ""}
                        </span>
                      ))
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-800">{flight.airline}</h3>
                        <span className="text-sm text-gray-500">
                          {flight.airlineCode}{flight.flightNumber}
                        </span>
                        {tripType === "return" && returnDate && flight.returnFlight && (
                          <span className="text-sm text-gray-500">
                            | {flight.returnFlight.airline} {flight.returnFlight.airlineCode}{flight.returnFlight.flightNumber}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFavorite(flight.id)}
                    className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                  >
                    <FaHeart className={flight.isFavorite ? "text-red-500" : ""} size={20} />
                  </button>
                </div>

                {tripType === "multicity" && flight.multiCityFlights ? (
                  flight.multiCityFlights.map((leg, index) => (
                    <div
                      key={index}
                      className={`flex flex-col md:flex-row gap-6 ${index > 0 ? "mt-4 pt-4 border-t border-gray-200" : ""}`}
                    >
                      <div className="md:w-1/5 flex items-center space-x-3">
                        <img src={leg.logo} alt={leg.airline} className="h-8 w-8 object-contain" />
                        <div>
                          <p className="font-medium">{leg.airline}</p>
                          <p className="text-sm text-gray-500">{leg.airlineCode}{leg.flightNumber}</p>
                        </div>
                      </div>
                      <div className="md:w-2/5 flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-lg font-bold">{leg.departureTime}</p>
                          <p className="text-sm">{leg.departure || "N/A"}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center px-4">
                          <div className="text-xs text-gray-500">{leg.duration}</div>
                          <div className="w-24 md:w-32 h-px bg-gray-300 relative my-2">
                            {leg.stops > 0 && (
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {leg.stops === 0 ? "Direct" : `${leg.stops} stop`}
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{leg.arrivalTime}</p>
                          <p className="text-sm">{leg.arrival || "N/A"}</p>
                        </div>
                      </div>
                      <div className="md:w-2/5 flex flex-col-reverse md:flex-row items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{flight.cabinClass}</p>
                          {leg.stops > 0 && (
                            <p className="text-xs text-gray-500">via {leg.stopCities.join(", ")}</p>
                          )}
                        </div>
                        {index === flight.multiCityFlights.length - 1 && (
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">₹{flight.price.toLocaleString()}</p>
                            <button
                              onClick={() => handleSelectFlight(flight)}
                              className="mt-2 bg-blue-600 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                              Select
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/5 flex items-center space-x-3">
                      <img src={flight.logo} alt={flight.airline} className="h-8 w-8 object-contain" />
                      <div>
                        <p className="font-medium">{flight.airline}</p>
                        <p className="text-sm text-gray-500">{flight.airlineCode}{flight.flightNumber}</p>
                      </div>
                    </div>
                    <div className="md:w-2/5 flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-lg font-bold">{flight.departureTime}</p>
                        <p className="text-sm">{flight.departure || "N/A"}</p>
                      </div>
                      <div className="flex flex-col items-center justify-center px-4">
                        <div className="text-xs text-gray-500">{flight.duration}</div>
                        <div className="w-24 md:w-32 h-px bg-gray-300 relative my-2">
                          {flight.stops > 0 && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {flight.stops === 0 ? "Direct" : `${flight.stops} stop`}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">{flight.arrivalTime}</p>
                        <p className="text-sm">{flight.arrival || "N/A"}</p>
                      </div>
                    </div>
                    <div className="md:w-2/5 flex flex-col-reverse md:flex-row items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{flight.cabinClass}</p>
                        {flight.stops > 0 && (
                          <p className="text-xs text-gray-500">via {flight.stopCities.join(", ")}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">₹{flight.price.toLocaleString()}</p>
                        <button
                          onClick={() => handleSelectFlight(flight)}
                          className="mt-2 bg-blue-600 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {tripType === "return" && returnDate && flight.returnFlight && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/5 flex items-center space-x-3">
                        <img
                          src={flight.returnFlight.logo}
                          alt={flight.returnFlight.airline}
                          className="h-8 w-8 object-contain"
                        />
                        <div>
                          <p className="font-medium">{flight.returnFlight.airline}</p>
                          <p className="text-sm text-gray-500">{flight.returnFlight.airlineCode}{flight.returnFlight.flightNumber}</p>
                        </div>
                      </div>
                      <div className="md:w-2/5 flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-lg font-bold">{flight.returnFlight.departureTime}</p>
                          <p className="text-sm">{flight.returnFlight.departure || "N/A"}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center px-4">
                          <div className="text-xs text-gray-500">{flight.returnFlight.duration}</div>
                          <div className="w-24 md:w-32 h-px bg-gray-300 relative my-2">
                            {flight.returnFlight.stops > 0 && (
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {flight.returnFlight.stops === 0 ? "Direct" : `${flight.returnFlight.stops} stop`}
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{flight.returnFlight.arrivalTime}</p>
                          <p className="text-sm">{flight.returnFlight.arrival || "N/A"}</p>
                        </div>
                      </div>
                      <div className="md:w-2/5 flex flex-col-reverse md:flex-row items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{flight.cabinClass}</p>
                          {flight.returnFlight.stops > 0 && (
                            <p className="text-xs text-gray-500">via {flight.returnFlight.stopCities.join(", ")}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    className="text-blue-600 text-sm cursor-pointer flex items-center"
                    onClick={() => toggleFlightDetails(flight.id)}
                  >
                    <FaExchangeAlt className="mr-2" />
                    {expandedFlightId === flight.id ? "Hide details" : "Flight details"}
                  </button>
                </div>

                {expandedFlightId === flight.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Flight Details</h3>
                    <div className="space-y-6">
                      {tripType === "multicity" && flight.multiCityFlights ? (
                        flight.multiCityFlights.map((leg, index) => (
                          <div key={index}>
                            <h4 className="font-medium mb-2">Flight {index + 1}</h4>
                            <div className="flex items-start gap-4">
                              <div className="flex flex-col items-center">
                                <FaPlaneDeparture className="text-blue-600" />
                                <div className="w-px h-16 bg-gray-300 my-1"></div>
                                <FaPlaneArrival className="text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between mb-4">
                                  <div>
                                    <p className="font-medium">{leg.departureTime || "N/A"} • {leg.departure || "N/A"}</p>
                                    <p className="text-sm text-gray-500">{leg.departureDate || "N/A"}</p>
                                    <p className="text-sm text-gray-500">{leg.airline} • {leg.airlineCode}{leg.flightNumber}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">Duration: {leg.duration || "N/A"}</p>
                                  </div>
                                </div>
                                {leg.stops > 0 && (
                                  <div className="bg-gray-200 p-2 rounded-lg mb-4">
                                    <p className="text-sm text-gray-600">Layover in {leg.stopCities.join(", ") || "N/A"} • Approx. 2h 30m</p>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium">{leg.arrivalTime || "N/A"} • {leg.arrival || "N/A"}</p>
                                    <p className="text-sm text-gray-500">{leg.departureDate || "N/A"}</p>
                                    <p className="text-sm text-gray-500">{leg.airline} • {leg.airlineCode}{leg.flightNumber}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div>
                            <h4 className="font-medium mb-2">Outbound Flight</h4>
                            <div className="flex items-start gap-4">
                              <div className="flex flex-col items-center">
                                <FaPlaneDeparture className="text-blue-600" />
                                <div className="w-px h-16 bg-gray-300 my-1"></div>
                                <FaPlaneArrival className="text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between mb-4">
                                  <div>
                                    <p className="font-medium">{flight.departureTime || "N/A"} • {flight.departure || "N/A"}</p>
                                    <p className="text-sm text-gray-500">{flight.departureDate || "N/A"}</p>
                                    <p className="text-sm text-gray-500">{flight.airline} • {flight.airlineCode}{flight.flightNumber}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">Duration: {flight.duration || "N/A"}</p>
                                  </div>
                                </div>
                                {flight.stops > 0 && (
                                  <div className="bg-gray-200 p-2 rounded-lg mb-4">
                                    <p className="text-sm text-gray-600">Layover in {flight.stopCities.join(", ") || "N/A"} • Approx. 2h 30m</p>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium">{flight.arrivalTime || "N/A"} • {flight.arrival || "N/A"}</p>
                                    <p className="text-sm text-gray-500">{flight.departureDate || "N/A"}</p>
                                    <p className="text-sm text-gray-500">{flight.airline} • {flight.airlineCode}{flight.flightNumber}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {tripType === "return" && returnDate && flight.returnFlight && (
                            <div>
                              <h4 className="font-medium mb-2">Return Flight</h4>
                              <div className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                  <FaPlaneDeparture className="text-blue-600" />
                                  <div className="w-px h-16 bg-gray-300 my-1"></div>
                                  <FaPlaneArrival className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between mb-4">
                                    <div>
                                      <p className="font-medium">{flight.returnFlight.departureTime || "N/A"} • {flight.returnFlight.departure || "N/A"}</p>
                                      <p className="text-sm text-gray-500">{flight.returnFlight.departureDate || returnDate || "N/A"}</p>
                                      <p className="text-sm text-gray-500">{flight.returnFlight.airline} • {flight.returnFlight.airlineCode}{flight.returnFlight.flightNumber}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-gray-500">Duration: {flight.returnFlight.duration || "N/A"}</p>
                                    </div>
                                  </div>
                                  {flight.returnFlight.stops > 0 && (
                                    <div className="bg-gray-200 p-2 rounded-lg mb-4">
                                      <p className="text-sm text-gray-600">Layover in {flight.returnFlight.stopCities.join(", ") || "N/A"} • Approx. 2h 30m</p>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <div>
                                      <p className="font-medium">{flight.returnFlight.arrivalTime || "N/A"} • {flight.returnFlight.arrival || "N/A"}</p>
                                      <p className="text-sm text-gray-500">{flight.returnFlight.departureDate || returnDate || "N/A"}</p>
                                      <p className="text-sm text-gray-500">{flight.returnFlight.airline} • {flight.returnFlight.airlineCode}{flight.returnFlight.flightNumber}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      <div>
                        <h4 className="font-medium mb-2">Price Breakdown</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <p className="text-sm">Base Fare</p>
                            <p className="text-sm">₹{(flight.price * 0.8).toLocaleString()}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm">Taxes & Fees</p>
                            <p className="text-sm">₹{(flight.price * 0.2).toLocaleString()}</p>
                          </div>
                          <div className="flex justify-between font-semibold border-t pt-2">
                            <p>Total Price</p>
                            <p>₹{flight.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Additional Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-blue-600" />
                            <p className="text-sm">Departure Date: {flight.departureDate || "N/A"}</p>
                          </div>
                          {tripType === "return" && returnDate && (
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-blue-600" />
                              <p className="text-sm">Return Date: {flight.returnFlight?.departureDate || returnDate || "N/A"}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <FaPlane className="text-blue-600" />
                            <p className="text-sm">Cabin Class: {flight.cabinClass}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-lg">No flights found matching your criteria.</p>
            <p className="text-gray-600 mt-2">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {visibleFlights < sortedFlights.length && (
        <div className="mt-6 text-center">
          <button
            onClick={handleViewMore}
            className="bg-blue-600 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightCards;