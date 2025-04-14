import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaStar,
  FaCoffee,
  FaWifi,
  FaSwimmingPool,
  FaWineGlass,
  FaDumbbell,
  FaSpa,
  FaShuttleVan,
  FaUtensils,
  FaParking,
  FaTv,
  FaConciergeBell,
  FaSnowflake,
  FaHotTub,
  FaPaw,
  FaChild,
  FaSmokingBan,
  FaWheelchair,
  FaBusinessTime,
  FaTshirt,
  FaBell,           // For Room Service
  FaCar,            // For Valet Parking
  FaUserTie,        // For Private Butler
  FaHelicopter,     // For Helipad
  FaCocktail,       // For Rooftop Lounge
  FaCarSide,        // For Limousine Service
  FaUsers,          // For Meeting Rooms
} from 'react-icons/fa';
import HotelFilter from './HotelFilter';

const HotelCard = ({ location, checkInDate, checkOutDate, adults, children, rooms }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const amenityIcons = {
    "Free Breakfast": <FaCoffee className="w-4 h-4 text-green-600" />,
    "Pool": <FaSwimmingPool className="w-4 h-4 text-green-600" />,
    "Bar": <FaWineGlass className="w-4 h-4 text-green-600" />,
    "Gym": <FaDumbbell className="w-4 h-4 text-green-600" />,
    "Spa": <FaSpa className="w-4 h-4 text-green-600" />,
    "Airport Shuttle": <FaShuttleVan className="w-4 h-4 text-green-600" />,
    "Restaurant": <FaUtensils className="w-4 h-4 text-green-600" />,
    "Concierge": <FaConciergeBell className="w-4 h-4 text-green-600" />,
    "Air Conditioning": <FaSnowflake className="w-4 h-4 text-green-600" />,
    "Sauna": <FaHotTub className="w-4 h-4 text-green-600" />,
    "Pet Friendly": <FaPaw className="w-4 h-4 text-green-600" />,
    "Kids Activities": <FaChild className="w-4 h-4 text-green-600" />,
    "Non-Smoking": <FaSmokingBan className="w-4 h-4 text-green-600" />,
    "Wheelchair Accessible": <FaWheelchair className="w-4 h-4 text-green-600" />,
    "Business Center": <FaBusinessTime className="w-4 h-4 text-green-600" />,
    "Laundry": <FaTshirt className="w-4 h-4 text-green-600" />,
    "Room Service": <FaBell className="w-4 h-4 text-green-600" />,
    "Valet Parking": <FaCar className="w-4 h-4 text-green-600" />,
    "Private Butler": <FaUserTie className="w-4 h-4 text-green-600" />,
    "Helipad": <FaHelicopter className="w-4 h-4 text-green-600" />,
    "Rooftop Lounge": <FaCocktail className="w-4 h-4 text-green-600" />,
    "Limousine Service": <FaCarSide className="w-4 h-4 text-green-600" />,
    "Meeting Rooms": <FaUsers className="w-4 h-4 text-green-600" />,
  };

  const fetchHotels = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (location) queryParams.append('arrival', location);

      if (filters.price?.length > 0 && !filters.price.includes('all')) {
        filters.price.forEach((price) => {
          switch (price) {
            case 'below2000': queryParams.append('totalpricepernight', '0-2000'); break;
            case '2000to5000': queryParams.append('totalpricepernight', '2000-5000'); break;
            case '5000to10000': queryParams.append('totalpricepernight', '5000-10000'); break;
            case 'above10000': queryParams.append('totalpricepernight', '10000+'); break;
            default: break;
          }
        });
      }

      if (filters.rating?.length > 0 && !filters.rating.includes('all')) {
        filters.rating.forEach((rating) => queryParams.append('rating', rating));
      }

      if (filters.amenities?.length > 0) {
        filters.amenities.forEach((amenity) => queryParams.append('amenities', amenity));
      }

      const response = await fetch(`http://localhost:5001/all?${queryParams.toString()}`);
      const data = await response.json();
      setHotels(data.all || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchHotels();
  }, [location, fetchHotels]);

  const handleFilterChange = useCallback((filters) => {
    fetchHotels(filters);
  }, [fetchHotels]);

  const renderStars = (rating) => {
    const starCount = Math.ceil(parseFloat(rating));
    return Array.from({ length: starCount }).map((_, i) => (
      <FaStar key={i} className="text-yellow-500 w-4 h-4" aria-hidden="true" />
    ));
  };

  const handleChooseRoom = (hotel, arrival) => {
    navigate(`/hotel-details/${encodeURIComponent(hotel)}/${encodeURIComponent(arrival)}`, {
      state: {
        checkInDate,
        checkOutDate,
        adults,
        children,
        rooms,
        hotelName: hotel,
        arrival: arrival,
      },
    });
  };

  // List of all possible amenities excluding "Wi-Fi", "TV", "Parking", "Suite"
  const allAmenities = [
    "Free Breakfast", "Pool", "Bar", "Gym", "Spa", "Airport Shuttle", "Restaurant",
    "Concierge", "Air Conditioning", "Sauna", "Pet Friendly", "Kids Activities",
    "Non-Smoking", "Wheelchair Accessible", "Business Center", "Laundry"
  ];

  const getRandomAmenities = (hotelAmenities, hotelIndex) => {
    const excludedAmenities = ["Wi-Fi", "TV", "Parking", "Suites"];
    let availableAmenities = hotelAmenities
      ? hotelAmenities.split(',').map((a) => a.trim()).filter((a) => !excludedAmenities.includes(a))
      : [];

    const priorityAmenities = availableAmenities.filter((a) => !["Pool", "Gym", "Spa"].includes(a));
    const commonAmenities = availableAmenities.filter((a) => ["Pool", "Gym", "Spa"].includes(a));

    let finalAmenities = [...priorityAmenities];
    const remainingCount = 8 - finalAmenities.length;

    if (remainingCount > 0) {
      finalAmenities = [...finalAmenities, ...commonAmenities.slice(0, Math.min(remainingCount, commonAmenities.length))];
    }

    if (finalAmenities.length < 8) {
      const additionalAmenities = allAmenities
        .filter((a) => !finalAmenities.includes(a))
        .sort(() => 0.5 - Math.random())
        .slice(0, 8 - finalAmenities.length);
      finalAmenities = [...finalAmenities, ...additionalAmenities];
    }

    return finalAmenities.sort(() => 0.5 - Math.random() - hotelIndex * 0.1).slice(0, 8);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <HotelFilter onFilterChange={handleFilterChange} />
        </div>

        <div className="w-full md:w-3/4 flex flex-col gap-4">
          <h3 className="text-xl font-semibold mb-4">Available Hotels in {location || 'Any Location'}</h3>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading hotels...</div>
          ) : hotels.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No hotels found for this location.</div>
          ) : (
            hotels.map((hotel, index) => {
              const displayAmenities = getRandomAmenities(hotel.amenities, index);
              return (
                <div
                  key={hotel.hotel + hotel.arrival}
                  className="rounded-xl shadow-sm flex flex-col md:flex-row bg-white overflow-hidden w-full h-[300px] md:h-64"
                >
                  <div className="w-full md:w-[30%] h-56 md:h-full">
                    <img
                      src={hotel.images ? (hotel.images.startsWith('http') ? hotel.images : `http://localhost:5001/images/${hotel.images}`) : '/images/Hotel/placeholder.jpg'}
                      alt={hotel.hotel}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => (e.target.src = '/images/Hotel/placeholder.jpg')}
                    />
                  </div>
                  <div className="flex-1 p-5 flex flex-col h-full">
                    <div>
                      <h3 className="text-lg font-semibold">{hotel.hotel}</h3>
                      <div className="flex items-center gap-1 mt-0.5" aria-label={`Rating: ${hotel.rating} out of 5`}>
                        {renderStars(hotel.rating)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{hotel.arrival}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mt-4">
                      {displayAmenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-1">
                          {amenityIcons[amenity] || <span className="w-4 h-4" />}
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-center p-3 md:w-56 border-t md:border-t-0 md:border-l border-gray-300 h-full">
                    <div className="text-center mb-3">
                      <div className="text-2xl font-bold text-gray-800 mb-1">
                        ₹{parseFloat(hotel.totalpricepernight).toLocaleString()} <span className="text-sm font-normal text-gray-600">/ night</span>
                      </div>
                      <div className="text-xs text-gray-700 font-semibold">
                        +₹{parseFloat(hotel.totalcost - hotel.totalpricepernight).toLocaleString()} taxes & fees
                      </div>
                    </div>
                    <button
                      className="bg-blue-600 text-white text-sm py-2 px-4 rounded hover:bg-blue-700 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Choose room at ${hotel.hotel}`}
                      onClick={() => handleChooseRoom(hotel.hotel, hotel.arrival)}
                    >
                      Choose Room
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelCard;