import { useState, useEffect } from "react";
import { FaGlobe, FaUser, FaBars, FaHeart, FaPlane, FaHotel, FaCar, FaFlag, FaSearchLocation, FaQuestionCircle } from "react-icons/fa";
import logo from "../assets/image/logo2.png";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("flights");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Update activeTab based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/hotel") || path.includes("/hotel-search")) {
      setActiveTab("hotels");
    } else if (path.includes("/carhire")) {
      setActiveTab("carhire");
    } else {
      setActiveTab("flights");
    }
  }, [location.pathname]);

  return (
    <div>
      {/* Navbar */}
      <header className="bg-[#06152B] text-white">
        <div className="container mx-auto max-w-7xl flex flex-wrap items-center justify-between p-4 md:p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 cursor-pointer hover:text-blue-300">
              {/* <img src={logo} alt="Tripglide Logo" className="h-8 md:h-10 w-auto" /> */}
              <span className="text-lg md:text-2xl font-bold font-serif">Tripglide</span>
            </Link>
          </div>
  
          {/* Navbar Icons & Dropdown */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Selector */}
            <div className="p-2 rounded-lg hover:bg-gray-600 transition cursor-pointer">
              <FaGlobe />
            </div>
  
            {/* Favorites */}
            <div className="p-2 rounded-lg hover:bg-gray-600 transition cursor-pointer">
              <FaHeart />
            </div>
  
            {/* Log in */}
            <div
              className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-600 transition cursor-pointer"
              onClick={() => navigate("/login")}
            >
              <FaUser />
              <span className="hidden sm:inline">Log in</span>
            </div>
  
            {/* Mobile Menu (Hamburger) */}
            <div className="relative">
              <div
                className="p-2 rounded-lg hover:bg-gray-600 transition cursor-pointer"
                onClick={toggleDropdown}
              >
                <FaBars />
              </div>
  
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white text-black shadow-lg rounded-xl z-10">
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
                    <Link to="/explore" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition">
                      <FaSearchLocation className="text-[#0c828b]" /> Explore everywhere
                    </Link>
                    <Link to="/help" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition">
                      <FaQuestionCircle className="text-[#0c828b]" /> Help
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
  
        {/* Tabs Section - Responsive */}
        <div className="container mx-auto max-w-7xl flex flex-wrap gap-2 md:gap-4 px-4 md:px-6 py-2 md:py-4 bg-[#06152B] text-white">
          {[
            { id: "flights", icon: <FaPlane />, label: "Flights" },
            { id: "hotels", icon: <FaHotel />, label: "Hotels" },
            { id: "carhire", icon: <FaCar />, label: "Car hire" }
          ].map(({ id, icon, label }) => (
            <Link
              key={id}
              to={`/${id}`}
              className={`flex items-center cursor-pointer gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white transition-transform duration-300 hover:scale-105 hover:bg-blue-600 ${
                activeTab === id ? "bg-blue-600" : "bg-gray-800"
              }`}
            >
              {icon} {label}
            </Link>
          ))}
        </div>
      </header>
    </div>
  );  
}