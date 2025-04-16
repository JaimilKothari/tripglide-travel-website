import React from "react";

function HotelSearchPopup({
  isOpen,
  onClose,
  destination,
  setDestination,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  adults,
  setAdults,
  children,
  setChildren,
  rooms,
  setRooms,
}) {
  if (!isOpen) return null; // Hide popup when not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Popup Container */}
      <div className="bg-[#0C1D3D] text-white w-full max-w-lg md:max-w-2xl rounded-lg p-6 shadow-lg relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-1 right-1 text-gray-400 hover:text-white text-xl">
          ✕
        </button>

        {/* Search Bar UI (Matches Hotel Search) */}
        <div className="flex flex-col gap-4">
          {/* Destination Input */}
          <input
            type="text"
            placeholder="Enter Destination"
            className="w-full p-3 rounded-md bg-white text-black placeholder-gray-400"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          {/* Dates */}
          <div className="flex gap-3">
            <input
              type="date"
              className="flex-1 p-3 rounded-md bg-white text-black"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
            />
            <input
              type="date"
              className="flex-1 p-3 rounded-md bg-white text-black"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
            />
          </div>

          {/* Guests & Rooms */}
          <div className="flex justify-between">
            <div className="flex flex-col">
              <label>Adults</label>
              <input
                type="number"
                min="1"
                className="w-16 p-2 rounded-md bg-white text-black text-center"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label>Children</label>
              <input
                type="number"
                min="0"
                className="w-16 p-2 rounded-md bg-white text-black text-center"
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label>Rooms</label>
              <input
                type="number"
                min="1"
                className="w-16 p-2 rounded-md bg-white text-black text-center"
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-md text-white font-semibold"
          >
            Search Hotels
          </button>
        </div>
      </div>
    </div>
  );
}

export default HotelSearchPopup;
