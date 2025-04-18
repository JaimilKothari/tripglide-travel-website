import { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

const FlightBookingHistory = ({
  user,
  setError,
  isLoading,
  setIsLoading,
  showToast,
  API_URL_FLIGHT,
  formatDate,
  numberToWords,
}) => {
  const [flightBookings, setFlightBookings] = useState([]);
  const [cancellingBookings, setCancellingBookings] = useState(new Set());

  const getIdentifier = (user) => user.email || user.phone;

  const fetchFlightBookings = async (user) => {
    setIsLoading(true);
    try {
      const identifier = getIdentifier(user);
      if (!identifier) {
        setError("User email or phone is required to fetch bookings");
        return;
      }
      const url = `${API_URL_FLIGHT}/flight_bookings?identifier=${encodeURIComponent(identifier)}`;
      let attempts = 2;
      while (attempts > 0) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        try {
          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || errorData.error || `Failed to load bookings (Status: ${response.status})`);
          }
          const data = await response.json();
          if (data.success) {
            setFlightBookings(data.bookings || []);
            break;
          } else {
            throw new Error(data.error || "Failed to load bookings");
          }
        } catch (err) {
          clearTimeout(timeoutId);
          if (err.name === "AbortError") {
            throw new Error("Request timed out for bookings");
          }
          attempts--;
          if (attempts === 0) {
            console.error("Failed to fetch bookings after retries:", err);
            setError(`Unable to load bookings: ${err.message}`);
          }
          if (attempts > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }
    } catch (err) {
      console.error("Fetch booking history error:", err);
      setError(`Failed to load booking history: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelFlight = async (bookingNumber) => {
    if (!window.confirm("Are you sure you want to cancel this flight booking?")) return;
    setCancellingBookings((prev) => new Set([...prev, bookingNumber]));
    try {
      const response = await fetch(`${API_URL_FLIGHT}/cancel_flight_booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_number: bookingNumber }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || `Failed to cancel booking (Status: ${response.status})`);
      }
      const data = await response.json();
      if (data.success) {
        showToast("Flight booking cancelled successfully", "success");
        setFlightBookings((prev) => {
          const updated = prev.map((b) =>
            b.booking_number === bookingNumber ? { ...b, status: "Cancelled" } : b
          );
          return updated.sort((a, b) => {
            const order = { Upcoming: 1, Completed: 2, Cancelled: 3 };
            return order[a.status] - order[b.status] || new Date(b.booked_on) - new Date(a.booked_on);
          });
        });
      } else {
        throw new Error(data.error || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Cancel flight error:", err);
      showToast(`Failed to cancel booking: ${err.message}`, "error");
    } finally {
      setCancellingBookings((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookingNumber);
        return newSet;
      });
    }
  };

  const downloadInvoice = (booking) => {
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
    doc.text(`Invoice No: INV-2025-${booking.booking_number}`, 190, yPosition, { align: "right" });
    yPosition += 5;
    doc.text(
      `Booking Date: ${new Date(booking.booked_on).toLocaleDateString("en-US", {
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
    doc.text(`Traveler: ${booking.traveler_name || "Guest"}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Email: ${booking.email || "Not provided"}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Booking ID: TG-${booking.booking_number}`, 15, yPosition);
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
    const flightTitle = `${booking.airline || "Unknown Airline"} • ${
      booking.flight_number || "N/A"
    } - ${booking.departure_airport} to ${booking.arrival_airport}`;
    doc.text(flightTitle, 15, yPosition, { maxWidth: 180 });
    yPosition += 8;
    const travelDate = `Travel Date: ${new Date(booking.departure_date).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })}, ${booking.departure_time || "N/A"}`;
    doc.text(travelDate, 15, yPosition);
    yPosition += 5;
    doc.text(`Traveler: ${booking.traveler_name || "Guest"}`, 15, yPosition);
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
    const baseFare = Math.round(booking.total_price * 0.7) || 0; // Assume 70% is base fare
    const taxes = Math.round(booking.total_price * 0.3) || 0; // Assume 30% is taxes
    const total = booking.total_price || 0;

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
    doc.text("_tripglide Customer Support", 15, 270);
    yPosition = 275;
    doc.setFont("helvetica", "normal");
    doc.text("_tripglide Pvt. Ltd.", 15, yPosition);
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

    doc.save(`invoice_${booking.booking_number}.pdf`);
  };

  useEffect(() => {
    fetchFlightBookings(user);
  }, [user]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const buttonVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800">Flight Bookings</h3>
      {flightBookings.length === 0 ? (
        <p className="text-gray-500 text-sm">No flight bookings found.</p>
      ) : (
        flightBookings.map((booking) => (
          <motion.div
            key={booking.booking_number}
            variants={itemVariants}
            className={`border rounded-lg p-4 mb-4 shadow-sm ${
              booking.status === "Cancelled" ? "bg-gray-100 opacity-75 border-gray-300" : "bg-white"
            }`}
            layout
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-800 max-w-2xl">
                {booking.airline} • {booking.departure_airport} → {booking.arrival_airport}
              </p>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    booking.status === "Upcoming"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "Completed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
                {booking.status === "Upcoming" && !cancellingBookings.has(booking.booking_number) && (
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleCancelFlight(booking.booking_number)}
                    className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg transition"
                  >
                    Cancel Flight
                  </motion.button>
                )}
                {cancellingBookings.has(booking.booking_number) && (
                  <p className="text-sm text-gray-500">Cancelling...</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500">Booking Number</p>
                <p className="text-sm font-semibold">{booking.booking_number}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Traveler</p>
                <p className="text-sm">{booking.traveler_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm">{booking.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Flight Number</p>
                <p className="text-sm font-semibold">{booking.flight_number || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Departure</p>
                <p className="text-sm">{formatDate(booking.departure_date)} • {booking.departure_time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Arrival</p>
                <p className="text-sm">{formatDate(booking.arrival_date)} • {booking.arrival_time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm">{booking.duration || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Price</p>
                <p className="text-sm font-semibold">₹{Number(booking.total_price).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Trip Type</p>
                <p className="text-sm">{booking.trip_type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Booked On</p>
                <p className="text-sm">{formatDate(booking.booked_on)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Created At</p>
                <p className="text-sm">{formatDate(booking.created_at)}</p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => downloadInvoice(booking)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm flex items-center"
              >
                <FaDownload className="mr-2" />
                Invoice
              </motion.button>
            </div>
          </motion.div>
        ))
      )}
    </>
  );
};

export default FlightBookingHistory;