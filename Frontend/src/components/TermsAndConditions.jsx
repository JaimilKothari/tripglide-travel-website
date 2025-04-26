import React from "react";
import { Link, useLocation } from "react-router-dom";

const TermsAndConditions = () => {
  const location = useLocation();
  // Retrieve stored state from localStorage
  const storedState = JSON.parse(localStorage.getItem("carConfirmationState")) || location.state;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full transform transition-all duration-300 hover:shadow-3xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Cab Rental Terms and Conditions</h1>
          <p className="text-gray-600 text-lg">
            Please read these terms and conditions carefully before using our cab rental services.
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. General</h2>
            <p className="text-gray-600">
              By booking a cab through TripGlide Pvt. Ltd., you agree to these Terms and Conditions. These terms govern
              all cab rental services, including airport transfers, city rides, and outstation trips, provided by
              TripGlide or its partner operators.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Booking and Confirmation</h2>
            <p className="text-gray-600">
              A cab booking is confirmed only after TripGlide issues a confirmation number via email or SMS. Bookings are
              subject to vehicle and driver availability. TripGlide reserves the right to cancel or modify bookings in
              case of unforeseen circumstances, such as vehicle breakdowns or driver unavailability, with prior notice
              where possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Payment</h2>
            <p className="text-gray-600">
              Payment is required at the time of booking or upon trip completion, depending on the booking type
              (prepaid/postpaid). Prices include driver charges, fuel, and applicable taxes unless otherwise stated.
              Additional charges (e.g., tolls, parking fees, or night surcharges) will be communicated during booking or
              added to the final fare.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Cancellation and Refunds</h2>
            <p className="text-gray-600">
              Cancellations made at least 2 hours before the scheduled pick-up time are eligible for a full refund, minus
              any processing fees. Cancellations within 2 hours or no-shows may incur a 50% cancellation fee. Refunds will
              be processed within 5-7 business days to the original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Passenger Conduct</h2>
            <p className="text-gray-600">
              Passengers must behave respectfully toward the driver and maintain cleanliness in the cab. Smoking, alcohol
              consumption, or illegal activities are strictly prohibited. TripGlide reserves the right to terminate the
              ride without refund if passengers violate these rules.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Driver Responsibilities</h2>
            <p className="text-gray-600">
              Drivers are responsible for safe and timely transportation, adhering to traffic regulations. TripGlide
              ensures drivers are licensed and trained, but passengers should report any concerns (e.g., reckless driving)
              immediately to customer support for resolution.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Luggage and Belongings</h2>
            <p className="text-gray-600">
              Passengers are responsible for their belongings. Standard luggage is included in the fare, but oversized or
              excess luggage may incur additional charges, subject to driver discretion. TripGlide is not liable for lost
              or damaged items left in the cab.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Liability and Insurance</h2>
            <p className="text-gray-600">
              TripGlide provides basic insurance for passenger safety during the ride. However, passengers are liable for
              damages to the cab caused by negligence or misuse (e.g., spills, vandalism). TripGlide is not responsible
              for delays due to traffic, weather, or other uncontrollable factors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">9. Modifications to Booking</h2>
            <p className="text-gray-600">
              Changes to pick-up time, location, or destination are subject to availability and may incur additional
              charges. Contact TripGlide customer support at least 1 hour in advance to request modifications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">10. Governing Law</h2>
            <p className="text-gray-600">
              These terms are governed by the laws of India. Any disputes arising from cab rental services will be resolved
              in the courts of Gujarat, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">11. Contact Information</h2>
            <p className="text-gray-600">
              For inquiries, complaints, or support regarding cab rentals, contact TripGlide Pvt. Ltd. at:
              <br />
              Email: support@tripglide.com
              <br />
              Phone: 1-800-123-4567
              <br />
              Address: 123 Travel Lane, Phase 1, Gujarat, India
            </p>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/car-confirmation"
            state={storedState} // Use stored state from localStorage
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;