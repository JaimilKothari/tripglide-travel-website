// import React from 'react';
// import TravelersCabinClass from './TravelersCabinClass';

// export default function SearchFormPopup({
//   isOpen,
//   onClose,
//   tripType,
//   from,
//   to,
//   departDate,
//   returnDate,
//   cabinClass,
//   setTripType,
//   setFrom,
//   setTo,
//   setDepartDate,
//   setReturnDate,
//   setCabinClass,
//   handleSearch,
//   departureAirports,
//   arrivalAirports,
//   multiCityFlights,
//   setMultiCityFlights
// }) {
//   if (!isOpen) return null;

//   const today = new Date().toISOString().split("T")[0];
  
//   const swapLocations = () => {
//     const tempFrom = from;
//     setFrom(to);
//     setTo(tempFrom);
//   };

//   const isOneWayValid = from && to && departDate;
//   const isReturnValid = isOneWayValid && returnDate;
//   const isMultiCityValid = multiCityFlights && multiCityFlights.every(flight => flight.from && flight.to && flight.depart);
//   const isSearchDisabled = 
//     (tripType === "oneway" && !isOneWayValid) || 
//     (tripType === "return" && !isReturnValid) || 
//     (tripType === "multicity" && !isMultiCityValid);

//   const removeMultiCityFlight = (id) => {
//     const updatedFlights = multiCityFlights.filter(flight => flight.id !== id);
//     setMultiCityFlights(updatedFlights);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-[#001533] rounded-2xl shadow-lg w-full max-w-4xl p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-white text-xl font-bold">Modify Search</h2>
//           <button onClick={onClose} className="text-white hover:text-gray-300">
//             ✕
//           </button>
//         </div>

//         <div className="flex gap-6 text-white mb-4">
//           <label className="flex items-center cursor-pointer">
//             <input
//               type="radio"
//               name="tripType"
//               className="mr-2"
//               checked={tripType === "return"}
//               onChange={() => setTripType("return")}
//             />
//             Return
//           </label>
//           <label className="flex items-center cursor-pointer">
//             <input
//               type="radio"
//               name="tripType"
//               className="mr-2"
//               checked={tripType === "oneway"}
//               onChange={() => setTripType("oneway")}
//             />
//             One way
//           </label>
//           <label className="flex items-center cursor-pointer">
//             <input
//               type="radio"
//               name="tripType"
//               className="mr-2"
//               checked={tripType === "multicity"}
//               onChange={() => setTripType("multicity")}
//             />
//             Multi-city
//           </label>
//         </div>

//         <form onSubmit={handleSearch} className="space-y-4">
//           {tripType === "multicity" ? (
//             // Multi-City Form
//             <div className="space-y-4">
//               {multiCityFlights.map((flight, index) => (
//                 <div key={flight.id} className="flex flex-wrap md:flex-nowrap gap-4 items-center">
//                   <div className="flex-1 min-w-[100px]">
//                     <label className="block text-white font-semibold mb-1">From</label>
//                     <input 
//                       list={`departure-airports-${index}`} 
//                       value={flight.from} 
//                       onChange={(e) => {
//                         const updatedFlights = [...multiCityFlights];
//                         updatedFlights[index].from = e.target.value;
//                         setMultiCityFlights(updatedFlights);
//                       }} 
//                       className="w-full p-3 rounded-lg bg-white text-black"
//                       placeholder="Select or type departure airport"
//                       required
//                     />
//                     <datalist id={`departure-airports-${index}`}>
//                       {departureAirports.filter(airport => airport !== flight.to).map((airport, idx) => (
//                         <option key={idx} value={airport} />
//                       ))}
//                     </datalist>
//                   </div>
//                   <div className="flex-1 min-w-[100px]">
//                     <label className="block text-white font-semibold mb-1">To</label>
//                     <input 
//                       list={`arrival-airports-${index}`} 
//                       value={flight.to}
//                       onChange={(e) => {
//                         const updatedFlights = [...multiCityFlights];
//                         updatedFlights[index].to = e.target.value;
//                         setMultiCityFlights(updatedFlights);
//                       }} 
//                       className="w-full p-3 rounded-lg bg-white text-black"
//                       placeholder="Select or type arrival airport"
//                       required
//                     />
//                     <datalist id={`arrival-airports-${index}`}>
//                       {arrivalAirports.filter(airport => airport !== flight.from).map((airport, idx) => (
//                         <option key={idx} value={airport} />
//                       ))}
//                     </datalist>
//                   </div>
//                   <input 
//                     type="date" 
//                     min={index === 0 ? today : multiCityFlights[index - 1].depart || today}
//                     value={flight.depart} 
//                     required
//                     onChange={(e) => {
//                       const updatedFlights = [...multiCityFlights];
//                       updatedFlights[index].depart = e.target.value;
//                       setMultiCityFlights(updatedFlights);
//                     }} 
//                     className="w-full md:w-1/4 p-3 mt-7 rounded-lg bg-white text-black cursor-pointer"
//                   />
//                   <button 
//                     type="button"
//                     onClick={() => removeMultiCityFlight(flight.id)}
//                     disabled={multiCityFlights.length <= 2}
//                     className={`text-white px-4 py-2 mt-7 rounded-lg transition 
//                       ${multiCityFlights.length <= 2 ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-700 cursor-pointer"}`}
//                   >
//                     ✖
//                   </button>
//                 </div>
//               ))}
//               <div className="flex flex-col md:flex-row justify-between gap-4 items-end">
//               <button
//                 type="button"
//                 onClick={() => setMultiCityFlights([...multiCityFlights, { id: Date.now(), from: "", to: "", depart: "" }])}
//                 className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg w-full md:w-32"
//               >
//                 Add Flight
//               </button>
//               <TravelersCabinClass
//                 selectedCabinClass={cabinClass}
//                 setSelectedCabinClass={setCabinClass}
//               />
//               <button
//                 type="submit"
//                 disabled={isSearchDisabled}
//                 className={`px-6 py-3 font-semibold rounded-lg transition w-full md:w-32 ${
//                   isSearchDisabled
//                     ? "bg-blue-300 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
//                 }`}
//               >
//                 Search
//               </button>
//             </div>
//             </div>
//           ) : (
//             // One-way or Return Form
//             <>
//               <div className="flex flex-col md:flex-row gap-4 items-start relative">
//                 <div className="flex-1 w-full">
//                   <label className="block text-white font-semibold mb-1">From</label>
//                   <input
//                     list="departure-airports"
//                     value={from}
//                     onChange={(e) => setFrom(e.target.value)}
//                     className="w-full p-3 rounded-lg bg-white text-black"
//                     placeholder="Select airport"
//                     required
//                   />
//                   <datalist id="departure-airports">
//                     {departureAirports.filter(airport => airport !== to).map((airport, index) => (
//                       <option key={index} value={airport} />
//                     ))}
//                   </datalist>
//                 </div>

