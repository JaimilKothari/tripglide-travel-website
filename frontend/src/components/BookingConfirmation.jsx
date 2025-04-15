import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaPlaneDeparture,
  FaHotel,
  FaCar,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTicketAlt,
  FaCalendarAlt,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";
import jsPDF from "jspdf"; // Import jsPDF

// Utility function to calculate duration
const calculateDuration = (depTime, arrTime) => {
  if (!depTime || !arrTime) return "N/A";
  try {
    const [depHours, depMinutes] = depTime.split(":").map(Number);
    const [arrHours, arrMinutes] = arrTime.split(":").map(Number);
    const depTotalMinutes = depHours * 60 + depMinutes;
    let arrTotalMinutes = arrHours * 60 + arrMinutes;
    if (arrTotalMinutes < depTotalMinutes) {
      arrTotalMinutes += 24 * 60;
    }
    const diffMinutes = arrTotalMinutes - depTotalMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  } catch (e) {
    console.error("Duration calculation error:", e);
    return "N/A";
  }
};

// Utility function to convert number to words (basic implementation)
const numberToWords = (num) => {
  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
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
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const thousands = ["", "Thousand", "Million", "Billion"];

  if (num === 0) return "Zero";

  let word = "";
  let thousandCounter = 0;

  while (num > 0) {
    let part = num % 1000;
    if (part > 0) {
      let partWord = "";
      if (part >= 100) {
        partWord += units[Math.floor(part / 100)] + " Hundred ";
        part %= 100;
      }
      if (part >= 20) {
        partWord += tens[Math.floor(part / 10)] + " ";
        part %= 10;
      }
      if (part >= 10 && part < 20) {
        partWord += teens[part - 10] + " ";
        part = 0;
      }
      if (part > 0 && part < 10) {
        partWord += units[part] + " ";
      }
      word = partWord + thousands[thousandCounter] + " " + word;
    }
    num = Math.floor(num / 1000);
    thousandCounter++;
  }

  return word.trim();
};

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [bookingNumber, setBookingNumber] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);

  const API_URL = "http://localhost:5000/api";

  // Generate booking and ticket numbers
  useEffect(() => {
    const generateBookingNumber = () => {
      return Math.floor(10000000 + Math.random() * 90000000).toString();
    };
    const generateTicketNumber = () => {
      return Math.floor(100000000000 + Math.random() * 900000000000).toString();
    };
    setBookingNumber(generateBookingNumber());
    setTicketNumber(generateTicketNumber());
  }, []);

  // Save booking to backend
  const saveBooking = async (bookingData, userDetails, bookingNumber) => {
    try {
      const { selectedFlight, selectedFare, searchParams } = bookingData;
      const { tripType, from, to, departDate } = searchParams;
      const firstLeg = tripType === "multicity" && selectedFlight?.multiCityFlights ? selectedFlight.multiCityFlights[0] : selectedFlight;

      const formatDateForMySQL = (dateString) => {
        if (!dateString) return null;
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) throw new Error("Invalid date");
          return date.toISOString().split('T')[0];
        } catch (e) {
          console.error("Date format error:", e);
          return null;
        }
      };

      const formatTimeForMySQL = (timeString) => {
        if (!timeString) return null;
        try {
          const match = timeString.match(/(\d{1,2}):(\d{2})/);
          if (!match) throw new Error("Invalid time format");
          return `${match[1].padStart(2, '0')}:${match[2]}`;
        } catch (e) {
          console.error("Time format error:", e);
          return null;
        }
      };

      const payload = {
        booking_number: bookingNumber,
        traveler_name: userDetails.name || "Guest",
        email: userDetails.email !== "Not provided" ? userDetails.email : null,
        phone: userDetails.phone !== "Not provided" ? userDetails.phone : null,
        booked_on: new Date().toISOString().slice(0, 19).replace('T', ' '),
        airline: firstLeg?.airline || "Unknown Airline",
        flight_number: firstLeg?.flightNumber || null,
        departure_airport: firstLeg?.departure || from,
        departure_time: formatTimeForMySQL(firstLeg?.departureTime),
        departure_date: formatDateForMySQL(firstLeg?.departureDate || departDate),
        arrival_airport: firstLeg?.arrival || to,
        arrival_time: formatTimeForMySQL(firstLeg?.arrivalTime),
        arrival_date: formatDateForMySQL(firstLeg?.arrivalDate || departDate),
        duration: firstLeg?.duration || calculateDuration(firstLeg?.departureTime, firstLeg?.arrivalTime),
        stops: firstLeg?.stops || 0,
        fare_type: selectedFare?.type || "Standard",
        total_price: selectedFare?.price || 0,
        trip_type: tripType === "oneway" ? "One Way" : tripType === "return" ? "Return" : "Multi-city",
        payment_method: "Credit Card",
        ticket_number: ticketNumber,
        meal_preference: "Any meal",
        special_request: "",
        status: "Upcoming",
      };

      console.log("Sending payload to /save_booking_confirmation:", payload);

      const response = await fetch(`${API_URL}/save_booking_confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
        mode: "cors",
        credentials: "same-origin"
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: "UnknownError", message: response.statusText || "Failed to parse response" };
        }
        const errorName = errorData.error || `HTTPError_${response.status}`;
        const message = errorData.message || response.statusText || "Failed to save booking";
        throw new Error(`${errorName}: ${message}`);
      }

      const res = await response.json();
      console.log("Booking saved:", res.message);
      return res;
    } catch (err) {
      console.error(`Save booking error [${err.name}]: ${err.message}`);
      if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
        console.error("Possible CORS or network issue. Check server status and CORS configuration.");
      }
      setError(`Failed to save booking: ${err.message}`);
      throw err; // Re-throw for caller to handle
    }
  };

  // Download Invoice function
  const downloadInvoice = () => {
    if (!bookingDetails || !userDetails) return;

    const { selectedFlight, selectedFare, searchParams } = bookingDetails;
    const { tripType, from, to, departDate } = searchParams;
    const firstLeg =
      tripType === "multicity" && selectedFlight?.multiCityFlights
        ? selectedFlight.multiCityFlights[0]
        : selectedFlight;

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
    doc.text(`Traveler: ${userDetails.name || "Guest"}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Email: ${userDetails.email || "Not provided"}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Booking ID: TG-${bookingNumber}`, 15, yPosition);
    yPosition += 15;

    // Flight Details Section
    doc.setFillColor(...lightGray);
    doc.rect(10, yPosition - 5, 190, 10, "F"); // Light gray background for section header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGray);
    doc.text("Flight Details", 15, yPosition);
    doc.setLineWidth(0.2);
    doc.line(15, yPosition + 2, 65, yPosition + 2); // Underline for header
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const flightTitle = `${firstLeg?.airline || "Unknown Airline"} • ${
      firstLeg?.flightNumber || "N/A"
    } - ${firstLeg?.departure || from} (${firstLeg?.departureAirport || ""}) to ${
      firstLeg?.arrival || to
    } (${firstLeg?.arrivalAirport || ""})`;
    doc.text(flightTitle, 15, yPosition, { maxWidth: 180 });
    yPosition += 8;
    const travelDate = `Travel Date: ${new Date(firstLeg?.departureDate || departDate).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })}, ${firstLeg?.departureTime || "N/A"}`;
    doc.text(travelDate, 15, yPosition);
    yPosition += 5;
    doc.text(`Traveler: ${userDetails.name || "Guest"}`, 15, yPosition);
    yPosition += 10;

    // Fare Breakdown Table
    doc.setFillColor(...darkBlue);
    doc.rect(15, yPosition - 5, 180, 8, "F"); // Dark blue header for table
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...white);
    doc.text("Description", 20, yPosition);
    doc.text("Base Fare", 100, yPosition, { align: "right" });
    doc.text("Service Fee & Taxes", 150, yPosition, { align: "right" });
    doc.text("Amount", 190, yPosition, { align: "right" });
    yPosition += 8;

    doc.setLineWidth(0.1);
    doc.setDrawColor(...darkGray);
    doc.line(15, yPosition - 2, 195, yPosition - 2); // Divider below table header
    yPosition += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkGray);
    const baseFare = Math.round(selectedFare?.price * 0.7) || 0; // Assume 70% is base fare
    const taxes = Math.round(selectedFare?.price * 0.3) || 0; // Assume 30% is taxes
    const total = selectedFare?.price || 0;

    // Row 1: Base Fare
    doc.setFillColor(245, 245, 245); // Very light gray for alternating row
    doc.rect(15, yPosition - 5, 180, 8, "F");
    doc.text("Flight Charges", 20, yPosition);
    doc.text(`Rs. ${baseFare.toLocaleString()}`, 100, yPosition, { align: "right" });
    doc.text(`Rs. ${taxes.toLocaleString()}`, 150, yPosition, { align: "right" });
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

  // Fetch user details and load booking details
  useEffect(() => {
    console.log("useEffect ran for data loading");
    const fetchUserDetails = async () => {
      if (hasFetchedProfile) {
        console.log("Skipping profile fetch; already attempted");
        return;
      }

      let storedUser = localStorage.getItem("user");
      let identifier;

      try {
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserDetails({
            name: parsedUser.username || "Guest",
            email: parsedUser.email || "Not provided",
            phone: parsedUser.phone || "Not provided",
          });
          identifier = parsedUser.email || parsedUser.phone;
        } else {
          let storedStripeUser = localStorage.getItem("stripeUserDetails");
          if (storedStripeUser) {
            const parsedStripeUser = JSON.parse(storedStripeUser);
            setUserDetails({
              name: parsedStripeUser.name || "Guest",
              email: parsedStripeUser.email || "Not provided",
              phone: parsedStripeUser.phone || "Not provided",
            });
            identifier = parsedStripeUser.email || parsedStripeUser.phone;
          } else {
            setUserDetails({
              name: "Guest",
              email: "Not provided",
              phone: "Not provided",
            });
            setError("No user data found. Please log in.");
            return;
          }
        }

        if (identifier) {
          console.log(`Fetching profile for identifier: ${identifier}`);
          const response = await fetch(`${API_URL}/profile?identifier=${encodeURIComponent(identifier)}`, {
            signal: AbortSignal.timeout(5000),
          });
          if (!response.ok) {
            let errorData;
            try {
              errorData = await response.json();
            } catch {
              errorData = {};
            }
            const errorName = errorData.error || `HTTPError_${response.status}`;
            const message = errorData.message || response.statusText || "Failed to fetch profile";
            if (response.status === 404) {
              console.warn(`Profile not found for ${identifier}`);
              setHasFetchedProfile(true);
              return;
            }
            throw new Error(`${errorName}: ${message}`);
          }
          const res = await response.json();
          if (res.success) {
            const updatedUser = {
              name: res.user.username,
              email: res.user.email || "Not provided",
              phone: res.user.phone || "Not provided",
            };
            setUserDetails(updatedUser);
            localStorage.setItem("user", JSON.stringify(res.user));
          }
        }
      } catch (err) {
        console.error(`Fetch user error [${err.name}]: ${err.message}`);
        setError(`Failed to sync user data: ${err.message}`);
      } finally {
        setHasFetchedProfile(true);
      }
    };

    const loadBookingDetails = async () => {
      try {
        let storedDetails = sessionStorage.getItem("bookingDetails");
        if (!storedDetails) {
          storedDetails = localStorage.getItem("bookingDetails");
          if (storedDetails) sessionStorage.setItem("bookingDetails", storedDetails);
        }

        if (storedDetails) {
          const parsedDetails = JSON.parse(storedDetails);
          if (parsedDetails.isFlightDeal) {
            parsedDetails.searchParams.tripType = "oneway";
            parsedDetails.selectedFlight.returnFlight = null;
          }
          setBookingDetails(parsedDetails);
          localStorage.setItem("bookingDetails", JSON.stringify(parsedDetails));
          console.log("BookingConfirmation bookingDetails:", parsedDetails);

          if (!parsedDetails.isSaved && userDetails) {
            await saveBooking(parsedDetails, userDetails, bookingNumber);
            parsedDetails.isSaved = true;
            setBookingDetails({ ...parsedDetails });
            localStorage.setItem("bookingDetails", JSON.stringify(parsedDetails));
            sessionStorage.setItem("bookingDetails", JSON.stringify(parsedDetails));
          }
        } else {
          throw new Error("NoBookingDetailsError: No booking details found");
        }
      } catch (err) {
        console.error(`Load booking error [${err.name}]: ${err.message}`);
        setError(`Failed to load booking: ${err.message}`);
      }
    };

    const loadData = async () => {
      await fetchUserDetails();
      await loadBookingDetails();
      setIsLoaded(true);
    };

    loadData();
  }, [bookingNumber]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (isLoaded && !bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
          <p>No booking details found. Please complete the booking process.</p>
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

  const { selectedFlight, selectedFare, searchParams } = bookingDetails;
  const { tripType, from, to, departDate, returnDate, multiCityFlights } = searchParams || {};
  const firstLeg = tripType === "multicity" && selectedFlight?.multiCityFlights ? selectedFlight.multiCityFlights[0] : selectedFlight;
  const isFlightDeal = bookingDetails.isFlightDeal;

  let flightSummary = "";
  if (tripType === "multicity" && multiCityFlights) {
    flightSummary = multiCityFlights
      .map((flight) => `${flight.from} → ${flight.to} • ${flight.depart}`)
      .join(" | ");
  } else if (tripType === "return") {
    flightSummary = `${from} → ${to} • ${departDate} - ${returnDate}`;
  } else if (tripType === "oneway") {
    flightSummary = `${from} → ${to} • ${departDate}`;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = { month: "short", day: "numeric" };
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
      return date.toLocaleDateString("en-US", options);
    } catch (e) {
      console.error("Date format error:", e);
      return "N/A";
    }
  };

  const getAirlineLogo = (flight) => {
    if (flight?.logo) return flight.logo;
    const airlineLogos = {
      indigo: "https://i.pinimg.com/474x/e9/82/55/e98255f2c1040c38dd2314a6288f1850.jpg",
      "air india": "https://i.pinimg.com/736x/dd/f1/ce/ddf1ceee59fd228201084a162cbfb48c.jpg",
      spicejet: "https://i.pinimg.com/474x/1f/5c/77/1f5c77cbff120399a8e50b101329a039.jpg",
      vistara: "https://i.pinimg.com/474x/6b/d3/8c/6bd38cd030c054f5ea2c5d16974d7fbb.jpg",
      default: "/api/placeholder/40/40",
    };
    if (!flight?.airline || typeof flight.airline !== "string") return airlineLogos.default;
    const airlineLower = flight.airline.toLowerCase();
    return airlineLogos[airlineLower] || airlineLogos.default;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 pb-12">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mb-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
            {error}
          </div>
        )}
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
            This reservation has been confirmed and the ticket numbers for this itinerary have been emailed. Thank you
            for booking with us!
          </p>
          <p className="text-gray-600">
            For any changes to the itinerary call us 24/7 Toll Free:{" "}
            <span className="text-red-500 font-bold">800-525-0400</span>
          </p>
        </div>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <FaUser className="text-gray-500 mr-2" />
              <div>
                <p className="text-gray-500 text-sm">Traveler</p>
                <p className="font-semibold">{userDetails?.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-gray-500 mr-2" />
              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                <p className="font-semibold">{userDetails?.phone}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="text-gray-500 mr-2" />
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-semibold">{userDetails?.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <div>
                <p className="text-gray-500 text-sm">Booked On</p>
                <p className="font-semibold">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Trip Summary</h3>
          <div className="mb-4">
            <h4 className="font-semibold flex items-center mb-2">
              <FaPlaneDeparture className="mr-2 text-blue-500" />
              Flight Summary
            </h4>

            {tripType === "multicity" && selectedFlight?.multiCityFlights ? (
              selectedFlight.multiCityFlights.map((leg, index) => (
                <div key={index} className="border rounded-lg p-3 mb-3 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <img src={getAirlineLogo(leg)} alt={leg.airline || "Unknown"} className="h-8 w-8 mr-2" />
                      <span className="font-semibold">{leg.airline || "Unknown Airline"}</span>
                    </div>
                    <div className="text-sm text-gray-500">Flight {leg.flightNumber || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-semibold">{leg.departure || "N/A"}</p>
                      <p className="text-xs text-gray-500">{leg.departureAirport ? `(${leg.departureAirport})` : ""}</p>
                      <p className="text-sm flex items-center">
                        <FaClock className="mr-1 text-xs" />
                        {leg.departureTime || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(leg.departureDate || departDate)}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-xs text-gray-500">
                        {leg.duration || calculateDuration(leg.departureTime, leg.arrivalTime)}
                      </div>
                      <div className="relative w-full h-0.5 bg-gray-300 my-1">
                        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {(leg.stops || 0) === 0 ? "Nonstop" : `${leg.stops} stop`}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-semibold">{leg.arrival || "N/A"}</p>
                      <p className="text-xs text-gray-500">{leg.arrivalAirport ? `(${leg.arrivalAirport})` : ""}</p>
                      <p className="text-sm flex items-center">
                        <FaClock className="mr-1 text-xs" />
                        {leg.arrivalTime || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(leg.departureDate || departDate)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : tripType === "return" && selectedFlight?.returnFlight ? (
              <>
                <div className="border rounded-lg p-3 mb-3 shadow-sm">
                  <div className="text-sm font-semibold bg-blue-50 p-1 rounded mb-2">Outbound Flight</div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <img src={getAirlineLogo(firstLeg)} alt={firstLeg?.airline || "Unknown"} className="h-8 w-8 mr-2" />
                      <span className="font-semibold">{firstLeg?.airline || "Unknown Airline"}</span>
                    </div>
                    <div className="text-sm text-gray-500">Flight {firstLeg?.flightNumber || "N/A"}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-semibold">{firstLeg?.departure || "N/A"}</p>
                      <p className="text-xs text-gray-500">
                        {firstLeg?.departureAirport ? `(${firstLeg.departureAirport})` : ""}
                      </p>
                      <p className="text-sm flex items-center">
                        <FaClock className="mr-1 text-xs" />
                        {firstLeg?.departureTime || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(departDate)}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-xs text-gray-500">
                        {firstLeg?.duration || calculateDuration(firstLeg?.departureTime, firstLeg?.arrivalTime)}
                      </div>
                      <div className="relative w-full h-0.5 bg-gray-300 my-1">
                        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {(firstLeg?.stops || 0) === 0 ? "Nonstop" : `${firstLeg?.stops} stop`}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-semibold">{firstLeg?.arrival || "N/A"}</p>
                      <p className="text-xs text-gray-500">
                        {firstLeg?.arrivalAirport ? `(${firstLeg.arrivalAirport})` : ""}
                      </p>
                      <p className="text-sm flex items-center">
                        <FaClock className="mr-1 text-xs" />
                        {firstLeg?.arrivalTime || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(departDate)}</p>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-3 mb-3 shadow-sm">
                  <div className="text-sm font-semibold bg-green-50 p-1 rounded mb-2">Return Flight</div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <img
                        src={getAirlineLogo(selectedFlight.returnFlight)}
                        alt={selectedFlight.returnFlight?.airline || "Unknown"}
                        className="h-8 w-8 mr-2"
                      />
                      <span className="font-semibold">
                        {selectedFlight.returnFlight?.airline || "Unknown Airline"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Flight {selectedFlight.returnFlight?.flightNumber || "N/A"}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-semibold">{selectedFlight.returnFlight?.departure || "N/A"}</p>
                      <p className="text-xs text-gray-500">
                        {selectedFlight.returnFlight?.departureAirport
                          ? `(${selectedFlight.returnFlight.departureAirport})`
                          : ""}
                      </p>
                      <p className="text-sm flex items-center">
                        <FaClock className="mr-1 text-xs" />
                        {selectedFlight.returnFlight?.departureTime || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(returnDate)}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-xs text-gray-500">
                        {selectedFlight.returnFlight?.duration ||
                          calculateDuration(
                            selectedFlight.returnFlight?.departureTime,
                            selectedFlight.returnFlight?.arrivalTime
                          )}
                      </div>
                      <div className="relative w-full h-0.5 bg-gray-300 my-1">
                        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {(selectedFlight.returnFlight?.stops || 0) === 0
                          ? "Nonstop"
                          : `${selectedFlight.returnFlight?.stops} stop`}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-semibold">{selectedFlight.returnFlight?.arrival || "N/A"}</p>
                      <p className="text-xs text-gray-500">
                        {selectedFlight.returnFlight?.arrivalAirport
                          ? `(${selectedFlight.returnFlight.arrivalAirport})`
                          : ""}
                      </p>
                      <p className="text-sm flex items-center">
                        <FaClock className="mr-1 text-xs" />
                        {selectedFlight.returnFlight?.arrivalTime || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(returnDate)}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="border rounded-lg p-3 mb-3 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <img src={getAirlineLogo(firstLeg)} alt={firstLeg?.airline || "Unknown"} className="h-8 w-8 mr-2" />
                    <span className="font-semibold">{firstLeg?.airline || "Unknown Airline"}</span>
                  </div>
                  <div className="text-sm text-gray-500">Flight {firstLeg?.flightNumber || "N/A"}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-semibold">{firstLeg?.departure || "N/A"}</p>
                    <p className="text-xs text-gray-500">
                      {firstLeg?.departureAirport ? `(${firstLeg.departureAirport})` : ""}
                    </p>
                    <p className="text-sm flex items-center">
                      <FaClock className="mr-1 text-xs" />
                      {firstLeg?.departureTime || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isFlightDeal && firstLeg?.departureDate
                        ? firstLeg.departureDate.split(", ")[1] + " " + firstLeg.departureDate.split(", ")[0]
                        : formatDate(departDate)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-500">
                      {firstLeg?.duration || calculateDuration(firstLeg?.departureTime, firstLeg?.arrivalTime)}
                    </div>
                    <div className="relative w-full h-0.5 bg-gray-300 my-1">
                      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {(firstLeg?.stops || 0) === 0 ? "Nonstop" : `${firstLeg?.stops} stop`}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-semibold">{firstLeg?.arrival || "N/A"}</p>
                    <p className="text-xs text-gray-500">
                      {firstLeg?.arrivalAirport ? `(${firstLeg.arrivalAirport})` : ""}
                    </p>
                    <p className="text-sm flex items-center">
                      <FaClock className="mr-1 text-xs" />
                      {firstLeg?.arrivalTime || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isFlightDeal && firstLeg?.arrivalDate
                        ? firstLeg.arrivalDate
                        : formatDate(firstLeg?.arrivalDate || departDate)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Passenger & Ticket Information</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Traveler Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Number
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meal Preference
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Special Request
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{userDetails?.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{ticketNumber}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">Any meal</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs flex items-start">
            <FaExclamationCircle className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">
              All special requests, meal preferences, seat requests are not guaranteed. You must contact your airline to
              reconfirm that they have received this request and confirmed it.
            </p>
          </div>
        </div>

        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Fare Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Fare Type</p>
              <p className="font-semibold">{selectedFare?.type || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Price</p>
              <p className="font-semibold text-green-600">₹{selectedFare?.price?.toLocaleString() || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Trip Type</p>
              <p className="font-semibold">
                {tripType === "oneway" ? "One Way" : tripType === "return" ? "Return" : "Multi-city"}
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
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-blue-700"
            >
              Back to Home
            </button>
            <button
              onClick={downloadInvoice}
              className="bg-green-600 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-green-700"
            >
              Download Invoice
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-5">--- Complete your trip ---</h2>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mb-6">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-yellow-100 rounded-full p-4 mb-4">
            <FaHotel className="text-yellow-500 text-4xl" />
          </div>
        </div>
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Need a place to stay in?</h2>
          <p className="text-gray-700">Explore hotels in the best spots nearby.</p>
        </div>
        <div className="text-center">
          <button
            onClick={() => navigate("/hotels")}
            className="bg-blue-600 text-white px-8 py-2 cursor-pointer rounded-lg hover:bg-blue-700"
          >
            Explore hotels
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-blue-100 rounded-full p-4 mb-4">
            <FaCar className="text-blue-500 text-4xl" />
          </div>
          <h2 className="text-xl font-semibold">Complete your car journey</h2>
        </div>
        <div className="mb-6 text-center">
          <p className="text-gray-700">Skip the crowds on public transport and relax on the road.</p>
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

export default BookingConfirmation;