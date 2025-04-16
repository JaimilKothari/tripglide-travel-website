import React, { useState, useEffect } from "react";

const hotelFaqs = [
  { question: "How do I book a hotel with Tripglide?", answer: "We compare hotel prices from top booking sites. Once you find the best deal, we redirect you to the provider’s site to complete your booking." },
  { question: "Can I book a hotel with free cancellation?", answer: "Yes! Many hotel options on Tripglide offer free cancellation. Always check the provider’s cancellation policy before booking." },
  { question: "Do I need a credit card to book a hotel?", answer: "Most hotels require a credit card to confirm your booking, though some allow alternative payment methods. Check the provider’s terms." },
  { question: "Are taxes and fees included in the hotel price?", answer: "Tripglide shows total prices where possible, but some providers may add taxes and fees. Always review the final price before booking." },
  { question: "Can I modify or cancel my hotel booking?", answer: "This depends on the hotel’s policy. If free cancellation is available, you can modify or cancel your booking without extra fees before the deadline." },
  { question: "How do I find the best hotel deals?", answer: "Use Tripglide’s filters to compare prices, star ratings, guest reviews, and amenities. Booking early often gets you the best rates." },
  { question: "Are there any hidden charges?", answer: "Tripglide aims for price transparency. However, some hotels may charge additional fees like resort fees. Check the booking details carefully." },
  { question: "Can I book family rooms or suites?", answer: "Yes! Tripglide allows you to search for specific room types including family rooms, suites, and apartments based on your preferences." },
  { question: "Is breakfast included in the hotel price?", answer: "Some hotels include breakfast in the room rate, while others charge extra. Filter your search to find hotels offering free breakfast." },
  { question: "Can I book hotels for group stays?", answer: "Yes, many hotels accommodate group bookings. It’s best to contact the hotel directly for special rates and arrangements." }
];

const HotelFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    console.log("openIndex changed to:", openIndex);
  }, [openIndex]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-8 text-center">Hotel Booking with Tripglide</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotelFaqs.map((faq, index) => (
          <div key={index} className="border-b pb-4">
            <button
              className="w-full text-left font-semibold text-base sm:text-lg py-3 flex justify-between items-center focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
            </button>
            <div
              className={`transition-all overflow-hidden duration-300 ease-in-out ${
                openIndex === index ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelFAQ;
