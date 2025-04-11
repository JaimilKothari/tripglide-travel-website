import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import TravelersCabinClass from "./TravelersCabinClass";
import TravelDeals from "./TravelDeals";
import FAQSection from "./FAQSection";
import FeaturesSection from "./FeaturesSection";
import FlightDealsCards from "./FlightDealsCards";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaCalendarAlt, FaTag } from "react-icons/fa";
import axios from "axios";
import FlightData from "./FlightData";

export default function SearchSection() {
  const [tripType, setTripType] = useState("return");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cabinClass, setCabinClass] = useState("Economy");
  const [multiCityFlights, setMultiCityFlights] = useState([
    { id: 1, from: "", to: "", depart: "" },
    { id: 2, from: "", to: "", depart: "" },
  ]);
  const [departureAirports, setDepartureAirports] = useState([]);
  const [arrivalAirports, setArrivalAirports] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [filteredDepartureAirports, setFilteredDepartureAirports] = useState([]);
  const [filteredArrivalAirports, setFilteredArrivalAirports] = useState([]);
  const [multiCityDropdowns, setMultiCityDropdowns] = useState([]);
  const [fromFocusIndex, setFromFocusIndex] = useState(-1);
  const [toFocusIndex, setToFocusIndex] = useState(-1);
  const [multiCityFocusIndices, setMultiCityFocusIndices] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const multiCityRefs = useRef([]);
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const images = [
    "/images/samuel-ferrara-1527pjeb6jg-unsplash.jpg",
    "/images/daniel-leone-g30P1zcOzXo-unsplash.jpg",
    "/images/benjamin-voros-phIFdC6lA4E-unsplash.jpg",
    "/images/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/get_flights");
        setDepartureAirports(response.data.departure_airport || []);
        setArrivalAirports(response.data.arrival_airport || []);
      } catch (error) {
        console.error("Error fetching airport data:", error);
      }
    };
    fetchAirports();
  }, []);

  useEffect(() => {
    setFilteredDepartureAirports(
      departureAirports.filter(
        (airport) =>
          airport.toLowerCase().includes(from.toLowerCase()) && airport !== to
      )
    );
    setFromFocusIndex(-1);
  }, [from, to, departureAirports]);

  useEffect(() => {
    setFilteredArrivalAirports(
      arrivalAirports.filter(
        (airport) =>
          airport.toLowerCase().includes(to.toLowerCase()) && airport !== from
      )
    );
    setToFocusIndex(-1);
  }, [to, from, arrivalAirports]);

  useEffect(() => {
    if (multiCityFlights.length > 0) {
      setMultiCityDropdowns(
        multiCityFlights.map(() => ({
          showFrom: false,
          showTo: false,
          filteredFrom: [],
          filteredTo: [],
        }))
      );
      setMultiCityFocusIndices(multiCityFlights.map(() => ({ from: -1, to: -1 })));
    }
  }, [multiCityFlights.length]);

  useEffect(() => {
    if (multiCityDropdowns.length > 0) {
      const updatedDropdowns = multiCityFlights.map((flight, index) => {
        return {
          ...multiCityDropdowns[index],
          filteredFrom: departureAirports.filter(
            (airport) =>
              airport.toLowerCase().includes(flight.from.toLowerCase()) &&
              airport !== flight.to
          ),
          filteredTo: arrivalAirports.filter(
            (airport) =>
              airport.toLowerCase().includes(flight.to.toLowerCase()) &&
              airport !== flight.from
          ),
        };
      });
      setMultiCityDropdowns(updatedDropdowns);
    }
  }, [multiCityFlights, departureAirports, arrivalAirports]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    setTimeout(() => {
      // Simulate a 2-3 second delay before navigation
      navigate("/search-results", {
        state: {
          tripType,
          from,
          to,
          departDate,
          returnDate,
          cabinClass,
          multiCityFlights,
        },
      });
      setIsLoading(false); // Stop loading after navigation
    }, 2500); // 2.5 seconds delay
  };

  const isMultiCityValid = multiCityFlights.every(
    (flight) => flight.from && flight.to && flight.depart
  );
  const isOneWayValid = from && to && departDate;
  const isReturnValid = isOneWayValid && returnDate;
  const isSearchDisabled =
    (tripType === "multicity" && !isMultiCityValid) ||
    (tripType === "oneway" && !isOneWayValid) ||
    (tripType === "return" && !isReturnValid);

  const swapLocations = () => {
    setFrom((prevFrom) => {
      setTo(prevFrom);
      return to;
    });
  };

  const addMultiCityFlight = () => {
    if (multiCityFlights.length < 6) {
      setMultiCityFlights([
        ...multiCityFlights,
        { id: Date.now(), from: "", to: "", depart: "" },
      ]);
    }
  };

  const removeMultiCityFlight = (id) => {
    setMultiCityFlights(multiCityFlights.filter((flight) => flight.id !== id));
  };

  const handleFromSelect = (airport) => {
    setFrom(airport);
    setShowFromDropdown(false);
    setFromFocusIndex(-1);
  };

  const handleToSelect = (airport) => {
    setTo(airport);
    setShowToDropdown(false);
    setToFocusIndex(-1);
  };

  const handleMultiCityFromSelect = (airport, index) => {
    const updatedFlights = [...multiCityFlights];
    updatedFlights[index].from = airport;
    setMultiCityFlights(updatedFlights);
    const updatedDropdowns = [...multiCityDropdowns];
    updatedDropdowns[index].showFrom = false;
    setMultiCityDropdowns(updatedDropdowns);
    const updatedFocus = [...multiCityFocusIndices];
    updatedFocus[index].from = -1;
    setMultiCityFocusIndices(updatedFocus);
  };

  const handleMultiCityToSelect = (airport, index) => {
    const updatedFlights = [...multiCityFlights];
    updatedFlights[index].to = airport;
    setMultiCityFlights(updatedFlights);
    const updatedDropdowns = [...multiCityDropdowns];
    updatedDropdowns[index].showTo = false;
    setMultiCityDropdowns(updatedDropdowns);
    const updatedFocus = [...multiCityFocusIndices];
    updatedFocus[index].to = -1;
    setMultiCityFocusIndices(updatedFocus);
  };

  const toggleMultiCityDropdown = (index, type) => {
    const updatedDropdowns = [...multiCityDropdowns];
    if (type === "from") {
      updatedDropdowns[index].showFrom = !updatedDropdowns[index].showFrom;
      updatedDropdowns.forEach((dropdown, i) => {
        if (i !== index) {
          dropdown.showFrom = false;
          dropdown.showTo = false;
        } else {
          dropdown.showTo = false;
        }
      });
    } else {
      updatedDropdowns[index].showTo = !updatedDropdowns[index].showTo;
      updatedDropdowns.forEach((dropdown, i) => {
        if (i !== index) {
          dropdown.showFrom = false;
          dropdown.showTo = false;
        } else {
          dropdown.showFrom = false;
        }
      });
    }
    setMultiCityDropdowns(updatedDropdowns);
    setShowFromDropdown(false);
    setShowToDropdown(false);
  };

  const handleFromKeyDown = (e) => {
    if (!showFromDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFromFocusIndex((prev) =>
        Math.min(prev + 1, filteredDepartureAirports.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFromFocusIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && fromFocusIndex >= 0) {
      e.preventDefault();
      handleFromSelect(filteredDepartureAirports[fromFocusIndex]);
    }
  };

  const handleToKeyDown = (e) => {
    if (!showToDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setToFocusIndex((prev) =>
        Math.min(prev + 1, filteredArrivalAirports.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setToFocusIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && toFocusIndex >= 0) {
      e.preventDefault();
      handleToSelect(filteredArrivalAirports[toFocusIndex]);
    }
  };

  const handleMultiCityKeyDown = (e, index, type) => {
    const dropdown = multiCityDropdowns[index];
    const focusIndices = multiCityFocusIndices[index];
    const filteredList = type === "from" ? dropdown.filteredFrom : dropdown.filteredTo;
    const isDropdownOpen = type === "from" ? dropdown.showFrom : dropdown.showTo;
    const focusIndex = type === "from" ? focusIndices.from : focusIndices.to;

    if (!isDropdownOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const updatedFocus = [...multiCityFocusIndices];
      updatedFocus[index][type] = Math.min(focusIndex + 1, filteredList.length - 1);
      setMultiCityFocusIndices(updatedFocus);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const updatedFocus = [...multiCityFocusIndices];
      updatedFocus[index][type] = Math.max(focusIndex - 1, -1);
      setMultiCityFocusIndices(updatedFocus);
    } else if (e.key === "Enter" && focusIndex >= 0) {
      e.preventDefault();
      if (type === "from") {
        handleMultiCityFromSelect(filteredList[focusIndex], index);
      } else {
        handleMultiCityToSelect(filteredList[focusIndex], index);
      }
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const flightFeatures = [
    {
      icon: <FaPlane />,
      text: "Explore the best flight deals from anywhere, to everywhere, then book with no fees",
    },
    {
      icon: <FaCalendarAlt />,
      text: "Compare flight deals from over 1000 providers, and choose the cheapest, fastest or lowest-emission tickets",
    },
    {
      icon: <FaTag />,
      text: "Find the cheapest month - or even day - to fly, and set up Price Alerts to book when the price is right",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromInputRef.current && !fromInputRef.current.contains(event.target)) {
        setShowFromDropdown(false);
      }
      if (toInputRef.current && !toInputRef.current.contains(event.target)) {
        setShowToDropdown(false);
      }
      if (multiCityRefs.current.length > 0) {
        let closeAll = true;
        multiCityRefs.current.forEach((refs, index) => {
          if (!refs) return;
          if (refs.fromRef && refs.fromRef.contains(event.target)) closeAll = false;
          if (refs.toRef && refs.toRef.contains(event.target)) closeAll = false;
        });
        if (closeAll) {
          const updatedDropdowns = [...multiCityDropdowns];
          updatedDropdowns.forEach((dropdown) => {
            dropdown.showFrom = false;
            dropdown.showTo = false;
          });
          setMultiCityDropdowns(updatedDropdowns);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="w-full">
      <div className="absolute inset-0 block -z-10">
        <img
          src="/images/Large-Flights-hero-2.jpeg"
          alt="Flight booking background"
          className="w-full h-full object-cover object-center fixed"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-8">
          <b>The best flight offers from anywhere, to everywhere</b>
        </h1>

        <div className="bg-[#001533] p-6 rounded-2xl shadow-lg">
          <div className="flex gap-6 text-white mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                className="mr-2"
                checked={tripType === "return"}
                onChange={() => setTripType("return")}
              />{" "}
              Return
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                className="mr-2"
                checked={tripType === "oneway"}
                onChange={() => setTripType("oneway")}
              />{" "}
              One way
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                className="mr-2"
                checked={tripType === "multicity"}
                onChange={() => setTripType("multicity")}
              />{" "}
              Multi-city
            </label>
          </div>

          {tripType === "multicity" ? (
            <form className="space-y-4">
              {multiCityFlights.map((flight, index) => (
                <div
                  key={flight.id}
                  className="flex flex-wrap md:flex-nowrap gap-4 items-center"
                >
                  <div
                    className="flex-1 min-w-[100px] relative"
                    ref={(el) => {
                      if (!multiCityRefs.current[index])
                        multiCityRefs.current[index] = {};
                      multiCityRefs.current[index].fromRef = el;
                    }}
                  >
                    <label className="block text-white font-semibold mb-1">
                      From
                    </label>
                    <input
                      value={flight.from}
                      onChange={(e) => {
                        const updatedFlights = [...multiCityFlights];
                        updatedFlights[index].from = e.target.value;
                        setMultiCityFlights(updatedFlights);
                        if (!multiCityDropdowns[index]?.showFrom)
                          toggleMultiCityDropdown(index, "from");
                      }}
                      onClick={() => toggleMultiCityDropdown(index, "from")}
                      onKeyDown={(e) => handleMultiCityKeyDown(e, index, "from")}
                      className="w-full p-3 rounded-lg bg-white text-black"
                      placeholder="Select or type departure airport"
                      required
                    />

                    {multiCityDropdowns[index]?.showFrom && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {multiCityDropdowns[index]?.filteredFrom.length > 0 ? (
                          multiCityDropdowns[index].filteredFrom.map(
                            (airport, idx) => (
                              <div
                                key={idx}
                                className={`p-2 hover:bg-blue-100 cursor-pointer ${
                                  multiCityFocusIndices[index]?.from === idx
                                    ? "bg-blue-200"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleMultiCityFromSelect(airport, index)
                                }
                              >
                                {airport}
                              </div>
                            )
                          )
                        ) : (
                          <div className="p-2 text-gray-500">
                            No airports found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className="flex-1 min-w-[100px] relative"
                    ref={(el) => {
                      if (!multiCityRefs.current[index])
                        multiCityRefs.current[index] = {};
                      multiCityRefs.current[index].toRef = el;
                    }}
                  >
                    <label className="block text-white font-semibold mb-1">
                      To
                    </label>
                    <input
                      value={flight.to}
                      onChange={(e) => {
                        const updatedFlights = [...multiCityFlights];
                        updatedFlights[index].to = e.target.value;
                        setMultiCityFlights(updatedFlights);
                        if (!multiCityDropdowns[index]?.showTo)
                          toggleMultiCityDropdown(index, "to");
                      }}
                      onClick={() => toggleMultiCityDropdown(index, "to")}
                      onKeyDown={(e) => handleMultiCityKeyDown(e, index, "to")}
                      className="w-full p-3 rounded-lg bg-white text-black"
                      placeholder="Select or type arrival airport"
                      required
                    />

                    {multiCityDropdowns[index]?.showTo && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {multiCityDropdowns[index]?.filteredTo.length > 0 ? (
                          multiCityDropdowns[index].filteredTo.map(
                            (airport, idx) => (
                              <div
                                key={idx}
                                className={`p-2 hover:bg-blue-100 cursor-pointer ${
                                  multiCityFocusIndices[index]?.to === idx
                                    ? "bg-blue-200"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleMultiCityToSelect(airport, index)
                                }
                              >
                                {airport}
                              </div>
                            )
                          )
                        ) : (
                          <div className="p-2 text-gray-500">
                            No airports found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <input
                    type="date"
                    min={
                      index === 0
                        ? today
                        : multiCityFlights[index - 1].depart || today
                    }
                    value={flight.depart}
                    required
                    onChange={(e) => {
                      const updatedFlights = [...multiCityFlights];
                      updatedFlights[index].depart = e.target.value;
                      setMultiCityFlights(updatedFlights);
                    }}
                    className="w-full md:w-1/4 p-3 mt-7 rounded-lg bg-white text-black cursor-pointer"
                  />

                  <button
                    type="button"
                    onClick={() => removeMultiCityFlight(flight.id)}
                    disabled={multiCityFlights.length <= 2}
                    className={`text-white px-4 py-2 mt-7 rounded-lg transition 
                                            ${
                                              multiCityFlights.length <= 2
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-red-500 hover:bg-red-700 cursor-pointer"
                                            }`}
                  >
                    ✖
                  </button>
                </div>
              ))}

              {multiCityFlights.length < 6 && (
                <button
                  type="button"
                  onClick={addMultiCityFlight}
                  className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition cursor-pointer"
                >
                  ➕ Add another flight
                </button>
              )}

              <div className="flex flex-wrap md:flex-nowrap items-center gap-4 mt-4">
                <div className="flex-1">
                  <TravelersCabinClass
                    selectedCabinClass={cabinClass}
                    setSelectedCabinClass={setCabinClass}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  type="submit"
                  disabled={isSearchDisabled || isLoading}
                  className={`mt-5 px-6 py-3 cursor-pointer font-semibold rounded-lg transition 
                                        ${
                                          isSearchDisabled || isLoading
                                            ? "bg-blue-300 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                        }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                        ></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form className="flex flex-wrap gap-2 sm:gap-4 items-center w-full">
              <div className="flex-1 min-w-[100px] relative" ref={fromInputRef}>
                <label className="block text-white font-semibold mb-1">
                  From
                </label>
                <input
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    if (!showFromDropdown) setShowFromDropdown(true);
                  }}
                  onClick={() => {
                    setShowFromDropdown(true);
                    setShowToDropdown(false);
                  }}
                  onKeyDown={handleFromKeyDown}
                  className="w-full p-3 rounded-lg bg-white text-black"
                  placeholder="Select airport"
                  required
                />

                {showFromDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredDepartureAirports.length > 0 ? (
                      filteredDepartureAirports.map((airport, index) => (
                        <div
                          key={index}
                          className={`p-2 hover:bg-blue-100 cursor-pointer ${
                            fromFocusIndex === index ? "bg-blue-200" : ""
                          }`}
                          onClick={() => handleFromSelect(airport)}
                        >
                          {airport}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">No airports found</div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex relative mt-7 justify-center items-center">
                <button
                  type="button"
                  onClick={swapLocations}
                  className="bg-white text-black border border-gray-300 w-10 h-10 rounded-full flex justify-center items-center shadow-md hover:bg-gray-400 transition"
                >
                  ⇄
                </button>
              </div>

              <div className="flex-1 min-w-[100px] relative" ref={toInputRef}>
                <label className="block required: text-white font-semibold mb-1">
                  To
                </label>
                <input
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    if (!showToDropdown) setShowToDropdown(true);
                  }}
                  onClick={() => {
                    setShowToDropdown(true);
                    setShowFromDropdown(false);
                  }}
                  onKeyDown={handleToKeyDown}
                  className="w-full p-3 rounded-lg bg-white text-black"
                  placeholder="Select airport"
                  required
                />

                {showToDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredArrivalAirports.length > 0 ? (
                      filteredArrivalAirports.map((airport, index) => (
                        <div
                          key={index}
                          className={`p-2 hover:bg-blue-100 cursor-pointer ${
                            toFocusIndex === index ? "bg-blue-200" : ""
                          }`}
                          onClick={() => handleToSelect(airport)}
                        >
                          {airport}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">No airports found</div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-[100px]">
                <label className="block text-white font-semibold mb-1">
                  Depart
                </label>
                <input
                  type="date"
                  min={today}
                  value={departDate}
                  required
                  onChange={(e) => {
                    setDepartDate(e.target.value);
                    setReturnDate("");
                  }}
                  className="w-full p-3 rounded-lg bg-white text-black cursor-pointer"
                />
              </div>

              {tripType !== "oneway" && (
                <div className="flex-1 min-w-[100px]">
                  <label className="block text-white font-semibold mb-1">
                    Return
                  </label>
                  <input
                    type="date"
                    min={departDate || today}
                    value={returnDate}
                    required
                    onChange={(e) => setReturnDate(e.target.value)}
                    disabled={!departDate}
                    className={`w-full p-3 rounded-lg bg-white text-black ${
                      !departDate ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  />
                </div>
              )}

              <div className="flex-1">
                <TravelersCabinClass
                  selectedCabinClass={cabinClass}
                  setSelectedCabinClass={setCabinClass}
                />
              </div>

              <div className="flex-1">
                <button
                  onClick={handleSearch}
                  type="submit"
                  disabled={isSearchDisabled || isLoading}
                  className={`w-full mt-7 px-6 py-3 font-semibold rounded-lg transition 
                                        ${
                                          isSearchDisabled || isLoading
                                            ? "bg-blue-300 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                        }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                        ></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </form>
          )}

          {tripType !== "multicity" && (
            <div className="flex flex-wrap gap-4 items-center mt-4 text-white">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="mr-2" /> Add nearby airports
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="mr-2" /> Flexible Tickets
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-8 pt-5 max-w-7xl">
          <nav className="text-sm">
            <a href="/" className="text-blue-600 hover:underline">
              Home
            </a>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-600">Flights</span>
          </nav>
        </div>
        <FeaturesSection features={flightFeatures} />
      </div>

      <section className="relative w-full py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
            <img
              src={images[currentImage]}
              alt="Scenic view"
              className="w-full h-100 md:h-130 object-cover object-center transition-opacity duration-500 ease-in-out"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-6 text-white bg-black/50">
              <p className="text-lg uppercase font-serif">Grab a deal</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                When the price is low, you'll know
              </h2>
              <p className="mt-2 text-lg font-serif">
                Score cheaper seats with Price Alerts
              </p>
              <a
                href="#faq"
                className="mt-5 px-6 py-1 w-36 bg-white text-black rounded-2xl font-semibold shadow-md hover:bg-gray-500 hover:text-white cursor-pointer text-center inline-block"
              >
                How it works
              </a>
            </div>
          </div>
        </div>
      </section>
      <hr className="border-black"></hr>

      <section className="bg-white">
        <FlightDealsCards />
      </section>

      <section className="bg-gray-100 py-12 px-6 md:px-12">
        <div className="max-w-7xl container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-serif">
            Looking for the best flight deals to anywhere in the world?
          </h2>
          <p className="text-gray-600 mb-10 font-serif">
            It’s easy around here. 100 million travellers use us as their go-to tool...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2645/2645568.png"
                alt="Globe"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-lg font-bold font-serif">
                Search ‘Everywhere’, explore anywhere
              </h3>
              <p className="text-gray-600 mt-2 font-serif">
                Enter your departure airport and travel dates...
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2353/2353181.png"
                alt="Transparent Pricing"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-lg font-bold font-serif">
                Pay less, go further with transparent pricing
              </h3>
              <p className="text-gray-600 mt-2 font-serif">
                The cheapest flight deals. No hidden fees...
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2529/2529521.png"
                alt="Price Alerts"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-lg font-bold font-serif">
                Book when it's best with Price Alerts
              </h3>
              <p className="text-gray-600 mt-2 font-serif">
                Found your flight, but not quite ready to book...
              </p>
            </div>
          </div>
        </div>
      </section>
      <hr className="bg-black"></hr>

      <section className="bg-white">
        <TravelDeals />
      </section>

      <section id="faq" className="bg-white">
        <FAQSection />
      </section>

      <Footer />
    </section>
  );
}