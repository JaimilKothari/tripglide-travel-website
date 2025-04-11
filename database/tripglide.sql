-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 11, 2025 at 11:13 AM
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
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `status` enum('Upcoming','Completed','Cancelled') DEFAULT 'Upcoming'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_rentals`
--

INSERT INTO `car_rentals` (`rental_id`, `user_id`, `car_name`, `start_date`, `end_date`, `cost`, `status`) VALUES
(1, 1, 'Hyundai Creta', '2025-05-01 09:00:00', '2025-05-03 18:00:00', 6000.00, 'Upcoming'),
(2, 1, 'Maruti Swift', '2025-03-14 10:00:00', '2025-03-16 17:00:00', 4000.00, 'Completed'),
(3, 2, 'Toyota Innova', '2025-06-10 08:00:00', '2025-06-12 20:00:00', 8000.00, 'Upcoming'),
(4, 2, 'Honda City', '2025-02-20 09:00:00', '2025-02-22 18:00:00', 5000.00, 'Completed'),
(5, 5, 'Mahindra Thar', '2025-04-25 10:00:00', '2025-04-27 19:00:00', 7000.00, 'Upcoming');

-- --------------------------------------------------------

--
-- Table structure for table `flight_bookings`
--

CREATE TABLE `flight_bookings` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `from_city` varchar(100) NOT NULL,
  `to_city` varchar(100) NOT NULL,
  `departure_date` datetime NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `status` enum('Upcoming','Completed','Cancelled') DEFAULT 'Upcoming'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flight_bookings`
--

INSERT INTO `flight_bookings` (`booking_id`, `user_id`, `from_city`, `to_city`, `departure_date`, `cost`, `status`) VALUES
(1, 1, 'Bangalore', 'Delhi', '2025-05-01 10:00:00', 4500.00, 'Upcoming'),
(2, 1, 'Mumbai', 'Chennai', '2025-03-15 14:30:00', 3800.00, 'Completed'),
(3, 2, 'Delhi', 'Kolkata', '2025-06-10 08:00:00', 5200.00, 'Upcoming'),
(4, 2, 'Hyderabad', 'Bangalore', '2025-02-20 18:00:00', 4100.00, 'Completed'),
(5, 5, 'Pune', 'Goa', '2025-04-25 12:00:00', 3000.00, 'Upcoming');

-- --------------------------------------------------------

--
-- Table structure for table `hotel_bookings`
--

CREATE TABLE `hotel_bookings` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `hotel_name` varchar(100) NOT NULL,
  `check_in_date` datetime NOT NULL,
  `check_out_date` datetime NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `status` enum('Upcoming','Completed','Cancelled') DEFAULT 'Upcoming'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hotel_bookings`
--

INSERT INTO `hotel_bookings` (`booking_id`, `user_id`, `hotel_name`, `check_in_date`, `check_out_date`, `cost`, `status`) VALUES
(1, 1, 'Taj Palace', '2025-05-02 14:00:00', '2025-05-05 12:00:00', 15000.00, 'Upcoming'),
(2, 1, 'Oberoi Grand', '2025-03-10 14:00:00', '2025-03-12 12:00:00', 8000.00, 'Completed'),
(3, 2, 'Hyatt Regency', '2025-06-11 14:00:00', '2025-06-15 12:00:00', 20000.00, 'Upcoming'),
(4, 2, 'Marriott', '2025-02-21 14:00:00', '2025-02-23 12:00:00', 10000.00, 'Completed'),
(5, 5, 'Leela Palace', '2025-04-26 14:00:00', '2025-04-28 12:00:00', 12000.00, 'Upcoming');

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
  `email_verified` tinyint(1) DEFAULT 0,
  `google_verified` tinyint(1) DEFAULT 0,
  `google_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `birthday`, `gender`, `phone`, `address`, `state`, `pincode`, `phone_verified`, `email_verified`, `google_verified`, `google_id`) VALUES
