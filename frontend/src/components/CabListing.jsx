import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaHeart, FaUserFriends, FaSuitcase, FaSnowflake, FaCogs, FaStar, FaMapMarkerAlt, FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import CabPopup from "./CabPopup";

const CabListing = () => {
  const locationState = useLocation();
  const { pickupLocation, pickupDate, dropoffDate, pickupTime, dropoffTime } = locationState.state || {};

  // State for the search popup
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [formPickupLocation, setFormPickupLocation] = useState(pickupLocation || '');
  const [formPickupDate, setFormPickupDate] = useState(pickupDate || '');
  const [formPickupTime, setFormPickupTime] = useState(pickupTime || '');
  const [formDropoffDate, setFormDropoffDate] = useState(dropoffDate || '');
  const [formDropoffTime, setFormDropoffTime] = useState(dropoffTime || '');
  const [isDifferentLocation, setIsDifferentLocation] = useState(false);
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [isDriverAgeValid, setIsDriverAgeValid] = useState(true);

  const handleSearchSubmit = () => {
    setIsSearchPopupOpen(false);
  };

  const [cars, setCars] = useState([]); 
  const [filteredCars, setFilteredCars] = useState([]); 
  const [isFilterOpen, setIsFilterOpen] = useState(false); 
  const [expandedCarId, setExpandedCarId] = useState(null); 

  useEffect(() => {
    const initialCars = [
      {
        id: 1,
        carMake: "Toyota",
        model: "Innova",
        type: "SUV",
        mileage: "15 km/l",
        yearOfMake: 2023,
        pricePerDay: 6000,
        carAgency: "City Rides",
        agencyPrice: 6000,
        fuelType: "Petrol",
        transmission: "Automatic",
        image: "https://i.pinimg.com/474x/0f/c8/36/0fc836701d156f6e42595709d7773b44.jpg",
        passengers: 7,
        luggage: 4,
        rating: 7.5,
        reviews: 170960,
        features: ["600 km included", "Same to same", "Pick-up: Shuttle bus (YYZ)"],
        isFavorite: false,
        deals: [
          {
            agency: "City Rides",
            price: 6000,
            rating: 7.5,
            reviews: 170960,
            features: ["600 km included", "Same to same", "Pick-up: Shuttle bus (YYZ)"],
            freeCancellation: true,
          },
          {
            agency: "TravelEasy",
            price: 6100,
            rating: 7.8,
            reviews: 180000,
            features: ["650 km included", "Full to full", "Pick-up: Airport (YYZ)"],
            freeCancellation: false,
          },
          {
            agency: "RideNow",
            price: 5900,
            rating: 7.2,
            reviews: 165000,
            features: ["550 km included", "Same to same", "Pick-up: City Center"],
            freeCancellation: true,
          },
        ],
      },
      {
        id: 2,
        carMake: "Honda",
        model: "Civic",
        type: "Sedan",
        mileage: "18 km/l",
        yearOfMake: 2022,
        pricePerDay: 4200,
        carAgency: "RoadTrip",
        agencyPrice: 4200,
        fuelType: "Petrol",
        transmission: "Manual",
        image: "https://i.pinimg.com/474x/fd/52/67/fd5267988393235258b7b32763b67d05.jpg",
        passengers: 5,
        luggage: 2,
        rating: 7.2,
        reviews: 145000,
        features: ["500 km included", "Full to full", "Pick-up: Airport (LAX)"],
        isFavorite: false,
        deals: [
          {
            agency: "RoadTrip",
            price: 4200,
            rating: 7.2,
            reviews: 145000,
            features: ["500 km included", "Full to full", "Pick-up: Airport (LAX)"],
            freeCancellation: true,
          },
          {
            agency: "City Rides",
            price: 4250,
            rating: 7.4,
            reviews: 150000,
            features: ["550 km included", "Same to same", "Pick-up: Terminal (LAX)"],
            freeCancellation: true,
          },
          {
            agency: "DriveOn",
            price: 4100,
            rating: 7.0,
            reviews: 140000,
            features: ["500 km included", "Full to full", "Pick-up: City Hub"],
            freeCancellation: false,
          },
        ],
      },
      {
        id: 3,
        carMake: "Mercedes Benz",
        model: "X Class",
        type: "Luxury",
        mileage: "12 km/l",
        yearOfMake: 2023,
        pricePerDay: 12000,
        carAgency: "Adventure",
        agencyPrice: 12000,
        fuelType: "Diesel",
        transmission: "Automatic",
        image: "https://i.pinimg.com/474x/c5/72/49/c572495a735f8c9a42c9419524c90b23.jpg",
        passengers: 4,
        luggage: 3,
        rating: 8.5,
        reviews: 190000,
        features: ["700 km included", "Same to same", "Pick-up: Terminal (MIA)"],
        isFavorite: false,
        deals: [
          {
            agency: "Adventure",
            price: 12000,
            rating: 8.5,
            reviews: 190000,
            features: ["700 km included", "Same to same", "Pick-up: Terminal (MIA)"],
            freeCancellation: false,
          },
          {
            agency: "RoadRunner",
            price: 12200,
            rating: 8.7,
            reviews: 195000,
            features: ["750 km included", "Full to full", "Pick-up: Airport (MIA)"],
            freeCancellation: true,
          },
          {
            agency: "TravelGear",
            price: 11800,
            rating: 8.3,
            reviews: 185000,
            features: ["700 km included", "Same to same", "Pick-up: City Center"],
            freeCancellation: true,
          },
        ],
      },
      {
        id: 4,
        carMake: "Volkswagen",
        model: "Polo",
        type: "Hatchback",
        mileage: "20 km/l",
        yearOfMake: 2022,
        pricePerDay: 3500,
        carAgency: "Explorer",
        agencyPrice: 3500,
        fuelType: "CNG",
        transmission: "Manual",
        image: "https://i.pinimg.com/474x/7a/3e/ba/7a3eba674c45f37f174582532d2671ed.jpg",
        passengers: 4,
        luggage: 2,
        rating: 7.0,
        reviews: 125000,
        features: ["450 km included", "Full to full", "Pick-up: City Center"],
        isFavorite: false,
        deals: [
          {
            agency: "Explorer",
            price: 3500,
            rating: 7.0,
            reviews: 125000,
            features: ["450 km included", "Full to full", "Pick-up: City Center"],
            freeCancellation: true,
          },
          {
            agency: "WanderWheels",
            price: 3600,
            rating: 7.2,
            reviews: 130000,
            features: ["500 km included", "Same to same", "Pick-up: Airport (JFK)"],
            freeCancellation: false,
          },
          {
            agency: "JourneyPro",
            price: 3550,
            rating: 7.1,
            reviews: 128000,
            features: ["475 km included", "Full to full", "Pick-up: Downtown"],
            freeCancellation: true,
          },
        ],
      },
      {
        id: 5,
        carMake: "Tesla",
        model: "Model 3",
        type: "Sedan",
        mileage: "5 km/kWh",
        yearOfMake: 2023,
        pricePerDay: 9000,
        carAgency: "DriveOn",
        agencyPrice: 9000,
        fuelType: "Electric",
        transmission: "Automatic",
        image: "https://i.pinimg.com/474x/c9/4f/de/c94fdeb008bdf6d791cff571154323c9.jpg",
        passengers: 5,
        luggage: 2,
        rating: 8.2,
        reviews: 160000,
        features: ["550 km included", "Same to same", "Pick-up: Airport (SFO)"],
        isFavorite: false,
        deals: [
          {
            agency: "DriveOn",
            price: 9000,
            rating: 8.2,
            reviews: 160000,
            features: ["550 km included", "Same to same", "Pick-up: Airport (SFO)"],
            freeCancellation: true,
          },
          {
            agency: "MileMarker",
            price: 9200,
            rating: 8.4,
            reviews: 165000,
            features: ["600 km included", "Full to full", "Pick-up: Terminal (SFO)"],
            freeCancellation: true,
          },
          {
            agency: "RoadTrip",
            price: 8900,
            rating: 8.0,
            reviews: 155000,
            features: ["525 km included", "Same to same", "Pick-up: City Hub"],
            freeCancellation: false,
          },
        ],
      },
      {
        id: 6,
        carMake: "Toyota",
        model: "Fortuner",
        type: "SUV",
        mileage: "14 km/l",
        yearOfMake: 2022,
        pricePerDay: 8000,
        carAgency: "WanderWheels",
        agencyPrice: 8000,
        fuelType: "Petrol",
        transmission: "Automatic",
        image: "https://i.pinimg.com/474x/e1/8e/59/e18e5968b8ca9294345a530f68f83aa0.jpg",
        passengers: 7,
        luggage: 4,
        rating: 7.4,
        reviews: 135000,
        features: ["500 km included", "Full to full", "Pick-up: City Terminal"],
        isFavorite: false,
        deals: [
          {
            agency: "WanderWheels",
            price: 8000,
            rating: 7.4,
            reviews: 135000,
            features: ["500 km included", "Full to full", "Pick-up: City Terminal"],
            freeCancellation: false,
          },
          {
            agency: "Explorer",
            price: 8100,
            rating: 7.5,
            reviews: 140000,
            features: ["525 km included", "Same to same", "Pick-up: Airport (BOS)"],
            freeCancellation: true,
          },
          {
            agency: "TravelGear",
            price: 7900,
            rating: 7.3,
            reviews: 132000,
            features: ["500 km included", "Full to full", "Pick-up: Downtown"],
            freeCancellation: true,
          },
        ],
      },
      {
        id: 7,
        carMake: "BMW",
        model: "7 Series",
        type: "Luxury",
        mileage: "13 km/l",
        yearOfMake: 2023,
        pricePerDay: 15000,
        carAgency: "JourneyPro",
        agencyPrice: 15000,
        fuelType: "Petrol",
        transmission: "Automatic",
        image: "https://i.pinimg.com/474x/5a/e8/d6/5ae8d6218c3c6a9296936347fc2c2eef.jpg",
        passengers: 4,
        luggage: 3,
        rating: 8.8,
        reviews: 180000,
        features: ["600 km included", "Same to same", "Pick-up: Airport (ORD)"],
        isFavorite: false,
        deals: [
          {
            agency: "JourneyPro",
            price: 15000,
            rating: 8.8,
            reviews: 180000,
            features: ["600 km included", "Same to same", "Pick-up: Airport (ORD)"],
            freeCancellation: true,
          },
          {
            agency: "City Rides",
            price: 15200,
            rating: 8.9,
            reviews: 185000,
            features: ["625 km included", "Full to full", "Pick-up: Terminal (ORD)"],
            freeCancellation: true,
          },
          {
            agency: "RideNow",
            price: 14800,
            rating: 8.7,
            reviews: 175000,
            features: ["575 km included", "Same to same", "Pick-up: City Center"],
            freeCancellation: false,
          },
        ],
      },
      {
        id: 8,
        carMake: "Kia",
        model: "Seltos",
        type: "SUV",
        mileage: "15 km/l",
        yearOfMake: 2022,
        pricePerDay: 5500,
        carAgency: "RoadRunner",
        agencyPrice: 5500,
        fuelType: "Hybrid",
        transmission: "Automatic",
        image: "https://i.pinimg.com/474x/68/a2/d6/68a2d60a4643e599a20a41ff0e8988d2.jpg",
        passengers: 5,
        luggage: 3,
        rating: 7.2,
        reviews: 140000,
        features: ["500 km included", "Full to full", "Pick-up: Downtown"],
        isFavorite: false,
        deals: [
          {
            agency: "RoadRunner",
            price: 5500,
            rating: 7.2,
            reviews: 140000,
            features: ["500 km included", "Full to full", "Pick-up: Downtown"],
            freeCancellation: true,
          },
          {
            agency: "DriveOn",
            price: 5600,
            rating: 7.3,
            reviews: 145000,
            features: ["525 km included", "Same to same", "Pick-up: Airport (LAX)"],
            freeCancellation: true,
          },
          {
            agency: "Adventure",
            price: 5400,
            rating: 7.1,
            reviews: 138000,
            features: ["500 km included", "Full to full", "Pick-up: City Hub"],
            freeCancellation: false,
          },
        ],
      },
      {
        id: 9,
        carMake: "Hyundai",
        model: "i10",
        type: "Hatchback",
        mileage: "22 km/l",
        yearOfMake: 2023,
        pricePerDay: 3000,
        carAgency: "TravelGear",
        agencyPrice: 3000,
        fuelType: "Petrol",
        transmission: "Manual",
        image: "https://i.pinimg.com/474x/68/a2/d6/68a2d60a4643e599a20a41ff0e8988d2.jpg",
        passengers: 4,
        luggage: 2,
        rating: 7.1,
        reviews: 155000,
        features: ["550 km included", "Same to same", "Pick-up: Airport (SEA)"],
        isFavorite: false,
        deals: [
          {
            agency: "TravelGear",
            price: 3000,
            rating: 7.1,
            reviews: 155000,
            features: ["550 km included", "Same to same", "Pick-up: Airport (SEA)"],
            freeCancellation: false,
          },
          {
            agency: "RoadTrip",
            price: 3100,
            rating: 7.2,
            reviews: 160000,
            features: ["575 km included", "Full to full", "Pick-up: Terminal (SEA)"],
            freeCancellation: true,
          },
          {
            agency: "Explorer",
            price: 2900,
            rating: 7.0,
            reviews: 150000,
            features: ["550 km included", "Same to same", "Pick-up: City Center"],
            freeCancellation: true,
          },
        ],
      },
      {
        id: 10,
        carMake: "Chevrolet",
        model: "Cruze",
        type: "Sedan",
        mileage: "17 km/l",
        yearOfMake: 2022,
        pricePerDay: 4500,
        carAgency: "MileMarker",
        agencyPrice: 4500,
        fuelType: "Diesel",
        transmission: "Automatic",
        image: "https://i.pinimg.com/474x/33/9f/41/339f41adab047e664192b5e84e13335d.jpg",
        passengers: 5,
        luggage: 3,
        rating: 7.3,
        reviews: 130000,
        features: ["500 km included", "Full to full", "Pick-up: City Hub"],
        isFavorite: false,
        deals: [
          {
            agency: "MileMarker",
            price: 4500,
            rating: 7.3,
            reviews: 130000,
            features: ["500 km included", "Full to full", "Pick-up: City Hub"],
            freeCancellation: true,
          },
          {
            agency: "JourneyPro",
            price: 4600,
            rating: 7.4,
            reviews: 135000,
            features: ["525 km included", "Same to same", "Pick-up: Airport (DFW)"],
            freeCancellation: true,
          },
          {
            agency: "WanderWheels",
            price: 4400,
            rating: 7.2,
            reviews: 128000,
            features: ["500 km included", "Full to full", "Pick-up: Downtown"],
            freeCancellation: false,
          },
        ],
      },
    ];
    setCars(initialCars);
    setFilteredCars(initialCars); 
  }, []);

  const [filters, setFilters] = useState({
    priceRange: [3000, 15000], // Default price range based on car data
    passengers: 1,
    carType: [],
    fuelType: [],
    transmission: "all",
    carAgency: [],
  });

  // Function to clear all filters
  const clearFilters = () => {
    setFilters({
      priceRange: [3000, 15000],
      passengers: 1,
      carType: [],
      fuelType: [],
      transmission: "all",
      carAgency: [],
    });
    setFilteredCars(cars); // Reset filtered cars to the full list
  };

  // Filter logic
  useEffect(() => {
    let results = [...cars];

    // Filter by price range
    const [minPrice, maxPrice] = filters.priceRange;
    results = results.filter(car => car.pricePerDay >= minPrice && car.pricePerDay <= maxPrice);

    // Filter by number of passengers
    if (filters.passengers) {
      const passengerCount = parseInt(filters.passengers);
      if (!isNaN(passengerCount)) {
        results = results.filter(car => car.passengers >= passengerCount);
      }
    }

    // Filter by car type
    if (filters.carType.length > 0) {
      results = results.filter(car => filters.carType.includes(car.type));
    }

    // Filter by fuel type
    if (filters.fuelType.length > 0) {
      results = results.filter(car => filters.fuelType.includes(car.fuelType));
    }

    // Filter by transmission
    if (filters.transmission !== "all") {
      results = results.filter(car => car.transmission === filters.transmission);
    }

    // Filter by car agency
    if (filters.carAgency.length > 0) {
      results = results.filter(car => filters.carAgency.includes(car.carAgency));
    }

    setFilteredCars(results);
  }, [filters, cars]);

  const handleCheckboxChange = (e, category) => {
    const value = e.target.value;
    const checked = e.target.checked;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: checked
        ? [...prevFilters[category], value]
        : prevFilters[category].filter((item) => item !== value),
    }));
  };

  const carAgencies = [...new Set(cars.map(car => car.carAgency))];

  const toggleFavorite = (carId) => {
    setCars(prevCars => 
      prevCars.map(car => 
        car.id === carId ? { ...car, isFavorite: !car.isFavorite } : car
      )
    );
  };

  const toggleDeals = (carId) => {
    setExpandedCarId(expandedCarId === carId ? null : carId);
  };

  // Calculate the number of active filters for display
  const activeFilterCount = [
    filters.carType.length,
    filters.fuelType.length,
    filters.carAgency.length,
    filters.transmission !== "all" ? 1 : 0,
    filters.passengers > 1 ? 1 : 0,
    (filters.priceRange[0] !== 3000 || filters.priceRange[1] !== 15000) ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  // Price range slider min and max values
  const minPrice = 3000;
  const maxPrice = 15000;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-[#001533] py-4 px-4 z-10 shadow-lg">
        <div className="flex justify-center">
          <div
            className="flex items-center px-4 py-2 rounded-full w-full max-w-6xl bg-white/10 backdrop-blur-md cursor-pointer border border-white/20 sm:px-6 sm:py-3"
            onClick={() => setIsSearchPopupOpen(true)}
          >
            <FaSearch className="text-white mr-2 sm:mr-3" size={16} />
            <p className="text-white text-xs sm:text-sm text-center flex-1 truncate">
              {formPickupLocation || "Enter Pickup Location"} • {formPickupDate || "DD/MM/YYYY"}, {formPickupTime || "HH:MM"} - {formDropoffDate || "DD/MM/YYYY"}, {formDropoffTime || "HH:MM"}
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
      />

      {/* Page Content */}
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Available Cabs Heading and Mobile Filter Toggle */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Available Cabs ({filteredCars.length})
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

        {/* Filters and Car Listings */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* Sidebar for Filters */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block bg-white rounded-xl shadow-md p-4 sm:p-6 md:w-1/4 md:sticky md:top-20 h-auto md:h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-800">Filters</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <FaTimes className="mr-1" /> Clear All
                </button>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">Price Range</h4>
              <div className="relative">
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={filters.priceRange[0]}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    if (newMin <= filters.priceRange[1]) {
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: [newMin, prev.priceRange[1]],
                      }));
                    }
                  }}
                  className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    zIndex: 2,
                    background: `linear-gradient(to right, #3b82f6 ${(filters.priceRange[0] - minPrice) / (maxPrice - minPrice) * 100}%, #e5e7eb ${(filters.priceRange[0] - minPrice) / (maxPrice - minPrice) * 100}%)`,
                  }}
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={filters.priceRange[1]}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value);
                    if (newMax >= filters.priceRange[0]) {
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: [prev.priceRange[0], newMax],
                      }));
                    }
                  }}
                  className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer"
                  style={{
                    zIndex: 1,
                    background: `linear-gradient(to right, transparent ${(filters.priceRange[1] - minPrice) / (maxPrice - minPrice) * 100}%, #e5e7eb ${(filters.priceRange[1] - minPrice) / (maxPrice - minPrice) * 100}%)`,
                  }}
                />
                <div className="relative h-2 bg-gray-200 rounded-lg">
                  <div
                    className="absolute h-2 bg-blue-600 rounded-lg"
                    style={{
                      left: `${(filters.priceRange[0] - minPrice) / (maxPrice - minPrice) * 100}%`,
                      width: `${(filters.priceRange[1] - filters.priceRange[0]) / (maxPrice - minPrice) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between mt-2 text-gray-600 text-xs sm:text-sm">
                <span>₹{filters.priceRange[0].toLocaleString()}</span>
                <span>₹{filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Number of Passengers */}
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">Number of Passengers</h4>
              <input
                type="number"
                min="1"
                value={filters.passengers}
                onChange={(e) => setFilters({ ...filters, passengers: e.target.value })}
                className="w-full p-2 border rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Car Type */}
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">Car Type</h4>
              <div className="space-y-2">
                {["SUV", "Sedan", "Luxury", "Hatchback"].map((type) => (
                  <label key={type} className="flex items-center cursor-pointer text-gray-800">
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

            {/* Fuel Type */}
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">Fuel Type</h4>
              <div className="space-y-2">
                {["Petrol", "Diesel", "CNG", "Electric", "Hybrid"].map((fuel) => (
                  <label key={fuel} className="flex items-center cursor-pointer text-gray-800">
                    <input
                      type="checkbox"
                      value={fuel}
                      onChange={(e) => handleCheckboxChange(e, "fuelType")}
                      checked={filters.fuelType.includes(fuel)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm sm:text-base">{fuel}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transmission Type */}
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">Transmission Type</h4>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer text-gray-800">
                  <input 
                    type="radio" 
                    name="transmission" 
                    value="all"
                    checked={filters.transmission === "all"} 
                    onChange={() => setFilters({ ...filters, transmission: "all" })} 
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
                    onChange={() => setFilters({ ...filters, transmission: "Automatic" })} 
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
                    onChange={() => setFilters({ ...filters, transmission: "Manual" })} 
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm sm:text-base">Manual</span>
                </label>
              </div>
            </div>

            {/* Car Agency */}
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">Car Agency</h4>
              <div className="space-y-2">
                {carAgencies.map((agency) => (
                  <label key={agency} className="flex items-center cursor-pointer text-gray-800">
                    <input
                      type="checkbox"
                      value={agency}
                      onChange={(e) => handleCheckboxChange(e, "carAgency")}
                      checked={filters.carAgency.includes(agency)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm sm:text-base">{agency}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Car Listings */}
          <main className="w-full md:w-3/4">
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <div key={car.id} className="bg-white p-4 sm:p-6 rounded-2xl mb-4 sm:mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  {/* Car Header */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">{car.carMake} {car.model}</h3>
                      <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{car.type}</span>
                    </div>
                    <button 
                      onClick={() => toggleFavorite(car.id)}
<<<<<<< HEAD
                      className="text-gray-400 hover:text-red-500 transition-colors"
=======
                      className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
>>>>>>> 2ffd4dcaef5abc45eda35a883b9e96f47e2eaadc
                    >
                      <FaHeart className={car.isFavorite ? 'text-red-500' : ''} size={20} />
                    </button>
                  </div>

                  {/* Car Image and Details */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="sm:w-1/3">
                      <img 
                        src={car.image} 
                        alt={`${car.carMake} ${car.model}`} 
                        className="w-full h-32 sm:h-40 object-contain rounded-lg bg-gray-50 p-2"
                      />
                    </div>
                    <div className="sm:w-2/3 flex flex-col justify-between">
                      <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <FaUserFriends size={14} />
                          <span className="text-xs sm:text-sm">{car.passengers} Passengers</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <FaSuitcase size={14} />
                          <span className="text-xs sm:text-sm">{car.luggage} Luggage</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <FaSnowflake size={14} />
                          <span className="text-xs sm:text-sm">Air Conditioning</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <FaCogs size={14} />
                          <span className="text-xs sm:text-sm">{car.transmission}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <FaMapMarkerAlt size={14} />
                          <span className="text-xs sm:text-sm">{car.mileage}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <FaStar size={14} className="text-yellow-400" />
                          <span className="text-xs sm:text-sm">{car.rating}/10 ({car.reviews.toLocaleString()} reviews)</span>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4 flex items-center justify-between">
                        <span className="text-lg sm:text-2xl font-bold text-gray-800">
                          ₹{car.pricePerDay.toLocaleString()}
                          <span className="text-xs sm:text-sm font-normal text-gray-500">/day</span>
                        </span>
                        <button 
                          onClick={() => toggleDeals(car.id)}
                          className="flex items-center text-blue-600 font-semibold hover:text-blue-800 cursor-pointer transition-colors text-sm sm:text-base"
                        >
                          {expandedCarId === car.id ? (
                            <>
                              Hide Deals <FaChevronUp className="ml-1 sm:ml-2 cursor-pointer" />
                            </>
                          ) : (
                            <>
                              View Deals <FaChevronDown className="ml-1 sm:ml-2 cursor-pointer" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Deal Section */}
                  {expandedCarId === car.id && (
                    <div className="border-t pt-3 sm:pt-4">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Compare Deals</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {car.deals && car.deals.length > 0 ? (
                          car.deals.map((deal, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors flex flex-col"
                            >
                              <div className="mb-2 sm:mb-3">
                                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                                  <span className="text-sm sm:text-lg font-medium text-gray-800 truncate">{deal.agency}</span>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-yellow-400 flex">
                                      {[...Array(Math.round(deal.rating / 2))].map((_, i) => (
                                        <FaStar key={i} size={12} className="sm:w-4 sm:h-4" />
                                      ))}
                                    </span>
                                    <span className="text-xs sm:text-sm text-gray-600">{deal.rating}/10</span>
                                  </div>
                                </div>
                                <div className="text-xs sm:text-sm text-gray-700 space-y-1 sm:space-y-2">
                                  <ul className="space-y-1">
                                    {deal.features.map((feature, idx) => (
                                      <li key={idx} className="flex items-start space-x-2">
                                        <FaMapMarkerAlt size={12} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                        <span className="break-words">{feature}</span>
                                      </li>
                                    ))}
                                    {deal.freeCancellation && (
                                      <li className="flex items-start space-x-2 text-green-600">
                                        <FaMapMarkerAlt size={12} className="flex-shrink-0 mt-0.5" />
                                        <span className="break-words">Free Cancellation</span>
                                      </li>
                                    )}
                                  </ul>
                                  <p className="text-gray-500 text-xs mt-1 sm:mt-2">
                                    {deal.reviews.toLocaleString()} reviews
                                  </p>
                                  <div className="text-base sm:text-xl font-bold text-gray-800">
                                    ₹{deal.price.toLocaleString()}
                                    <span className="text-xs sm:text-sm font-normal text-gray-500">/day</span>
                                  </div>
                                </div>
                              </div>
                              <button className="w-full bg-blue-600 text-white px-3 py-1.5 cursor-pointer sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base mt-auto">
                                Book Now
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600 col-span-3 text-sm sm:text-base">No deals available for this car.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl p-6 sm:p-8 text-center shadow-md">
                <p className="text-base sm:text-lg text-gray-800">No cars found matching your criteria.</p>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">Try adjusting your filters or clear them to see all available cars.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-semibold text-sm sm:text-base"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CabListing;