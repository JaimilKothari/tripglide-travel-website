import { useState } from "react";

const flightDeals = [
  { city: "Agra", country: "India", date: "Sat, 5 Apr", returnDate: "Sun, 6 Apr", price: "₹ 878", image: "https://i.pinimg.com/474x/a2/45/13/a245133998244908efecadf2798e5e5f.jpg", link: "/" },
  { city: "Kuala Lumpur", country: "Malaysia", date: "Tue, 18 Mar", returnDate: "Sat, 22 Mar", price: "₹ 7,248", image: "https://i.pinimg.com/474x/d4/3e/f3/d43ef32953c8cc10441255eb58a66d34.jpg", link: "/" },
  { city: "Muscat", country: "Oman", date: "Fri, 14 Mar", returnDate: "Sun, 16 Mar", price: "₹ 9,451", image: "https://i.pinimg.com/474x/e6/30/66/e6306613b1ecb7afc1d0b9e3e5c41a62.jpg", link: "/" },
  { city: "Dhaka", country: "Bangladesh", date: "Thu, 13 Mar", returnDate: "Fri, 14 Mar", price: "₹ 9,646", image: "https://i.pinimg.com/474x/6f/64/7c/6f647c4f9940c7b9fed6cd336e537374.jpg", link: "/" },
  { city: "Colombo", country: "Sri Lanka", date: "Mon, 5 May", returnDate: "Wed, 7 May", price: "₹ 11,075", image: "https://i.pinimg.com/474x/3a/84/1a/3a841a66007cae4724025e451208ef44.jpg", link: "/" },
  { city: "Singapore", country: "Singapore", date: "Fri, 28 Mar", returnDate: "Wed, 2 Apr", price: "₹ 12,356", image: "https://i.pinimg.com/474x/1f/7a/36/1f7a36ee1580c0fc154ba480a16d5ec1.jpg", link: "/" },
  { city: "Bali", country: "Indonesia", date: "Fri, 8 Apr", returnDate: "Mon, 12 Apr", price: "₹ 15,450", image: "https://i.pinimg.com/474x/0b/40/7f/0b407f324f3948b4b5878e834d4839a2.jpg", link: "/" },
  { city: "Istanbul", country: "Turkey", date: "Sat, 10 May", returnDate: "Thu, 15 May", price: "₹ 19,800", image: "https://i.pinimg.com/474x/4d/5c/d1/4d5cd1565e04ee98ec74056275136d1e.jpg", link: "/" },
  { city: "Paris", country: "France", date: "Sun, 15 Jun", returnDate: "Sat, 22 Jun", price: "₹ 34,500", image: "https://i.pinimg.com/474x/6a/99/ee/6a99ee843798375c5f7049316e8d31ed.jpg", link: "/" },
//   { city: "Ras al Khaimah", country: "UAE", date: "Wed, 12 Mar", returnDate: "Thu, 13 Mar", price: "₹ 13,730", image: "https://i.pinimg.com/474x/b5/b9/50/b5b9508f565c91e781714445beca26e4.jpg", link: "/" },
//   { city: "Phuket", country: "Thailand", date: "Mon, 5 May", returnDate: "Fri, 9 May", price: "₹ 13,933", image: "https://i.pinimg.com/474x/2a/0f/c5/2a0fc56c63ed836b7a4e2151179c2edf.jpg", link: "/" },
//   { city: "Kathmandu", country: "Nepal", date: "Thu, 3 Apr", returnDate: "Wed, 9 Apr", price: "₹ 14,941", image: "https://i.pinimg.com/474x/9e/e7/fa/9ee7fa0d2fcb2be5a25a40e9cdb0745c.jpg", link: "/" },
];

const FlightDealsCards = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleDeals = showAll ? flightDeals : flightDeals.slice(0, 6);

  return (
    <div className="max-w-7xl container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 font-serif mt-5"><b>Flight deals from India</b></h2>
      <p className="font-serif mb-5 text-gray-800">Here are the flight deals with the lowest prices. Act fast – they all depart within the next three months.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
        {visibleDeals.map((deal, index) => (
          <a key={index} href={deal.link} target="_blank" rel="noopener noreferrer" className="block">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl hover:border-b transition duration-300">
              <img src={deal.image} alt={deal.city} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold font-serif">{deal.city}</h3>
                <p className="text-gray-600 font-serif">{deal.country}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-800 font-normal">{deal.date} - {deal.returnDate}</p>
                  <span className="text-gray-700 font-normal">Direct</span>
                </div>
                <p className="mt-2 text-blue-600 font-normal">from {deal.price}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="text-center mt-6">
      <button 
          onClick={() => setShowAll(!showAll)} 
          className="text-blue-600 mt-4 mb-4 cursor-pointer font-semibold hover:underline">
          {showAll ? "See fewer deals" : "See more deals"}
        </button>
      </div>
    </div>
  );
};

export default FlightDealsCards;