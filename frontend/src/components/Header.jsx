import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaGlobe, FaUser, FaBars, FaHeart, FaPlane, FaHotel, FaCar, FaFlag, FaSearchLocation, FaQuestionCircle, FaChartBar } from "react-icons/fa";
import logo from "../assets/image/logo2.png";

export default function Header({ user, allFlights, tripType, returnDate }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("flights");
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/hotels")) setActiveTab("hotels");
    else if (path.includes("/carhire") || path.includes("/cabs")) setActiveTab("carhire");
    else setActiveTab("flights");
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFavoritesClick = () => {
    const favoriteFlights = allFlights.filter(flight => flight.isFavorite);
    navigate("/favorites", { state: { allFlights: favoriteFlights, tripType, returnDate } });
  };

  const handleUserClick = () => {
    if (user) {
      // If user is logged in, go directly to dashboard
      navigate("/dashboard");
    }
    // If not logged in, the Link to "/login" will handle navigation
  };

  // const onLogout = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   handleLogout();
  //   navigate('/');
  // };

  return (
    <header className="bg-[#06152B] text-white w-full">
      <div className="container mx-auto max-w-7xl flex flex-wrap items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 cursor-pointer hover:text-blue-300">
            <img src={logo} alt="Tripglide Logo" className="h-8 md:h-10 w-auto" />
            <span className="text-lg md:text-2xl font-bold font-serif">Tripglide</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/country-facts" className="p-2 rounded-lg hover:bg-gray-600 transition cursor-pointer" title="Country Facts">
            <FaGlobe />
          </Link>
          <div
            className="p-2 rounded-lg hover:bg-gray-600 transition cursor-pointer"
            onClick={handleFavoritesClick}
            title="Saved Trips"
          >
            <FaHeart />
          </div>
          {/* <a
            href="https://dashboard.stripe.com/test/guests/gcus_1R9jv32RiOcrGJvia7h7puky"
            className="p-2 rounded-lg hover:bg-gray-600 transition cursor-pointer"
            title="Stripe Dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaChartBar />
          </a> */}
          {user ? (
            <div
              className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-600"
              onClick={handleUserClick}
              title="Go to Dashboard"
            >
              <FaUser />
              <span className="hidden sm:inline">{user.username}</span>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-600 transition cursor-pointer"
              title="Sign In"
            >
              <FaUser />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
          <div className="relative" ref={dropdownRef}>
            <div className="p-2 rounded-lg hover:bg-gray-600 transition cursor-pointer" onClick={toggleDropdown}>
              <FaBars />
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white text-black shadow-lg rounded-xl z-20">
                <div className="py-2">
                  <Link to="/" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition">
                    <FaPlane className="text-blue-500" /> Flights
                  </Link>
                  <Link to="/hotels" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition">
                    <FaHotel className="text-blue-500" /> Hotels
                  </Link>
                  <Link to="/carhire" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition">
                    <FaCar className="text-blue-500" /> Car hire
                  </Link>
                </div>
                <hr className="border-t border-gray-300" />
                <div className="py-2">
                  <Link to="/regional-settings" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition">
                    <FaFlag /> Regional settings
                  </Link>
                  <Link to="/hotels" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition">
                    <FaSearchLocation className="text-[#0c828b]" /> Explore everywhere
                  </Link>
                  <Link to="/help" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition">
                    <FaQuestionCircle className="text-[#0c828b]" /> Help
                  </Link>
                  {/* {user && (
                    <button
                      onClick={onLogout}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 transition w-full text-left"
                    >
                      Logout
                    </button>
                  )} */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl overflow-x-auto scrollbar-hide">
        <div className="flex flex-nowrap gap-2 md:gap-4 px-4 md:px-6 py-2 md:py-4 bg-[#06152B] text-white min-w-max">
          {[
            { id: "flights", icon: <FaPlane />, label: "Flights" },
            { id: "hotels", icon: <FaHotel />, label: "Hotels" },
            { id: "carhire", icon: <FaCar />, label: "Car hire" },
          ].map(({ id, icon, label }) => (
            <Link
              key={id}
              to={`/${id === "flights" ? "" : id}`}
              className={`flex items-center whitespace-nowrap cursor-pointer gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white transition-transform duration-300 hover:scale-105 hover:bg-blue-600 ${
                activeTab === id ? "bg-blue-600" : "bg-gray-800"
              }`}
            >
              {icon} {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}