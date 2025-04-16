import React, { useState, useEffect } from "react";

const faqs = [
  { question: "How does Tripglide work?", answer: "We’re a flight, car hire and hotel search engine. We scan all the top airlines and travel providers across the net, so you can compare flight fares and other travel costs in one place. Once you’ve found the best flight, car hire or hotel, you book directly with the provider." },
  { question: "How can I find the cheapest flight using Tripglide?", answer: "Use our filters and flexible date options to compare prices and find the best deal." },
  { question: "Where should I book a flight to right now?", answer: "Check out our trending destinations and top deals." },
  { question: "Do I book my flight with Tripglide?", answer: "No, we redirect you to the airline or travel provider to complete your booking." },
  { question: "What happens after I have booked my flight?", answer: "You will receive a confirmation email from the provider you booked with." },
  { question: "Does Triplide do hotels too?", answer: "Yes, you can search and compare hotel prices with us." },
  { question: "What about car hire?", answer: "We also offer car hire comparisons to find you the best deal." },
  { question: "What’s a Price Alert?", answer: "Price Alerts notify you when flight prices change for your selected route." },
  { question: "Can I book a flexible flight ticket?", answer: "Yes, we have options for flexible tickets that allow changes." },
  { question: "Can I book flights that emit less CO₂?", answer: "Yes, we highlight flights with lower CO₂ emissions to help you make eco-friendly choices." }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(-1);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
    console.log("Updated openIndex:", openIndex);
  };
  
  useEffect(() => {
    console.log("State changed, openIndex is now:", openIndex);
  }, [openIndex]);

  return (
    <div className="max-w-7xl conatiner mx-auto p-6 pointer-events-auto">
      <h2 className="text-2xl font-bold font-serif mb-6">Booking flights with Tripglide</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-4">  
            <button
              className="w-full text-left font-semibold py-2 flex justify-between items-center cursor-pointer pointer-events-auto"
              onClick={(e) => {
                toggleFAQ(index);
              }}
              style={{
                pointerEvents: "auto !important",
                cursor: "pointer !important",
                zIndex: 999
              }}
              >
              {faq.question}
              <span>{openIndex === index ? "−" : "+"}</span>
          </button>
          <p className={`mt-2 text-gray-600 transition-all duration-300 ease-in-out ${
            openIndex === index ? "block opacity-100 max-h-40" : "hidden opacity-0 max-h-0"
          }`}>
            {faq.answer}
          </p>
          </div>
        ))}
      </div>
    </div>
    
  );
};




export default FAQSection;
