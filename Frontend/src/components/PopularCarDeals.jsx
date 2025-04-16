import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const carDeals = [
  {
    city: "Dubai",
    image: "/images/dubai.jpeg",
    price: "₹1,135",
  },
  {
    city: "Bangkok",
    image: "/images/bangkok.jpeg",
    price: "₹1,729",
  },
  {
    city: "Pune",
    image: "/images/pune.jpeg",
    price: "₹2,794",
  },
  {
    city: "Paris",
    image: "/images/paris.jpeg",
    price: "₹3,200",
  },
  {
    city: "New York",
    image: "/images/new york.jpeg",
    price: "₹4,150",
  },
  {
    city: "Tokyo",
    image: "/images/tokyo.jpeg",
    price: "₹3,900",
  },
  {
    city: "Bengaluru",
    image: "/images/bengaluru.jpeg",
    price: "₹6,370",
  },
];

const PopularCarDeals = () => {
  return (
    <div className="w-full px-10 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Popular car rental destinations</h2>
        <div className="flex gap-2">
          <button className="swiper-button-prev-custom text-gray-500 hover:text-black">
            <FaChevronLeft size={20} />
          </button>
          <button className="swiper-button-next-custom text-gray-500 hover:text-black">
            <FaChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        breakpoints={{
          320: { slidesPerView: 1, slidesPerGroup: 1 },
          768: { slidesPerView: 2, slidesPerGroup: 2 },
          1024: { slidesPerView: 3, slidesPerGroup: 3 },
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        className="overflow-hidden"
      >
        {carDeals.map((deal, index) => (
          <SwiperSlide key={index}>
            <div className="cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img src={deal.image} alt={deal.city} className="w-full h-48 object-cover" />
              <div className="p-4 bg-white">
                <h3 className="text-lg font-semibold">Car hire in {deal.city}</h3>
                <p className="text-gray-600 text-sm">Most popular car type: Economy</p>
                <p className="text-black font-bold mt-2">From {deal.price}  per day</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PopularCarDeals;
