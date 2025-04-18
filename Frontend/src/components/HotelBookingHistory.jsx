import { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

const HotelBookingHistory = ({
  user,
  setError,
  formatDate,
  numberToWords,
  fetchBookingHistory,
  showToast,
}) => {
  const [hotelBookings, setHotelBookings] = useState([]);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const API_URL = "http://localhost:5003/api";

  const getIdentifier = (user) => user.email || user.phone;

  const fetchHotelBookings = async (user) => {
    try {
      const identifier = getIdentifier(user);
      const response = await fetch(`${API_URL}/hotel_bookings?identifier=${encodeURIComponent(identifier)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setHotelBookings(data.bookings || []);
      } else {
        setError(data.error || "Failed to load hotel bookings");
      }
    } catch (err) {
      console.error("Fetch hotel bookings error:", err);
      setError(`Failed to load hotel bookings: ${err.message}`);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`${API_URL}/hotel_bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      if (res.success) {
        showToast("Your booking has been cancelled successfully!", "success");
        fetchBookingHistory(user);
      } else {
        setError(res.error || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Cancel booking error:", err);
      setError(`Failed to cancel booking: ${err.message}`);
    }
  };

  const confirmCancelBooking = (bookingId) => {
    setBookingToCancel(bookingId);
    setShowCancelConfirmation(true);
  };

  const handleConfirmCancel = async () => {
    if (bookingToCancel) {
      await handleCancelBooking(bookingToCancel);
      setShowCancelConfirmation(false);
      setBookingToCancel(null);
    }
  };

  const handleCancelConfirmation = () => {
    setShowCancelConfirmation(false);
    setBookingToCancel(null);
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
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...white);
    doc.text("TripGlide", 15, yPosition + 10);
    doc.setFontSize(14);
    doc.text("INVOICE", 190, yPosition + 10, { align: "right" });
    yPosition += 20;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: INV-2025-${booking.booking_number}`, 190, yPosition, {
      align: "right",
    });
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
    doc.text(`Traveler: ${booking.guest_name || "Guest"}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Email: ${booking.email || "Not provided"}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Phone: ${booking.phone || "Not provided"}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Booking ID: TG-${booking.booking_number}`, 15, yPosition);
    yPosition += 15;

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
    const hotelTitle = `${booking.hotel_name} - ${booking.room_type} (${booking.rooms} Room${booking.rooms > 1 ? "s" : ""})`;
    doc.text(hotelTitle, 15, yPosition, { maxWidth: 180 });
    yPosition += 8;
    const totalGuests = (booking.adults || 0) + (booking.children || 0);
    doc.text(`Guest: ${totalGuests} (Adults: ${booking.adults || 0}, Children: ${booking.children || 0})`, 15, yPosition);
    yPosition += 5;

    const checkIn = `Check-In: ${new Date(booking.check_in_date).toLocaleDateString(
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
    const checkOut = `Check-Out: ${new Date(booking.check_out_date).toLocaleDateString(
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
    doc.text(`Traveler: ${booking.guest_name || "Guest"}`, 15, yPosition);
    yPosition += 10;

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
    const baseRate = Math.round(booking.total_amount * 0.7);
    const taxes = Math.round(booking.total_amount * 0.3);
    const total = booking.total_amount;

    doc.setFillColor(245, 245, 245);
    doc.rect(15, yPosition - 5, 180, 8, "F");
    doc.text(
      `Room Charges (${booking.rooms} Room${booking.rooms > 1 ? "s" : ""})`,
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

    doc.setFillColor(...lightGray);
    doc.rect(15, yPosition - 5, 180, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Total", 20, yPosition);
    doc.text(`Rs. ${total.toLocaleString()}`, 190, yPosition, {
      align: "right",
    });
    yPosition += 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const totalInWords = `${numberToWords(total).toUpperCase()} ONLY (INR)`;
    doc.text(`Grand Total (in words): ${totalInWords}`, 15, yPosition, {
      maxWidth: 180,
    });
    yPosition += 10;

    doc.setFont("helvetica", "bold");
    doc.text(
      "Policy: Please ensure to present valid identification proof at the time of check-in.",
      15,
      yPosition,
      { maxWidth: 180 }
    );
    yPosition += 15;

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

    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text(
      "Note: This is a computer-generated invoice and does not require a signature/stamp.",
      15,
      290,
      { maxWidth: 180 }
    );

    doc.save(`invoice_${booking.booking_number}.pdf`);
  };

  useEffect(() => {
    if (user) {
      fetchHotelBookings(user);
    }
  }, [user]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const buttonVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-800">Hotel Bookings</h3>
      {hotelBookings.length === 0 ? (
        <p className="text-gray-500 text-sm">No hotel bookings found.</p>
      ) : (
        <>
          {hotelBookings
            .filter((booking) => booking.status !== "Cancelled")
            .map((booking) => (
              <motion.div
                key={booking.id}
                variants={itemVariants}
                className="rounded-lg p-4 shadow-md border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-md font-medium text-gray-800">
                    {booking.hotel_name} - {booking.room_type}
                  </h4>
                  {booking.status === "Ongoing" ? (
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                      Ongoing
                    </span>
                  ) : booking.status === "Upcoming" ? (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                      Upcoming
                    </span>
                  ) : null}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Booking Number</p>
                    <p className="font-medium">{booking.booking_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Traveler</p>
                    <p className="font-medium">{booking.guest_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{booking.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium">{booking.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Arrival</p>
                    <p className="font-medium">{booking.arrival}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Check-in Date</p>
                    <p className="font-medium">{formatDate(booking.check_in_date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Check-out Date</p>
                    <p className="font-medium">{formatDate(booking.check_out_date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Adults</p>
                    <p className="font-medium">{booking.adults}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Children</p>
                    <p className="font-medium">{booking.children}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rooms</p>
                    <p className="font-medium">{booking.rooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Room Type</p>
                    <p className="font-medium">{booking.room_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Price Per Night</p>
                    <p className="font-medium">₹{booking.price_per_night.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Price</p>
                    <p className="font-medium">₹{booking.total_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium">{booking.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Booked On</p>
                    <p className="font-medium">{formatDate(booking.booked_on)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Created At</p>
                    <p className="font-medium">{formatDate(booking.created_at)}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-4">
                  {booking.status === "Upcoming" && (
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => confirmCancelBooking(booking.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Cancel Booking
                    </motion.button>
                  )}
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => downloadInvoice(booking)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
                  >
                    <FaDownload className="mr-2" />
                    Download Invoice
                  </motion.button>
                </div>
              </motion.div>
            ))}
          {hotelBookings.filter((booking) => booking.status === "Cancelled").length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mt-6">Cancelled Bookings</h3>
              {hotelBookings
                .filter((booking) => booking.status === "Cancelled")
                .map((booking) => (
                  <motion.div
                    key={booking.id}
                    variants={itemVariants}
                    className="rounded-lg p-4 shadow-xl bg-gray-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-md font-medium text-gray-800">
                        {booking.hotel_name} - {booking.room_type}
                      </h4>
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                        Cancelled
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Booking Number</p>
                        <p className="font-medium">{booking.booking_number}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Traveler</p>
                        <p className="font-medium">{booking.guest_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Check-in Date</p>
                        <p className="font-medium">{formatDate(booking.check_in_date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Check-out Date</p>
                        <p className="font-medium">{formatDate(booking.check_out_date)}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => downloadInvoice(booking)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
                      >
                        <FaDownload className="mr-2" />
                        Download Invoice
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
            </>
          )}
        </>
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
              <p className="text-gray-600 mb-6">Are you sure you want to cancel your booking?</p>
              <div className="flex justify-end gap-4">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleCancelConfirmation}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  No
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleConfirmCancel}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Yes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HotelBookingHistory;