(1, 'RaviKumar', 'ravi.kumar123@gmail.com', 'password123', '2025-04-15', 'Male', '9876543210', '123, MG Road', 'Karnataka', '560001', 1, 1, 0, NULL),
(2, 'PriyaSharma', 'priya.sharma89@yahoo.com', 'priya@456', NULL, 'Female', '9823456799', '45, Lajpat Nagar', 'Delhi', '110024', 1, 1, 0, NULL),
(3, 'AmitVerma', 'amit.verma567@gmail.com', 'amit!pass', '1995-07-18', 'Male', '9890123456', '21, Civil Lines', 'Uttar Pradesh', '226001', 1, 1, 0, NULL),
(4, 'SnehaRao', 'sneha.rao99@gmail.com', 'Abhi1344', '0000-00-00', 'FEMALE', '8765432109', '12, Park Street', 'West Bengal', '700016', 1, 1, 0, NULL),
(5, 'Vikram Patil', 'vikram.patil22@gmail.com', '123456', '1987-04-08', 'MALE', '9988776655', '56, FC Road', 'Maharashtra', '411004', 1, 1, 0, NULL),
(6, 'AnjaliGupta', 'anjali.gupta11@gmail.com', 'anjali@123', '1993-08-22', 'Female', '9876512345', '89, Raja Park', 'Rajasthan', '302004', 0, 0, 0, NULL),
(7, 'RahulJoshi', 'rahul.joshi77@hotmail.com', 'rahul!777', '1991-09-30', 'Male', '9900112233', '33, Gariahat', 'West Bengal', '700019', 0, 0, 0, NULL),
(8, 'KiranReddy', 'kiran.reddy99@gmail.com', 'kiran@pass', '1996-04-15', 'Female', '9887766554', '101, Jubilee Hills', 'Telangana', '500033', 0, 0, 0, NULL),
(9, 'NehaSingh', 'neha.singh88@gmail.com', 'neha@pass99', '1994-06-05', 'Female', '9876549870', '77, Sector 14', 'Haryana', '122001', 0, 0, 0, NULL),
(10, 'ArjunMishra', 'arjun.mishra45@yahoo.com', 'arjun#pass', NULL, 'MALE', '9765432109', '98, Ashok Nagar ,Gujarat', 'Bihar', '800001', 0, 1, 0, NULL),
(34, 'Abhirajsinh Parmar', 'abhirajsinh2244@gmail.com', '123456', '2003-05-01', 'MALE', '9979665656', 'brtbhdtrb', 'Gujarat', '390022', 1, 1, 0, NULL),
(36, 'fyhfery', 'kojom53307@provko.com', '123456', '2025-04-07', 'MALE', '9997966565', 'sgrgrege', 'Goa', '390022', 0, 1, 0, NULL),
(37, 'NewUser', 'try@gmail.com', '123456', NULL, 'Unknown', NULL, NULL, NULL, NULL, 0, 0, 0, NULL),
(38, 'NewUser', '', '123456', NULL, 'Unknown', '9993338555', NULL, NULL, NULL, 0, 0, 0, NULL),
(39, 'NewUser', 'afwgf@gmail.com', '123456', NULL, 'Unknown', NULL, NULL, NULL, NULL, 0, 0, 0, NULL),
(40, 'NewUser', '21it64@svitvasad.ac.in', NULL, NULL, 'Unknown', NULL, NULL, NULL, NULL, 0, 0, 1, '113528539322348357655');

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
  ADD UNIQUE KEY `google_id` (`google_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `car_rentals`
--
ALTER TABLE `car_rentals`
  MODIFY `rental_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `flight_bookings`
--
ALTER TABLE `flight_bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `hotel_bookings`
--
ALTER TABLE `hotel_bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  ADD CONSTRAINT `flight_bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `hotel_bookings`
--
ALTER TABLE `hotel_bookings`
  ADD CONSTRAINT `hotel_bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
