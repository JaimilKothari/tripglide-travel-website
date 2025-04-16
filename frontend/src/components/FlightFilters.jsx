import React from "react";
import { FaFilter } from "react-icons/fa";

const FlightFilters = ({
  priceRange,
  setPriceRange,
  stopFilter,
  setStopFilter,
  timeFilter,
  setTimeFilter,
  airlinesFilter,
  setAirlinesFilter,
  airlines,
  isFilterOpen,
  setIsFilterOpen,
}) => {
  const toggleAirlineFilter = (airline) => {
    setAirlinesFilter((prev) =>
      prev.includes(airline) ? prev.filter((a) => a !== airline) : [...prev, airline]
    );
  };

  return (
    <div
      className={`${
        isFilterOpen ? "block" : "hidden"
      } md:block bg-white rounded-xl shadow-md p-6 md:w-1/4 md:sticky md:top-20 h-fit`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Filters</h3>
        <button
          className="md:hidden text-blue-600"
          onClick={() => setIsFilterOpen(false)}
        >
          Close
        </button>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Price Range</h4>
        <div className="flex justify-between text-sm mb-1">
          <span>₹{priceRange[0].toLocaleString()}</span>
          <span>₹{priceRange[1].toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="3000"
          max="6000"
          step="100"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
          className="w-full mb-2 cursor-pointer"
        />
        <input
          type="range"
          min="3000"
          max="6000"
          step="100"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full cursor-pointer"
        />
      </div>

      {/* Stops Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Stops</h4>
        <div className="space-y-2">
          {["all", "direct"].map((filter) => (
            <label key={filter} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="stops"
                checked={stopFilter === filter}
                onChange={() => setStopFilter(filter)}
                className="mr-2"
              />
              {filter === "all" ? "All" : "Direct flights only"}
            </label>
          ))}
        </div>
      </div>

      {/* Departure Time Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">Departure Time</h4>
        <div className="space-y-2">
          {["all", "morning", "afternoon", "evening"].map((filter) => (
            <label key={filter} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="time"
                checked={timeFilter === filter}
                onChange={() => setTimeFilter(filter)}
                className="mr-2"
              />
              {filter === "all"
                ? "All"
                : filter === "morning"
                ? "Morning (5:00 - 11:59)"
                : filter === "afternoon"
                ? "Afternoon (12:00 - 17:59)"
                : "Evening (18:00 - 4:59)"}
            </label>
          ))}
        </div>
      </div>

      {/* Airlines Filter */}
      <div>
        <h4 className="font-semibold mb-2">Airlines</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {airlines.map((airline) => (
            <label key={airline} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={airlinesFilter.includes(airline)}
                onChange={() => toggleAirlineFilter(airline)}
                className="mr-2"
              />
              {airline}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightFilters;