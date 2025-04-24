import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaHeart,
  FaUserFriends,
  FaSuitcase,
  FaSnowflake,
  FaCogs,
  FaStar,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
} from "react-icons/fa";
import Footer from "./Footer";
import CabPopup from "./CabPopup";
import CarCard from "./CarCard";
import axios from "axios";

const CabListing = () => {
  const locationState = useLocation();
  const { pickupLocation, pickupDate, dropoffDate, pickupTime, dropoffTime } =
    locationState.state || {};
//  const navigate = useNavigate(); // Kept for potential future use, but not used here

  // Popup and search state
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [isDriverAgeValid, setIsDriverAgeValid] = useState(true);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [formPickupLocation, setFormPickupLocation] = useState(
    pickupLocation || ""
  );
  const [formPickupDate, setFormPickupDate] = useState(pickupDate || "");
  const [formPickupTime, setFormPickupTime] = useState(pickupTime || "");
  const [formDropoffDate, setFormDropoffDate] = useState(dropoffDate || "");
  const [formDropoffTime, setFormDropoffTime] = useState(dropoffTime || "");
  const [isDifferentLocation, setIsDifferentLocation] = useState(false);
  const [locations, setLocations] = useState([]);

  // Car and filter state
  const [cars, setCars] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    passengers: 1,
    carType: [],
    fuelPolicy: [],
    transmission: "all",
  });

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5005/locations");
        setLocations(response.data.locations || []);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  // Function to clear all filters
  const clearFilters = () => {
    setFilters({
      passengers: 1,
      carType: [],
      fuelPolicy: [],
      transmission: "all",
    });
    setCars([]); // Reset cars
  };

  // Filter logic
  useEffect(() => {
    let results = [...cars];

    if (filters.passengers > 1) {
      // Only filter if a threshold is set (1 is default/no filter)
      results = results.filter((car) => car.passengers >= filters.passengers);
    }

    if (filters.carType.length > 0) {
      results = results.filter((car) => filters.carType.includes(car.type));
    }

    if (filters.fuelPolicy.length > 0) {
      results = results.filter((car) =>
        filters.fuelPolicy.includes(car.fuel_policy)
      );
    }

    if (filters.transmission !== "all") {
      results = results.filter(
        (car) => car.transmission === filters.transmission
      );
    }

    setCars(results);
  }, [filters]);

  // Fetch cars based on search and filters
  const fetchCars = async (searchParams = {}) => {
    try {
      const params = {
        location: searchParams.pickupLocation || formPickupLocation,
        no_of_passenger: filters.passengers > 1 ? filters.passengers : null,
        cartype: filters.carType.length === 1 ? filters.carType[0] : null,
        transmission:
          filters.transmission !== "all" ? filters.transmission : null,
        fuel_policy:
          filters.fuelPolicy.length === 1 ? filters.fuelPolicy[0] : null,
      };
      const response = await axios.get("http://localhost:5005", {
        params,
      });
      setCars(response.data || []);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    if (formPickupLocation) fetchCars();
  }, [formPickupLocation, filters]);

  // Handle search from popup
  const handleSearchSubmit = (searchParams) => {
    // Update search bar values from popup
    setFormPickupLocation(searchParams.pickupLocation);
    setFormPickupDate(searchParams.pickupDate);
    setFormPickupTime(searchParams.pickupTime);
    setFormDropoffDate(searchParams.dropoffDate);
    setFormDropoffTime(searchParams.dropoffTime);
    setDropoffLocation(searchParams.dropoffLocation);
    setIsDifferentLocation(searchParams.isDifferentLocation);
    setIsDriverAgeValid(searchParams.isDriverAgeValid);

    // Fetch cars for the new search criteria
    fetchCars(searchParams);

    // Close the popup
    setIsSearchPopupOpen(false);
  };

  const handleCheckboxChange = (e, category) => {
    const value = e.target.value;
    const checked = e.target.checked;
    setFilters((prev) => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter((item) => item !== value),
    }));
  };

  const activeFilterCount = [
    filters.carType.length,
    filters.fuelPolicy.length,
    filters.transmission !== "all" ? 1 : 0,
    filters.passengers > 1 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#001533] py-4 px-4 z-10 shadow-lg">
        <div className="flex justify-center">
          <div
            className="flex items-center px-4 py-2 rounded-full w-full max-w-6xl bg-white/10 backdrop-blur-md cursor-pointer border border-white/20 sm:px-6 sm:py-3"
            onClick={() => setIsSearchPopupOpen(true)}
          >
            <FaSearch className="text-white mr-2 sm:mr-3" size={16} />
            <p className="text-white text-xs sm:text-sm text-center flex-1 truncate">
              {formPickupLocation || "Enter Pickup Location"} •{" "}
              {formPickupDate || "DD/MM/YYYY"}, {formPickupTime || "HH:MM"} -{" "}
              {formDropoffDate || "DD/MM/YYYY"}, {formDropoffTime || "HH:MM"}
            </p>
          </div>
        </div>
      </div>

      <CabPopup
        isOpen={isSearchPopupOpen}
        onClose={() => setIsSearchPopupOpen(false)}
        pickupLocation={formPickupLocation}
        setPickupLocation={setFormPickupLocation}
        pickupDate={formPickupDate}
        setPickupDate={setFormPickupDate}
        pickupTime={formPickupTime}
        setPickupTime={setFormPickupTime}
        dropoffDate={formDropoffDate}
        setDropoffDate={setFormDropoffDate}
        dropoffTime={formDropoffTime}
        setDropoffTime={setFormDropoffTime}
        isDifferentLocation={isDifferentLocation}
        setIsDifferentLocation={setIsDifferentLocation}
        dropoffLocation={dropoffLocation}
        setDropoffLocation={setDropoffLocation}
        isDriverAgeValid={isDriverAgeValid}
        setIsDriverAgeValid={setIsDriverAgeValid}
        handleSearch={handleSearchSubmit}
        locations={locations}
      />

      <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Available Cabs ({cars.length})
          </h2>
          <button
            className="flex items-center md:hidden bg-blue-600 text-white px-3 py-2 rounded-lg relative text-sm sm:text-base"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FaFilter className="mr-1 sm:mr-2" /> Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          <div
            className={`${
              isFilterOpen ? "block" : "hidden"
            } md:block bg-white rounded-xl shadow-md p-4 sm:p-6 md:w-1/4 md:sticky md:top-20 h-auto md:h-[70vh] overflow-y-auto scrollbar-thin`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-800">
                Filters
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <FaTimes className="mr-1" /> Clear All
                </button>
              )}
            </div>
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">
                Number of Passengers
              </h4>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.passengers === 5} // Use 5 as threshold for "4-5"
                    onChange={() =>
                      setFilters({
                        ...filters,
                        passengers: filters.passengers === 5 ? 1 : 5,
                      })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-800 text-sm sm:text-base">
                    4-5
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.passengers === 7} // Use 7 as threshold for "6+"
                    onChange={() =>
                      setFilters({
                        ...filters,
                        passengers: filters.passengers === 7 ? 1 : 7,
                      })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-800 text-sm sm:text-base">6+</span>
                </label>
              </div>
            </div>
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">
                Car Type
              </h4>
              <div className="space-y-2">
                {["SUV", "Sedan", "Luxury", "Hatchback"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center cursor-pointer text-gray-800"
                  >
                    <input
                      type="checkbox"
                      value={type}
                      onChange={(e) => handleCheckboxChange(e, "carType")}
                      checked={filters.carType.includes(type)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm sm:text-base">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">
                Fuel Type
              </h4>
              <div className="space-y-2">
                {["Full to Full", "Same to Same", "Full to Empty"].map(
                  (fuel) => (
                    <label
                      key={fuel}
                      className="flex items-center cursor-pointer text-gray-800"
                    >
                      <input
                        type="checkbox"
                        value={fuel}
                        onChange={(e) => handleCheckboxChange(e, "fuelPolicy")}
                        checked={filters.fuelPolicy.includes(fuel)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm sm:text-base">{fuel}</span>
                    </label>
                  )
                )}
              </div>
            </div>
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">
                Transmission Type
              </h4>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer text-gray-800">
                  <input
                    type="radio"
                    name="transmission"
                    value="all"
                    checked={filters.transmission === "all"}
                    onChange={() =>
                      setFilters({ ...filters, transmission: "all" })
                    }
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm sm:text-base">All</span>
                </label>
                <label className="flex items-center cursor-pointer text-gray-800">
                  <input
                    type="radio"
                    name="transmission"
                    value="Automatic"
                    checked={filters.transmission === "Automatic"}
                    onChange={() =>
                      setFilters({ ...filters, transmission: "Automatic" })
                    }
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm sm:text-base">Automatic</span>
                </label>
                <label className="flex items-center cursor-pointer text-gray-800">
                  <input
                    type="radio"
                    name="transmission"
                    value="Manual"
                    checked={filters.transmission === "Manual"}
                    onChange={() =>
                      setFilters({ ...filters, transmission: "Manual" })
                    }
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm sm:text-base">Manual</span>
                </label>
              </div>
            </div>
          </div>

          <main className="w-full md:w-3/4">
            <CarCard
              cars={cars}
              locationState={{
                pickupLocation: formPickupLocation,
                pickupDate: formPickupDate,
                pickupTime: formPickupTime,
                dropoffDate: formDropoffDate,
                dropoffTime: formDropoffTime,
              }}
            />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CabListing;