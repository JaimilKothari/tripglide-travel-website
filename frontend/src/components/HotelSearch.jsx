import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import HotelCard from "./HotelCard";
import HotelFilter from "./HotelFilter";
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
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null); // Track last fetched destination and filters
  const [filters, setFilters] = useState({
    price: [],
    rating: [],
    amenities: [],
    bedroomType: [],
  });

  // Fetch destinations from the backend
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get("http://localhost:5003/arrival");
        setDestinations(response.data.locations || []);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setError("Failed to load destinations. Please try again.");
      }
    };

    fetchDestinations();
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

  // Memoized and debounced fetchHotels
  const fetchHotels = useCallback(
    debounce(async (dest, filters) => {
      if (!dest) return;

      const queryParams = new URLSearchParams();
      queryParams.append("arrival", dest);

      if (filters.price?.length > 0 && !filters.price.includes("all")) {
        filters.price.forEach((price) => {
          switch (price) {
            case "below2000":
              queryParams.append("totalpricepernight", "0-2000");
              break;
            case "2000to5000":
              queryParams.append("totalpricepernight", "2000-5000");
              break;
            case "5000to10000":
              queryParams.append("totalpricepernight", "5000-10000");
              break;
            case "above10000":
              queryParams.append("totalpricepernight", "10000+");
              break;
            default:
              break;
          }
        });
      }

      if (filters.rating?.length > 0 && !filters.rating.includes("all")) {
        filters.rating.forEach((rating) => {
          queryParams.append("rating", rating === "below3" ? "0-2.9" : rating);
        });
      }

      if (filters.amenities?.length > 0) {
        filters.amenities.forEach((amenity) =>
          queryParams.append("amenities", amenity)
        );
      }

      if (filters.bedroomType?.length > 0) {
        filters.bedroomType.forEach((type) =>
          queryParams.append("bedroomtype", type)
        );
      }

      const fetchKey = `${dest}|${queryParams.toString()}`;
      if (fetchKey === lastFetched) {
        return; // Skip if already fetched
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5003/all?${queryParams.toString()}`
        );
        setHotels(response.data.all || []);
        setLastFetched(fetchKey);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    [lastFetched]
  );

  // Fetch hotels when destination or filters change
  useEffect(() => {
    if (searchData.destination) {
      fetchHotels(searchData.destination, filters);
    }
  }, [searchData.destination, filters, fetchHotels]);

  const handleGuestChange = (type, increment) => {
    setSearchData((prev) => {
      if (type === "adults") {
        const newAdults = Math.max(1, Math.min(prev.adults + increment, 10));
        const newRooms = Math.min(prev.rooms, Math.ceil(newAdults / 2));
        return { ...prev, adults: newAdults, rooms: newRooms };
      }
      if (type === "children") {
        const newChildren = Math.max(0, Math.min(prev.children + increment, 10));
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
    fetchHotels(searchData.destination, filters);
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleGuestsDropdownClick = (e) => {
    e.stopPropagation();
    setShowGuestsDropdown(!showGuestsDropdown);
  };

  if (error) {
    return <div className="text-center py-8">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50 flex justify-center w-full bg-[#06152B]">
        <div className="w-full max-w-7xl px-4 py-4">
          <div className="w-full bg-white rounded-md flex flex-col md:flex-row overflow-hidden shadow-lg">
            <div className="flex-1 flex flex-col items-start justify-center px-4 py-2 border-b md:border-b-0 md:border-r border-gray-300">
              <span className="text-xs text-gray-600">
                Where do you want to stay?
              </span>
              <select
                name="destination"
                value={searchData.destination}
                onChange={(e) => handleInputChange(e)}
                className="text-blue-600 font-semibold text-base bg-transparent outline-none"
              >
                <option value="">Select Destination</option>
                {destinations.map((dest, index) => (
                  <option key={index} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
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
                {searchData.children > 0 ? `, ${searchData.children} children` : ""}
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/4">
              <HotelFilter onFilterChange={handleFilterChange} />
            </div>
            <div className="w-full md:w-3/4 flex flex-col gap-4">
              <h3 className="text-xl font-semibold mb-4">
                Available Hotels in {searchData.destination || "Any Location"}
              </h3>
              <div className="flex-1 overflow-y-auto h-[calc(100vh-180px)]">
                <div className="space-y-4 pb-10">
                  {loading ? (
                    <div className="text-center text-gray-500 py-8">
                      Loading hotels...
                    </div>
                  ) : hotels.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No hotels found for this location.
                    </div>
                  ) : (
                    hotels.map((hotel, index) => (
                      <HotelCard
                        key={hotel.hotel + hotel.arrival}
                        hotel={hotel}
                        checkInDate={searchData.checkInDate}
                        checkOutDate={searchData.checkOutDate}
                        adults={searchData.adults}
                        children={searchData.children}
                        rooms={searchData.rooms}
                      />
                    ))
                  )}
                </div>
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