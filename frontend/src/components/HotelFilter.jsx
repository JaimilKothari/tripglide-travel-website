import React, { useState, useEffect, useCallback } from "react";

const HotelFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    price: [],
    rating: [],
    amenities: [],
    bedroomType: [],
  });

  const priceOptions = [
    { label: "Below ₹2000", value: "below2000" },
    { label: "₹2000 - ₹5000", value: "2000to5000" },
    { label: "₹5000 - ₹10000", value: "5000to10000" },
    { label: "Above ₹10000", value: "above10000" },
    { label: "All", value: "all" },
  ];

  const ratingOptions = [
    { label: "5 Star", value: "5" },
    { label: "4 Star", value: "4" },
    { label: "3 Star", value: "3" },
    { label: "Below 3 Star", value: "below3" },
    { label: "All", value: "all" },
  ];

  const amenityOptions = [
    "Spa",
    "Swimming Pool",
    "Rooftop Lounge",
    "Helipad",
    "Valet Parking",
    "Limousine Service",
    "Sauna",
    "Gym",
    "Private Butler",
  ];

  const handleFilterChangeInternal = useCallback((e) => {
    const { name, value, checked } = e.target;
    setFilters((prev) => {
      let updatedFilter = checked
        ? [...prev[name], value]
        : prev[name].filter((item) => item !== value);

      if (name === "price" || name === "rating" || name === "bedroomType") {
        if (value === "all" && checked) {
          updatedFilter = ["all"];
        } else if (checked && prev[name].includes("all")) {
          updatedFilter = updatedFilter.filter((item) => item !== "all");
        }
      }

      return {
        ...prev,
        [name]: updatedFilter,
      };
    });
  }, []);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 md:block w-70 sm:p-6 md:sticky h-auto md:h-[70vh] overflow-y-auto scrollbar-thin">
      <h3 className="text-lg font-semibold mb-3">Filters</h3>

      {/* Price Filter */}
      <div className="mb-3">
        <label className="block mb-2 text-sm font-medium">Price Range</label>
        {priceOptions.map((option) => (
          <div key={option.value} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`price-${option.value}`}
              name="price"
              value={option.value}
              checked={filters.price.includes(option.value)}
              onChange={handleFilterChangeInternal}
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor={`price-${option.value}`} className="text-sm">
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {/* Rating Filter */}
      <div className="mb-3">
        <label className="block mb-2 text-sm font-medium">Rating</label>
        {ratingOptions.map((option) => (
          <div key={option.value} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`rating-${option.value}`}
              name="rating"
              value={option.value}
              checked={filters.rating.includes(option.value)}
              onChange={handleFilterChangeInternal}
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor={`rating-${option.value}`} className="text-sm">
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {/* Amenities Filter */}
      <div className="mb-3">
        <label className="block mb-2 text-sm font-medium">Amenities</label>
        {amenityOptions.map((amenity) => (
          <div key={amenity} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`amenity-${amenity.toLowerCase().replace(/\s+/g, "-")}`}
              name="amenities"
              value={amenity}
              checked={filters.amenities.includes(amenity)}
              onChange={handleFilterChangeInternal}
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label
              htmlFor={`amenity-${amenity.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm"
            >
              {amenity}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelFilter;