//                 <div className="hidden md:flex relative items-center self-end mb-3">
//                   <button
//                     type="button"
//                     onClick={swapLocations}
//                     className="bg-white text-black border border-gray-300 w-8 h-8 rounded-full flex justify-center items-center shadow-md hover:bg-gray-400 transition"
//                   >
//                     ⇄
//                   </button>
//                 </div>

//                 <div className="flex-1 w-full">
//                   <label className="block text-white font-semibold mb-1">To</label>
//                   <input
//                     list="arrival-airports"
//                     value={to}
//                     onChange={(e) => setTo(e.target.value)}
//                     className="w-full p-3 rounded-lg bg-white text-black"
//                     placeholder="Select airport"
//                     required
//                   />
//                   <datalist id="arrival-airports">
//                     {arrivalAirports.filter(airport => airport !== from).map((airport, index) => (
//                       <option key={index} value={airport} />
//                     ))}
//                   </datalist>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={swapLocations}
//                   className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black border border-gray-300 w-8 h-8 rounded-full flex justify-center items-center shadow-md hover:bg-gray-400 transition"
//                 >
//                   ⇄
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 gap-2">
//                 {/* oneway */}
//                 {tripType === "oneway" ? (
//                   <div className="flex flex-col md:flex-row gap-2">
//                     <div className="flex-1">
//                       <label className="block text-white font-semibold mb-1">Depart</label>
//                       <input
//                         type="date"
//                         min={today}
//                         value={departDate}
//                         onChange={(e) => setDepartDate(e.target.value)}
//                         className="w-full p-3 m-0 rounded-lg bg-white text-black cursor-pointer"
//                         required
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <label className="text-white font-semibold mt-8 invisible">Cabin</label> {/* Invisible label for alignment */}
//                       <TravelersCabinClass
//                         selectedCabinClass={cabinClass}
//                         setSelectedCabinClass={setCabinClass}
//                         className="w-full p-3 m-0 rounded-lg" // Match padding and margin
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <label className="block text-white font-semibold mb-1 invisible">Search</label> {/* Invisible label for alignment */}
//                       <button
//                         type="submit"
//                         disabled={isSearchDisabled}
//                         className={`w-full p-3 m-0 rounded-lg font-semibold transition ${
//                           isSearchDisabled
//                             ? "bg-blue-300 cursor-not-allowed"
//                             : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
//                         }`}
//                       >
//                         Search
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   // return
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-white font-semibold mb-1">Depart</label>
//                       <input
//                         type="date"
//                         min={today}
//                         value={departDate}
//                         onChange={(e) => {
//                           setDepartDate(e.target.value);
//                           setReturnDate("");
//                         }}
//                         className="w-full p-3 rounded-lg bg-white text-black cursor-pointer"
//                         required
//                       />
//                     </div>
//                     {tripType === "return" && (
//                       <div>
//                         <label className="block text-white font-semibold mb-1">Return</label>
//                         <input
//                           type="date"
//                           min={departDate || today}
//                           value={returnDate}
//                           onChange={(e) => setReturnDate(e.target.value)}
//                           disabled={!departDate}
//                           className={`w-full p-3 rounded-lg bg-white text-black ${!departDate ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
//                           required
//                         />
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {tripType !== "oneway" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
//                   <TravelersCabinClass
//                     selectedCabinClass={cabinClass}
//                     setSelectedCabinClass={setCabinClass}
//                   />
//                   <button
//                     type="submit"
//                     disabled={isSearchDisabled}
//                     className={`px-6 py-3 font-semibold rounded-lg transition ${
//                       isSearchDisabled
//                         ? "bg-blue-300 cursor-not-allowed"
//                         : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
//                     }`}
//                   >
//                     Search
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }