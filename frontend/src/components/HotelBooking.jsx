import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaCheckCircle,
  FaHotel,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaExclamationCircle,
  FaBed,
} from "react-icons/fa";
import jsPDF from "jspdf";

const HotelBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [bookingNumber, setBookingNumber] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Generate random booking number
  useEffect(() => {
    const generateBookingNumber = () => {
      return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };
    setBookingNumber(generateBookingNumber());
  }, []);

  // Retrieve user and booking details
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      console.warn("No user found in localStorage, redirecting to login");
      setError("Please log in to view booking details");
      setIsLoaded(true);
      navigate("/login");
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(storedUser);
      setUserDetails({
        name: parsedUser.username || "Guest",
        email: parsedUser.email || "No email provided",
        phone: parsedUser.phone || "Not provided",
      });
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      setError("Failed to load user data");
      setIsLoaded(true);
      return;
    }

    let storedDetails = sessionStorage.getItem("hotelBookingDetails");
    if (!storedDetails) {
      storedDetails = localStorage.getItem("hotelBookingDetails");
      if (storedDetails) sessionStorage.setItem("hotelBookingDetails", storedDetails);
    }

    if (!storedDetails) {
      console.warn("No booking details found");
      setError("No booking details found");
      setIsLoaded(true);
      return;
    }

    try {
      const parsedDetails = JSON.parse(storedDetails);
      // Validate required fields
      if (
        !parsedDetails.hotelName ||
        !parsedDetails.checkInDate ||
        !parsedDetails.checkOutDate ||
        !parsedDetails.roomType ||
        !parsedDetails.rooms ||
        !parsedDetails.totalAmount
      ) {
        throw new Error("Incomplete booking details");
      }
      setBookingDetails(parsedDetails);
      localStorage.setItem("hotelBookingDetails", storedDetails);

      const sendBookingToBackend = async () => {
        const bookingSent = sessionStorage.getItem("bookingSent");
        if (bookingSent === bookingNumber) {
          console.log(`Booking ${bookingNumber} already sent, skipping...`);
          return;
        }

        const bookingData = {
          booking_number: bookingNumber,
          hotel_name: parsedDetails.hotelName,
          arrival: parsedDetails.arrival,
          check_in_date: parsedDetails.checkInDate,
          check_out_date: parsedDetails.checkOutDate,
          adults: parsedDetails.adults,
          children: parsedDetails.children,
          rooms: parsedDetails.rooms,
          room_type: parsedDetails.roomType,
          price_per_night: parsedDetails.pricePerNight,
          total_amount: parsedDetails.totalAmount,
          guest_name: parsedUser.username || "Guest",
          email: parsedUser.email || "No email provided",
          phone: parsedUser.phone || "Not provided",
          booked_on: new Date().toISOString().split("T")[0],
          payment_method: "Credit Card",
        };

        console.log("Sending booking:", bookingData);

        try {
          const response = await fetch("http://localhost:5003/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData),
          });

          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.error || "Failed to store booking");
          }
          console.log(`Booking ${bookingNumber} stored:`, result.message);
          sessionStorage.setItem("bookingSent", bookingNumber);
        } catch (err) {
          console.error(`Error sending booking ${bookingNumber}:`, err);
          setError("Failed to save booking to server");
        }
      };

      if (bookingNumber) sendBookingToBackend();
    } catch (e) {
      console.error("Error parsing hotelBookingDetails:", e);
      setError("Invalid booking details");
      setIsLoaded(true);
    }

    setIsLoaded(true);
  }, [bookingNumber, navigate]);

  // Function to convert number to words (simplified for INR)
  const numberToWords = (num) => {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const scales = ["", "Thousand", "Lakh", "Crore"];

    if (num === 0) return "Zero";

    let numStr = num.toString();
    let chunks = [];
    while (numStr.length > 0) {
      if (numStr.length > 3) {
        chunks.push(parseInt(numStr.slice(-3)));
        numStr = numStr.slice(0, -3);
      } else {
        chunks.push(parseInt(numStr));
        numStr = "";
      }
    }

    let words = [];
    for (let i = 0; i < chunks.length; i++) {
      let chunk = chunks[i];
      if (chunk === 0) continue;

      let chunkWords = [];
      if (chunk >= 100) {
        chunkWords.push(`${units[Math.floor(chunk / 100)]} Hundred`);
        chunk %= 100;
      }
      if (chunk >= 10 && chunk <= 19) {
        chunkWords.push(teens[chunk - 10]);
      } else if (chunk >= 20) {
        chunkWords.push(tens[Math.floor(chunk / 10)]);
        chunk %= 10;
        if (chunk > 0) chunkWords.push(units[chunk]);
      } else if (chunk > 0) {
        chunkWords.push(units[chunk]);
      }
      if (i > 0 && chunkWords.length > 0) {
        chunkWords.push(scales[i]);
      }
      words.unshift(...chunkWords);
    }

    return words.join(" ");
  };

  // Download Invoice with Dark Blue and White Theme
  const downloadInvoice = () => {
    if (!bookingDetails || !userDetails) {
      console.error("Cannot download invoice: missing booking or user details", {
        bookingDetails,
        userDetails,
      });
      alert("Unable to generate invoice due to missing booking details.");
      return;
    }

    const {
      hotelName,
      checkInDate,
      checkOutDate,
      roomType,
      rooms,
      pricePerNight,
      totalAmount,
    } = bookingDetails;

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
    doc.rect(5, 5, 200, 287, "S");

    // Header: Dark Blue Background with White Text
    doc.setFillColor(...darkBlue);
    doc.rect(0, 0, 210, 30, "F");
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...white);
    doc.text("TripGlide", 15, yPosition + 10);
    doc.setFontSize(14);
    doc.text("INVOICE", 190, yPosition + 10, { align: "right" });
    yPosition += 20;

    // Invoice Number and Booking Date
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: INV-2025-${bookingNumber}`, 190, yPosition, {
      align: "right",
    });
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
    doc.rect(10, yPosition - 5, 190, 40, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("Customer Information", 15, yPosition);
    doc.setLineWidth(0.2);
    doc.setDrawColor(...darkBlue);
    doc.line(15, yPosition + 2, 85, yPosition + 2);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Traveler: ${userDetails.name || "Guest"}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Email: ${userDetails.email || "Not provided"}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Booking ID: TG-${bookingNumber}`, 15, yPosition);
    yPosition += 15;

    // Hotel Details Section
    doc.setFillColor(...lightGray);
    doc.rect(10, yPosition - 5, 190, 10, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("Hotel Details", 15, yPosition);
    doc.setLineWidth(0.2);
    doc.line(15, yPosition + 2, 65, yPosition + 2);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const hotelTitle = `${hotelName} - ${roomType} (${rooms} Room${rooms > 1 ? "s" : ""})`;
    doc.text(hotelTitle, 15, yPosition, { maxWidth: 180 });
    yPosition += 8;
    const totalGuests = (bookingDetails.adults || 0) + (bookingDetails.children || 0);
    doc.text(`Guest: ${totalGuests} (Adults: ${bookingDetails.adults || 0}, Children: ${bookingDetails.children || 0})`, 15, yPosition);
    yPosition += 5;

    const checkIn = `Check-In: ${new Date(checkInDate).toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    )}, 02:00 PM`;
    doc.text(checkIn, 15, yPosition);
    yPosition += 5;
    const checkOut = `Check-Out: ${new Date(checkOutDate).toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    )}, 11:00 AM`;
    doc.text(checkOut, 15, yPosition);
    yPosition += 5;
    doc.text(`Traveler: ${userDetails.name || "Guest"}`, 15, yPosition);
    yPosition += 10;

    // Fare Breakdown Table
    doc.setFillColor(...darkBlue);
    doc.rect(15, yPosition - 5, 180, 8, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...white);
    doc.text("Description", 20, yPosition);
    doc.text("Base Rate", 100, yPosition, { align: "right" });
    doc.text("Taxes & Fees", 150, yPosition, { align: "right" });
    doc.text("Amount", 190, yPosition, { align: "right" });
    yPosition += 8;

    doc.setLineWidth(0.1);
    doc.setDrawColor(...darkGray);
    doc.line(15, yPosition - 2, 195, yPosition - 2);
    yPosition += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkGray);
    const baseRate = Math.round(totalAmount * 0.7); // Assume 70% is base rate
    const taxes = Math.round(totalAmount * 0.3); // Assume 30% is taxes
    const total = totalAmount;

    // Row 1: Room Charges
    doc.setFillColor(245, 245, 245);
    doc.rect(15, yPosition - 5, 180, 8, "F");
    doc.text(
      `Room Charges (${rooms} Room${rooms > 1 ? "s" : ""})`,
      20,
      yPosition
    );
    doc.text(`Rs. ${baseRate.toLocaleString()}`, 100, yPosition, {
      align: "right",
    });
    doc.text(`Rs. ${taxes.toLocaleString()}`, 150, yPosition, { align: "right" });
    doc.text(`Rs. ${total.toLocaleString()}`, 190, yPosition, {
      align: "right",
    });
    yPosition += 10;

    // Total Row
    doc.setFillColor(...lightGray);
    doc.rect(15, yPosition - 5, 180, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Total", 20, yPosition);
    doc.text(`Rs. ${total.toLocaleString()}`, 190, yPosition, {
      align: "right",
    });
    yPosition += 15;

    // Total in Words
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const totalInWords = `${numberToWords(total).toUpperCase()} ONLY (INR)`;
    doc.text(`Grand Total (in words): ${totalInWords}`, 15, yPosition, {
      maxWidth: 180,
    });
    yPosition += 15;

    doc.setFont("helvetica", "bold");
    doc.text(
      "Policy: Please ensure to present valid identification proof at the time of check-in.",
      15,
      yPosition,
      { maxWidth: 180 }
    );
    yPosition += 15;

    // Footer: Dark Blue Background with White Text
    doc.setFillColor(...darkBlue);
    doc.rect(0, 260, 210, 37, "F");
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
    doc.setTextColor(200, 200, 200);
    doc.text(
      "Note: This is a computer-generated invoice and does not require a signature/stamp.",
      15,
      290,
      { maxWidth: 180 }
    );

    doc.save(`invoice_${bookingNumber}.pdf`);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (isLoaded && (!bookingDetails || error)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
          <p>{error || "No booking details found. Please complete the booking process."}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const { hotelName, arrival, checkInDate, checkOutDate, adults, children, rooms, roomType, totalAmount, pricePerNight } =
    bookingDetails;

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  const formatDate = (dateString) => {
    const options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 pb-12">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mb-6">
        <div className="border-b pb-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 text-4xl mr-2" />
              <h2 className="text-2xl font-bold text-green-700">Booking Confirmed!</h2>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Booking Number</p>
              <p className="font-bold">{bookingNumber}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-2">
            Your hotel reservation has been confirmed. A confirmation email has been sent to your registered email address.
          </p>
          <p className="text-gray-600">
            For any changes to your booking, contact us 24/7 Toll Free: <span className="text-red-500 font-bold">800-525-0400</span>
          </p>
        </div>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <FaUser className="text-gray-500 mr-2" />
              <div>
                <p className="text-gray-500 text-sm">Guest</p>
                <p className="font-semibold">{userDetails.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-gray-500 mr-2" />
              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                <p className="font-semibold">{userDetails.phone}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="text-gray-500 mr-2" />
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-semibold">{userDetails.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <div>
                <p className="text-gray-500 text-sm">Booked On</p>
                <p className="font-semibold">
                  {new Date().toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Hotel Summary</h3>
          <div className="mb-4">
            <h4 className="font-semibold flex items-center mb-2">
              <FaHotel className="mr-2 text-blue-500" />
              Hotel Details
            </h4>
            <div className="border rounded-lg p-3 mb-3 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <FaHotel className="text-blue-500 mr-2" />
                  <span className="font-semibold">{hotelName}</span>
                </div>
                <div className="text-sm text-gray-500">{arrival}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Check-In</p>
                  <p className="font-semibold">{formatDate(checkInDate)}</p>
                  <p className="text-sm flex items-center">02:00 PM</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-Out</p>
                  <p className="font-semibold">{formatDate(checkOutDate)}</p>
                  <p className="text-sm flex items-center">11:00 AM</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Room Type</p>
                  <p className="font-semibold">{roomType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guests & Rooms</p>
                  <p className="font-semibold">
                    {adults + children} Guests, {rooms} Room{rooms > 1 ? "s" : ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nights</p>
                  <p className="font-semibold">{nights} Night{nights > 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Guest & Booking Information</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Number</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Preference</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Special Request</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{userDetails.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{bookingNumber}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{roomType}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs flex items-start">
            <FaExclamationCircle className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">
              All special requests and room preferences are not guaranteed. Please contact the hotel to reconfirm that they have received this request and confirmed it.
            </p>
          </div>
        </div>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Room Rate</p>
              <p className="font-semibold">₹{pricePerNight.toLocaleString()} per night</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Amount</p>
              <p className="font-semibold text-green-600">₹{totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Summary</p>
              <p className="font-semibold">
                {rooms} {roomType} Room{rooms > 1 ? "s" : ""} for {nights} Night{nights > 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Payment Method</p>
              <p className="font-semibold">Credit Card</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Thank you for your booking! A confirmation email has been sent to your registered email address.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-blue-700"
            >
              Back to Home
            </button>
            <button
              onClick={downloadInvoice}
              disabled={!bookingDetails || !userDetails || error}
              className={`px-4 py-2 cursor-pointer rounded-lg ${
                !bookingDetails || !userDetails || error
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Download Invoice
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-5">--- Complete your trip ---</h2>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-blue-100 rounded-full p-4 mb-4">
            <FaBed className="text-blue-500 text-4xl" />
          </div>
          <h2 className="text-xl font-semibold">Need a car for your trip?</h2>
        </div>
        <div className="mb-6 text-center">
          <p className="text-gray-700">Explore car hire options to make your travel seamless.</p>
        </div>
        <div className="text-center">
          <button
            onClick={() => navigate("/carhire")}
            className="bg-blue-600 text-white px-8 py-2 cursor-pointer rounded-lg hover:bg-blue-700"
          >
            Find a car
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;