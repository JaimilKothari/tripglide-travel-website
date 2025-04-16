import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const destinations = [
  { image: "/images/Editable India Boarding Pass Plane ticket.jpeg", city: "TajMahal, India" },
  { image: "/images/Editable Paris Plane Boarding Pass Ticket.jpeg", city: "Paris, France" },
  { image: "/images/Editable New York Boarding Pass Plane ticket.jpeg", city: "New York, USA" },
  { image: "/images/Surprise Tokyo Boarding Pass Gift Certificate Inv.jpeg", city: "Tokyo, Japan" },
  { image: "/images/Editable Dubai Boarding Pass Plane ticket.jpeg", city: "Dubai, UAE" },
  { image: "/images/Editable London Plane Boarding Pass Ticket.jpeg", city: "London, UK" },
  { image: "/images/Editable Canada Boarding Pass Plane ticket.jpeg", city: "Toronto, Canada" },
  { image: "/images/Editable Australia Boarding Pass Plane ticket.jpeg", city: "Sydney, Australia" },
  { image: "/images/Surprise Berlin Plane Boarding Pass Ticket.jpeg", city: "Berlin, Germany" },
  { image: "/images/Editable Singapore Plane ticket, Singapore Trip.jpeg", city: "Singapore" },
  { image: "/images/Editable New Zealand Plane ticket, New Zealand.jpeg", city: "New Zealand" },
  { image: "/images/Editable Switzerland Plane ticket, Switzerland Invitation _ Zazzle.jpeg", city: "Switzerland" },
  { image: "/images/Editable Oslo Plane ticket, Norway Trip.jpeg", city: "Oslo, Norway" },
  { image: "/images/Editable Greece Boarding Pass Plane ticket.jpeg", city: "Greece" },
  { image: "/images/Editable Bali Plane ticket, Bali Trip.jpeg", city: "Bali, Indonesia" },
];

const TravelDeals = () => {
  return (
    <section className="py-20 bg-white container mx-auto max-w-7xl">
      <h2 className="text-center text-3xl font-bold font-serif mb-6 text-black">Popular Destinations</h2>

      <div className="max-w-7xl conainer mx-auto">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="rounded-lg overflow-hidden"
        >
          <style>
        {`
          .swiper-pagination-bullet {
            background-color: darkblue !important; 
            opacity: 0.5;
          }
          .swiper-pagination-bullet-active {
            background-color: darkblue !important;
            opacity: 1;
          }
          .swiper-button-next, .swiper-button-prev {
            color: darkblue !important;
          }
        `}
      </style>

          {destinations.map((dest, index) => (
            <SwiperSlide key={index} className="relative group">
              {/* Destination Image */}
              <img
                src={dest.image}
                alt={dest.city}
                className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105 relative z-10"
              />
              {/* Text Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-0 transition-opacity duration-300 group-hover:bg-opacity-50">
                <h3 className="text-white text-lg font-semibold relative z-20">{dest.city}</h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TravelDeals;
