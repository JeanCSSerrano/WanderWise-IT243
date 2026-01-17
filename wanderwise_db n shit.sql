-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 17, 2026 at 08:40 AM
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
-- Database: `wanderwise_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `user_name` varchar(50) DEFAULT 'Anonymous',
  `comment_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `lat` decimal(10,8) NOT NULL,
  `lng` decimal(11,8) NOT NULL,
  `venue_address` text NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `lat`, `lng`, `venue_address`, `description`, `image_url`) VALUES
(1, 'Burnham Park', 16.41237950, 120.59297040, 'Jose Abad Santos Dr Baguio 2600 Benguet Philippines', 'Burnham Park, officially known as the Burnham Park Reservation, is a historic urban park located in downtown Baguio, Philippines. The park\'s design is influenced from the City Beautiful movement; It has a small pond or lagoon situated at the green space\'s center and has regimented rows of grass and sidewalk.', 'images/burnham_park.jpg'),
(2, 'Mines View Observation Deck', 16.41956510, 120.62785880, 'Mines View Baguio Benguet Philippines', 'Mines View Park is an overlook park on the northeastern outskirts of Baguio in the Philippines. Located on a land promontory 4 kilometres (2.5 mi) from downtown Baguio, the park overlooks the mining town of Itogon, particularly the abandoned gold and copper mines of the Benguet Corporation, and offers a glimpse of the Amburayan Valley.', 'images/mines_view.jpg'),
(3, 'Wright Park', 16.41569970, 120.61722330, 'The Mansion Romulo Dr Baguio Benguet, Philippines', 'Wright Park is a wooded area in Baguio which became known for its horseback riding services for tourists.', 'images/wright_park.jpg'),
(4, 'Camp John Hay Picnic Area', 16.39967430, 120.61633870, '9JX8+VG8 Camp John Hay, Baguio Benguet Philippines', 'Camp John Hay is a mixed-used development which serves as a tourist destination and forest watershed reservation in Baguio, Philippines. Camp John Hay features historic sites like the Bell House and Bell Amphitheater, along with gardens such as the History Trail, Secret Garden, and a symbolic “Cemetery of Negativism.” The area also includes a golf course, now managed by the Bases Conversion and Development Authority.', 'images/art_park.jpg'),
(5, 'Botanical Garden', 16.41501180, 120.61290640, '37 Leonard Wood Rd Baguio 2600 Benguet Philippines', 'The Baguio Botanical Garden, formerly known as Imelda Park, is a botanical garden in Baguio, Philippines, located on Leonard Wood Road between Wright Park and Teacher\'s Camp. The park has art galleries provided by the Baguio Arts Guild, and sculptures displaying the culture of the Igorot people. A statue by Ben Hur Villanueva commemorating the people who built Baguio can also be found. One of the garden\'s main attractions is a 150 m (490 ft) long tunnel which was dug out by Japanese Imperial Army soldiers during World War II for use as storage, treatment, and a bunker.', 'images/botanical_garden.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
