import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlightFilters from "./FlightFilters";
import FlightCards from "./FlightCards";
import FlightSearchFormPopup from "./FlightSearchFormPopup";
import Footer from "./Footer";
import { FaSearch, FaFilter } from "react-icons/fa";

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

// Utility function to generate random return time
const generateRandomReturnTime = (baseArrivalTime, durationMinutes) => {
  if (!baseArrivalTime || durationMinutes === undefined) {
    return { departureTime: "14:00", arrivalTime: "15:00" };
  }

  const [baseHours, baseMinutes] = baseArrivalTime.split(":").map(Number);
  let baseTotalMinutes = baseHours * 60 + baseMinutes;

  const minLayoverMinutes = 120; // 2 hours
  const maxLayoverMinutes = 360; // 6 hours
  const layoverMinutes = Math.floor(Math.random() * (maxLayoverMinutes - minLayoverMinutes + 1)) + minLayoverMinutes;

  const returnDepTotalMinutes = (baseTotalMinutes + layoverMinutes) % (24 * 60);
  const returnDepHours = Math.floor(returnDepTotalMinutes / 60);
  const returnDepMinutes = returnDepTotalMinutes % 60;

  const returnArrTotalMinutes = (returnDepTotalMinutes + durationMinutes) % (24 * 60);
  const returnArrHours = Math.floor(returnArrTotalMinutes / 60);
  const returnArrMinutes = returnArrTotalMinutes % 60;

  return {
    departureTime: `${returnDepHours.toString().padStart(2, "0")}:${returnDepMinutes.toString().padStart(2, "0")}`,
    arrivalTime: `${returnArrHours.toString().padStart(2, "0")}:${returnArrMinutes.toString().padStart(2, "0")}`,
  };
};

