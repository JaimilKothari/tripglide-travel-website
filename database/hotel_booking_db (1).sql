CREATE DATABASE hotel_booking_db;
USE hotel_booking_db;
CREATE TABLE hotel_bookings (
    TravelCode int,
    UserID int,
    Departure varchar(100),
    Arrival varchar(100),
    Hotel varchar(100),
    Rating int,
    BedroomType varchar(100),
    PricePerNight int,
    Adults int,
    Children int,
    TotalBedrooms int,
    TotalPricePerNight int,
    Amenities varchar(200),
    StayingDays int,
    TotalCost int,
    CheckOut date,
<<<<<<< HEAD
    CheckIn date
=======
    CheckIn date,
    HotelID varchar(100)
>>>>>>> f59948b22d6d9f6eea37dcfccc009c962c9a9495
    );