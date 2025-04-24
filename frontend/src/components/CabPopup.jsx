import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CabPopup({
  isOpen,
  onClose,
  pickupLocation,
  setPickupLocation,
  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  dropoffDate,
  setDropoffDate,
  dropoffTime,
  setDropoffTime,
  isDifferentLocation,
  setIsDifferentLocation,
  dropoffLocation,
  setDropoffLocation,
  isDriverAgeValid,
  setIsDriverAgeValid,
  handleSearch,
  locations: availableLocations, // Renamed to match your prop
}) {
  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toTimeString().slice(0, 5);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Added state for dropdown

  const handlePickupDateChange = (e) => {
    const newPickupDate = e.target.value;
    setPickupDate(newPickupDate);
    
    if (dropoffDate && dropoffDate < newPickupDate) {
      setDropoffDate(newPickupDate);
    }
  };
  
  const handleDropoffDateChange = (e) => {
    setDropoffDate(e.target.value);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5005/locations")
      .then((response) => {
        setAvailableLocations(response.data.locations || []);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  const isFormComplete = 
    pickupLocation && 
    pickupDate && 
    pickupTime && 
    dropoffDate && 
    dropoffTime && 
    (!isDifferentLocation || (isDifferentLocation && dropoffLocation));

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch({
      pickupLocation,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      dropoffLocation,
      isDifferentLocation,
      isDriverAgeValid
    });
    onClose();
  };

  const handleSelectLocation = (location) => {
    setPickupLocation(location);
    setIsDropdownOpen(false); // Close dropdown on selection
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#001533] rounded-2xl shadow-lg w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Modify Car Search</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Pickup Location */}
          
<div className="md:col-span-1 relative">
  <label className="block text-white font-semibold mb-1">
    Pick-up location
  </label>
  <div className="relative">
    <input
      type="text"
      placeholder="City, airport or station"
      className="w-full p-3 rounded-lg bg-white text-black"
      value={pickupLocation}
      onChange={(e) => setPickupLocation(e.target.value)}
      onFocus={() => setIsDropdownOpen(true)}
      onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
      required
    />
    {isDropdownOpen && availableLocations.length > 0 && (
      <ul className="absolute z-10 w-full bg-white text-black rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
        {availableLocations.map((location, index) => (
          <li
            key={index}
            className="p-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              setPickupLocation(location);
              setIsDropdownOpen(false);
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {location}
          </li>
        ))}
      </ul>
    )}
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg
        className="w-4 h-4 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </div>
  </div>
</div>

            {/* Different drop-off location checkbox */}
            <div className="md:col-span-1 flex items-end">
              <label className="flex items-center text-white pb-2">
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  checked={isDifferentLocation}
                  onChange={(e) => setIsDifferentLocation(e.target.checked)}
                />
                Return car to a different location
              </label>
            </div>

            {/* Conditional Drop-off Location */}
            {isDifferentLocation && (
              <div className="md:col-span-2">
                <label className="block text-white font-semibold mb-1">
                  Drop-off location
                </label>
                <input
                  type="text"
                  placeholder="City, airport or station"
                  className="w-full p-3 rounded-lg bg-white text-black"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  required={isDifferentLocation}
                />
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Pickup Date */}
            <div>
              <label className="block text-white font-semibold mb-1">
                Pick-up date
              </label>
              <input 
                type="date"
                className="w-full p-3 rounded-lg bg-white text-black"
                min={today}
                value={pickupDate}
                onChange={handlePickupDateChange}
                required
              />
            </div>

            {/* Pickup Time */}
            <div>
              <label className="block text-white font-semibold mb-1">
                Time
              </label>
              <input
                type="time"
                className="w-full p-3 rounded-lg bg-white text-black"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                min={pickupDate === today ? currentTime : "00:00"}
                disabled={!pickupDate}
                required
              />
            </div>

            {/* Drop-off Date */}
            <div>
              <label className="block text-white font-semibold mb-1">
                Drop-off date
              </label>
              <input 
                type="date"
                className="w-full p-3 rounded-lg bg-white text-black"
                min={pickupDate || today}
                value={dropoffDate}
                onChange={handleDropoffDateChange}
                disabled={!pickupDate}
                required
              />
            </div>

            {/* Drop-off Time */}
            <div>
              <label className="block text-white font-semibold mb-1">
                Time
              </label>
              <input 
                type="time"
                className="w-full p-3 rounded-lg bg-white text-black"
                value={dropoffTime}
                onChange={(e) => setDropoffTime(e.target.value)}
                min={dropoffDate === pickupDate ? pickupTime : "00:00"}
                disabled={!dropoffDate}
                required
              />
            </div>
          </div>

          {/* Driver Age Checkbox */}
          <div className="flex items-center text-white mt-2">
            <input 
              type="checkbox" 
              id="driver-age" 
              className="mr-2" 
              checked={isDriverAgeValid}
              onChange={(e) => setIsDriverAgeValid(e.target.checked)}
            />
            <label htmlFor="driver-age">Driver aged between 25 – 70</label>
          </div>

          {/* Search Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={!isFormComplete}
              className={`px-6 py-3 font-semibold rounded-lg transition ${
                isFormComplete
                  ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}