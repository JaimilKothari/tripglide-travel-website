import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HotelDetails = () => {
  const { hotel, arrival } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize state with location.state or sessionStorage
  const sessionBookingData = JSON.parse(sessionStorage.getItem('hotelBookingDetails')) || {};
  const {
    checkInDate = sessionBookingData.checkInDate,
    checkOutDate = sessionBookingData.checkOutDate,
    adults = sessionBookingData.adults || 1,
    children = sessionBookingData.children || 0,
    rooms = sessionBookingData.rooms || 1,
  } = location.state || {};

  const [hotelData, setHotelData] = useState({ Deluxe: null, Executive: null, Suite: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelData = async () => {
      setLoading(true);
      try {
        const roomTypes = ['Deluxe', 'Executive', 'Suite'];
        const responses = await Promise.all(
          roomTypes.map((type) =>
            axios.get('http://localhost:5003/all', {
              params: {
                hotel: decodeURIComponent(hotel),
                arrival: decodeURIComponent(arrival),
                bedroomtype: type,
              },
            })
          )
        );

        const newHotelData = {};
        responses.forEach((response, index) => {
          const hotels = response.data.all || [];
          newHotelData[roomTypes[index]] = hotels.length > 0 ? hotels[0] : null;
        });

        setHotelData(newHotelData);

        if (!newHotelData.Deluxe && !newHotelData.Executive && !newHotelData.Suite) {
          setError('No rooms found for this hotel.');
        }
      } catch (err) {
        console.error('Error fetching hotel data:', err);
        setError('Failed to fetch hotel details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [hotel, arrival]);

  // Function to initiate Stripe checkout
  const initiateStripeCheckout = async (bookingData) => {
    try {
      const response = await axios.post('http://localhost:5003/create-checkout-session', bookingData);
      const sessionId = response.data.id;

      const stripe = window.Stripe('pk_test_51RBDzAQVbUKIjAtM0sKQOZ3Z3ErNkHUXooqIOCQkMUzNYsl85hKfQhevmDlAB46ebEcGSrvOquL507u2t6OZVu1T00E8wJhZTD');
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Stripe redirect error:', error);
        alert('Failed to redirect to payment page. Please try again.');
      }
    } catch (err) {
      console.error('Error initiating checkout:', err);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading hotel details...</div>;
  }

  if (error) {
    return <div className="text-center py-8">{error}</div>;
  }

  if (!checkInDate || !checkOutDate) {
    return (
      <div className="text-center py-8">
        Missing booking details. Please try again from the hotel search page.
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const renderRoomSection = (roomType, data) => {
    if (!data) return null;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    const pricePerNight = data.totalpricepernight;
    const hotelCharges = pricePerNight * nights * rooms;
    const discountPerRoom = 2240;
    const discount = discountPerRoom * rooms;
    const gstPerRoom = 1440;
    const gst = gstPerRoom * rooms;
    const convenienceFeePerRoom = 300;
    const convenienceFee = convenienceFeePerRoom * rooms;
    const totalAmount = hotelCharges - discount + gst + convenienceFee;
    
    const amenities = data.amenities ? data.amenities.split(',').map((am) => am.trim()) : [];

    // Define specific images for each room type
    const roomImages = {
      Deluxe: '/images/Hotel/deluxe_room.jpg', // Deluxe Room
      Executive: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80', // Executive Room
      Suite: '/images/Hotel/suite_romm.jpg', // Suite Room
    };

    const handleBookNow = () => {
      const bookingData = {
        hotelName: data.hotel,
        totalAmount: totalAmount,
        checkInDate,
        checkOutDate,
        adults,
        children,
        rooms,
        roomType,
        pricePerNight,
        arrival: data.arrival,
      };

      // Check if user is logged in
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        // Not logged in, navigate to login with booking data
        navigate('/login', {
          state: {
            redirectTo: `/hotel-details/${encodeURIComponent(hotel)}/${encodeURIComponent(arrival)}`,
            bookingData,
            checkInDate,
            checkOutDate,
            adults,
            children,
            rooms,
          },
        });
        return;
      }

      // User is logged in, store booking data and proceed to Stripe
      sessionStorage.setItem('hotelBookingDetails', JSON.stringify(bookingData));
      initiateStripeCheckout(bookingData);
    };

    return (
      <div className="mb-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-xl font-semibold mb-4">{roomType} Room</h3>
          <div className="flex gap-4">
            <div className="w-1/3">
              <img
                src={roomImages[roomType]} // Use specific image based on room type
                alt={`${data.hotel} ${roomType}`}
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{data.hotel}</h2>
              <p className="text-sm text-gray-600">{data.arrival}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-yellow-500">{'★'.repeat(Math.ceil(parseFloat(data.rating)))}</span>
                <span className="text-sm text-gray-600">{data.rating}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Check-In</p>
              <p className="text-blue-600 font-semibold">
                {new Date(checkInDate).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' })} | 02:00 PM
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Check-Out</p>
              <p className="text-blue-600 font-semibold">
                {new Date(checkOutDate).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' })} | 11:00 AM
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{nights}N/{nights + 1}D</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{adults + children} Guests | {rooms} Room{rooms > 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Room Details</h3>
            <p className="text-sm text-gray-600">{rooms} x {data.bedroomtype} - Only Room</p>
            <p className="text-sm text-green-600 flex items-center gap-1">
              <span>✔</span> {amenities.includes('Wi-Fi') ? 'Complimentary WiFi' : 'WiFi Available'}
            </p>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Cancellation Policy</h3>
            <p className="text-sm text-gray-600">Cancellation policy details can be added here if available.</p>
          </div>
        </div>

        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-4">Price Breakup</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Room Rate</p>
              <p className="text-sm font-semibold">₹{pricePerNight.toLocaleString()} per night</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Hotel Charges ({rooms} Room{rooms > 1 ? 's' : ''} × {nights} Night{nights > 1 ? 's' : ''})</p>
              <p className="text-sm font-semibold">₹{hotelCharges.toLocaleString()}</p>
            </div>
            <div className="flex justify-between text-green-600">
              <p className="text-sm">Discounts</p>
              <p className="text-sm font-semibold">(-) ₹{discount.toLocaleString()}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Hotel GST</p>
              <p className="text-sm font-semibold">₹{gst.toLocaleString()}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Convenience Fee</p>
              <p className="text-sm font-semibold">₹{convenienceFee.toLocaleString()}</p>
            </div>
            <div className="flex justify-between border-t pt-2">
              <p className="text-lg font-semibold">Total Amount</p>
              <p className="text-lg font-semibold">₹{totalAmount.toLocaleString()}</p>
            </div>
            <div className="flex justify-between text-green-600">
              <p className="text-sm">Your Savings</p>
              <p className="text-sm font-semibold">₹{discount.toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={handleBookNow}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Book Now
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-2 text-sm text-gray-600">
        <span>Home</span>
        <span className="mx-1">{'>'}</span>
        <span>Hotels in {decodeURIComponent(arrival)}</span>
        <span className="mx-1">{'>'}</span>
        <span>{decodeURIComponent(hotel)}</span>
        <span className="mx-1">{'>'}</span>
        <span>Review Hotel Booking</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {renderRoomSection('Deluxe', hotelData.Deluxe)}
        {renderRoomSection('Executive', hotelData.Executive)}
        {renderRoomSection('Suite', hotelData.Suite)}
      </div>
    </div>
  );
};

export default HotelDetails;