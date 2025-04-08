import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchSection from "./components/SearchSection";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import FlightCardList from "./components/FlightCardList";
import CarHire from "./components/Carhire";
import Hotels from "./components/Hotels";
import FeaturesSection from "./components/FeaturesSection";
import HotelSearch from "./components/HotelSearch";
import HotelFilter from "./components/HotelFilter";
import HotelCard from "./components/HotelCard";
import HotelDetails from "./components/HotelDetails"; 
import HotelBooking from "./components/HotelBooking";


function App() {
  console.log('rendering app with routes');
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/carhire" element={<CarHire />} />
          <Route path="/search-results" element={<FlightCardList />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/carhire" element={<CarHire />} />
          <Route path="/flights" element={<SearchSection />} />
          <Route path="/" element={<SearchSection />} />
          <Route path="/features" element={<FeaturesSection />} />
          <Route path="/hotel-search" element={<HotelSearch />} />
          <Route path="/hotel-search/:location" element={<HotelSearch />} />
          <Route path="/hotel-search/:location/:checkin/:checkout" element={<HotelSearch />} />
          <Route path="/hotelfilter" element={<HotelFilter />} />
          <Route path="/hotelcard" element={<HotelCard />} />
          <Route path="/hotel-details/:hotel/:arrival" element={<HotelDetails />} />
          <Route path="/hotel-booking" element={<HotelBooking />} />
          <Route path="/cancel" element={<div>Payment Canceled. Please try again.</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
