-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 13, 2025 at 05:48 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tripglide`
--

-- --------------------------------------------------------

--
-- Table structure for table `car_rentals`
--

CREATE TABLE `car_rentals` (
  `rental_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `car_name` varchar(100) NOT NULL,
  `from_location` varchar(100) DEFAULT NULL,
  `to_location` varchar(100) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `status` enum('Upcoming','Completed','Cancelled') DEFAULT 'Upcoming',
  `policy_applied` varchar(50) DEFAULT 'Standard Policy'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_rentals`
--

INSERT INTO `car_rentals` (`rental_id`, `user_id`, `car_name`, `from_location`, `to_location`, `start_date`, `end_date`, `cost`, `status`, `policy_applied`) VALUES
(1, 1, 'Hyundai Creta', 'City Center', 'Airport', '2025-05-01 09:00:00', '2025-05-03 18:00:00', 6000.00, 'Upcoming', 'Standard Policy'),
(2, 1, 'Maruti Swift', 'Airport', 'City Center', '2025-03-14 10:00:00', '2025-03-16 17:00:00', 4000.00, 'Completed', 'Standard Policy'),
(3, 2, 'Toyota Innova', 'Railway Station', 'City Center', '2025-06-10 08:00:00', '2025-06-12 20:00:00', 8000.00, 'Upcoming', 'Standard Policy'),
(4, 2, 'Honda City', 'City Center', 'Hotel District', '2025-02-20 09:00:00', '2025-02-22 18:00:00', 5000.00, 'Completed', 'Standard Policy'),
(5, 5, 'Mahindra Thar', 'Airport', 'Beach Resort', '2025-04-25 10:00:00', '2025-04-27 19:00:00', 7000.00, 'Upcoming', 'Standard Policy'),
(6, 1, 'Tata Nexon', 'City Center', 'Airport', '2025-04-15 12:00:00', '2025-04-16 12:00:00', 3000.00, 'Cancelled', 'Standard Policy'),
(7, 2, 'Kia Seltos', 'Hotel District', 'City Center', '2025-05-20 09:00:00', '2025-05-22 18:00:00', 6500.00, 'Cancelled', 'Flexible Policy'),
(8, 3, 'Renault Duster', 'City Center', 'Railway Station', '2025-07-01 10:00:00', '2025-07-03 18:00:00', 5500.00, 'Upcoming', 'Standard Policy'),
(9, 1, 'Ford EcoSport', 'Airport', 'Hotel District', '2025-08-15 09:00:00', '2025-08-17 17:00:00', 6000.00, 'Upcoming', 'Flexible Policy'),
(10, 4, 'Maruti Baleno', 'Beach Resort', 'City Center', '2025-06-20 11:00:00', '2025-06-22 19:00:00', 4500.00, 'Upcoming', 'Standard Policy'),
(11, 2, 'Hyundai Venue', 'Railway Station', 'Airport', '2025-05-25 08:00:00', '2025-05-27 20:00:00', 5000.00, 'Upcoming', 'Standard Policy'),
(12, 5, 'Tata Harrier', 'Hotel District', 'Beach Resort', '2025-09-10 12:00:00', '2025-09-12 18:00:00', 7500.00, 'Upcoming', 'Flexible Policy'),
(13, 1, 'Kia Sonet', 'City Center', 'Airport', '2025-04-20 09:00:00', '2025-04-21 15:00:00', 3500.00, 'Cancelled', 'Standard Policy'),
(14, 3, 'Mahindra XUV300', 'Airport', 'City Center', '2025-10-05 10:00:00', '2025-10-07 16:00:00', 6200.00, 'Upcoming', 'Standard Policy'),
(15, 4, 'Toyota Fortuner', 'Beach Resort', 'Railway Station', '2025-11-12 08:00:00', '2025-11-14 17:00:00', 9000.00, 'Upcoming', 'Flexible Policy'),
(16, 2, 'Honda Amaze', 'City Center', 'Hotel District', '2025-07-15 11:00:00', '2025-07-16 12:00:00', 4000.00, 'Completed', 'Standard Policy'),
(17, 5, 'Maruti Ertiga', 'Railway Station', 'City Center', '2025-12-01 09:00:00', '2025-12-03 18:00:00', 7000.00, 'Upcoming', 'Standard Policy');

-- --------------------------------------------------------

--
-- Table structure for table `flight_bookings`
--

CREATE TABLE `flight_bookings` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `flight_number` varchar(20) NOT NULL,
  `from_city` varchar(50) DEFAULT NULL,
  `from_state` varchar(50) DEFAULT NULL,
  `to_city` varchar(50) DEFAULT NULL,
  `to_state` varchar(50) DEFAULT NULL,
  `departure_date` date NOT NULL,
  `departure_time` time NOT NULL,
  `arrival_date` date NOT NULL,
  `arrival_time` time NOT NULL,
  `departure_airport` varchar(50) NOT NULL,
  `arrival_airport` varchar(50) NOT NULL,
  `airline` varchar(100) NOT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flight_bookings`