const FlightData = ({
  allFlights,
  setAllFlights,
  tripType,
  setTripType,
  returnDate,
  setReturnDate,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialSearchParams = location.state || {};
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [from, setFrom] = useState(initialSearchParams.from || "");
  const [to, setTo] = useState(initialSearchParams.to || "");
  const [departDate, setDepartDate] = useState(initialSearchParams.departDate || "");
  const [cabinClass, setCabinClass] = useState(initialSearchParams.cabinClass || "Economy");
  const [flexibleTickets, setFlexibleTickets] = useState(initialSearchParams.flexibleTickets || false);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("best");
  const [expandedFlightId, setExpandedFlightId] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [multiCityFlights, setMultiCityFlights] = useState(initialSearchParams.multiCityFlights || []);

  const [priceRange, setPriceRange] = useState([3000, 6000]);
  const [stopFilter, setStopFilter] = useState("direct");
  const [timeFilter, setTimeFilter] = useState("all");
  const [airlinesFilter, setAirlinesFilter] = useState([]);

  useEffect(() => {
    let enrichedFlights = allFlights.map((flight) => {
      const outboundDuration = calculateDuration(flight.departureTime, flight.arrivalTime);
      let returnFlightData = flight.returnFlight;

      if (tripType === "return" && from && to) {
        const { departureTime, arrivalTime } = generateRandomReturnTime(
          flight.arrivalTime || "12:00",
          outboundDuration.totalMinutes
        );
        returnFlightData = {
          ...flight.returnFlight,
          departure: to,
          arrival: from,
          departureDate: returnDate || flight.departureDate,
          departureTime,
          arrivalTime,
          duration: `${outboundDuration.hours}h ${outboundDuration.minutes}m`,
          stops: flight.returnFlight?.stops || flight.stops,
          stopCities: flight.returnFlight?.stopCities || flight.stopCities,
        };
      }

      return {
        ...flight,
        departure: from || flight.departure,
        arrival: to || flight.arrival,
        departureDate: departDate || flight.departureDate,
        cabinClass: cabinClass || flight.cabinClass, // Ensure cabinClass is set
        returnFlight: returnFlightData,
        isFavorite: flight.isFavorite || !!favorites[`${flight.id}-${tripType}`],
      };
    });

    if (tripType === "multicity" && multiCityFlights.length > 0) {
      enrichedFlights = multiCityFlights.map((flight, index) => ({
        ...allFlights[index % allFlights.length],
        departure: flight.from,
        arrival: flight.to,
        departureDate: flight.depart,
        cabinClass: flight.cabinClass || cabinClass, // Include cabinClass from multiCityFlights or fallback
        multiCityFlights: multiCityFlights.map((f) => ({
          ...allFlights[index % allFlights.length],
          departure: f.from,
          arrival: f.to,
          departureDate: f.depart,
          cabinClass: f.cabinClass || cabinClass, // Ensure cabinClass per leg
        })),
        isFavorite: allFlights[index % allFlights.length].isFavorite || !!favorites[`${allFlights[index % allFlights.length].id}-${tripType}`],
      }));
    }

    setAllFlights(enrichedFlights);
    setFilteredFlights(enrichedFlights);
  }, [from, to, departDate, returnDate, tripType, multiCityFlights, cabinClass]);

  useEffect(() => {
    if (location.state) {
      setTripType(location.state.tripType || "oneway");
      setFrom(location.state.from || "");
      setTo(location.state.to || "");
      setDepartDate(location.state.departDate || "");
      setReturnDate(location.state.returnDate || "");
      setCabinClass(location.state.cabinClass || "Economy");
      setMultiCityFlights(location.state.multiCityFlights || []);
      setFlexibleTickets(location.state.flexibleTickets || false);
    }
  }, [location.state, setTripType, setReturnDate]);

  useEffect(() => {
    let results = [...allFlights];

    if (cabinClass) {
      results = results.filter((flight) => flight.cabinClass === cabinClass);
    }

    results = results.filter(
      (flight) => flight.price >= priceRange[0] && flight.price <= priceRange[1]
    );

    if (stopFilter === "direct") {
      results = results.filter((flight) => flight.stops === 0);
    }

    if (timeFilter === "morning") {
      results = results.filter((flight) => {
        const hour = parseInt(flight.departureTime.split(":")[0]);
        return hour >= 5 && hour < 12;
      });
    } else if (timeFilter === "afternoon") {
      results = results.filter((flight) => {
        const hour = parseInt(flight.departureTime.split(":")[0]);
        return hour >= 12 && hour < 18;
      });
    } else if (timeFilter === "evening") {
      results = results.filter((flight) => {
        const hour = parseInt(flight.departureTime.split(":")[0]);
        return hour >= 18 || hour < 5;
      });
    }

    if (airlinesFilter.length > 0) {
      results = results.filter((flight) => airlinesFilter.includes(flight.airline));
    }

    if (flexibleTickets) {
      results.sort((a, b) => {
        if (a.price !== b.price) return a.price - b.price;
        const scoreA = a.price / 1000 + parseInt(a.duration.split("h")[0]);
        const scoreB = b.price / 1000 + parseInt(b.duration.split("h")[0]);
        return scoreA - scoreB;
      });
    } else if (selectedFilter === "cheapest") {
      results.sort((a, b) => a.price - b.price);
    } else if (selectedFilter === "fastest") {
      results.sort((a, b) => {
        const durationA = parseInt(a.duration.split("h")[0]) * 60 + (parseInt(a.duration.split("h")[1]) || 0);
        const durationB = parseInt(b.duration.split("h")[0]) * 60 + (parseInt(b.duration.split("h")[1]) || 0);
        return durationA - durationB;
      });
    } else if (selectedFilter === "best") {
      results.sort((a, b) => {
        const scoreA = a.price / 1000 + parseInt(a.duration.split("h")[0]);
        const scoreB = b.price / 1000 + parseInt(b.duration.split("h")[0]);
        return scoreA - scoreB;
      });
    }

    setFilteredFlights(results);
  }, [
    allFlights,
    selectedFilter,
    priceRange,
    stopFilter,
    timeFilter,
    airlinesFilter,
    cabinClass,
    flexibleTickets,
  ]);

  const handleSearch = (e, multiCityData, flexibleTicketsFromPopup) => {
    e.preventDefault();
    let enrichedFlights = [];
    const flexibleTicketsValue = flexibleTicketsFromPopup !== undefined ? flexibleTicketsFromPopup : flexibleTickets;

    if (tripType === "multicity" && multiCityData) {
      enrichedFlights = multiCityData.map((flight, index) => ({
        ...allFlights[index % allFlights.length],
        departure: flight.from,
        arrival: flight.to,
        departureDate: flight.depart,
        cabinClass: flight.cabinClass || cabinClass, // Ensure cabinClass is included
        multiCityFlights: multiCityData.map((f) => ({
          ...allFlights[index % allFlights.length],
          departure: f.from,
          arrival: f.to,
          departureDate: f.depart,
          cabinClass: f.cabinClass || cabinClass, // Per leg cabinClass
        })),
        isFavorite: allFlights[index % allFlights.length].isFavorite || !!favorites[`${allFlights[index % allFlights.length].id}-${tripType}`],
      }));
      setMultiCityFlights(multiCityData);
    } else {
      enrichedFlights = allFlights.map((flight) => {
        const outboundDuration = calculateDuration(flight.departureTime, flight.arrivalTime);
        let returnFlightData = flight.returnFlight;

        if (tripType === "return" && from && to) {
          const { departureTime, arrivalTime } = generateRandomReturnTime(
            flight.arrivalTime || "12:00",
            outboundDuration.totalMinutes
          );
          returnFlightData = {
            ...flight.returnFlight,
            departure: to,
            arrival: from,
            departureDate: returnDate || flight.departureDate,
            departureTime,
            arrivalTime,
            duration: `${outboundDuration.hours}h ${outboundDuration.minutes}m`,
            stops: flight.returnFlight?.stops || flight.stops,
            stopCities: flight.returnFlight?.stopCities || flight.stopCities,
          };
        }

        return {
          ...flight,
          departure: from,
          arrival: to,
          departureDate: departDate || flight.departureDate,
          cabinClass: cabinClass, // Ensure cabinClass is set
          returnFlight: returnFlightData,
          isFavorite: flight.isFavorite || !!favorites[`${flight.id}-${tripType}`],
        };
      });
    }

    setAllFlights(enrichedFlights);
    setFilteredFlights(enrichedFlights);
    setFlexibleTickets(flexibleTicketsValue);
    navigate("/search-results", {
      state: {
        tripType,
        from,
        to,
        departDate,
        returnDate,
        cabinClass,
        multiCityFlights: tripType === "multicity" ? multiCityData : undefined,
        flexibleTickets: flexibleTicketsValue,
      },
    });
  };

  const toggleFavorite = (flightId) => {
    const updatedFlights = allFlights.map((flight) =>
      flight.id === flightId
        ? { ...flight, isFavorite: !flight.isFavorite, favoritedTripType: !flight.isFavorite ? tripType : flight.favoritedTripType }
        : flight
    );
    setAllFlights(updatedFlights);
    setFilteredFlights(updatedFlights);
  };

  const uniqueAirports = [...new Set(allFlights.map((flight) => flight.departure).concat(allFlights.map((flight) => flight.arrival)))];

  const uniqueAirlines = [...new Set(allFlights.map((flight) => flight.airline))];

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="flex bg-[#06152B] justify-center py-6 px-4">
        <div
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center px-6 py-3 rounded-lg w-full max-w-6xl bg-[#0C1D3D]/100 cursor-pointer hover:bg-[#0C1D3D]/80"
        >
          <FaSearch className="text-blue-500 mr-3" size={18} />
          <p className="text-white text-center text-sm flex-1">
            {tripType === "multicity" && multiCityFlights.length > 0 ? (
              multiCityFlights.map((flight, index) => (
                <span key={index}>
                  {flight.from || "From"} → {flight.to || "To"} • {flight.depart || "Depart"}
                  {flight.cabinClass && ` • ${flight.cabinClass}`} {/* Include cabinClass */}
                  {index < multiCityFlights.length - 1 && " | "}
                </span>
              ))
            ) : (
              <>
                {from || "From"} → {to || "To"} • {departDate || "Depart"}
                {tripType === "return" && ` - ${returnDate || "Return"}`}
                {cabinClass && ` • ${cabinClass}`} {/* Include cabinClass for one-way/return */}
              </>
            )}
          </p>
        </div>
      </div>

      <FlightSearchFormPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tripType={tripType}
        from={from}
        to={to}
        departDate={departDate}
        returnDate={returnDate}
        cabinClass={cabinClass}
        setTripType={setTripType}
        setFrom={setFrom}
        setTo={setTo}
        setDepartDate={setDepartDate}
        setReturnDate={setReturnDate}
        setCabinClass={setCabinClass}
        handleSearch={handleSearch}
        multiCityFlights={multiCityFlights}
        setMultiCityFlights={setMultiCityFlights}
      />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Flight search results ({filteredFlights.length})</h2>
          <button
            className="flex items-center md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FaFilter className="mr-2" /> Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <FlightFilters
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            stopFilter={stopFilter}
            setStopFilter={setStopFilter}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            airlinesFilter={airlinesFilter}
            setAirlinesFilter={setAirlinesFilter}
            airlines={uniqueAirlines}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
          />
          <FlightCards
            filteredFlights={filteredFlights}
            tripType={tripType}
            returnDate={returnDate}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            expandedFlightId={expandedFlightId}
            setExpandedFlightId={setExpandedFlightId}
            toggleFavorite={toggleFavorite}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FlightData;