import React, { useState } from "react";
import Header from "./Header";  
import Footer from "./Footer";  

const flights = [
  { city: "New Delhi", price: 80433, },
  { city: "Bengaluru", price: 82161 },
  { city: "Mumbai", price: 100829 },
  { city: "Chennai", price: 109997 },
  { city: "Hyderabad", price: 111865 },
  { city: "Kochi", price: 112670 },
  { city: "Thiruvananthapuram", price: 115680 },
  { city: "Ahmedabad", price: 118031 },
  { city: "Vadodara", price: 126850 },
];

// Sorting for cheapest flights
const cheapestFlights = [...flights].sort((a, b) => a.price - b.price).slice(0, 3);

// Placeholder logic for direct flights
const directFlights = flights.slice(0, 5);

// Default to all locations
const allFlights = flights;

const FlightCardList = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  let displayedFlights = allFlights;
  if (selectedFilter === "cheapest") displayedFlights = cheapestFlights;
  else if (selectedFilter === "direct") displayedFlights = directFlights;

  return (
    <div className="bg-blue-50"> 
      <Header />  {/* Header added */}

      <div className="p-8 container mx-auto max-w-7xl">
        {/* Heading */}
        <h2 className="text-2xl font-bold mb-4">Select departure location</h2>

        {/* Filter buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 cursor-pointer rounded-lg border ${selectedFilter === "cheapest" ? "bg-blue-900 text-white" : "text-black border-gray-300 hover:border-black"}`}
            onClick={() => setSelectedFilter("cheapest")}
          >
            Cheapest flights
          </button>
          <button
            className={`px-4 py-2 cursor-pointer rounded-lg border ${selectedFilter === "direct" ? "bg-blue-900 text-white" : "text-black border-gray-300 hover:border-black"}`}
            onClick={() => setSelectedFilter("direct")}
          >
            Direct flights
          </button>
          <button
            className={`px-4 py-2 cursor-pointer rounded-lg border ${selectedFilter === "all" ? "bg-blue-900 text-white" : "text-black border-gray-300 hover:border-black"}`}
            onClick={() => setSelectedFilter("all")}
          >
            All available locations
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedFlights.map((flight, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-md border hover:shadow-lg cursor-pointer"
            >
              <h3 className="text-lg font-semibold">{flight.city}</h3>
              <p className="text-gray-500">Flights from</p>
              <p className="text-xl font-bold">₹{flight.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer /> {/* Footer added */}
    </div>
  );
};

export default FlightCardList;
