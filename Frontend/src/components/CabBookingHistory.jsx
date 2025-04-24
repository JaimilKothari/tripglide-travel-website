import { useState } from "react";
import { FaCar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

const CabBookingHistory = ({ user, carRentals, setCarRentals, fetchBookingHistory, showToast, isLoading }) => {
  const [error, setError] = useState("");
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const CAR_API_URL = "http://localhost:5005/api";

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Not provided";
    return timeString;
  };

  const numberToWords = (num) => {
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const scales = ["", "Thousand", "Lakh", "Crore"];

    if (num === 0) return "Zero";

    const [integerPart, decimalPart = "0"] = num.toString().split(".");
    let numStr = integerPart;
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

    let result = words.join(" ");
    if (decimalPart && parseInt(decimalPart) > 0) {
      result += ` and ${numberToWords(parseInt(decimalPart))} Paise`;
    }
    return result;
  };

  const formatExtras = (extras) => {
    if (!extras) return "None";
    return [
      extras.additional_driver ? "Additional Driver" : "",
      extras.extra_luggage ? "Extra Luggage" : "",
      extras.child_seat ? "Child Seat" : "",
    ]
      .filter(Boolean)
      .join(", ") || "None";
  };

  const downloadInvoice = (booking) => {
    const doc = new jsPDF();
    let yPosition = 10;

    const darkBlue = [30, 58, 138];
    const lightGray = [243, 244, 246];
    const white = [255, 255, 255];
    const darkGray = [55, 65, 81];

    doc.setLineWidth(0.5);
    doc.setDrawColor(...darkBlue);
    doc.rect(5, 5, 200, 287, "S");

    doc.setFillColor(...darkBlue);
    doc.rect(0, 0, 210, 30, "F");
    doc.setFontSize(18);
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.text("TripGlide Invoice", 10, 20);

    doc.setFontSize(12);
    doc.setTextColor(...darkGray);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice Number: ${booking.booking_id || "N/A"}`, 10, 40);
    doc.text(`Date: ${new Date().toLocaleDateString("en-US")}`, 10, 50);
    doc.text(`Customer: ${user.username || "Guest"}`, 10, 60);
    doc.text(`Email: ${user.email || "N/A"}`, 10, 70);
    doc.text(`Phone: ${user.phone || "N/A"}`, 10, 80);

    yPosition = 90;
    doc.setFillColor(...lightGray);
    doc.rect(10, yPosition, 190, 10, "F");
    doc.setFontSize(12);
    doc.setTextColor(...darkGray);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Details", 15, yPosition + 7);
    yPosition += 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
     doc.text(`Car: ${booking.car_make || "N/A"} ${booking.car_model || ""}`, 15, yPosition);
    doc.text(`Type: ${booking.car_type || "N/A"}`, 15, yPosition + 10);
    doc.text(`Agency: ${booking.agency || "N/A"}`, 15, yPosition + 20);
    doc.text(`Fuel Policy: ${booking.fuel_policy || "N/A"}`, 15, yPosition + 30);
    doc.text(`Extras: ${formatExtras(booking.extras)}`, 15, yPosition + 40);
    doc.text(`Pickup: ${booking.pickup_location || "N/A"} on ${formatDate(booking.pickup_date)} ${booking.pickup_time || ""}`, 15, yPosition + 50);
    doc.text(`Dropoff: ${booking.dropoff_location || "N/A"} on ${formatDate(booking.dropoff_date)} ${booking.dropoff_time || ""}`, 15, yPosition + 60);
    doc.text(`Total Price: ₹${(booking.total_price || 0).toLocaleString()}`, 15, yPosition + 70);
    doc.text(`Booked On: ${formathandel(formatDate(booking.created_at || booking.pickup_date || "N/A"))}`, 15, yPosition + 80);
    doc.text(`Deal ID: ${booking.deal_id || "N/A"}`, 15, yPosition + 90);
    yPosition += 100;

    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: ₹${(booking.total_price || 0).toLocaleString()}`, 15, yPosition);
    doc.text(`Amount in Words: ${numberToWords(booking.total_price || 0)} Rupees`, 15, yPosition + 10);
    yPosition += 20;

    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.text("Thank you for choosing TripGlide!", 15, 280);
    doc.text("For support, contact: support@tripglide.com", 15, 290, { maxWidth: 180 });

    doc.save(`invoice_${booking.booking_id || "booking"}.pdf`);
  };

  const handleCancelCarBooking = async (bookingId) => {
    try {
      setIsCancelLoading(true);
      const response = await fetch(`${CAR_API_URL}/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      if (res.success) {
        showToast("Your car rental has been cancelled successfully!", "success");
        fetchBookingHistory(user);
      } else {
        setError(res.error || "Failed to cancel car rental");
        setTimeout(() => setError(""), 5000);
      }
    } catch (err) {
      console.error("Cancel car booking error:", err);
      setError(`Failed to cancel car rental: ${err.message}`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsCancelLoading(false);
    }
  };

  const confirmCancelBooking = (bookingId) => {
    setBookingToCancel(bookingId);
    setShowCancelConfirmation(true);
  };

  const handleConfirmCancel = async () => {
    if (bookingToCancel) {
      await handleCancelCarBooking(bookingToCancel);
      setShowCancelConfirmation(false);
      setBookingToCancel(null);
    }
  };

  const handleCancelConfirmation = () => {
    setShowCancelConfirmation(false);
    setBookingToCancel(null);
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const buttonVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };

  // Validate carRentals prop
  if (!Array.isArray(carRentals)) {
    console.error("carRentals is not an array:", carRentals);
    return <p className="text-red-600 text-sm">Error: Invalid booking data</p>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
    >
      <div className="flex items-center mb-6">
        <FaCar className="text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Car Rentals</h2>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200"
        >
          {error}
        </motion.div>
      )}
      {isLoading && <p className="text-gray-500 text-sm mb-4">Loading car rentals...</p>}
      {!isLoading && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {carRentals.length === 0 ? (
            <p className="text-gray-500 text-sm">No car rentals found.</p>
          ) : (
            carRentals
              .filter((rental) => rental.status !== "Cancelled")
              .map((rental) => (
                <motion.div
                  key={rental.booking_id}
                  variants={itemVariants}
                  className="rounded-lg p-4 shadow-md border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-md font-medium text-gray-800">
                      {rental.car_make || "N/A"} {rental.car_model || ""} - {rental.car_type || "N/A"}
                    </h4>
                    {rental.status === "Ongoing" ? (
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        Ongoing
                      </span>
                    ) : rental.status === "Upcoming" ? (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                        Upcoming
                      </span>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Booking ID</p>
                      <p className="font-medium">{rental.booking_id || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Agency</p>
                      <p className="font-medium">{rental.agency || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Pickup Location</p>
                      <p className="font-medium">{rental.pickup_location || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Pickup Date/Time</p>
                      <p className="font-medium">
                        {formatDate(rental.pickup_date)} {formatTime(rental.pickup_time)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Dropoff Location</p>
                      <p className="font-medium">{rental.dropoff_location || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Dropoff Date/Time</p>
                      <p className="font-medium">
                        {formatDate(rental.dropoff_date)} {formatTime(rental.dropoff_time)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Passengers</p>
                      <p className="font-medium">{rental.car_passengers || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Transmission</p>
                      <p className="font-medium">{rental.car_transmission || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">AC</p>
                      <p className="font-medium">{rental.car_ac ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fuel Policy</p>
                      <p className="font-medium">{rental.fuel_policy || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Price Per Day</p>
                      <p className="font-medium">₹{(rental.price_per_day || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Price</p>
                      <p className="font-medium">₹{(rental.total_price || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Extras</p>
                      <p className="font-medium">{formatExtras(rental.extras)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Booked On</p>
                      <p className="font-medium">{formatDate(rental.created_at || rental.pickup_date || "N/A")}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Deal ID</p>
                      <p className="font-medium">{rental.deal_id || "N/A"}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4">
                    {rental.status === "Upcoming" && (
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => confirmCancelBooking(rental.booking_id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        disabled={isCancelLoading}
                      >
                        {isCancelLoading ? "Cancelling..." : "Cancel Booking"}
                      </motion.button>
                    )}
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => downloadInvoice(rental)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Download Invoice
                    </motion.button>
                  </div>
                </motion.div>
              ))
          )}
          {carRentals.filter((rental) => rental.status === "Cancelled").length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mt-6">Cancelled Rentals</h3>
              {carRentals
                .filter((rental) => rental.status === "Cancelled")
                .map((rental) => (
                  <motion.div
                    key={rental.booking_id}
                    variants={itemVariants}
                    className="rounded-lg p-4 shadow-xl bg-gray-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-md font-medium text-gray-800">
                        {rental.car_make || "N/A"} {rental.car_model || ""} - {rental.car_type || "N/A"}
                      </h4>
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                        Cancelled
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Booking ID</p>
                        <p className="font-medium">{rental.booking_id || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Agency</p>
                        <p className="font-medium">{rental.agency || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Pickup Date</p>
                        <p className="font-medium">{formatDate(rental.pickup_date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Dropoff Date</p>
                        <p className="font-medium">{formatDate(rental.dropoff_date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Price</p>
                        <p className="font-medium">₹{(rental.total_price || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Extras</p>
                        <p className="font-medium">{formatExtras(rental.extras)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Deal ID</p>
                        <p className="font-medium">{rental.deal_id || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-medium">{rental.status || "N/A"}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => downloadInvoice(rental)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Download Invoice
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
            </>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {showCancelConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCancelConfirmation}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </motion.button>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Cancellation</h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to cancel this car rental? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleCancelConfirmation}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  No, Keep Booking
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleConfirmCancel}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  disabled={isCancelLoading}
                >
                  {isCancelLoading ? "Cancelling..." : "Yes, Cancel"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CabBookingHistory;