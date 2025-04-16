import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle, FaUser, FaBars, FaEdit, FaLock, FaMobileAlt, FaSignOutAlt, FaUsers, FaLaptop, FaPlane, FaHotel, FaCar, FaDownload
} from "react-icons/fa";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";

const numberToWords = (num) => {
  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = [
    "",
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
  const tens = [
    "",
    "Ten",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
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

  return words;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [coTravellers, setCoTravellers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [newTraveller, setNewTraveller] = useState({ name: "", relationship: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [verificationData, setVerificationData] = useState({ identifier: "", code: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [activeSection, setActiveSection] = useState("Profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [flightBookings, setFlightBookings] = useState([]);
  const [hotelBookings, setHotelBookings] = useState([]);
  const [carRentals, setCarRentals] = useState([]);
  const [historyTab, setHistoryTab] = useState("Flights");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [cancellingBookings, setCancellingBookings] = useState(new Set());

  const API_URL_LOGIN = "http://localhost:5001/api";
  const API_URL_FLIGHT = "http://localhost:5000/api";

  const statesList = [
    "Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
    "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal",
  ];

  const profileFields = [
    { label: "Name", name: "username" },
    { label: "Birthday", name: "birthday", type: "date" },
    { label: "Gender", name: "gender" },
    { label: "Address", name: "address" },
    { label: "Pincode", name: "pincode" },
    { label: "State", name: "state" },
    { label: "Email", name: "email" },
    { label: "Phone", name: "phone" },
  ];

  const isEmail = (str) => /^[\w\.-]+@[\w\.-]+\.\w+$/.test(str);
  const isPhone = (str) => /^\d{10}$/.test(str);
  const validatePincode = (str) => /^\d{6}$/.test(str);

  const calculateCompletionPercentage = (userData) => {
    const totalFields = profileFields.length;
    let filledFields = 0;
    profileFields.forEach((field) => {
      if (userData[field.name]) filledFields++;
    });
    return Math.round((filledFields / totalFields) * 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const getIdentifier = (user) => user.email || user.phone;

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: "", type: "", visible: false }), 3000);
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
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setFormData({
          ...parsedUser,
          birthday: parsedUser.birthday ? new Date(parsedUser.birthday).toISOString().split('T')[0] : ""
        });
        setCompletionPercentage(calculateCompletionPercentage(parsedUser));
        fetchProfile(getIdentifier(parsedUser));
        fetchBookingHistory(parsedUser);
      } catch {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
    const storedCoTravellers = localStorage.getItem("coTravellers");
    const storedDevices = localStorage.getItem("devices");
    if (storedCoTravellers) setCoTravellers(JSON.parse(storedCoTravellers));
    if (storedDevices) {
      setDevices(JSON.parse(storedDevices));
    } else {
      const currentDevice = { id: Date.now(), name: navigator.userAgent, lastLogin: new Date().toISOString(), isCurrent: true };
      setDevices([currentDevice]);
      localStorage.setItem("devices", JSON.stringify([currentDevice]));
    }
  }, [navigate]);

  const fetchProfile = async (identifier) => {
    try {
      const response = await fetch(`${API_URL_LOGIN}/profile?identifier=${encodeURIComponent(identifier)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      if (res.success) {
        const updatedUser = {
          ...res.user,
          birthday: res.user.birthday ? new Date(res.user.birthday).toISOString().split('T')[0] : ""
        };
        setUser(updatedUser);
        setFormData(updatedUser);
        setCompletionPercentage(calculateCompletionPercentage(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setError(res.error || "Failed to fetch profile");
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      setError(`Failed to load profile data: ${err.message}`);
    }
  };

  const fetchBookingHistory = async (user) => {
    setIsLoading(true);
    try {
      const identifier = getIdentifier(user);
      if (!identifier) {
        setError("User email or phone is required to fetch bookings");
        return;
      }
      const endpoints = [
        { url: `${API_URL_FLIGHT}/flight_bookings?identifier=${encodeURIComponent(identifier)}`, setter: setFlightBookings, key: "bookings" },
      ];
      for (const { url, setter, key } of endpoints) {
        let attempts = 2;
        while (attempts > 0) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || errorData.error || `Failed to load ${key} (Status: ${response.status})`);
            }
            const data = await response.json();
            if (data.success) {
              setter(data[key] || []);
              break;
            } else {
              throw new Error(data.error || `Failed to load ${key}`);
            }
          } catch (err) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
              throw new Error(`Request timed out for ${key}`);
            }
            attempts--;
            if (attempts === 0) {
              console.error(`Failed to fetch ${key} after retries:`, err);
              setError(`Unable to load ${key}: ${err.message}`);
            }
            if (attempts > 0) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  const handleVerificationChange = (e) => setVerificationData({ ...verificationData, [e.target.name]: e.target.value });

  const handleAddCoTraveller = () => {
    if (!newTraveller.name || !newTraveller.relationship) {
      setError("Please fill in all traveller details");
      return;
    }
    const updatedCoTravellers = [...coTravellers, { id: Date.now(), ...newTraveller }];
    setCoTravellers(updatedCoTravellers);
    localStorage.setItem("coTravellers", JSON.stringify(updatedCoTravellers));
    setNewTraveller({ name: "", relationship: "" });
    setError("");
  };

  const handleDeleteCoTraveller = (id) => {
    const updatedCoTravellers = coTravellers.filter((t) => t.id !== id);
    setCoTravellers(updatedCoTravellers);
    localStorage.setItem("coTravellers", JSON.stringify(updatedCoTravellers));
  };

  const handleDeleteDevice = (id) => {
    const updatedDevices = devices.filter((d) => d.id !== id && !d.isCurrent);
    setDevices(updatedDevices);
    localStorage.setItem("devices", JSON.stringify(updatedDevices));
  };

  const handleSave = async () => {
    if (formData.email && !isEmail(formData.email)) {
      setError("Invalid email format");
      return;
    }
    if (formData.phone && !isPhone(formData.phone)) {
      setError("Phone number must be 10 digits");
      return;
    }
    if (formData.pincode && !validatePincode(formData.pincode)) {
      setError("Pincode must be 6 digits");
      return;
    }
    try {
      const response = await fetch(`${API_URL_LOGIN}/update_profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, identifier: getIdentifier(user) }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      if (res.success) {
        showToast("Profile updated successfully!", "success");
        localStorage.setItem("user", JSON.stringify(formData));
        setUser(formData);
        setCompletionPercentage(calculateCompletionPercentage(formData));
        setShowPopup(false);
        setError("");
        fetchProfile(getIdentifier(user));
      } else {
        setError(res.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      setError(`Failed to update profile: ${err.message}`);
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    try {
      const response = await fetch(`${API_URL_LOGIN}/change_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: getIdentifier(user), currentPassword, newPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      if (res.success) {
        showToast("Password changed successfully!", "success");
        setShowPasswordPopup(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordError("");
      } else {
        setPasswordError(res.error || "Failed to change password");
      }
    } catch (err) {
      console.error("Change password error:", err);
      setPasswordError(`Failed to change password: ${err.message}`);
    }
  };

  const handleRequestVerification = async (phone) => {
    try {
      const response = await fetch(`${API_URL_LOGIN}/request_verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: phone }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      if (res.success) {
        setVerificationData({ identifier: phone, code: "" });
        setShowVerificationPopup(true);
        setVerificationError("");
      } else {
        setError(res.error || "Failed to send verification code");
      }
    } catch (err) {
      console.error("Request verification error:", err);
      setError(`Failed to send verification code: ${err.message}`);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch(`${API_URL_LOGIN}/verify_code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verificationData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      if (res.success) {
        showToast("Phone verified successfully!", "success");
        setShowVerificationPopup(false);
        setVerificationData({ identifier: "", code: "" });
        fetchProfile(getIdentifier(user));
      } else {
        setVerificationError(res.error || "Invalid code");
      }
    } catch (err) {
      console.error("Verify code error:", err);
      setVerificationError(`Failed to verify code: ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("coTravellers");
    localStorage.removeItem("devices");
    navigate("/login");
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const openEditPopup = () => setShowPopup(true);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }} className="text-gray-600 text-lg">
          Loading...
        </motion.div>
      </div>
    );
  }

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const buttonVariants = { hover: { scale: 1.05 }, tap: { scale: 0.95 } };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white text-sm z-50 ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:hidden flex justify-between items-center p-4 bg-white shadow-md border-b border-gray-200">
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-700 hover:text-blue-600 focus:outline-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaBars size={24} />
        </motion.button>
        <h1 className="text-xl font-semibold text-gray-800 cursor-pointer">Dashboard</h1>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 max-w-7xl mx-auto w-full p-4 gap-6">
        <motion.nav
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`lg:w-64 bg-white rounded-xl shadow-lg p-6 fixed inset-y-0 left-0 z-50 w-64 transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out border border-gray-100`}
        >
          <div className="flex items-center mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <FaUser className="text-blue-600 text-xl" />
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-800 truncate">{user.username}</span>
          </div>
          <ul className="space-y-2">
            {[
              { section: "Profile", label: "Profile", icon: <FaUser className="mr-2" /> },
              { section: "BookingHistory", label: "Booking History", icon: <FaPlane className="mr-2" /> },
              { section: "Login_details", label: "Login Details", icon: <FaLock className="mr-2" /> },
              { section: "coTravellersSection", label: "Co-Travellers", icon: <FaUsers className="mr-2" /> },
              { section: "devicesSection", label: "Devices", icon: <FaLaptop className="mr-2" /> },
              { section: "logoutSection", label: "Logout", icon: <FaSignOutAlt className="mr-2" />, onClick: handleLogout },
            ].map((item, index) => (
              <li key={index}>
                <motion.button
                  onClick={() => (item.onClick ? item.onClick() : handleSectionChange(item.section))}
                  variants={itemVariants}
                  className={`w-full flex cursor-pointer items-center p-3 rounded-lg text-gray-700 hover:bg-blue-50 transition ${
                    activeSection === item.section ? "bg-blue-100 text-blue-600 font-semibold" : ""
                  }`}
                  whileHover={{ x: 5 }}
                >
                  {item.icon}
                  {item.label}
                </motion.button>
              </li>
            ))}
          </ul>
        </motion.nav>

        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 backdrop-brightness-30 z-40" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}

        <div className="flex-1 w-full lg:ml-0 mt-4 lg:mt-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeSection === "Profile" && (
              <motion.div key="Profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Completion</h2>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
                    />
                  </div>
                  <p className="text-sm text-gray-600">{completionPercentage}% Complete</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Personal Details</h2>
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={openEditPopup}
                      className="mt-4 sm:mt-0 flex cursor-pointer items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </motion.button>
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
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                    {profileFields.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <span className="text-sm text-gray-600">
                          {item.name === "birthday" ? formatDate(user[item.name]) : user[item.name] || "Not provided"}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeSection === "BookingHistory" && (
              <motion.div key="BookingHistory" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Booking History</h2>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200"
                  >
                    {error}
                  </motion.div>
                )}
                {isLoading && <p className="text-gray-500 text-sm mb-4">Loading bookings...</p>}
                {!isLoading && (
                  <div className="flex border-b border-gray-200 mb-6">
                    {["Flights", "Hotels", "Cars"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setHistoryTab(tab)}
                        className={`px-4 py-2 cursor-pointer text-sm font-medium ${historyTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                  {historyTab === "Flights" && !isLoading && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800">Flight Bookings</h3>
                      {flightBookings.length === 0 ? (
                        <p className="text-gray-500 text-sm">No flight bookings found.</p>
                      ) : (
                        flightBookings.map((booking, index) => (
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
                  )}
                  {historyTab === "Hotels" && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800">Hotel Bookings</h3>
                      {hotelBookings.length === 0 ? (
                        <p className="text-gray-500 text-sm">No hotel bookings found.</p>
                      ) : (
                        hotelBookings.map((booking) => (
                          <motion.div key={booking.booking_id} variants={itemVariants} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{booking.hotel_name || "Hotel Details"}</p>
                              <p className="text-sm text-gray-500">{formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}</p>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </>
                  )}
                  {historyTab === "Cars" && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800">Car Rentals</h3>
                      {carRentals.length === 0 ? (
                        <p className="text-gray-500 text-sm">No car rentals found.</p>
                      ) : (
                        carRentals.map((rental) => (
                          <motion.div key={rental.rental_id} variants={itemVariants} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{rental.car_name || "Car Details"}</p>
                              <p className="text-sm text-gray-500">{formatDate(rental.start_date)} - {formatDate(rental.end_date)}</p>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}

            {activeSection === "Login_details" && (
              <motion.div key="Login_details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Login Details</h2>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200"
                  >
                    {error}
                  </motion.div>
                )}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                  <motion.div variants={itemVariants} className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <FaMobileAlt className="mr-2 text-gray-500" />
                      Mobile Number
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">{user.phone || "Not provided"}</span>
                      {user.phone && (user.otp_verified ? <FaCheckCircle className="text-green-500" /> : (
                        <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={() => handleRequestVerification(user.phone)} className="text-blue-600 text-sm hover:underline">
                          Verify
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Email</span>
                    <span className="text-sm text-gray-600">{user.email || "Not provided"}</span>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <FaLock className="mr-2 text-gray-500" />
                      Password
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">•••••••</span>
                      <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={() => setShowPasswordPopup(true)} className="text-blue-600 cursor-pointer text-sm hover:underline">
                        Change
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {activeSection === "coTravellersSection" && (
              <motion.div key="coTravellersSection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Co-Travellers</h2>
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newTraveller.name}
                      onChange={(e) => setNewTraveller({ ...newTraveller, name: e.target.value })}
                      className="border border-gray-200 rounded-lg p-3 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                    />
                    <input
                      type="text"
                      placeholder="Relationship"
                      value={newTraveller.relationship}
                      onChange={(e) => setNewTraveller({ ...newTraveller, relationship: e.target.value })}
                      className="border border-gray-200 rounded-lg p-3 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                    />
                    <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={handleAddCoTraveller} className="flex items-center cursor-pointer bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition">
                      <AiOutlinePlus className="mr-2" />
                      Add
                    </motion.button>
                  </div>
                  {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                </div>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                  {coTravellers.length === 0 ? (
                    <p className="text-gray-500 text-sm">No co-travellers added yet.</p>
                  ) : (
                    coTravellers.map((traveller) => (
                      <motion.div key={traveller.id} variants={itemVariants} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{traveller.name}</p>
                          <p className="text-sm text-gray-500">{traveller.relationship}</p>
                        </div>
                        <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={() => handleDeleteCoTraveller(traveller.id)} className="text-red-500 hover:text-red-700">
                          <AiOutlineDelete size={20} />
                        </motion.button>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </motion.div>
            )}

            {activeSection === "devicesSection" && (
              <motion.div key="devicesSection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Devices</h2>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                  {devices.map((device) => (
                    <motion.div key={device.id} variants={itemVariants} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{device.name.substring(0, 50)}...</p>
                        <p className="text-sm text-gray-500">Last login: {new Date(device.lastLogin).toLocaleString()}{device.isCurrent && " (Current)"}</p>
                      </div>
                      {!device.isCurrent && (
                        <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={() => handleDeleteDevice(device.id)} className="text-red-500 hover:text-red-700">
                          <AiOutlineDelete size={20} />
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowPopup(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <IoClose size={24} />
              </motion.button>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
                  {error}
                </motion.div>
              )}
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-h-[60vh] overflow-y-auto">
                {profileFields.map((item, index) => (
                  <motion.div key={index} variants={itemVariants} className={item.name === "address" ? "col-span-1 sm:col-span-2" : "col-span-1"}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
                    {item.name === "state" ? (
                      <select
                        name={item.name}
                        value={formData[item.name] || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                      >
                        <option value="">Select State</option>
                        {statesList.map((state, stateIndex) => (
                          <option key={stateIndex} value={state}>{state}</option>
                        ))}
                      </select>
                    ) : item.name === "gender" ? (
                      <select
                        name={item.name}
                        value={formData[item.name] || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    ) : (
                      <input
                        type={item.type || "text"}
                        name={item.name}
                        value={formData[item.name] || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
              <div className="flex justify-end">
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPasswordPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4">
            <motion.div className="bg-white rounded-xl p-6 w-full max-w-md" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowPasswordPopup(false)} className="text-gray-500 hover:text-gray-700">
                  <IoClose size={24} />
                </motion.button>
              </div>
              {passwordError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
                  {passwordError}
                </motion.div>
              )}
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                  />
                </motion.div>
              </motion.div>
              <div className="flex justify-end mt-6">
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={handleChangePassword} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVerificationPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4">
            <motion.div className="bg-white rounded-xl p-6 w-full max-w-md" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Verify Phone</h2>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowVerificationPopup(false)} className="text-gray-500 hover:text-gray-700">
                  <IoClose size={24} />
                </motion.button>
              </div>
              {verificationError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
                  {verificationError}
                </motion.div>
              )}
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                  <input
                    type="text"
                    name="code"
                    value={verificationData.code}
                    onChange={handleVerificationChange}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50"
                    placeholder="Enter OTP"
                  />
                </motion.div>
              </motion.div>
              <div className="flex justify-end mt-6">
                <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" onClick={handleVerifyCode} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Verify
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;