--

INSERT INTO `flight_bookings` (`booking_id`, `user_id`, `flight_number`, `from_city`, `from_state`, `to_city`, `to_state`, `departure_date`, `departure_time`, `arrival_date`, `arrival_time`, `departure_airport`, `arrival_airport`, `airline`, `cost`, `status`) VALUES
(46, 1, 'AI123', 'Bangalore', 'Karnataka', 'Delhi', 'Delhi', '2025-05-01', '08:00:00', '2025-05-01', '10:30:00', 'BLR', 'DEL', 'Air India', 5200.00, 'Completed'),
(47, 2, '6E456', 'Delhi', 'Delhi', 'Mumbai', 'Maharashtra', '2025-05-02', '14:30:00', '2025-05-02', '16:45:00', 'DEL', 'BOM', 'IndiGo', 4500.00, 'Completed'),
(48, 2, 'SG789', 'Lucknow', 'Uttar Pradesh', 'Hyderabad', 'Telangana', '2025-05-03', '11:15:00', '2025-05-03', '13:00:00', 'LKO', 'HYD', 'SpiceJet', 4800.00, 'Cancelled'),
(49, 4, 'UK101', 'Kolkata', 'West Bengal', 'Chennai', 'Tamil Nadu', '2025-05-04', '09:45:00', '2025-05-04', '12:15:00', 'CCU', 'MAA', 'Vistara', 5100.00, 'Cancelled'),
(50, 5, 'AI678', 'Pune', 'Maharashtra', 'Bangalore', 'Karnataka', '2025-05-05', '17:00:00', '2025-05-05', '19:30:00', 'PNQ', 'BLR', 'Air India', 5500.00, 'Upcoming'),
(51, 6, '6E234', 'Jaipur', 'Rajasthan', 'Delhi', 'Delhi', '2025-05-06', '06:30:00', '2025-05-06', '08:45:00', 'JAI', 'DEL', 'IndiGo', 4700.00, 'Upcoming'),
(52, 7, 'SG567', 'Kolkata', 'West Bengal', 'Mumbai', 'Maharashtra', '2025-05-07', '13:00:00', '2025-05-07', '15:20:00', 'CCU', 'BOM', 'SpiceJet', 4600.00, 'Upcoming'),
(53, 8, 'UK890', 'Hyderabad', 'Telangana', 'Goa', 'Goa', '2025-05-08', '20:00:00', '2025-05-09', '00:30:00', 'HYD', 'GOI', 'Vistara', 4900.00, 'Upcoming'),
(54, 9, 'AI345', 'Delhi', 'Delhi', 'Ahmedabad', 'Gujarat', '2025-05-09', '10:00:00', '2025-05-09', '12:00:00', 'DEL', 'AMD', 'Air India', 4300.00, 'Upcoming'),
(55, 10, '6E789', 'Patna', 'Bihar', 'Bangalore', 'Karnataka', '2025-05-10', '15:30:00', '2025-05-10', '18:00:00', 'PAT', 'BLR', 'IndiGo', 5000.00, 'Upcoming'),
(66, 2, 'AI456', 'Mumbai', 'Maharashtra', 'Delhi', 'Delhi', '2025-07-01', '09:00:00', '2025-07-01', '11:30:00', 'BOM', 'DEL', 'Air India', 5300.00, 'Upcoming'),
(67, 4, '6E123', 'Chennai', 'Tamil Nadu', 'Bangalore', 'Karnataka', '2025-08-10', '12:00:00', '2025-08-10', '13:15:00', 'MAA', 'BLR', 'IndiGo', 4200.00, 'Upcoming'),
(68, 1, 'SG234', 'Delhi', 'Delhi', 'Goa', 'Goa', '2025-09-05', '15:00:00', '2025-09-05', '17:45:00', 'DEL', 'GOI', 'SpiceJet', 4800.00, 'Upcoming'),
(69, 5, 'UK567', 'Bangalore', 'Karnataka', 'Kolkata', 'West Bengal', '2025-10-12', '07:30:00', '2025-10-12', '10:00:00', 'BLR', 'CCU', 'Vistara', 5100.00, 'Upcoming'),
(70, 3, 'AI789', 'Hyderabad', 'Telangana', 'Mumbai', 'Maharashtra', '2025-11-01', '18:00:00', '2025-11-01', '20:15:00', 'HYD', 'BOM', 'Air India', 4600.00, 'Upcoming'),
(71, 2, '6E890', 'Delhi', 'Delhi', 'Pune', 'Maharashtra', '2025-06-15', '10:30:00', '2025-06-15', '12:45:00', 'DEL', 'PNQ', 'IndiGo', 4900.00, 'Cancelled'),
(72, 4, 'SG345', 'Kolkata', 'West Bengal', 'Delhi', 'Delhi', '2025-12-10', '14:00:00', '2025-12-10', '16:30:00', 'CCU', 'DEL', 'SpiceJet', 4700.00, 'Upcoming'),
(73, 1, 'UK678', 'Mumbai', 'Maharashtra', 'Chennai', 'Tamil Nadu', '2025-07-20', '06:00:00', '2025-07-20', '08:15:00', 'BOM', 'MAA', 'Vistara', 5200.00, 'Upcoming'),
(74, 5, 'AI234', 'Bangalore', 'Karnataka', 'Hyderabad', 'Telangana', '2025-08-25', '19:00:00', '2025-08-25', '20:15:00', 'BLR', 'HYD', 'Air India', 4000.00, 'Upcoming'),
(75, 3, '6E567', 'Goa', 'Goa', 'Delhi', 'Delhi', '2025-09-15', '11:00:00', '2025-09-15', '13:30:00', 'GOI', 'DEL', 'IndiGo', 4500.00, 'Upcoming');

