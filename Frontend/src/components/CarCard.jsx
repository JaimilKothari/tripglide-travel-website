import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserFriends, FaSnowflake, FaCogs, FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa";

const CarCard = ({ cars, locationState }) => {
  const navigate = useNavigate();
  const [expandedCarId, setExpandedCarId] = useState(null);
  const [activeMake, setActiveMake] = useState("Volkswagen");

  const toggleDeals = (carId) => {
    setExpandedCarId(expandedCarId === carId ? null : carId);
  };

  const getImageUrl = (type) => {
    switch (type) {
      case "SUV":
        return "https://i.pinimg.com/474x/0f/c8/36/0fc836701d156f6e42595709d7773b44.jpg";
      case "Sedan":
        return "https://i.pinimg.com/474x/fd/52/67/fd5267988393235258b7b32763b67d05.jpg";
      case "Luxury":
        return "https://i.pinimg.com/474x/c5/72/49/c572495a735f8c9a42c9419524c90b23.jpg";
      case "Hatchback":
        return "https://i.pinimg.com/474x/7a/3e/ba/7a3eba674c45f37f174582532d2671ed.jpg";
      default:
        return "https://i.pinimg.com/474x/0f/c8/36/0fc836701d156f6e42595709d7773b44.jpg";
    }
  };

  // Ensure all 8 unique models for the active make are displayed
  const uniqueCars = [];
  const seenModels = new Set();
  const makeCars = cars.filter(car => car.make === activeMake); // Filter by active make from fetched cars
  makeCars.forEach((car) => {
    if (!seenModels.has(car.model) && uniqueCars.length < 8) {
      seenModels.add(car.model);
      uniqueCars.push(car);
    }
  });
  // Pad with duplicates if less than 8 unique models (for debugging)
  if (uniqueCars.length < 8 && makeCars.length > 0) {
    console.warn("Only", uniqueCars.length, "unique models found for", activeMake, ". Expected 8. Available data:", makeCars.map(car => `${car.make} ${car.model}`));
    while (uniqueCars.length < 8 && makeCars.length > uniqueCars.length) {
      uniqueCars.push(makeCars[uniqueCars.length % makeCars.length]); // Cycle through available cars
    }
  }
  console.log("Displayed Models for", activeMake, ": ", uniqueCars.map(car => `${car.make} ${car.model}`)); // Debug

  // Filter agencies for the specific make and model, limited to 5 unique agencies
  const carAgencies = {};
  cars.forEach((car) => {
    const key = `${car.make}-${car.model}`;
    if (!carAgencies[key]) carAgencies[key] = [];
    if (!carAgencies[key].some((d) => d.agency === car.agency)) {
      carAgencies[key].push({
        agency: car.agency,
        price: car.price,
        fuelPolicy: car.fuel_policy || `Fuel Policy for ${car.model} not specified`, // Match CabListing filters
        id: car.id,
      });
    }
  });

  // Note: toggleFavorite removed as setCars is undefined. To implement, pass a callback from parent:
  /*
  const toggleFavorite = (carId) => {
    // Assuming parent passes setCars or an update function
    setCars((prev) =>
      prev.map((car) =>
        car.id === carId ? { ...car, isFavorite: !car.isFavorite } : car
      )
    );
  };
  */

  const handleBookNow = (car, deal) => {
    navigate("/car-confirmation", {
      state: {
        ...locationState,
        car,
        selectedDeal: deal,
      },
    });
  };

  const makes = ["Volkswagen", "Toyota", "Ford", "Hyundai", "Honda"];

  return (
    <>
      {/* Tabs Section */}
      <div className="mb-4 flex space-x-2">
        {makes.map((make) => (
          <button
            key={make}
            onClick={() => setActiveMake(make)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeMake === make ? "bg-gray-200" : "bg-white hover:bg-gray-100"
            }`}
          >
            {make}
          </button>
        ))}
      </div>

      {uniqueCars.length > 0 ? (
        uniqueCars.map((car) => (
          <div
            key={car.id}
            className="bg-white p-4 sm:p-6 rounded-2xl mb-4 sm:mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                   {car.model}
                </h3>
                <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{car.type}</span>
              </div>
              {/* Favorite button removed due to undefined setCars */}
              {/* <button onClick={() => toggleFavorite(car.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                <FaHeart size={20} />
              </button> */}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="sm:w-1/3">
                <img src={getImageUrl(car.type)} alt={`${car.make} ${car.model}`} className="w-full h-32 sm:h-40 object-contain rounded-lg bg-gray-50 p-2" />
              </div>
              <div className="sm:w-2/3 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaUserFriends size={14} />
                    <span className="text-xs sm:text-sm">{car.passengers || "N/A"} Passengers</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaSnowflake size={14} />
                    <span className="text-xs sm:text-sm">{car.ac === "Yes" ? "Air Conditioning" : "No AC"}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaCogs size={14} />
                    <span className="text-xs sm:text-sm">{car.transmission || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaStar size={14} className="text-yellow-400" />
                    <span className="text-xs sm:text-sm">{car.ratings || "N/A"}/5</span>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center justify-end">
                  <button
                    onClick={() => toggleDeals(car.id)}
                    className="flex items-center text-blue-600 font-semibold hover:text-blue-800 cursor-pointer transition-colors text-sm sm:text-base"
                  >
                    View Deals {expandedCarId === car.id ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                  </button>
                </div>
              </div>
            </div>

            {expandedCarId === car.id && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-lg font-semibold mb-2">Available Agencies</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {carAgencies[`${car.make}-${car.model}`]?.slice(0, 5).map((deal) => (
                    <div key={deal.id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{deal.agency}</p>
                        <p className="text-sm text-gray-600">₹{deal.price}/hour</p>
                        <p className="text-sm text-gray-600">Fuel Policy: {deal.fuelPolicy}</p>
                      </div>
                      <button
                        onClick={() => handleBookNow(car, deal)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="bg-white rounded-xl p-6 sm:p-8 text-center shadow-md">
          <p className="text-base sm:text-lg text-gray-800">No cars available for this location.</p>
        </div>
      )}
    </>
  );
};

export default CarCard;