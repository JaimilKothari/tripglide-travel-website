import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { jsPDF } from "jspdf";

const stripePromise = loadStripe('pk_test_51RBqKcHDDYPUff2kicXW3yxLTiL7zsGgfPPFH5LNU4ldUzgnhUZ7tlYMbdKRiDXDZRNQpdk0SguQued56ZP1EqZl00Msnu4Xv6');

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasSavedBooking = useRef(false); // Flag to prevent multiple saves
  console.log("Navigation State:", location.state); // Debug log to check state

  // Retrieve booking data from localStorage
  const storedBooking = localStorage.getItem('lastBooking');
  const bookingData = storedBooking ? JSON.parse(storedBooking) : {};
  console.log("Stored Booking Data:", bookingData); // Debug log

  // Destructure with fallbacks from localStorage or location.state
  const {
    car = {},
    selectedDeal = {},
    pickupLocation = "Not specified",
    pickupDate = "Not specified",
    pickupTime = "Not specified",
    dropoffDate = "Not specified",
    dropoffTime = "Not specified",
    dropoffLocation = "Not specified",
    isDifferentLocation = false,
    extras = {},
    totalPrice = 0,
  } = bookingData || location.state || {};

  // Extract car and deal details with fallbacks
  const carDetails = {
    model: car.model || "Not specified",
    make: car.make || "Not specified",
    type: car.type || "Not specified",
    passengers: car.passengers || "Not specified",
    transmission: car.transmission || "Not specified",
    ac: car.ac || "Not specified",
  };

  const dealDetails = {
    agency: selectedDeal.agency || "Not specified",
    price: selectedDeal.pricePerDay ? `₹${selectedDeal.pricePerDay.toLocaleString()}/hour` : "Not specified",
    fuelPolicy: selectedDeal.fuelPolicy || selectedDeal.fuel_policy || "Not specified",
  };

  const dropoffLoc = isDifferentLocation && dropoffLocation ? dropoffLocation : pickupLocation;

  // Authentication check
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user || !user.user_id) {
      console.error('User not authenticated, redirecting to login');
      navigate('/login');
    }
  }, [navigate]);

  // Clean up localStorage after displaying
  useEffect(() => {
    return () => {
      localStorage.removeItem('lastBooking');
    };
  }, []);

  // Save booking to backend
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    console.log('User from localStorage:', user);
    console.log('Location state:', location.state);

    const saveBooking = async () => {
      if (hasSavedBooking.current) {
        console.log('Booking already saved, skipping');
        return;
      }

      if (user && user.user_id) {
        const searchParams = new URLSearchParams(location.search);
        const bookingData = {
          user_id: user.user_id,
          car_make: car.make || searchParams.get('car_make') || 'Unknown',
          car_model: car.model || searchParams.get('car_model') || 'Unknown',
          car_type: car.type || searchParams.get('car_type') || 'Unknown',
          car_passengers: parseInt(car.passengers) || parseInt(searchParams.get('car_passengers')) || 0,
          car_transmission: car.transmission || searchParams.get('car_transmission') || 'Unknown',
          car_ac: car.ac === 'Yes' || searchParams.get('car_ac') === 'true' || false,
          selectedDeal_agency: selectedDeal.agency || searchParams.get('agency') || 'Unknown',
          selectedDeal_pricePerDay: parseFloat(selectedDeal.pricePerDay) || parseFloat(searchParams.get('pricePerDay')) || 0,
          selectedDeal_fuelPolicy: selectedDeal.fuelPolicy || searchParams.get('fuelPolicy') || 'Unknown',
          selectedDeal_id: car.id || parseInt(searchParams.get('car_id')) || 0,
          pickupLocation: pickupLocation || searchParams.get('pickupLocation') || 'Not specified',
          pickupDate: pickupDate || searchParams.get('pickupDate') || new Date().toISOString().split('T')[0],
          pickupTime: pickupTime || searchParams.get('pickupTime') || '00:00:00',
          dropoffDate: dropoffDate || searchParams.get('dropoffDate') || new Date().toISOString().split('T')[0],
          dropoffTime: dropoffTime || searchParams.get('dropoffTime') || '00:00:00',
          dropoffLocation: dropoffLocation || searchParams.get('dropoffLocation') || pickupLocation || 'Not specified',
          extras_additionalDriver: extras.additionalDriver || searchParams.get('extras_additionalDriver') === 'true' || false,
          extras_extraLuggage: extras.extraLuggage || searchParams.get('extras_extraLuggage') === 'true' || false,
          extras_childSeat: extras.childSeat || searchParams.get('extras_childSeat') === 'true' || false,
          totalPrice: parseFloat(totalPrice) || parseFloat(searchParams.get('totalPrice')) || 0,
        };

        console.log('Sending booking data:', bookingData);

        try {
          const response = await fetch('http://localhost:5005/api/save-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData),
          });
          const data = await response.json();
          if (data.message) {
            console.log('Booking saved:', data.message);
            hasSavedBooking.current = true; // Mark as saved
            localStorage.setItem('lastBooking', JSON.stringify(bookingData));
          } else {
            console.error('Save failed:', data.error);
            alert('Failed to save booking: ' + data.error);
          }
        } catch (error) {
          console.error('Error saving booking:', error);
          alert('Error saving booking: ' + error.message);
        }
      } else {
        console.error('User or user_id not found, redirecting to login');
        navigate('/login');
      }
    };

    saveBooking();
  }, [navigate, location]);

  // Debug log to verify totalPrice
  console.log("Total Price:", totalPrice);

  // Download Invoice with Dark Blue and White Theme
  const downloadInvoice = () => {
    const doc = new jsPDF();
    let yPosition = 10;

    // Colors
    const darkBlue = [30, 58, 138]; // #1E3A8A
    const lightGray = [243, 244, 246]; // #F3F4F6
    const white = [255, 255, 255]; // #FFFFFF
    const darkGray = [55, 65, 81]; // #374151

    // Outer Border
    doc.setLineWidth(0.5);
    doc.setDrawColor(...darkBlue);
    doc.rect(5, 5, 200, 287, "S"); // Border around the entire page

    // Header: Dark Blue Background with White Text
    doc.setFillColor(...darkBlue);
    doc.rect(0, 0, 210, 30, "F"); // Full-width header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...white);
    doc.text("TripGlide", 15, yPosition + 10);
    doc.setFontSize(14);
    doc.text("INVOICE", 190, yPosition + 10, { align: "right" });
    yPosition += 20;

    // Invoice Number and Booking Date
    const bookingNumber = Math.floor(1000000000 + Math.random() * 9000000000); // Generate random booking number
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: INV-2025-${bookingNumber}`, 190, yPosition, { align: "right" });
    yPosition += 5;
    doc.text(
      `Booking Date: ${new Date().toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`,
      190,
      yPosition,
      { align: "right" }
    );
    yPosition += 10;

    // Customer Info Section
    doc.setFillColor(...white);
    doc.rect(10, yPosition - 5, 190, 40, "F"); // White background for customer info
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("Customer Information", 15, yPosition);
    doc.setLineWidth(0.2);
    doc.setDrawColor(...darkBlue);
    doc.line(15, yPosition + 2, 85, yPosition + 2); // Underline for header
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Traveler: Guest", 15, yPosition); // No userDetails.name in car rental code, using "Guest"
    yPosition += 5;
    doc.text("Email: Not provided", 15, yPosition); // No email in car rental code
    yPosition += 5;
    doc.text(`Booking ID: TG-${bookingNumber}`, 15, yPosition);
    yPosition += 15;

    // Car Rental Details Section
    doc.setFillColor(...lightGray);
    doc.rect(10, yPosition - 5, 190, 10, "F"); // Light gray background for section header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("Car Rental Details", 15, yPosition);
    doc.setLineWidth(0.2);
    doc.line(15, yPosition + 2, 85, yPosition + 2); // Underline for header
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const carTitle = `${carDetails.make || "Unknown"} ${carDetails.model || "Unknown"} - ${carDetails.type || "Unknown"}`;
    doc.text(carTitle, 15, yPosition, { maxWidth: 180 });
    yPosition += 8;
    const schedule = `Pick-up: ${pickupLocation || "N/A"} on ${pickupDate || "N/A"} at ${pickupTime || "N/A"}`;
    doc.text(schedule, 15, yPosition);
    yPosition += 5;
    const dropoff = `Drop-off: ${dropoffLoc || "N/A"} on ${dropoffDate || "N/A"} at ${dropoffTime || "N/A"}`;
    doc.text(dropoff, 15, yPosition);
    yPosition += 5;
    doc.text(`Agency: ${dealDetails.agency || "Not specified"}`, 15, yPosition);
    yPosition += 10;

    // Extras Section
    doc.setFillColor(...lightGray);
    doc.rect(10, yPosition - 5, 190, 10, "F"); // Light gray background for section header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("Additional Extras", 15, yPosition);
    doc.setLineWidth(0.2);
    doc.line(15, yPosition + 2, 75, yPosition + 2); // Underline for header
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Additional Driver: ${extras.additionalDriver ? "Yes (₹500)" : "No"}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Extra Luggage: ${extras.extraLuggage ? "Yes (₹300)" : "No"}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Child Seat: ${extras.childSeat ? "Yes (₹400)" : "No"}`, 15, yPosition);
    yPosition += 10;

    // Fare Breakdown Table
    doc.setFillColor(...darkBlue);
    doc.rect(15, yPosition - 5, 180, 8, "F"); // Dark blue header for table
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...white);
    doc.text("Description", 20, yPosition);
    doc.text("Base Cost", 100, yPosition, { align: "right" });
    doc.text("Extras", 150, yPosition, { align: "right" });
    doc.text("Amount", 190, yPosition, { align: "right" });
    yPosition += 8;

    doc.setLineWidth(0.1);
    doc.setDrawColor(...darkGray);
    doc.line(15, yPosition - 2, 195, yPosition - 2); // Divider below table header
    yPosition += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkGray);
    const baseCost = Math.round(totalPrice * 0.7) || 0; // Assume 70% is base cost
    const extrasCost = Math.round(totalPrice * 0.3) || 0; // Assume 30% is extras
    const total = totalPrice || 0;

    // Row 1: Base Cost
    doc.setFillColor(245, 245, 245); // Very light gray for alternating row
    doc.rect(15, yPosition - 5, 180, 8, "F");
    doc.text("Car Rental Charges", 20, yPosition);
    doc.text(`Rs. ${baseCost.toLocaleString()}`, 100, yPosition, { align: "right" });
    doc.text(`Rs. ${extrasCost.toLocaleString()}`, 150, yPosition, { align: "right" });
    doc.text(`Rs. ${total.toLocaleString()}`, 190, yPosition, { align: "right" });
    yPosition += 10;

    // Total Row
    doc.setFillColor(...lightGray);
    doc.rect(15, yPosition - 5, 180, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Total", 20, yPosition);
    doc.text(`Rs. ${total.toLocaleString()}`, 190, yPosition, { align: "right" });
    yPosition += 15;

    // Total in Words
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const numberToWords = (num) => {
      const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
      const teens = [
        "", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
      ];
      const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
      const thousands = ["", "Thousand", "Million", "Billion"];

      if (num === 0) return "Zero";

      const convertLessThanThousand = (n) => {
        if (n === 0) return "";
        if (n < 10) return units[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) {
          const ten = Math.floor(n / 10);
          const unit = n % 10;
          return `${tens[ten]}${unit ? " " + units[unit] : ""}`;
        }
        const hundred = Math.floor(n / 100);
        const remainder = n % 100;
        return `${units[hundred]} Hundred${remainder ? " " + convertLessThanThousand(remainder) : ""}`;
      };

      let words = "";
      let thousandIndex = 0;

      while (num > 0) {
        const chunk = num % 1000;
        if (chunk) {
          words = `${convertLessThanThousand(chunk)} ${thousands[thousandIndex]} ${words}`.trim();
        }
        num = Math.floor(num / 1000);
        thousandIndex++;
      }

      return words.trim();
    };
    const totalInWords = `${numberToWords(total).toUpperCase()} ONLY (INR)`;
    doc.text(`Grand Total (in words): ${totalInWords}`, 15, yPosition, { maxWidth: 180 });
    yPosition += 15;

    // Footer: Dark Blue Background with White Text
    doc.setFillColor(...darkBlue);
    doc.rect(0, 260, 210, 37, "F"); // Footer at the bottom
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...white);
    doc.text("TripGlide Customer Support", 15, 270);
    yPosition = 275;
    doc.setFont("helvetica", "normal");
    doc.text("TripGlide Pvt. Ltd.", 15, yPosition);
    yPosition += 5;
    doc.text("123 Travel Lane, Phase 1, Gujarat, India", 15, yPosition);
    yPosition += 5;
    doc.text("India Toll Free: 1-800-123-4567", 15, yPosition);

    // Footer Note
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200); // Light gray for note
    doc.text(
      "Note: This is a computer-generated invoice and does not require a signature/stamp.",
      15,
      290,
      { maxWidth: 180 }
    );

    doc.save(`invoice_${bookingNumber}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full transform transition-all duration-300 hover:shadow-3xl">
        <div className="text-center">
          <div className="inline-block bg-green-100 p-3 rounded-full mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 text-lg">Your car rental has been successfully booked. Enjoy your trip!</p>
        </div>

        {/* Booking Details Section */}
        <div className="mt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-green-200 pb-2">Booking Details</h2>

          {/* Car Details */}
          <div className="p-6 bg-green-50 rounded-lg border border-green-100">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Car Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
              <p><strong>Model:</strong> {carDetails.model}</p>
              <p><strong>Make:</strong> {carDetails.make}</p>
              <p><strong>Type:</strong> {carDetails.type}</p>
              <p><strong>Passengers:</strong> {carDetails.passengers}</p>
              <p><strong>Transmission:</strong> {carDetails.transmission}</p>
              <p><strong>AC:</strong> {carDetails.ac}</p>
            </div>
          </div>

          {/* Agency and Price */}
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Rental Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
              <p><strong>Agency:</strong> {dealDetails.agency}</p>
              <p><strong>Price:</strong> {dealDetails.price}</p>
              <p><strong>Fuel Policy:</strong> {dealDetails.fuelPolicy}</p>
            </div>
          </div>

          {/* Date and Time Details */}
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Schedule</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
              <p><strong>Pick-up Location:</strong> {pickupLocation}</p>
              <p><strong>Pick-up Date:</strong> {pickupDate}</p>
              <p><strong>Pick-up Time:</strong> {pickupTime}</p>
              <p><strong>Drop-off Location:</strong> {dropoffLoc}</p>
              <p><strong>Drop-off Date:</strong> {dropoffDate}</p>
              <p><strong>Drop-off Time:</strong> {dropoffTime}</p>
            </div>
          </div>

          {/* Extras */}
          <div className="p-6 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Additional Extras</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
              <p><strong>Additional Driver:</strong> {extras.additionalDriver ? "Yes (₹500)" : "No"}</p>
              <p><strong>Extra Luggage:</strong> {extras.extraLuggage ? "Yes (₹300)" : "No"}</p>
              <p><strong>Child Seat:</strong> {extras.childSeat ? "Yes (₹400)" : "No"}</p>
            </div>
          </div>

          {/* Total Price */}
          <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-100">
            <h3 className="text-xl font-medium text-gray-700 mb-4">Total Cost</h3>
            <p className="text-2xl font-bold text-gray-800">₹{totalPrice.toLocaleString() || "Not Calculated"}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Back to Home
          </Link>
          <button
            onClick={downloadInvoice}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;