-- --------------------------------------------------------

--
-- Table structure for table `hotel_bookings`
--

CREATE TABLE `hotel_bookings` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `hotel_name` varchar(100) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `check_in_date` datetime NOT NULL,
  `check_in_time` time DEFAULT NULL,
  `check_out_date` datetime NOT NULL,
  `check_out_time` time DEFAULT NULL,
  `cost` decimal(10,2) NOT NULL,
  `status` enum('Upcoming','Completed','Cancelled') DEFAULT 'Upcoming'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hotel_bookings`
--

INSERT INTO `hotel_bookings` (`booking_id`, `user_id`, `hotel_name`, `city`, `state`, `check_in_date`, `check_in_time`, `check_out_date`, `check_out_time`, `cost`, `status`) VALUES
(1, 1, 'Taj Palace', 'Delhi', 'Delhi', '2025-05-02 14:00:00', '14:00:00', '2025-05-05 12:00:00', '12:00:00', 15000.00, 'Upcoming'),
(2, 1, 'Oberoi Grand', 'Kolkata', 'West Bengal', '2025-03-10 14:00:00', '14:00:00', '2025-03-12 12:00:00', '12:00:00', 8000.00, 'Completed'),
(3, 2, 'Hyatt Regency', 'Chennai', 'Tamil Nadu', '2025-06-11 14:00:00', '14:00:00', '2025-06-15 12:00:00', '12:00:00', 20000.00, 'Upcoming'),
(4, 2, 'Marriott', 'Mumbai', 'Maharashtra', '2025-02-21 14:00:00', '14:00:00', '2025-02-23 12:00:00', '12:00:00', 10000.00, 'Completed'),
(5, 5, 'Leela Palace', 'Bangalore', 'Karnataka', '2025-04-26 14:00:00', '14:00:00', '2025-04-28 12:00:00', '12:00:00', 12000.00, 'Upcoming'),
(6, 1, 'ITC Grand', 'Goa', 'Goa', '2025-04-15 14:00:00', '14:00:00', '2025-04-17 12:00:00', '12:00:00', 9000.00, 'Cancelled'),
(7, 2, 'Radisson Blu', 'Pune', 'Maharashtra', '2025-05-10 14:00:00', '14:00:00', '2025-05-12 12:00:00', '12:00:00', 11000.00, 'Cancelled'),
(8, 1, 'Hilton', 'Mumbai', 'Maharashtra', '2025-07-02 14:00:00', '14:00:00', '2025-07-05 12:00:00', '12:00:00', 18000.00, 'Upcoming'),
(9, 3, 'Taj Bengal', 'Kolkata', 'West Bengal', '2025-08-11 14:00:00', '14:00:00', '2025-08-14 12:00:00', '12:00:00', 14000.00, 'Upcoming'),
(10, 5, 'JW Marriott', 'Pune', 'Maharashtra', '2025-09-06 14:00:00', '14:00:00', '2025-09-08 12:00:00', '12:00:00', 11000.00, 'Upcoming'),
(11, 2, 'Park Hyatt', 'Hyderabad', 'Telangana', '2025-10-13 14:00:00', '14:00:00', '2025-10-16 12:00:00', '12:00:00', 16000.00, 'Upcoming'),
(12, 4, 'Novotel', 'Chennai', 'Tamil Nadu', '2025-11-02 14:00:00', '14:00:00', '2025-11-04 12:00:00', '12:00:00', 9000.00, 'Upcoming'),
(13, 1, 'Oberoi', 'Delhi', 'Delhi', '2025-06-16 14:00:00', '14:00:00', '2025-06-18 12:00:00', '12:00:00', 13000.00, 'Cancelled'),
(14, 3, 'Taj Coromandel', 'Chennai', 'Tamil Nadu', '2025-12-11 14:00:00', '14:00:00', '2025-12-14 12:00:00', '12:00:00', 17000.00, 'Upcoming'),
(15, 5, 'Le Meridien', 'Goa', 'Goa', '2025-07-21 14:00:00', '14:00:00', '2025-07-23 12:00:00', '12:00:00', 12000.00, 'Upcoming'),
(16, 2, 'Westin', 'Bangalore', 'Karnataka', '2025-08-26 14:00:00', '14:00:00', '2025-08-29 12:00:00', '12:00:00', 15000.00, 'Upcoming'),
(17, 4, 'Radisson', 'Mumbai', 'Maharashtra', '2025-09-16 14:00:00', '14:00:00', '2025-09-18 12:00:00', '12:00:00', 10000.00, 'Upcoming');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `gender` varchar(10) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `pincode` varchar(6) DEFAULT NULL,
  `phone_verified` tinyint(1) DEFAULT 0,
  `email_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `birthday`, `gender`, `phone`, `address`, `state`, `pincode`, `phone_verified`, `email_verified`) VALUES
