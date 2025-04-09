// Hotels.jsx
import React, { useState, useEffect } from "react";
import { FaHotel, FaCalendarAlt, FaTag, FaPlus, FaMinus, FaChevronDown } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import TravelDeals from "./TravelDeals";
import FeaturesSection from "./FeaturesSection";
import HotelFAQ from "./HotelFAQ";
import Footer from "./Footer";
import axios from "axios";

export default function Hotels() {
  const navigate = useNavigate();

  const hotelFeatures = [
    {
      icon: <FaHotel />,
      text: "Search and compare hotels in seconds – anywhere in the India",
    },
    {
      icon: <FaCalendarAlt />,
      text: "Compare deals from trusted hotel providers in one place",
    },
    {
      icon: <FaTag />,
      text: "Book a hotel with flexible booking policies or free cancellation",
    },
  ];

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [destination, setDestination] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/arrival")
      .then((response) => {
        // Ensure destinations is always an array
        const locations = Array.isArray(response.data.locations) ? response.data.locations : [];
        setDestinations(locations);
      })
      .catch((error) => {
        console.error("Error fetching destinations:", error);
        setDestinations([]); // Fallback to empty array on error
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to HotelSearch with the form data
    navigate("/hotel-search", {
      state: {
        destination,
        checkInDate,
        checkOutDate,
        adults,
        children,
        rooms,
      },
    });
  };

  const handleCheckInDateChange = (event) => {
    setCheckInDate(event.target.value);
    if (checkOutDate && event.target.value > checkOutDate) {
      setCheckOutDate("");
    }
  };

  const handleCheckOutDateChange = (event) => {
    setCheckOutDate(event.target.value);
  };

  const isFormComplete = destination && checkInDate && checkOutDate;

  const handleOption = (type, operation) => {
    if (type === "adults") {
      setAdults((prev) => (operation === "inc" ? prev + 1 : prev > 1 ? prev - 1 : 1));
    }
    if (type === "children") {
      setChildren((prev) => (operation === "inc" ? prev + 1 : prev > 0 ? prev - 1 : 0));
    }
    if (type === "rooms") {
      setRooms((prev) => (operation === "inc" ? prev + 1 : prev > 1 ? prev - 1 : 1));
    }
  };

  // Hotel Slider Data (unchanged)
  const hotelData = {
    Mumbai: [
      { name: "The Taj Mahal Palace, Mumbai", distance: "14.39 km", rating: 4.8, reviews: "22 review", price: "₹18,236", image: "/images/Hotel/taj_mumbai.jpg", stars: 5 },
      { name: "Hotel Marine Plaza", distance: "13.69 km", rating: 4.4, reviews: "13 reviews", price: "₹1,528", image: "/images/Hotel/marine_plaza.webp", stars: 4 },
      { name: "ITC Maratha, a Luxury Collection Hotel", distance: "6.39 km", rating: 4.6, reviews: "29 reviews", price: "₹15,741", image: "/images/Hotel/itc_maratha.png", stars: 5 },
      { name: "ITC Grand Central", distance: "2.5 km from city centre", rating: 4.5, reviews: "900 reviews", price: "₹14,500", image: "/images/Hotel/ITC_Grand_centeral.png" },
    ],
    Jaipur: [
      { name: "The Oberoi Rajvilas Jaipur", distance: "7.56 km from city centre", rating: 5, reviews: "1 review", price: "₹77,027", image: "/images/Hotel/oberoi.jpg" },
      { name: "Nahar Singh Haveli", distance: "2.87 km from city centre", rating: 3, reviews: "702 reviews", price: "₹821", image: "/images/Hotel/nahar-singh-haveli.jpg" },
      { name: "Holiday Inn Jaipur City Centre", distance: "3.70 km from city centre", rating: 5, reviews: "6381 reviews", price: "₹5,812", image: "/images/Hotel/Holiday_Inn.jpg" },
      { name: "Hyatt Regency Jaipur Mansarovar", distance: "12.10 km from city centre", rating: 4.5, reviews: "510 reviews", price: "₹9,127", image: "/images/Hotel/Hyatt_regency.jpg" },
    ],
    Delhi: [
      { name: "The LaLiT New Delhi", distance: "0.75 km from city centre", rating: 4.5, reviews: "6100 reviews", price: "₹9,800", image: "/images/Hotel/The LaLiT New Delhi.jpg" },
      { name: "Radisson Blu Marina Hotel Connaught Place", distance: "0.27 km from city centre", rating: 4.5, reviews: "15 reviews", price: "₹14,000", image: "/images/Hotel/Radisson Blu Marina Hotel Connaught Place.jpg" },
      { name: "Hyatt Regency Delhi", distance: "7.82 km from city centre", rating: 4.5, reviews: "25 reviews", price: "₹13,300", image: "/images/Hotel/Hyatt Regency Delhi.webp" },
      { name: "JW Marriott Hotel New Delhi Aerocity", distance: "13.06 km from city centre", rating: 5, reviews: "5500 reviews", price: "₹42,000", image: "/images/Hotel/JW Marriott Hotel New Delhi Aerocity.avif" },
    ],
    Bengaluru: [
      { name: "Radisson Blu Atria Bengaluru", distance: "1.33 km from city centre", rating: 4.5, reviews: "1662 reviews", price: "₹7,650", image: "/images/Hotel/Radisson Blu Atria Bengaluru.jpg" },
      { name: "ITC Gardenia, a Luxury Collection Hotel", distance: "0.52 km from city centre", rating: 5, reviews: "5907 reviews", price: "₹18,219", image: "/images/Hotel/ITC Gardenia.webp" },
      { name: "Prestige Residency", distance: "1.87 km from city centre", rating: 4.1, reviews: "2 reviews", price: "₹546", image: "/images/Hotel/Prestige Residency.webp" },
      { name: "Renaissance Bengaluru Race Course Hotel", distance: "2.42 km from city centre", rating: 4.5, reviews: "1400 reviews", price: "₹9,999", image: "/images/Hotel/Renaissance Bengaluru Race Course Hotel.jpg" },
    ],
    Hyderabad: [
      { name: "Taj Krishna", distance: "6.65 km from city centre", rating: 4.5, reviews: "7 reviews", price: "₹14,850", image: "/images/Hotel/Taj Krishna.webp" },
      { name: "Novotel Hyderabad Airport", distance: "13.41 km from city centre", rating: 4.5, reviews: "10 reviews", price: "₹12,741", image: "/images/Hotel/Novotel Hyderabad Airport.jpg" },
      { name: "Taj Falaknuma Palace", distance: "3.37 km from city centre", rating: 4.8, reviews: "2 reviews", price: "₹28,000", image: "/images/Hotel/Taj Falaknuma Palace.jpg" },
      { name: "The Westin Hyderabad Mindspace", distance: "13.33 km from city centre", rating: 4.8, reviews: "5 reviews", price: "₹34,000", image: "/images/Hotel/The Westin Hyderabad Mindspace.jpg" },
    ],
  };

  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const breakpoints = {
    320: { slidesPerView: 1 },
    640: { slidesPerView: 1.2 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  };

  return (
    <section className="w-full">
      
      <div className="absolute inset-0 hidden lg:block -z-10 h-[600px] lg:h-[800px]">
        <img
          src="/images/Hotel/Heroimg.jpg"
          alt="Hotel background"
          className="w-full h-full object-cover object-center fixed"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24 mt-16">
        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-8">
          Find the best hotel deals
        </h1>
        <div className="bg-[#001533] p-6 rounded-2xl shadow-lg">
          <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-center" onSubmit={handleSearch}>
            <div className="lg:col-span-2">
              <label className="block text-white font-semibold mb-1">
                Where do you want to stay?
              </label>
              <input
                list="destinations"
                type="text"
                placeholder="Enter destination or hotel name"
                className="w-full p-3 rounded-lg bg-white text-black"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
              <datalist id="destinations">
                {destinations.map((destination, index) => (
                  <option key={index} value={destination} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-white font-semibold mb-1">Check-In</label>
              <input
                type="date"
                className="w-full p-3 rounded-lg bg-white text-black"
                min={today}
                value={checkInDate}
                onChange={handleCheckInDateChange}
                required
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-1">Check-Out</label>
              <input
                type="date"
                className="w-full p-3 rounded-lg bg-white text-black"
                min={checkInDate || today}
                value={checkOutDate}
                onChange={handleCheckOutDateChange}
                disabled={!checkInDate}
                required
              />
            </div>
            <div className="relative w-full">
              <label className="block text-white font-semibold mb-1">Guests & Rooms</label>
              <div
                className="flex justify-between items-center w-full p-3 rounded-lg bg-white text-black cursor-pointer"
                onClick={() => setShowGuestOptions(!showGuestOptions)}
              >
                <span>{`${adults} Adults, ${children} Children, ${rooms} Room`}</span>
                <FaChevronDown className={`transition-transform duration-300 ${showGuestOptions ? "rotate-180" : ""}`} />
              </div>
              {showGuestOptions && (
                <div className="absolute bg-white shadow-lg rounded-lg p-4 w-full top-20 z-10 mt-7">
                  <div className="flex justify-between items-center mb-4">
                    <span>Adults</span>
                    <div className="flex items-center space-x-3">
                      <button type="button" onClick={() => handleOption("adults", "dec")} className="p-2 bg-gray-200 rounded"><FaMinus /></button>
                      <span>{adults}</span>
                      <button type="button" onClick={() => handleOption("adults", "inc")} className="p-2 bg-gray-200 rounded"><FaPlus /></button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span>Children</span>
                    <div className="flex items-center space-x-3">
                      <button type="button" onClick={() => handleOption("children", "dec")} className="p-2 bg-gray-200 rounded"><FaMinus /></button>
                      <span>{children}</span>
                      <button type="button" onClick={() => handleOption("children", "inc")} className="p-2 bg-gray-200 rounded"><FaPlus /></button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span>Rooms</span>
                    <div className="flex items-center space-x-3">
                      <button type="button" onClick={() => handleOption("rooms", "dec")} className="p-2 bg-gray-200 rounded"><FaMinus /></button>
                      <span>{rooms}</span>
                      <button type="button" onClick={() => handleOption("rooms", "inc")} className="p-2 bg-gray-200 rounded"><FaPlus /></button>
                    </div>
                  </div>
                  <button type="button" className="text-blue-600 font-semibold mt-2" onClick={() => setShowGuestOptions(false)}>Done</button>
                </div>
              )}
            </div>
            <div className="lg:col-span-5 flex flex-wrap gap-4 items-center mt-4">
              <label className="flex items-center text-white">
                <input type="checkbox" className="mr-2" defaultChecked /> Free cancellation
              </label>
              <label className="flex items-center text-white">
                <input type="checkbox" className="mr-2" /> 4 stars
              </label>
              <label className="flex items-center text-white">
                <input type="checkbox" className="mr-2" /> 3 stars
              </label>
              <button
                type="submit"
                className={`ml-auto px-6 py-3 font-semibold rounded-lg transition ${
                  isFormComplete ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-300 text-gray-200 cursor-not-allowed"
                }`}
                disabled={!isFormComplete}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Rest of the Hotels page remains unchanged */}
      <div className="bg-white">
        <div className="container mx-auto max-w-7xl px-8 pt-5">
          <nav className="text-sm">
            <a href="/" className="text-blue-600 hover:underline">Home</a>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">Hotels</span>
          </nav>
        </div>
        <div className="container mx-auto max-w-7xl">
          <FeaturesSection features={hotelFeatures} />
        </div>
      </div>
      <div className="w-full bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-100 w-full">
          <h2 className="text-3xl font-bold mb-2">Hotels in your home country</h2>
          <p className="text-gray-500 mb-6">Your next adventure may be closer than you think. Discover hotels just beyond your doorstep.</p>
          <div className="flex gap-4 mb-6 flex-wrap">
            {Object.keys(hotelData).map((city) => (
              <button
                key={city}
                className={`px-4 py-2 rounded-full border ${selectedCity === city ? "bg-black text-white" : "bg-white text-black border-gray-300"}`}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </button>
            ))}
          </div>
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              navigation={{ prevEl: ".prev-btn", nextEl: ".next-btn" }}
              pagination={{ clickable: true }}
              breakpoints={breakpoints}
            >
              {hotelData[selectedCity].map((hotel, index) => (
                <SwiperSlide key={index}>
                  <div className="rounded-2xl shadow-md overflow-hidden bg-white">
                    <img src={hotel.image} alt={hotel.name} className="h-48 w-full object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{hotel.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{hotel.distance}</p>
                      <div className="flex items-center mb-2">
                        <span className="font-bold mr-2">{hotel.rating}</span>
                        <div className="flex text-yellow-400">{Array.from({ length: Math.floor(hotel.rating) }).map((_, idx) => (<span key={idx}>★</span>))}</div>
                        <span className="ml-2 text-sm text-gray-500">{hotel.reviews}</span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <span className="text-lg font-semibold">{hotel.price}</span>
                          <p className="text-sm text-gray-500">Per night</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="prev-btn absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 shadow rounded-full z-10"><ChevronLeft /></button>
            <button className="next-btn absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 shadow rounded-full z-10"><ChevronRight /></button>
          </div>
        </div>
      </div>
      <section className="bg-white"><TravelDeals /></section>
      <section className="bg-gray-100 py-12 px-6 md:px-12">
        <div className="max-w-7xl container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-serif">Looking for the best hotel deals worldwide?</h2>
          <p className="text-gray-600 mb-10 font-serif">Compare hotel prices from top booking sites in one place. With flexible options and no hidden fees, booking your perfect stay has never been easier – here’s why.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg">
              <img src="https://cdn-icons-png.flaticon.com/512/168/168812.png" alt="Wide Selection" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-bold font-serif">Wide Selection, Best Prices</h3>
              <p className="text-gray-600 mt-2 font-serif">Choose from thousands of hotels, resorts, and apartments worldwide. Find the perfect stay at the best price.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg">
              <img src="https://cdn-icons-png.flaticon.com/512/2910/2910791.png" alt="No Hidden Fees" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-bold font-serif">No Hidden Fees, No Surprises</h3>
              <p className="text-gray-600 mt-2 font-serif">The price you see is the price you pay. No unexpected charges – just clear, transparent hotel pricing.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg">
              <img src="https://cdn-icons-png.flaticon.com/512/709/709790.png" alt="Free Cancellation" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-bold font-serif">Free Cancellation on Most Bookings</h3>
              <p className="text-gray-600 mt-2 font-serif">Plans changed? No worries! Many hotels offer free cancellation, so you can book with confidence.</p>
            </div>
          </div>
        </div>
      </section>
      <div className="bg-white"><HotelFAQ /></div>
      <Footer />
    </section>
  );
}