import React, { useState } from "react";
import Footer from "./Footer"; // Assuming Footer is in the same directory
import { Link } from "react-router-dom";

const RegionalSettings = () => {
  // Static exchange rates (1 INR to other currencies as of March 2025, approximate values)
  const exchangeRates = {
    USD: 0.012, // 1 INR = 0.012 USD (United States)
    EUR: 0.011, // 1 INR = 0.011 EUR (Eurozone)
    GBP: 0.009, // 1 INR = 0.009 GBP (United Kingdom)
    AUD: 0.018, // 1 INR = 0.018 AUD (Australia)
    JPY: 1.82,  // 1 INR = 1.82 JPY (Japan)
    CAD: 0.016, // 1 INR = 0.016 CAD (Canada)
  };

  // State for the selected currency and amount in INR
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [amountInINR, setAmountInINR] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);

  // Function to handle currency conversion
  const handleConversion = (amount) => {
    const rate = exchangeRates[selectedCurrency];
    const converted = amount * rate;
    setConvertedAmount(converted.toFixed(2)); // Round to 2 decimal places
  };

  // Handle input change for INR amount
  const handleAmountChange = (e) => {
    const amount = e.target.value;
    setAmountInINR(amount);
    handleConversion(amount);
  };

  // Handle currency selection change
  const handleCurrencyChange = (e) => {
    const currency = e.target.value;
    setSelectedCurrency(currency);
    handleConversion(amountInINR);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-[#06152B] text-white py-4 px-4 shadow-lg">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <h1 className="text-2xl font-bold">Regional Settings</h1>
          <Link to="/" className="text-blue-400 hover:underline">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h2 className="text-3xl font-bold text-black mb-6 text-center">
          Currency Converter
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Convert Indian Rupees (INR) to other currencies.
        </p>

        {/* Currency Converter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 max-w-lg mx-auto">
          {/* Currency Selection */}
          <div className="mb-6">
            <label className="block text-black font-semibold mb-2">
              Select Currency to Convert To:
            </label>
            <select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD - United States Dollar</option>
              <option value="EUR">EUR - Euro (Eurozone)</option>
              <option value="GBP">GBP - British Pound (United Kingdom)</option>
              <option value="AUD">AUD - Australian Dollar (Australia)</option>
              <option value="JPY">JPY - Japanese Yen (Japan)</option>
              <option value="CAD">CAD - Canadian Dollar (Canada)</option>
            </select>
          </div>

          {/* Converter Boxes */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Box 1: India (INR) */}
            <div className="flex-1 bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                India (INR)
              </h3>
              <input
                type="number"
                value={amountInINR}
                onChange={handleAmountChange}
                placeholder="Enter amount in INR"
                className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-600 mt-2">
                ₹ {amountInINR || 0}
              </p>
            </div>

            {/* Box 2: Selected Currency */}
            <div className="flex-1 bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-2">
                {selectedCurrency} ({exchangeRates[selectedCurrency] ? selectedCurrency : "Select a currency"})
              </h3>
              <div className="w-full p-2 border rounded bg-white text-black">
                {convertedAmount} {selectedCurrency}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                1 INR = {exchangeRates[selectedCurrency]} {selectedCurrency}
              </p>
            </div>
          </div>
        </div>

        {/* Note About Exchange Rates */}
        <div className="mt-6 text-center text-gray-600">
          <p className="text-sm">
            Note: Exchange rates are approximate and for demonstration purposes only. For accurate rates, please consult a financial service provider.
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RegionalSettings;