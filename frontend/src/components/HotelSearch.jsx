import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import HotelCard from "./HotelCard";
import axios from "axios";

// Utility function to debounce a callback
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

function HotelSearch() {
  const locationState = useLocation();
  const { destination, checkInDate, checkOutDate, adults, children, rooms } =
    locationState.state || {};

  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/arrival")
      .then((response) => {
        const locations = Array.isArray(response.data.locations)
          ? response.data.locations
          : [];
        setDestinations(locations);
      })
      .catch((error) => {
        console.error("Error fetching destinations:", error);
        setDestinations([]);
      });
  }, []);

  const [searchData, setSearchData] = useState({
    destination: destination || "",
    checkInDate: checkInDate || "",
    checkOutDate: checkOutDate || "",
    adults: adults || 1,
    children: children || 0,
    rooms: rooms || 1,
  });

  const guestsDropdownRef = useRef(null);

  const fetchHotels = async (dest) => {
    if (!dest) return;

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5003/all", {
        params: { arrival: dest },
      });
      setHotels(response.data.all || []);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (destination) {
      fetchHotels(destination);
    }
  }, [destination]);

  const handleGuestChange = (type, increment) => {
    setSearchData((prev) => {
      if (type === "adults") {
        const newAdults = Math.max(1, Math.min(prev.adults + increment, 10));
        const newRooms = Math.min(prev.rooms, Math.ceil(newAdults / 2));
        return { ...prev, adults: newAdults, rooms: newRooms };
      }
      if (type === "children") {
        const newChildren = Math.max(
          0,
          Math.min(prev.children + increment, 10)
        );
        return { ...prev, children: newChildren };
      }
      if (type === "rooms") {
        const newRooms = Math.max(1, Math.min(prev.rooms + increment, 5));
        const newAdults = Math.max(newRooms, prev.adults);
        return { ...prev, rooms: newRooms, adults: newAdults };
      }
      return prev;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        guestsDropdownRef.current &&
        !guestsDropdownRef.current.contains(event.target)
      ) {
        setShowGuestsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debouncedSetSearchData = useCallback(
    debounce((name, value) => {
      setSearchData((prev) => ({ ...prev, [name]: value }));
    }, 500),
    []
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    debouncedSetSearchData(name, value);
  };

  const handleSearch = () => {
    if (!searchData.destination) {
      alert("Please enter a destination.");
      return;
    }
    fetchHotels(searchData.destination);
  };

  const handleGuestsDropdownClick = (e) => {
    e.stopPropagation();
    setShowGuestsDropdown(!showGuestsDropdown);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50 flex justify-center w-full bg-[#06152B]">
        <div className="w-full max-w-7xl px-4 py-4">
          <div className="w-full bg-white rounded-md flex flex-col md:flex-row overflow-hidden shadow-lg">
            <div className="flex-1 flex flex-col items-start justify-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-300">
              <span className="text-xs text-gray-600">
                Where do you want to stay?
              </span>
              <input
                list="destinations"
                type="text"
                name="destination"
                value={searchData.destination}
                onChange={handleInputChange}
                placeholder="Enter Destination"
                className="text-blue-600 font-semibold text-base bg-transparent outline-none"
              />
              <datalist id="destinations">
                {destinations.map((destination, index) => (
                  <option key={index} value={destination} />
                ))}
              </datalist>
            </div>
            <div className="flex-1 flex flex-col items-start justify-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-300">
              <span className="text-xs text-gray-600">Check-in</span>
              <input
                type="date"
                name="checkInDate"
                value={searchData.checkInDate}
                onChange={handleInputChange}
                className="w-full text-blue-600 font-semibold text-base bg-transparent outline-none"
              />
            </div>
            <div className="flex-1 flex flex-col items-start justify-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-300">
              <span className="text-xs text-gray-600">Check-out</span>
              <input
                type="date"
                name="checkOutDate"
                value={searchData.checkOutDate}
                onChange={handleInputChange}
                className="w-full text-blue-600 font-semibold text-base bg-transparent outline-none"
              />
            </div>
            <div
              ref={guestsDropdownRef}
              className="flex-1 flex flex-col items-start justify-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-300 relative"
              onClick={handleGuestsDropdownClick}
            >
              <span className="text-xs text-gray-600">Guests and rooms</span>
              <span className="text-blue-600 font-semibold text-base">
                {searchData.adults} adults
                {searchData.children > 0
                  ? `${searchData.children} children`
                  : ""}
                , {searchData.rooms} room
              </span>
              <ChevronDown
                className={`absolute right-4 top-7 w-4 h-4 text-black transition-transform ${
                  showGuestsDropdown ? "rotate-180" : ""
                }`}
              />
              {showGuestsDropdown && (
                <div
                  className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-xl z-[100] p-4 mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="block text-sm font-medium">Adults</span>
                      <span className="text-xs text-gray-500">Ages 18+</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleGuestChange("adults", -1)}
                        className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50"
                        disabled={searchData.adults <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">
                        {searchData.adults}
                      </span>
                      <button
                        onClick={() => handleGuestChange("adults", 1)}
                        className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50"
                        disabled={searchData.adults >= 10}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="block text-sm font-medium">
                        Children
                      </span>
                      <span className="text-xs text-gray-500">Ages 0-17</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleGuestChange("children", -1)}
                        className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50"
                        disabled={searchData.children <= 0}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">
                        {searchData.children}
                      </span>
                      <button
                        onClick={() => handleGuestChange("children", 1)}
                        className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50"
                        disabled={searchData.children >= 10}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="block text-sm font-medium">Rooms</span>
                      <span className="text-xs text-gray-500">Max 5 rooms</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleGuestChange("rooms", -1)}
                        className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50"
                        disabled={searchData.rooms <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">
                        {searchData.rooms}
                      </span>
                      <button
                        onClick={() => handleGuestChange("rooms", 1)}
                        className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50"
                        disabled={searchData.rooms >= 5}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGuestsDropdown(false)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white flex items-center justify-center gap-2 px-6 py-4 md:rounded-none rounded-b-md md:rounded-r-md font-semibold"
            >
              Search hotels <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="w-full max-w-7xl mx-auto flex flex-col mt-8 px-4 gap-4 flex-1">
          <div className="w-full flex flex-col">
            <div className="flex-1 overflow-y-auto h-[calc(100vh-180px)]">
              <div className="space-y-4 pb-10">
                {loading ? (
                  <div className="text-center text-gray-500 py-8">
                    Loading hotels...
                  </div>
                ) : (
                  <HotelCard
                    location={searchData.destination}
                    checkInDate={searchData.checkInDate}
                    checkOutDate={searchData.checkOutDate}
                    adults={searchData.adults}
                    children={searchData.children}
                    rooms={searchData.rooms}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 bg-gray-100">
        <Footer />
      </div>
    </div>
  );
}

export default HotelSearch;