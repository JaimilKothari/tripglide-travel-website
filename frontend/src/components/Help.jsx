import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer"; // Assuming Footer is in the same directory

const Help = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-[#06152B] text-white py-4 px-4 shadow-lg">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tripglide Help Center</h1>
          <Link to="/" className="text-blue-400 hover:underline">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h2 className="text-3xl font-bold text-black mb-6 text-center">
          How Can We Help You?
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Find answers to common questions about booking flights, hotels, car hires, and more with Tripglide.
        </p>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {/* Booking Flights */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              Booking Flights
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-black">
                  How do I book a flight on Tripglide?
                </h4>
                <p className="text-gray-600">
                  To book a flight, go to the homepage, select "Flights," enter your travel details (from, to, dates, etc.), and click "Search." Browse the available flights, select your preferred option, and follow the prompts to enter passenger details and payment information to confirm your booking.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  Can I book a multi-city flight?
                </h4>
                <p className="text-gray-600">
                  Yes, Tripglide supports multi-city bookings. On the flight search form, select the "Multi-city" option, add your flight legs, and search for available flights. You can add up to 6 legs in one booking.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  What if I need to cancel or change my flight?
                </h4>
                <p className="text-gray-600">
                  You can manage your flight bookings by logging into your Tripglide account and navigating to "My Bookings." Cancellation and change policies depend on the airline's terms and conditions, which will be displayed during booking. Additional fees may apply.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Hotels */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              Booking Hotels
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-black">
                  How do I find and book a hotel on Tripglide?
                </h4>
                <p className="text-gray-600">
                  Select "Hotels" on the homepage, enter your destination, travel dates, and the number of guests, then click "Search." Browse the available hotels, select your preferred option, and complete the booking by providing guest details and payment information.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  Are hotel prices per person or per room?
                </h4>
                <p className="text-gray-600">
                  Hotel prices on Tripglide are typically per room, per night, unless otherwise specified. The price includes the number of guests you select during the search. Always check the booking details for clarity.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  Can I cancel my hotel booking?
                </h4>
                <p className="text-gray-600">
                  Cancellation policies vary by hotel. During the booking process, you’ll see the hotel’s cancellation policy (e.g., free cancellation up to 48 hours before check-in). You can also manage your booking in the "My Bookings" section of your account.
                </p>
              </div>
            </div>
          </div>

          {/* Car Hire */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              Car Hire
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-black">
                  How do I rent a car through Tripglide?
                </h4>
                <p className="text-gray-600">
                  Select "Car Hire" on the homepage, enter your pickup location, dates, and times, then click "Search." Browse the available cars, apply filters (e.g., car type, fuel type), select your preferred car, and complete the booking with your details and payment.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  What documents do I need to rent a car?
                </h4>
                <p className="text-gray-600">
                  You typically need a valid driver’s license, a credit card for payment, and proof of identity (e.g., passport). Requirements may vary by car agency, so check the specific terms during booking.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  Is insurance included in the car hire price?
                </h4>
                <p className="text-gray-600">
                  Basic insurance is often included, but coverage varies by agency. You can opt for additional insurance during the booking process for extra protection. Review the terms and conditions for details.
                </p>
              </div>
            </div>
          </div>

          {/* Payments and Refunds */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              Payments and Refunds
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-black">
                  What payment methods does Tripglide accept?
                </h4>
                <p className="text-gray-600">
                  Tripglide accepts major credit/debit cards, net banking, and digital wallets (e.g., PayPal, Google Pay). Payment options may vary depending on your location and the service provider (e.g., airline, hotel, car agency).
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  How do I request a refund?
                </h4>
                <p className="text-gray-600">
                  To request a refund, go to "My Bookings" in your Tripglide account, select the booking, and follow the cancellation process. Refunds are processed based on the service provider’s policy, and the amount will be credited to your original payment method within 5-10 business days.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  Are there any hidden fees?
                </h4>
                <p className="text-gray-600">
                  Tripglide strives to be transparent. All applicable fees (e.g., taxes, service fees) are shown during the booking process before you confirm your payment. Be sure to review the breakdown on the payment page.
                </p>
              </div>
            </div>
          </div>

          {/* Customer Support */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-black mb-4">
              Customer Support
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-black">
                  How do I contact Tripglide support?
                </h4>
                <p className="text-gray-600">
                  You can reach our support team via email at support@tripglide.com or by calling our helpline at +1-800-TRIPGLIDE (available 24/7). You can also use the live chat feature on our website for immediate assistance.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  What should I do if I face an issue during my trip?
                </h4>
                <p className="text-gray-600">
                  If you encounter any issues (e.g., flight delays, hotel check-in problems, car hire issues), contact our support team immediately. Keep your booking reference number handy for faster assistance.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-black">
                  Can I get help in multiple languages?
                </h4>
                <p className="text-gray-600">
                  Yes, our support team offers assistance in multiple languages, including English, Spanish, French, and Hindi. Specify your preferred language when contacting us.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="mt-10 text-center">
          <h3 className="text-2xl font-semibold text-black mb-4">
            Still Need Help?
          </h3>
          <p className="text-gray-600 mb-6">
            Our support team is here to assist you. Reach out to us for any queries or issues.
          </p>
          <a
            href="https://inboxtechs.com/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Contact Support
          </a>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Help;