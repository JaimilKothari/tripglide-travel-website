import React, { useState, useEffect } from "react";

const carHireFaqs = [
  { question: "How do I book a car with Tripglide?", answer: "We compare car hire prices from leading providers. Once you find the best deal, we redirect you to the provider’s site to complete your booking." },
  { question: "Can I book a car with free cancellation?", answer: "Yes! Many car hire options on Tripglide offer free cancellation. Be sure to check the provider’s policy before booking." },
  { question: "What documents do I need to hire a car?", answer: "Typically, you need a valid driver's license, a credit card in your name, and sometimes an International Driving Permit (IDP)." },
  { question: "Can I hire a car without a credit card?", answer: "Most car hire companies require a credit card for the security deposit. Some may accept debit cards – check the provider's policy." },
  { question: "Are there age restrictions for car hire?", answer: "Yes, most providers require drivers to be between 25-70 years old. Some allow younger or older drivers with an additional fee." },
  { question: "Can I return the car to a different location?", answer: "Yes, many car hire providers offer one-way rentals, allowing you to return the car to a different location. Additional charges may apply." },
  { question: "How do I find the cheapest car hire?", answer: "Use Tripglide’s filters to compare prices and find the best deals. Booking in advance often gets you a better rate." },
  { question: "What should I do if my plans change?", answer: "If you booked a car with free cancellation, you can modify or cancel your booking without extra fees before the deadline." },
  { question: "Is insurance included in the car hire price?", answer: "Basic insurance is usually included, but you can add extra coverage for more protection. Check the terms when booking." },
  { question: "Can I add additional drivers?", answer: "Yes, many providers allow additional drivers for a fee. You must register them when picking up the vehicle." }
];

const CarHireFAQ = () => {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
    console.log("Updated openIndex:", openIndex);
  };

  useEffect(() => {
    console.log("State changed, openIndex is now:", openIndex);
  }, [openIndex]);

  return (
    <div className="max-w-7xl container mx-auto p-6 pointer-events-auto">
      <h2 className="text-2xl font-bold font-serif mb-6">Car Hire with Tripglide</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {carHireFaqs.map((faq, index) => (
          <div key={index} className="border-b pb-4">
            <button
              className="w-full text-left font-semibold py-2 flex justify-between items-center cursor-pointer pointer-events-auto"
              onClick={() => toggleFAQ(index)}
              style={{
                pointerEvents: "auto !important",
                cursor: "pointer !important",
                zIndex: 999,
              }}
            >
              {faq.question}
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>
            <p
              className={`mt-2 text-gray-600 transition-all duration-300 ease-in-out ${
                openIndex === index ? "block opacity-100 max-h-40" : "hidden opacity-0 max-h-0"
              }`}
            >
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarHireFAQ;