(1, 'RaviKumar', 'ravi.kumar123@gmail.com', 'password123', '2025-04-15', 'MALE', '9876543210', '123, MG Road', 'Karnataka', '560001', 1, 1),
(2, 'PriyaSharma', 'priya.sharma89@yahoo.com', 'priya@456', '2025-04-08', 'FEMALE', '9823456799', '45, Lajpat Nagar', 'Delhi', '110024', 1, 1),
(3, 'AmitVerma', 'amit.verma567@gmail.com', 'amit!pass', '1995-07-18', 'MALE', '9890123456', '21, Civil Lines', 'Uttar Pradesh', '226001', 1, 1),
(4, 'SnehaRao', 'sneha.rao99@gmail.com', 'Abhi1344', NULL, 'FEMALE', '8765432109', '12, Park Street', 'West Bengal', '700016', 1, 1),
(5, 'Vikram Patil', 'vikram.patil22@gmail.com', '123456', '1987-04-08', 'MALE', '9988776655', '56, FC Road', 'Maharashtra', '411004', 1, 1),
(6, 'AnjaliGupta', 'anjali.gupta11@gmail.com', 'anjali@123', '1993-08-22', 'FEMALE', '9876512345', '89, Raja Park', 'Rajasthan', '302004', 0, 0),
(7, 'RahulJoshi', 'rahul.joshi77@hotmail.com', 'rahul!777', '1991-09-30', 'MALE', '9900112233', '33, Gariahat', 'West Bengal', '700019', 0, 0),
(8, 'KiranReddy', 'kiran.reddy99@gmail.com', 'kiran@pass', '1996-04-15', 'FEMALE', '9887766554', '101, Jubilee Hills', 'Telangana', '500033', 0, 0),
(9, 'NehaSingh', 'neha.singh88@gmail.com', 'neha@pass99', '1994-06-05', 'FEMALE', '9876549870', '77, Sector 14', 'Haryana', '122001', 0, 0),
(10, 'ArjunMishra', 'arjun.mishra45@yahoo.com', 'arjun#pass', NULL, 'MALE', '9765432109', '98, Ashok Nagar ,Gujarat', 'Bihar', '800001', 0, 1),
(11, 'Abhirajsinh Parmar', 'abhirajsinh2244@gmail.com', '123456', '2003-05-01', 'MALE', '9979665656', 'brtbhdtrb', 'Gujarat', '390022', 1, 1),
(36, 'fyhfery', 'kojom53307@provko.com', '123456', '2025-04-07', 'MALE', '9997966565', 'sgrgrege', 'Goa', '390022', 0, 1),
(37, 'NewUser', 'try@gmail.com', '123456', NULL, 'UNKNOWN', NULL, NULL, NULL, NULL, 0, 0),
(38, 'NewUser', '', '123456', NULL, 'UNKNOWN', '9993338555', NULL, NULL, NULL, 0, 0),
(39, 'NewUser', 'afwgf@gmail.com', '123456', NULL, 'UNKNOWN', NULL, NULL, NULL, NULL, 0, 0),
(40, 'NewUser', '21it64@svitvasad.ac.in', NULL, NULL, 'UNKNOWN', NULL, NULL, NULL, NULL, 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `car_rentals`
--
ALTER TABLE `car_rentals`
  ADD PRIMARY KEY (`rental_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `flight_bookings`
--
ALTER TABLE `flight_bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `hotel_bookings`
--
ALTER TABLE `hotel_bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `idx_email_phone` (`email`,`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `car_rentals`
--
ALTER TABLE `car_rentals`
  MODIFY `rental_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `flight_bookings`
--
ALTER TABLE `flight_bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `hotel_bookings`
--
ALTER TABLE `hotel_bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `car_rentals`
--
ALTER TABLE `car_rentals`
  ADD CONSTRAINT `car_rentals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `flight_bookings`
--
ALTER TABLE `flight_bookings`
  ADD CONSTRAINT `flight_bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `hotel_bookings`
--
ALTER TABLE `hotel_bookings`
  ADD CONSTRAINT `hotel_bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
