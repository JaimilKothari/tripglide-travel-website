import React, { useState } from "react";

const TravelersCabinClass = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [cabinClass, setCabinClass] = useState("Economy");

  // Toggle Dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle Passenger Count
  const handleAdults = (change) => {
    setAdults((prev) => Math.max(1, prev + change));
  };
  const handleChildren = (change) => {
    setChildren((prev) => Math.max(0, prev + change));
  };

  // Handle Cabin Class Change
  const handleCabinChange = (e) => {
    setCabinClass(e.target.value);
  };

  return (
    <div className="relative inline-block">
      {/* Dropdown Button */}
    <button type="button"
        onClick={toggleDropdown}
        className={`px-4 py-0.5 cursor-pointer border rounded-lg flex flex-col w-56 text-left mt-7 transition-all
          ${className === "multi-city-travelers" ? "bg-white shadow-lg" : "bg-white"}
        `}
    >
        <span className="font-semibold">Travellers and cabin class</span>
        <span className="text-gray-600 text-sm">
        {adults + children} Traveller{adults + children > 1 ? "s" : ""}, {cabinClass}
        </span>
    </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute mt-2 w-80 bg-white shadow-lg rounded-lg p-4 z-50">
          <h3 className="font-bold text-lg">Cabin class</h3>
          <p className="text-sm text-gray-600 mb-2">
            We can only show Economy prices for this search.
          </p>

          {/* Cabin Class Selector */}
          <select
            className="w-full p-2 border rounded cursor-pointer mb-4"
            value={cabinClass}
            onChange={handleCabinChange}
          >
            <option value="Economy">Economy Class</option>
            <option value="Business">Business Class</option>
            <option value="First">First Class</option>
          </select>

          {/* Travellers Count */}
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Adults (18+)</span>
            <div className="flex items-center space-x-2">
              <button type="button"
                className="px-2 py-1 border rounded bg-gray-200"
                onClick={() => handleAdults(-1)}
              >
                −
              </button>
              <span>{adults}</span>
              <button
                className="px-2 py-1 border rounded bg-gray-200"
                onClick={() => handleAdults(1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Children (0-17)</span>
            <div className="flex items-center space-x-2">
              <button type="button"
                className="px-2 py-1 border rounded bg-gray-200"
                onClick={() => handleChildren(-1)}
              >
                −
              </button>
              <span>{children}</span>
              <button
                className="px-2 py-1 border rounded bg-gray-200"
                onClick={() => handleChildren(1)}
              >
                +
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Age limits and policies for traveling with children may vary, so
            check with the airline before booking.
          </p>

          {/* Apply Button */}
          <button type="button"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            onClick={toggleDropdown}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default TravelersCabinClass;
