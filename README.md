# TripGlide Travel Website

TripGlide is a modern travel booking platform that allows users to search for flights, hotels, and car rentals. It provides a seamless user experience with features like multi-city flight booking, price alerts, and flexible ticket options. Built with a robust backend and an interactive frontend, TripGlide aims to make travel planning effortless and enjoyable.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Flight Booking
- **Multi-City Booking**: Book flights for multiple destinations in one go.
- **Search Filters**: Filter flights by departure/arrival airports, dates, and cabin class.
- **Price Alerts**: Get notified when flight prices drop.
- **Nearby Airports**: Option to include nearby airports in the search.

### Hotel Booking
- **Hotel Listings**: Browse and book hotels with detailed amenities and pricing.
- **Booking History**: View past hotel bookings and download invoices.

### Car Rentals
- **Car Listings**: Search and book cars based on location, type, and price.
- **Car Hire FAQs**: Get answers to common questions about car rentals.

### Additional Features
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **User Authentication**: Secure login and signup functionality.
- **Dynamic Backgrounds**: Rotating scenic images for an engaging user experience.
- **Flexible Tickets**: Option to book refundable or flexible tickets.

---

## Tech Stack

### Frontend
- **React**: For building the user interface.
- **Vite**: For fast development and build processes.
- **Tailwind CSS**: For styling and responsive design.
- **React Router**: For navigation and routing.
- **Axios**: For API requests.

### Backend
- **Node.js**: For server-side logic.
- **Express.js**: For building RESTful APIs.
- **Stripe**: For payment processing.

### Database
- **MySQL**: For storing flight, hotel, and user data.

---

## Project Structure

tripglide/ ├── backend/ │ ├── carapp.py │ ├── flight.py │ ├── hotelApp.py │ ├── server.js │ ├── .env │ └── package.json ├── database/ │ ├── flights.sql │ ├── hotels.csv │ ├── tripglide.sql │ └── upload_csv_to_mysql.py ├── frontend/ │ ├── public/ │ ├── src/ │ │ ├── components/ │ │ │ ├── SearchSection.jsx │ │ │ ├── FlightBookingHistory.jsx │ │ │ ├── HotelBookingHistory.jsx │ │ │ ├── CabBookingHistory.jsx │ │ │ └── TravelDeals.jsx │ │ ├── App.jsx │ │ ├── index.css │ │ └── main.jsx │ ├── vite.config.js │ └── package.json ├── .gitignore ├── package.json └── README.md


---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Python (for backend scripts)
- MySQL (for database)

### Steps
1. Set up the backend:
   ```bash
   cd backend
   npm install

2. Set up the frontend:
   cd ../frontend
   npm install

3. Import the database:
   Open MySQL and run the scripts in database/tripglide.sql.
   
4. Start the backend server:
   cd backend
   npm start

5. Start the frontend development server:
   cd ../frontend
   npm run dev

Usage
1. Open the frontend in your browser:
   http://localhost:5173
2. Use the search bar to find flights, hotels, or car rentals.
3. Navigate through the app to explore features like multi-city booking, price alerts, and booking history.

API Endpoints
* Flights
GET /get_flights: Fetch available flights.
POST /create-checkout-session: Create a Stripe checkout session.
* Hotels
GET /get_hotels: Fetch available hotels.
* Cars
GET /get_cars: Fetch available car rentals.

Contributing:
Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   git checkout -b feature-name
3. Commit your changes:
   git commit -m "Add feature-name"
4. Push to the branch:
   git push origin feature-name
Open a pull request.

License:
This project is licensed under the MIT License. See the LICENSE file for details. 
