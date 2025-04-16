import React, { useState, useEffect } from "react"; // Added useEffect
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaExchangeAlt,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaCalendarAlt,
  FaPlane,
} from "react-icons/fa";

// Utility function to calculate duration between two times
const calculateDuration = (depTime, arrTime) => {
  if (!depTime || !arrTime) return { hours: 0, minutes: 0, totalMinutes: 0 };

  const [depHours, depMinutes] = depTime.split(":").map(Number);
  const [arrHours, arrMinutes] = arrTime.split(":").map(Number);

  const depTotalMinutes = depHours * 60 + depMinutes;
  let arrTotalMinutes = arrHours * 60 + arrMinutes;

  if (arrTotalMinutes < depTotalMinutes) {
    arrTotalMinutes += 24 * 60;
  }

  const diffMinutes = arrTotalMinutes - depTotalMinutes;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return { hours, minutes, totalMinutes: diffMinutes };
};

// Utility function to generate a random time after a base time with a specific duration
const generateRandomTime = (baseTime, minDuration = 60, maxDuration = 300) => {
  if (!baseTime) return { departureTime: "08:00", arrivalTime: "09:00", duration: "1h 0m" };

  const [baseHours, baseMinutes] = baseTime.split(":").map(Number);
  const baseTotalMinutes = baseHours * 60 + baseMinutes;

  const durationMinutes = Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration;
  const layoverMinutes = Math.floor(Math.random() * (120 - 60 + 1)) + 60; // 1-2 hour layover

  const newDepTotalMinutes = (baseTotalMinutes + layoverMinutes) % (24 * 60);
  const newDepHours = Math.floor(newDepTotalMinutes / 60);
  const newDepMinutes = newDepTotalMinutes % 60;

  const newArrTotalMinutes = (newDepTotalMinutes + durationMinutes) % (24 * 60);
  const newArrHours = Math.floor(newArrTotalMinutes / 60);
  const newArrMinutes = newArrTotalMinutes % 60;

  return {
    departureTime: `${newDepHours.toString().padStart(2, "0")}:${newDepMinutes.toString().padStart(2, "0")}`,
    arrivalTime: `${newArrHours.toString().padStart(2, "0")}:${newArrMinutes.toString().padStart(2, "0")}`,
    duration: `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`,
  };
};

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
  const [multiCityFlightTimes, setMultiCityFlightTimes] = useState({}); // New state to persist multi-city times
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {};

  // Initialize multi-city flight times only once per flight ID
  useEffect(() => {
    if (tripType === "multicity") {
      const updatedTimes = {};
      filteredFlights.forEach((flight) => {
        if (flight.multiCityFlights && !multiCityFlightTimes[flight.id]) {
          const times = flight.multiCityFlights.map((leg, index) => {
            if (index === 0) {
              return {
                ...leg,
                departureTime: leg.departureTime || "08:00",
                arrivalTime: leg.arrivalTime || "09:00",
                duration: leg.duration || "1h 0m",
              };
            }
            const prevLeg = flight.multiCityFlights[index - 1];
            const { departureTime, arrivalTime, duration } = generateRandomTime(
              prevLeg.arrivalTime || "09:00"
            );
            return {
              ...leg,
              departureTime,
              arrivalTime,
              duration,
            };
          });
          updatedTimes[flight.id] = times;
        }
      });
      setMultiCityFlightTimes((prev) => ({ ...prev, ...updatedTimes }));
    }
  }, [filteredFlights, tripType]); // Only runs when filteredFlights or tripType changes

  const toggleFlightDetails = (flightId) => {
    setExpandedFlightId(expandedFlightId === flightId ? null : flightId);
  };

  const handleViewMore = () => {
    setVisibleFlights(filteredFlights.length);
  };

  const handleSelectFlight = (flight) => {
    const outboundDuration = calculateDuration(flight.departureTime, flight.arrivalTime);
    let returnFlight = tripType === "return" && flight.returnFlight ? flight.returnFlight : null;
    if (tripType === "return" && (!returnFlight?.departureTime || !returnFlight?.arrivalTime)) {
      const { departureTime, arrivalTime } = generateRandomTime(
        flight.arrivalTime || "12:00",
        120,
        360
      );
      returnFlight = {
        ...flight.returnFlight,
        airline: flight.returnFlight?.airline || flight.airline,
        departure: flight.returnFlight?.departure || searchParams.to,
        arrival: flight.returnFlight?.arrival || searchParams.from,
        departureTime,
        arrivalTime,
        duration: `${outboundDuration.hours}h ${outboundDuration.minutes}m`,
      };
    }

    let enrichedFlight = { ...flight };
    if (tripType === "multicity" && flight.multiCityFlights) {
      enrichedFlight.multiCityFlights = multiCityFlightTimes[flight.id] || flight.multiCityFlights;
    }

    enrichedFlight = {
      ...enrichedFlight,
      returnFlight: tripType === "return" && returnFlight
        ? {
            ...returnFlight,
            airline: returnFlight.airline || flight.airline,
            departure: returnFlight.departure || searchParams.to,
            arrival: returnFlight.arrival || searchParams.from,
            departureTime: returnFlight.departureTime,
            arrivalTime: returnFlight.arrivalTime,
            duration: returnFlight.duration || `${outboundDuration.hours}h ${outboundDuration.minutes}m`,
          }
        : flight.returnFlight,
    };

    navigate("/flight-cart", { state: { selectedFlight: enrichedFlight, searchParams } });
  };

  const sortFlights = (flights) => {
    if (selectedFilter === "cheapest") {
      return [...flights].sort((a, b) => a.price - b.price);
    } else if (selectedFilter === "fastest") {
      return [...flights].sort((a, b) => {
        const durationA = tripType === "multicity"
          ? (multiCityFlightTimes[a.id] || a.multiCityFlights).reduce(
              (sum, leg) =>
                sum +
                (parseInt(leg.duration.split("h")[0]) * 60 +
                  (parseInt(leg.duration.split(" ")[1]?.split("m")[0]) || 0)),
              0
            )
          : parseInt(a.duration.split("h")[0]) * 60 +
            (parseInt(a.duration.split(" ")[1]?.split("m")[0]) || 0);
        const durationB = tripType === "multicity"
          ? (multiCityFlightTimes[b.id] || b.multiCityFlights).reduce(
              (sum, leg) =>
                sum +
                (parseInt(leg.duration.split("h")[0]) * 60 +
                  (parseInt(leg.duration.split(" ")[1]?.split("m")[0]) || 0)),
              0
            )
          : parseInt(b.duration.split("h")[0]) * 60 +
            (parseInt(b.duration.split(" ")[1]?.split("m")[0]) || 0);
        return durationA - durationB;
      });
    }
    return flights;
  };

  const sortedFlights = sortFlights(filteredFlights);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
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

      <div className="space-y-4">
        {sortedFlights.length > 0 ? (
          sortedFlights.slice(0, visibleFlights).map((flight) => {
            const outboundDuration = calculateDuration(flight.departureTime, flight.arrivalTime);
            let returnFlight = tripType === "return" && flight.returnFlight ? flight.returnFlight : null;
            if (tripType === "return" && (!returnFlight?.departureTime || !returnFlight?.arrivalTime)) {
              const { departureTime, arrivalTime } = generateRandomTime(
                flight.arrivalTime || "12:00",
                120,
                360
              );
              returnFlight = {
                ...flight.returnFlight,
                airline: flight.returnFlight?.airline || flight.airline,
                departure: flight.returnFlight?.departure || searchParams.to,
                arrival: flight.returnFlight?.arrival || searchParams.from,
                departureTime,
                arrivalTime,
                duration: `${outboundDuration.hours}h ${outboundDuration.minutes}m`,
              };
            }

            const multiCityFlightsWithTimes = tripType === "multicity" && flight.multiCityFlights
              ? multiCityFlightTimes[flight.id] || flight.multiCityFlights
              : null;

            return (
              <div
                key={flight.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {tripType === "multicity" && multiCityFlightsWithTimes ? (
                        multiCityFlightsWithTimes.map((leg, index) => (
                          <span key={index} className="text-sm text-gray-500">
                            {leg.airline || "Unknown Airline"} {leg.airlineCode || ""}
                            {leg.flightNumber || ""}
                            {index < multiCityFlightsWithTimes.length - 1 ? " | " : ""}
                          </span>
                        ))
                      ) : (
                        <>
                          <h3 className="text-lg font-semibold text-gray-800">{flight.airline || "Unknown Airline"}</h3>
                          <span className="text-sm text-gray-500">
                            {flight.airlineCode || ""}{flight.flightNumber || ""}
                          </span>
                          {tripType === "return" && returnDate && returnFlight && (
                            <span className="text-sm text-gray-500">
                              | {returnFlight.airline || flight.airline || "Unknown Airline"}{" "}
                              {returnFlight.airlineCode || flight.airlineCode || ""}
                              {returnFlight.flightNumber || flight.flightNumber || ""}
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

                  {tripType === "multicity" && multiCityFlightsWithTimes ? (
                    multiCityFlightsWithTimes.map((leg, index) => (
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
                                via {(leg.stopCities || flight.stopCities || []).join(", ")}
                              </p>
                            )}
                          </div>
                          {index === multiCityFlightsWithTimes.length - 1 && (
                            <div className="text-right">
                              <p className="text-2xl font-bold text-blue-600">
                                ₹{flight.price.toLocaleString()}
                              </p>
                              <button
                                onClick={() => handleSelectFlight({ ...flight, multiCityFlights: multiCityFlightsWithTimes })}
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
                              via {(flight.stopCities || []).join(", ")}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            ₹{flight.price.toLocaleString()}
                          </p>
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

                  {tripType === "return" && returnDate && returnFlight && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/5 flex items-center space-x-3">
                          <img
                            src={returnFlight.logo || flight.logo || "default-logo.png"}
                            alt={returnFlight.airline || flight.airline || "Unknown"}
                            className="h-8 w-8 object-contain"
                          />
                          <div>
                            <p className="font-medium">
                              {returnFlight.airline || flight.airline || "Unknown Airline"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {(returnFlight.airlineCode || flight.airlineCode || "") +
                                (returnFlight.flightNumber || flight.flightNumber || "")}
                            </p>
                          </div>
                        </div>
                        <div className="md:w-2/5 flex items-center justify-between">
                          <div className="text-center">
                            <p className="text-lg font-bold">{returnFlight.departureTime || "N/A"}</p>
                            <p className="text-sm">{returnFlight.departure || "N/A"}</p>
                          </div>
                          <div className="flex flex-col items-center justify-center px-4">
                            <div className="text-xs text-gray-500">
                              {returnFlight.duration || "N/A"}
                            </div>
                            <div className="w-24 md:w-32 h-px bg-gray-300 relative my-2">
                              {(returnFlight.stops || flight.stops || 0) > 0 && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {(returnFlight.stops || flight.stops || 0) === 0
                                ? "Direct"
                                : `${returnFlight.stops || flight.stops} stop`}
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold">{returnFlight.arrivalTime || "N/A"}</p>
                            <p className="text-sm">{returnFlight.arrival || "N/A"}</p>
                          </div>
                        </div>
                        <div className="md:w-2/5 flex flex-col-reverse md:flex-row items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">{flight.cabinClass || "N/A"}</p>
                            {(returnFlight.stops || flight.stops || 0) > 0 && (
                              <p className="text-xs text-gray-500">
                                via {(returnFlight.stopCities || flight.stopCities || []).join(", ")}
                              </p>
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
                        {tripType === "multicity" && multiCityFlightsWithTimes ? (
                          multiCityFlightsWithTimes.map((leg, index) => (
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
                                      <p className="font-medium">
                                        {leg.departureTime || "N/A"} • {leg.departure || "N/A"}
                                      </p>
                                      <p className="text-sm text-gray-500">{leg.departureDate || "N/A"}</p>
                                      <p className="text-sm text-gray-500">
                                        {(leg.airline || flight.airline || "Unknown Airline")} •{" "}
                                        {(leg.airlineCode || flight.airlineCode || "") +
                                          (leg.flightNumber || flight.flightNumber || "")}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-gray-500">
                                        Duration: {leg.duration || "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                  {(leg.stops || flight.stops || 0) > 0 && (
                                    <div className="bg-gray-200 p-2 rounded-lg mb-4">
                                      <p className="text-sm text-gray-600">
                                        Layover in {(leg.stopCities || flight.stopCities || []).join(", ") || "N/A"} •
                                        Approx. 1-2h
                                      </p>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <div>
                                      <p className="font-medium">
                                        {leg.arrivalTime || "N/A"} • {leg.arrival || "N/A"}
                                      </p>
                                      <p className="text-sm text-gray-500">{leg.departureDate || "N/A"}</p>
                                      <p className="text-sm text-gray-500">
                                        {(leg.airline || flight.airline || "Unknown Airline")} •{" "}
                                        {(leg.airlineCode || flight.airlineCode || "") +
                                          (leg.flightNumber || flight.flightNumber || "")}
                                      </p>
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
                                      <p className="font-medium">
                                        {flight.departureTime || "N/A"} • {flight.departure || "N/A"}
                                      </p>
                                      <p className="text-sm text-gray-500">{flight.departureDate || "N/A"}</p>
                                      <p className="text-sm text-gray-500">
                                        {flight.airline || "Unknown Airline"} •{" "}
                                        {(flight.airlineCode || "") + (flight.flightNumber || "")}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-gray-500">
                                        Duration: {flight.duration || "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                  {(flight.stops || 0) > 0 && (
                                    <div className="bg-gray-200 p-2 rounded-lg mb-4">
                                      <p className="text-sm text-gray-600">
                                        Layover in {(flight.stopCities || []).join(", ") || "N/A"} • Approx. 2h 30m
                                      </p>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <div>
                                      <p className="font-medium">
                                        {flight.arrivalTime || "N/A"} • {flight.arrival || "N/A"}
                                      </p>
                                      <p className="text-sm text-gray-500">{flight.departureDate || "N/A"}</p>
                                      <p className="text-sm text-gray-500">
                                        {flight.airline || "Unknown Airline"} •{" "}
                                        {(flight.airlineCode || "") + (flight.flightNumber || "")}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {tripType === "return" && returnDate && returnFlight && (
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
                                        <p className="font-medium">
                                          {returnFlight.departureTime || "N/A"} • {returnFlight.departure || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {returnFlight.departureDate || returnDate || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {(returnFlight.airline || flight.airline || "Unknown Airline")} •{" "}
                                          {(returnFlight.airlineCode || flight.airlineCode || "") +
                                            (returnFlight.flightNumber || flight.flightNumber || "")}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                          Duration: {returnFlight.duration || flight.duration || "N/A"}
                                        </p>
                                      </div>
                                    </div>
                                    {(returnFlight.stops || flight.stops || 0) > 0 && (
                                      <div className="bg-gray-200 p-2 rounded-lg mb-4">
                                        <p className="text-sm text-gray-600">
                                          Layover in{" "}
                                          {(returnFlight.stopCities || flight.stopCities || []).join(", ") || "N/A"} •
                                          Approx. 2h 30m
                                        </p>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <div>
                                        <p className="font-medium">
                                          {returnFlight.arrivalTime || "N/A"} • {returnFlight.arrival || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {returnFlight.departureDate || returnDate || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {(returnFlight.airline || flight.airline || "Unknown Airline")} •{" "}
                                          {(returnFlight.airlineCode || flight.airlineCode || "") +
                                            (returnFlight.flightNumber || flight.flightNumber || "")}
                                        </p>
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
                                <p className="text-sm">
                                  Return Date: {returnFlight?.departureDate || returnDate || "N/A"}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <FaPlane className="text-blue-600" />
                              <p className="text-sm">Cabin Class: {flight.cabinClass || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
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