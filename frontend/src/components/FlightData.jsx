import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlightFilters from "./FlightFilters";
import FlightCards from "./FlightCards";
import FlightSearchFormPopup from "./FlightSearchFormPopup";
import Footer from "./Footer";
import { FaSearch, FaFilter } from "react-icons/fa";

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
  const [flexibleTickets, setFlexibleTickets] = useState(initialSearchParams.flexibleTickets || false); // New state
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
    let enrichedFlights = allFlights.map((flight) => ({
      ...flight,
      departure: from ? from : flight.departure,
      arrival: to ? to : flight.arrival,
      departureDate: departDate || flight.departureDate,
      returnFlight: tripType === "return" && from && to
        ? flight.returnFlight || {
            ...flight,
            departure: to,
            arrival: from,
            departureDate: returnDate || flight.departureDate,
            departureTime: "14:00",
            arrivalTime: "16:15",
            duration: flight.duration,
            stops: flight.stops,
            stopCities: flight.stopCities,
          }
        : undefined,
      isFavorite: !!favorites[`${flight.id}-${tripType}`],
    }));

    if (tripType === "multicity" && multiCityFlights.length > 0) {
      enrichedFlights = multiCityFlights.map((flight, index) => ({
        ...allFlights[index % allFlights.length],
        departure: flight.from,
        arrival: flight.to,
        departureDate: flight.depart,
        multiCityFlights: multiCityFlights.map(f => ({
          ...allFlights[index % allFlights.length],
          departure: f.from,
          arrival: f.to,
          departureDate: f.depart,
        })),
        isFavorite: !!favorites[`${allFlights[index % allFlights.length].id}-${tripType}`],
      }));
    }

    setFilteredFlights(enrichedFlights);
  }, [allFlights, tripType, from, to, departDate, returnDate, favorites, multiCityFlights]);

  useEffect(() => {
    if (location.state) {
      setTripType(location.state.tripType || "oneway");
      setFrom(location.state.from || "");
      setTo(location.state.to || "");
      setDepartDate(location.state.departDate || "");
      setReturnDate(location.state.returnDate || "");
      setCabinClass(location.state.cabinClass || "Economy");
      setMultiCityFlights(location.state.multiCityFlights || []);
      setFlexibleTickets(location.state.flexibleTickets || false); // Set from navigation state
    }
  }, [location.state, setTripType, setReturnDate]);

  // Apply filters and sorting
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

    // Sorting logic
    if (flexibleTickets) {
      // Sort by cheapest first, then by best (price + duration)
      results.sort((a, b) => {
        if (a.price !== b.price) return a.price - b.price; // Cheapest first
        const scoreA = a.price / 1000 + parseInt(a.duration.split("h")[0]);
        const scoreB = b.price / 1000 + parseInt(b.duration.split("h")[0]);
        return scoreA - scoreB; // Then best
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

    results = results.map((flight) => ({
      ...flight,
      departure: from ? from : flight.departure,
      arrival: to ? to : flight.arrival,
      departureDate: departDate || flight.departureDate,
      returnFlight: tripType === "return" && from && to
        ? {
            ...flight.returnFlight,
            departure: to,
            arrival: from,
            departureDate: returnDate || flight.departureDate,
          }
        : flight.returnFlight,
    }));

    setFilteredFlights(results);
  }, [
    allFlights,
    selectedFilter,
    priceRange,
    stopFilter,
    timeFilter,
    airlinesFilter,
    cabinClass,
    from,
    to,
    departDate,
    returnDate,
    tripType,
    flexibleTickets, // Add dependency
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
        multiCityFlights: multiCityData.map(f => ({
          ...allFlights[index % allFlights.length],
          departure: f.from,
          arrival: f.to,
          departureDate: f.depart,
        })),
        isFavorite: !!favorites[`${allFlights[index % allFlights.length].id}-${tripType}`],
      }));
      setMultiCityFlights(multiCityData);
    } else {
      enrichedFlights = allFlights.map((flight) => ({
        ...flight,
        departure: from,
        arrival: to,
        departureDate: departDate || flight.departureDate,
        returnFlight: tripType === "return" && from && to
          ? flight.returnFlight || {
              ...flight,
              departure: to,
              arrival: from,
              departureDate: returnDate || flight.departureDate,
              departureTime: "14:00",
              arrivalTime: "16:15",
              duration: flight.duration,
              stops: flight.stops,
              stopCities: flight.stopCities,
            }
          : undefined,
        isFavorite: !!favorites[`${flight.id}-${tripType}`],
      }));
    }
    setAllFlights(enrichedFlights);
    setFilteredFlights(enrichedFlights);
    setFlexibleTickets(flexibleTicketsValue); // Update state
    navigate("/search-results", { 
      state: { 
        tripType, 
        from, 
        to, 
        departDate, 
        returnDate, 
        cabinClass,
        multiCityFlights: tripType === "multicity" ? multiCityData : undefined,
        flexibleTickets: flexibleTicketsValue, // Pass flexibleTickets
      } 
    });
  };

  const toggleFavorite = (flightId) => {
    const key = `${flightId}-${tripType}`;
    setFavorites((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    const updatedFlights = allFlights.map(flight => 
      flight.id === flightId ? { ...flight, isFavorite: !favorites[key] } : flight
    );
    setAllFlights(updatedFlights);
    setFilteredFlights(updatedFlights);
  };

  const uniqueAirports = [...new Set(allFlights.map(flight => flight.departure).concat(allFlights.map(flight => flight.arrival)))];

  const uniqueAirlines = [...new Set(allFlights.map(flight => flight.airline))];

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="flex bg-[#06152B] justify-center py-6 px-4">
        <div
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center px-6 py-3 rounded-lg w-full max-w-6xl bg-[#0C1D3D]/100 cursor-pointer hover:bg-[#0C1D3D]/80"
        >
          <FaSearch className="text-blue-500 mr-3" size={18} />
          <p className="text-white text-center text-sm flex-1">
            {from || "From"} → {to || "To"} • {departDate || "Depart"}
            {tripType === "return" && ` - ${returnDate || "Return"}`}
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