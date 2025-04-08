import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import TravelersCabinClass from "./TravelersCabinClass"; 
import TravelDeals from "./TravelDeals";
import FAQSection from "./FAQSecton";
import FlightCardList from "./FlightCardList";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaCalendarAlt, FaTag } from "react-icons/fa";
import FeaturesSection from "./FeaturesSection";
import FlightDealsCards from "../FlightDealsCards";

export default function SearchSection() {
    const [tripType, setTripType] = useState("return");
    const [from, setFrom] = useState(""); 
    const [to, setTo] = useState(""); 
    const [departDate, setDepartDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [multiCityFlights, setMultiCityFlights] = useState([
        { id: 1, from: "", to: "", depart: "" },
        { id: 2, from: "", to: "", depart: "" }
    ]);
    {/* Calculate if search button should be disabled */}
    const isMultiCityValid = multiCityFlights.every(flight => flight.from && flight.to && flight.depart);
    const isOneWayValid = from && to && departDate;
    const isReturnValid = isOneWayValid && returnDate;
    const [currentImage, setCurrentImage] = useState(0);
    const navigate = useNavigate();

    const images = [
        "/images/samuel-ferrara-1527pjeb6jg-unsplash.jpg",
        "/images/daniel-leone-g30P1zcOzXo-unsplash.jpg",
        "/images/benjamin-voros-phIFdC6lA4E-unsplash.jpg",
        "/images/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg"
      ];

      useEffect(() => {
        const interval = setInterval(() => {
          setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
      }, []);

      const handleSearch = (e) => {
        e.preventDefault();    
        console.log("Navigating to search results...");
        navigate("/search-results"); 
        //navigate("/flights");  
      };

    // Disable logic based on trip type
    const isSearchDisabled =
        (tripType === "multicity" && !isMultiCityValid) ||
        (tripType === "oneway" && !isOneWayValid) ||
        (tripType === "return" && !isReturnValid);

    // Function to swap from and to values
    const swapLocations = () => {
        setFrom((prevFrom) => {
            setTo(prevFrom);
            return to;
        });
    };

     // Function to add flight in Multi-city
     const addMultiCityFlight = () => {
        if (multiCityFlights.length < 6) {
            setMultiCityFlights([...multiCityFlights, { id: Date.now(), from: "", to: "", depart: "" }]);
        }
    };

    // Function to remove flight in Multi-city
    const removeMultiCityFlight = (id) => {
        setMultiCityFlights(multiCityFlights.filter(flight => flight.id !== id));
    };

    // Get today's date in YYYY-MM-DD format for min restriction
    const today = new Date().toISOString().split("T")[0];

     const flightFeatures = [
        {
          icon: <FaPlane />,
          text: "Explore the best flight deals from anywhere, to everywhere, then book with no fees",
        },
        {
          icon: <FaCalendarAlt />,
          text: "Compare flight deals from over 1000 providers, and choose the cheapest, fastest or lowest-emission tickets",
        },
        {
          icon: <FaTag />,
          text: "Find the cheapest month - or even day - to fly, and set up Price Alerts to book when the price is right",
        },
      ];

    return (
        <section className="relative w-full">
            {/* Header */}
            <Header />

            {/* Background Image */}
             <div className="absolute inset-0 block -z-10">
                <img
                    src="/images/Large-Flights-hero-2.jpeg"
                    alt="Flight booking background"
                    className="w-full h-full object-cover object-center fixed"
                />
            </div>

            {/* Hero Content */}
            <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-8">
                    The best flight offers from anywhere, to everywhere
                </h1>
                

                {/* Search Form */}
                <div className="bg-[#001533] p-6 rounded-2xl shadow-lg">
                    {/* Radio Buttons */}
                    <div className="flex gap-6 text-white mb-4">
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="tripType" className="mr-2" checked={tripType === "return"} onChange={() => setTripType("return")} /> Return
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="tripType" className="mr-2" checked={tripType === "oneway"} onChange={() => setTripType("oneway")} /> One way
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="radio" name="tripType" className="mr-2" checked={tripType === "multicity"} onChange={() => setTripType("multicity")} /> Multi-city
                        </label>
                    </div>

                     {/* Conditional Forms */}
                     {tripType === "multicity" ? (
                        // Multi-City Form
                        <form className="space-y-4">
                        {multiCityFlights.map((flight, index) => (
                            <div key={flight.id} className="flex flex-wrap md:flex-nowrap gap-4 items-center">
                                {/* From */}
                                <input 
                                    type="text" 
                                    placeholder="From" 
                                    value={flight.from} 
                                    required
                                    onChange={(e) => {
                                        const updatedFlights = [...multiCityFlights];
                                        updatedFlights[index].from = e.target.value;
                                        setMultiCityFlights(updatedFlights);
                                    }} 
                                    className="w-full md:w-1/3 p-3 rounded-lg bg-white text-black"
                                />
                
                                {/* To */}
                                <input 
                                    type="text" 
                                    placeholder="To" 
                                    value={flight.to}
                                    required 
                                    onChange={(e) => {
                                        const updatedFlights = [...multiCityFlights];
                                        updatedFlights[index].to = e.target.value;
                                        setMultiCityFlights(updatedFlights);
                                    }} 
                                    className="w-full md:w-1/3 p-3 rounded-lg bg-white text-black"
                                />
                
                                {/* Depart Date */}
                                <input 
                                        type="date" 
                                        min={index === 0 ? today : multiCityFlights[index - 1].depart || today} // Only allow today or after previous flight date
                                        value={flight.depart} 
                                        required
                                        onChange={(e) => {
                                            const updatedFlights = [...multiCityFlights];
                                            updatedFlights[index].depart = e.target.value;
                                            setMultiCityFlights(updatedFlights);
                                        }} 
                                        className="w-full md:w-1/4 p-3 rounded-lg bg-white text-black cursor-pointer"
                                    />
                
                                {/* Cross Button for Removing Flight */}
                                <button 
                                    type="button"
                                    onClick={() => removeMultiCityFlight(flight.id)}
                                    disabled={multiCityFlights.length <= 2} // Only enable when more than 2 flights exist
                                    className={`text-white px-4 py-2 rounded-lg transition 
                                        ${multiCityFlights.length <= 2 ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-700 cursor-pointer"}`}
                                >
                                    ✖
                                </button>
                            </div>
                        ))}
                
                        {/* Add Flight Button */}
                        {multiCityFlights.length < 6 && (
                            <button 
                                type="button" 
                                onClick={addMultiCityFlight} 
                                className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition cursor-pointer"
                            >
                                ➕ Add another flight
                            </button>
                        )}
                
                        {/* Travelers & Search */}
                        <div className="flex flex-wrap md:flex-nowrap items-center gap-4 mt-4">
                            <div className="flex-1">
                                <TravelersCabinClass />
                            </div>
                            <button 
                                onClick={handleSearch}
                                type="submit" 
                                disabled={isSearchDisabled}
                                className={`mt-5 px-6 py-3 font-semibold rounded-lg transition 
                                    ${isSearchDisabled ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                            >
                                Search
                            </button>   
                        </div>
                    </form>
                    ) : (
                    

                    // Return, One Way
                    <form className="flex flex-wrap gap-2 sm:gap-4 items-center w-full">
                        {/* From */}
                        <div className="flex-1 min-w-[100px]">
                            <label className="block text-white font-semibold mb-1">From</label>
                            <input type="text" required placeholder="Enter your city" 
                            value={from} 
                            onChange={(e) => setFrom(e.target.value)} 
                            className="w-full p-3 rounded-lg bg-white text-black" />
                        </div>

                        {/* Swap Button */}
                        <div className="flex relative mt-7 justify-center items-center">
                            <button type="button" 
                            onClick={swapLocations} 
                            className="bg-white text-black border border-gray-300 w-10 h-10 rounded-full flex justify-center items-center shadow-md hover:bg-gray-400 transition">⇄</button>
                        </div>

                        {/* To */}
                        <div className="flex-1 min-w-[100px]">
                            <label className="block required: text-white font-semibold mb-1">To</label>
                            <input type="text" placeholder="Enter your city" 
                            value={to} 
                            onChange={(e) => setTo(e.target.value)} 
                            className="w-full p-3 rounded-lg bg-white text-black" />
                        </div>

                        {/* Depart */}
                        <div className="flex-1 min-w-[100px]">
                                <label className="block text-white font-semibold mb-1">Depart</label>
                                <input
                                    type="date"
                                    min={today} 
                                    value={departDate}
                                    required
                                    onChange={(e) => {
                                        setDepartDate(e.target.value);
                                        setReturnDate(""); // Reset return when depart changes
                                    }}
                                    className="w-full p-3 rounded-lg bg-white text-black cursor-pointer"
                                />
                            </div>

                        {/* Return - Removed if One Way */}
                        {tripType !== "oneway" && (
                            <div className="flex-1 min-w-[100px]">
                            <label className="block text-white font-semibold mb-1">Return</label>
                            <input
                                type="date"
                                min={departDate || today} 
                                value={returnDate}
                                required
                                onChange={(e) => setReturnDate(e.target.value)}
                                disabled={!departDate} 
                                className={`w-full p-3 rounded-lg bg-white text-black ${!departDate ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            />
                        </div>
                        )}

                        {/* Travelers and Cabin */}
                        <div className="flex-1">
                            <TravelersCabinClass />
                        </div>

                        {/* Search Button */}
                        <div className="flex-1">
                        <button
                            onClick={handleSearch}
                            type="submit"
                            disabled={isSearchDisabled}
                            className={`w-full mt-7 px-6 py-3 font-semibold rounded-lg transition 
                                ${isSearchDisabled ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"}`}
                        >
                            Search
                        </button>
                        </div>
                        </form>
                    )}
    
                    {/* Checkbox Options */}
                    {tripType !== "multicity" && (
                    <div className="flex flex-wrap gap-4 items-center mt-4 text-white">
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="mr-2" /> Add nearby airports
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="mr-2" /> Direct flights only
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="mr-2" /> Flexible Tickets
                        </label>
                    </div>
                )}           
                </div>
            </div>

             {/* Features Section */}
             <div className="bg-white">
            <div className="container mx-auto px-8 pt-5 max-w-7xl">
                <nav className="text-sm">
                <a href="/" className="text-blue-600 hover:underline">Home</a>
                <span className="mx-2 text-gray-400">›</span>
                <span className="text-gray-600">Flights</span>
                </nav>
            </div>
            <FeaturesSection features={flightFeatures} />
            </div>


            {/* Banner */}
            <section className="relative w-full py-20 bg-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Banner */}
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
                        <img 
                            src={images[currentImage]}  
                            alt="Scenic view" 
                            className="w-full h-100 md:h-130 object-cover object-center transition-opacity duration-500 ease-in-out" 
                        />
                        {/* Text Content */}
                        <div className="absolute inset-0 flex flex-col justify-center px-6 text-white bg-black/50">
                            <p className="text-lg uppercase font-serif">Grab a deal</p>
                            <h2 className="text-3xl md:text-4xl font-bold mt-2">
                                When the price is low, you'll know
                            </h2>
                            <p className="mt-2 text-lg font-serif">
                                Score cheaper seats with Price Alerts
                            </p>
                            <a 
                                href="#faq"
                                className="mt-5 px-6 py-1 w-36 bg-white text-black rounded-2xl font-semibold shadow-md hover:bg-gray-500 hover:text-white cursor-pointer text-center inline-block"
                            >
                                How it works
                            </a>

                        </div>
                    </div>
                </div>
            </section>
            <hr className="border-black"></hr>

            {/* Flight Deals Cards */}
            <section className="bg-white">
            <FlightDealsCards />
            </section>

            {/* Flight Deals Section */}
            <section className="bg-gray-100 py-12 px-6 md:px-12">
            <div className="max-w-7xl container mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 font-serif">
                Looking for the best flight deals to anywhere in the world?
                </h2>
                <p className="text-gray-600 mb-10 font-serif">
                It’s easy around here. 100 million travellers use us as their go-to tool, comparing flight deals and offers
                from more than 1,200 airlines and travel providers. With so many options to choose from in one place, you can
                say hello to savings, and goodbye to stress – here’s how.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg">
                    <img
                    src="https://cdn-icons-png.flaticon.com/512/2645/2645568.png"
                    alt="Globe"
                    className="w-16 h-16 mx-auto mb-4"
                    />
                    <h3 className="text-lg font-bold font-serif">Search ‘Everywhere’, explore anywhere</h3>
                    <p className="text-gray-600 mt-2 font-serif">
                    Enter your departure airport and travel dates, then hit ‘Everywhere’. You’ll see flights to every
                    destination in the world, cheapest first.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg">
                    <img
                    src="https://cdn-icons-png.flaticon.com/512/2353/2353181.png"
                    alt="Transparent Pricing"
                    className="w-16 h-16 mx-auto mb-4"
                    />
                    <h3 className="text-lg font-bold font-serif">Pay less, go further with transparent pricing</h3>
                    <p className="text-gray-600 mt-2 font-serif">
                    The cheapest flight deals. No hidden fees. No funny business. With us, the price you see when you search is
                    what you’ll pay.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg">
                    <img
                    src="https://cdn-icons-png.flaticon.com/512/2529/2529521.png"
                    alt="Price Alerts"
                    className="w-16 h-16 mx-auto mb-4"
                    />
                    <h3 className="text-lg font-bold font-serif">Book when it's best with Price Alerts</h3>
                    <p className="text-gray-600 mt-2 font-serif">
                    Found your flight, but not quite ready to book? Set up Price Alerts and we’ll let you know when your flight
                    price goes up or down.
                    </p>
                </div>
                </div>
            </div>
            </section>
            <hr className="bg-black"></hr>

            {/* Swiper Section */}
            <section className="bg-white">
            <TravelDeals />
            </section>

            {/* FAQ Section */}
            <section id="faq" className="bg-white">
            <FAQSection />
            </section>

            {/* Footer */}
            <Footer />
        </section>
    );
}
