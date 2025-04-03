import React, { useState, useEffect, useRef } from "react";
import TravelersCabinClass from "./TravelersCabinClass";

const FlightSearchFormPopup = ({
  isOpen,
  onClose,
  tripType,
  setTripType,
  from,
  setFrom,
  to,
  setTo,
  departDate,
  setDepartDate,
  returnDate,
  setReturnDate,
  cabinClass,
  setCabinClass,
  handleSearch,
  multiCityFlights,
  setMultiCityFlights,
}) => {
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [departureAirports, setDepartureAirports] = useState([]);
  const [arrivalAirports, setArrivalAirports] = useState([]);
  const [filteredDepartureAirports, setFilteredDepartureAirports] = useState([]);
  const [filteredArrivalAirports, setFilteredArrivalAirports] = useState([]);
  const [multiCityDropdowns, setMultiCityDropdowns] = useState([]);
  const [fromFocusIndex, setFromFocusIndex] = useState(-1);
  const [toFocusIndex, setToFocusIndex] = useState(-1);
  const [multiCityFocusIndices, setMultiCityFocusIndices] = useState([]);

  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const multiCityRefs = useRef([]);

  const today = new Date().toISOString().split("T")[0];

  // Fetch airport data from Flask API
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch("http://localhost:5000/get_flights");
        const data = await response.json();
        if (data.departure_airport && data.arrival_airport) {
          setDepartureAirports(data.departure_airport);
          setArrivalAirports(data.arrival_airport);
          setFilteredDepartureAirports(data.departure_airport);
          setFilteredArrivalAirports(data.arrival_airport);
        } else {
          console.error("No airports found in API response");
        }
      } catch (error) {
        console.error("Error fetching airports:", error);
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
        multiCityFlights.map((flight) => ({
          showFrom: false,
          showTo: false,
          filteredFrom: departureAirports.filter((a) =>
            a.toLowerCase().includes(flight.from.toLowerCase()) && a !== flight.to
          ),
          filteredTo: arrivalAirports.filter((a) =>
            a.toLowerCase().includes(flight.to.toLowerCase()) && a !== flight.from
          ),
        }))
      );
      setMultiCityFocusIndices(multiCityFlights.map(() => ({ from: -1, to: -1 })));
    } else {
      setMultiCityDropdowns([]);
      setMultiCityFocusIndices([]);
    }
  }, [multiCityFlights, departureAirports, arrivalAirports]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tripType === "multicity") {
      handleSearch(e, multiCityFlights);
    } else {
      handleSearch(e);
    }
    onClose();
  };

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
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
  };

  const handleMultiCityToSelect = (airport, index) => {
    const updatedFlights = [...multiCityFlights];
    updatedFlights[index].to = airport;
    setMultiCityFlights(updatedFlights);
    const updatedDropdowns = [...multiCityDropdowns];
    updatedDropdowns[index].showTo = false;
    setMultiCityDropdowns(updatedDropdowns);
  };

  const toggleMultiCityDropdown = (index, type) => {
    const updatedDropdowns = multiCityDropdowns.map((dropdown, i) => ({
      ...dropdown,
      showFrom: i === index && type === "from" ? !dropdown.showFrom : false,
      showTo: i === index && type === "to" ? !dropdown.showTo : false,
    }));
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
    const dropdown = multiCityDropdowns[index] || {};
    const focusIndices = multiCityFocusIndices[index] || { from: -1, to: -1 };
    const filteredList = type === "from" ? dropdown.filteredFrom : dropdown.filteredTo;
    const isDropdownOpen = type === "from" ? dropdown.showFrom : dropdown.showTo;
    const focusIndex = type === "from" ? focusIndices.from : focusIndices.to;

    if (!isDropdownOpen || !filteredList) return;

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

  const isMultiCityValid = multiCityFlights.every(
    (flight) => flight.from && flight.to && flight.depart
  );
  const isOneWayValid = from && to && departDate;
  const isReturnValid = isOneWayValid && returnDate;
  const isSearchDisabled =
    (tripType === "multicity" && !isMultiCityValid) ||
    (tripType === "oneway" && !isOneWayValid) ||
    (tripType === "return" && !isReturnValid);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromInputRef.current && !fromInputRef.current.contains(event.target)) {
        setShowFromDropdown(false);
      }
      if (toInputRef.current && !toInputRef.current.contains(event.target)) {
        setShowToDropdown(false);
      }
      if (multiCityRefs.current.length > 0) {
        const updatedDropdowns = multiCityDropdowns.map((dropdown) => ({
          ...dropdown,
          showFrom: false,
          showTo: false,
        }));
        setMultiCityDropdowns(updatedDropdowns);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [multiCityDropdowns]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#001533] p-6 rounded-2xl shadow-lg w-full max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-white text-2xl"
        >
          ✕
        </button>

        <div className="flex gap-6 text-white mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="tripType"
              className="mr-2"
              checked={tripType === "return"}
              onChange={() => setTripType("return")}
            />
            Return
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="tripType"
              className="mr-2"
              checked={tripType === "oneway"}
              onChange={() => setTripType("oneway")}
            />
            One way
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="tripType"
              className="mr-2"
              checked={tripType === "multicity"}
              onChange={() => setTripType("multicity")}
            />
            Multi-city
          </label>
        </div>

        {tripType === "multicity" ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {multiCityFlights.map((flight, index) => (
              <div
                key={flight.id}
                className="flex flex-wrap md:flex-nowrap gap-4 items-center"
              >
                <div
                  className="flex-1 min-w-[100px] relative"
                  ref={(el) =>
                    (multiCityRefs.current[index] = {
                      ...multiCityRefs.current[index],
                      fromRef: el,
                    })
                  }
                >
                  <label className="block text-white font-semibold mb-1">From</label>
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
                    placeholder="Select departure airport"
                    required
                  />
                  {multiCityDropdowns[index]?.showFrom && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {multiCityDropdowns[index]?.filteredFrom.length > 0 ? (
                        multiCityDropdowns[index].filteredFrom.map((airport, idx) => (
                          <div
                            key={idx}
                            className={`p-2 hover:bg-blue-100 cursor-pointer ${
                              multiCityFocusIndices[index]?.from === idx ? "bg-blue-200" : ""
                            }`}
                            onClick={() => handleMultiCityFromSelect(airport, index)}
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

                <div
                  className="flex-1 min-w-[100px] relative"
                  ref={(el) =>
                    (multiCityRefs.current[index] = {
                      ...multiCityRefs.current[index],
                      toRef: el,
                    })
                  }
                >
                  <label className="block text-white font-semibold mb-1">To</label>
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
                    placeholder="Select arrival airport"
                    required
                  />
                  {multiCityDropdowns[index]?.showTo && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {multiCityDropdowns[index]?.filteredTo.length > 0 ? (
                        multiCityDropdowns[index].filteredTo.map((airport, idx) => (
                          <div
                            key={idx}
                            className={`p-2 hover:bg-blue-100 cursor-pointer ${
                              multiCityFocusIndices[index]?.to === idx ? "bg-blue-200" : ""
                            }`}
                            onClick={() => handleMultiCityToSelect(airport, index)}
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

                <input
                  type="date"
                  min={index === 0 ? today : multiCityFlights[index - 1].depart || today}
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
                  disabled={multiCityFlights.length <= 1}
                  className={`text-white px-4 py-2 mt-7 rounded-lg transition ${
                    multiCityFlights.length <= 1
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
                type="submit"
                disabled={isSearchDisabled}
                className={`mt-5 px-6 py-3 font-semibold rounded-lg transition ${
                  isSearchDisabled
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Search
              </button>
            </div>
          </form>
        ) : (
          <form
            className="flex flex-wrap gap-2 sm:gap-4 items-center w-full"
            onSubmit={handleSubmit}
          >
            <div className="flex-1 min-w-[100px] relative" ref={fromInputRef}>
              <label className="block text-white font-semibold mb-1">From</label>
              <input
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setShowFromDropdown(true);
                }}
                onClick={() => {
                  setShowFromDropdown(true);
                  setShowToDropdown(false);
                }}
                onKeyDown={handleFromKeyDown}
                className="w-full p-3 rounded-lg bg-white text-black"
                placeholder="Select departure airport"
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
              <label className="block text-white font-semibold mb-1">To</label>
              <input
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setShowToDropdown(true);
                }}
                onClick={() => {
                  setShowToDropdown(true);
                  setShowFromDropdown(false);
                }}
                onKeyDown={handleToKeyDown}
                className="w-full p-3 rounded-lg bg-white text-black"
                placeholder="Select arrival airport"
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
              <label className="block text-white font-semibold mb-1">Depart</label>
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
                <label className="block text-white font-semibold mb-1">Return</label>
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
                type="submit"
                disabled={isSearchDisabled}
                className={`w-full mt-7 px-6 py-3 font-semibold rounded-lg transition ${
                  isSearchDisabled
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                }`}
              >
                Search
              </button>
            </div>
          </form>
        )}

        {tripType !== "multicity" && (
          <div className="flex flex-wrap gap-4 items-center mt-4 text-white">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="mr-2" /> Add nearby airports
            </label>
            {/* <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="mr-2" /> Direct flights only
            </label> */}
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="mr-2" /> Flexible Tickets
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearchFormPopup;