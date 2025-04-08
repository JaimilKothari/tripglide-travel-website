import React from "react";
import { useState, useEffect } from "react";
import Header from "./Header";
import TravelDeals from "./TravelDeals";
import Footer from "./Footer";
import FeaturesSection from "./FeaturesSection";
import { FaCar, FaCalendarAlt, FaTag } from "react-icons/fa";
import CarHireFAQ from "./CarHireFAQ";

export default function CarHire() {
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const now = new Date();
    setCurrentTime(
      `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
    );
  }, [pickupDate]);

  const handlePickupDateChange = (event) => {
    setPickupDate(event.target.value);
    setPickupTime(""); // Reset pickup time when date changes
    if (dropoffDate && event.target.value > dropoffDate) {
      setDropoffDate("");
      setDropoffTime("");
    }
  };

  const handleDropoffDateChange = (event) => {
    setDropoffDate(event.target.value);
    setDropoffTime(""); // Reset drop-off time when date changes
  };

  const isFormComplete =
    pickupLocation && pickupDate && pickupTime && dropoffDate && dropoffTime;

    const carFeatures = [
      {
        icon: <FaCar />,
        text: "Search for cheap car rental in seconds – anywhere in the world",
      },
      {
        icon: <FaCalendarAlt />,
        text: "Compare deals from trusted car hire providers in one place",
      },
      {
        icon: <FaTag />,
        text: "Rent a car with a flexible booking policy or free cancellation",
      },
    ];


  return (
    <section className="relative w-full">
      {/* Header */}
      <Header />


      {/* Background Image - Hidden on Small Screens */}
      <div className="absolute inset-0 hidden lg:block -z-10">
        <img
          src="/public/images/carbg.jpg"
          alt="Car rental background"
          className="w-full h-full object-cover object-center fixed"
        />
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <h1 className="text-4xl lg:text-6xl font-bold text-black mb-8">
          Find the best car rental deals
        </h1>

        {/* Search Form */}
        <div className="bg-[#001533] p-6 rounded-2xl shadow-lg">
          <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-center">
            
            {/* Pickup Location */}
            <div className="lg:col-span-1">
              <label className="block text-white font-semibold mb-1">
                Pick-up location
              </label>
              <input
                type="text"
                placeholder="City, airport or station"
                className="w-full p-3 rounded-lg bg-white text-black"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>

            {/* Pickup Date */}
            <div>
              <label className="block text-white font-semibold mb-1">
                Pick-up date
              </label>
              <input type="date" 
              className="w-full p-3 rounded-lg bg-white text-black" 
              min={today}
              value={pickupDate}
              onChange={handlePickupDateChange}
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
              />
            </div>

            {/* Drop-off Date */}
            <div>
              <label className="block text-white font-semibold mb-1">
                Drop-off date
              </label>
              <input type="date" 
              className="w-full p-3 rounded-lg bg-white text-black" 
              min={pickupDate || today}
              value={dropoffDate}
              onChange={handleDropoffDateChange}
              disabled={!pickupDate}
              />
            </div>

            {/* Drop-off Time */}
            <div>
              <label className="block text-white font-semibold mb-1">
                Time
              </label>
              <input type="time" 
              className="w-full p-3 rounded-lg bg-white text-black" 
              value={dropoffTime}
                onChange={(e) => setDropoffTime(e.target.value)}
                min={dropoffDate === pickupDate ? pickupTime : "00:00"}
                disabled={!dropoffDate}
              />
            </div>

            {/* Options */}
            <div className="lg:col-span-5 flex flex-wrap gap-4 items-center mt-4">
              <label className="flex items-center text-white">
                <input type="checkbox" className="mr-2" defaultChecked />
                Driver aged between 25 – 70
              </label>

              <label className="flex items-center text-white">
                <input type="checkbox" className="mr-2" />
                Return car to a different location
              </label>

              <button
                type="submit"
                className={`ml-auto px-6 py-3 font-semibold rounded-lg transition ${
                  isFormComplete
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-300 text-gray-200 cursor-not-allowed"
                }`}
                disabled={!isFormComplete}
                style={{ cursor: isFormComplete ? "pointer" : "not-allowed" }}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white">
        <div className="container mx-auto max-w-7xl px-8 pt-5">
          <nav className="text-sm">
            <a href="/" className="text-blue-600 hover:underline">Home</a>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">Car hire</span>
          </nav>
        </div>
        <div className="container mx-auto max-w-7xl">
          <FeaturesSection features={carFeatures} />
        </div>
      </div>
      


      {/* Car Hire Deals Section */}
      <section className="bg-gray-100 py-12 px-6 md:px-12">
        <div className="max-w-7xl container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-serif">
            Looking for the best car hire deals worldwide?
          </h2>
          <p className="text-gray-600 mb-10 font-serif">
            Compare rental car deals from top providers, all in one place. With flexible options and no hidden fees, 
            renting a car has never been easier – here’s how.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Wide Selection */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1080/1080812.png"
                alt="Wide Selection"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-lg font-bold font-serif">Wide Selection, Best Prices</h3>
              <p className="text-gray-600 mt-2 font-serif">
                Browse a wide range of vehicles from top rental companies. Find the best deals that suit your needs and budget.
              </p>
            </div>

            {/* No Hidden Fees */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1246/1246732.png"
                alt="No Hidden Fees"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-lg font-bold font-serif">No Hidden Fees, No Surprises</h3>
              <p className="text-gray-600 mt-2 font-serif">
                The price you see is the price you pay. No extra costs, just transparent pricing for your peace of mind.
              </p>
            </div>

            {/* Free Cancellation */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg">
              <img
                src="https://cdn-icons-png.flaticon.com/512/747/747968.png"
                alt="Free Cancellation"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-lg font-bold font-serif">Free Cancellation on Most Bookings</h3>
              <p className="text-gray-600 mt-2 font-serif">
                Change of plans? No worries! Most car rentals offer free cancellation, so you can book with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>
      <hr className="bg-black"></hr>


       {/* Swiper Section */}
       <section className="bg-white">
       <TravelDeals />
       </section>

      {/* Car Hire FAQ */}
      <div className="bg-white">
      <CarHireFAQ />
      </div>

       {/* Footer */}
       <Footer />
    </section>
  );
}

