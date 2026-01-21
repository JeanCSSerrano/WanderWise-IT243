-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 21, 2026 at 05:18 PM
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
  `user_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `location_id`, `comment_text`, `created_at`) VALUES
(3, 1, 4, 'hatdog\r\n', '2026-01-18 10:18:17');

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
  `image_url` varchar(255) DEFAULT NULL,
  `open_time` int(11) DEFAULT 8,
  `close_time` int(11) DEFAULT 18
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `lat`, `lng`, `venue_address`, `description`, `image_url`, `open_time`, `close_time`) VALUES
(1, 'Burnham Park', 16.41237950, 120.59297040, 'Jose Abad Santos Dr Baguio 2600 Benguet Philippines', 'Burnham Park, officially known as the Burnham Park Reservation, is a historic urban park located in downtown Baguio, Philippines. The park\'s design is influenced from the City Beautiful movement; It has a small pond or lagoon situated at the green space\'s center and has regimented rows of grass and sidewalk.', 'images/burnham_park.jpg', 0, 24),
(2, 'Mines View Observation Deck', 16.41956510, 120.62785880, 'Mines View Baguio Benguet Philippines', 'Mines View Park is an overlook park on the northeastern outskirts of Baguio in the Philippines. Located on a land promontory 4 kilometres (2.5 mi) from downtown Baguio, the park overlooks the mining town of Itogon, particularly the abandoned gold and copper mines of the Benguet Corporation, and offers a glimpse of the Amburayan Valley.', 'images/mines_view.jpg', 5, 20),
(3, 'Wright Park', 16.41569970, 120.61722330, 'The Mansion Romulo Dr Baguio Benguet, Philippines', 'Wright Park is a wooded area in Baguio which became known for its horseback riding services for tourists.', 'images/wright_park.jpg', 13, 20),
(4, 'Camp John Hay Picnic Area', 16.39967430, 120.61633870, '9JX8+VG8 Camp John Hay, Baguio Benguet Philippines', 'Camp John Hay is a mixed-used development which serves as a tourist destination and forest watershed reservation in Baguio, Philippines. Camp John Hay features historic sites like the Bell House and Bell Amphitheater, along with gardens such as the History Trail, Secret Garden, and a symbolic “Cemetery of Negativism.” The area also includes a golf course, now managed by the Bases Conversion and Development Authority.', 'images/art_park.jpg', 0, 24),
(5, 'Botanical Garden', 16.41501180, 120.61290640, '37 Leonard Wood Rd Baguio 2600 Benguet Philippines', 'The Baguio Botanical Garden, formerly known as Imelda Park, is a botanical garden in Baguio, Philippines, located on Leonard Wood Road between Wright Park and Teacher\'s Camp. The park has art galleries provided by the Baguio Arts Guild, and sculptures displaying the culture of the Igorot people. A statue by Ben Hur Villanueva commemorating the people who built Baguio can also be found. One of the garden\'s main attractions is a 150 m (490 ft) long tunnel which was dug out by Japanese Imperial Army soldiers during World War II for use as storage, treatment, and a bunker.', 'images/botanical_garden.png', 6, 18),
(6, 'SM City Baguio', 16.40885160, 120.59980220, 'Luneta Hill Dr 231, Baguio 2600 Benguet Philippines', 'SM City Baguio is the 22nd largest shopping mall in the Philippines. It is also the first SM Supermall which does not use an air-conditioning system upon its completion, other than the SM Mall of Asia, that make use of natural lighting and which does not have air conditioning in common areas. It is also the only SM Supermall that opens all-year round, including the entire Holy Week. The site of the mall was once occupied by The Historic Pines Hotel until it burned down in 1984.', 'images/sm_city_baguio.jpg', 10, 21),
(7, 'Igorot Stone Kingdom', 16.43156590, 120.57508540, 'Long Long Benguet Rd Baguio Benguet Philippines', 'A cultural theme park and tourist attraction in Baguio, Philippines. Built in 2021 by engineer Pio Velasco, it features stone structures inspired by Cordilleran engineering traditions and folklore. The park gained attention for its distinctive riprap-style stone walling and for representing elements of Igorot culture.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Igorot_Stone_Kingdom.jpg/2560px-Igorot_Stone_Kingdom.jpg', 7, 18),
(8, 'Sky Ranch Baguio', 16.40640000, 120.59990000, 'Luneta Hill Upper Session Rd Baguio 2600 Benguet, Philippines', 'Sky Ranch (also stylized as Skyranch) is a network of amusement parks in the Philippines. Sky Ranch has three branches: in Tagaytay; San Fernando, Pampanga; and in Baguio. The first Sky Ranch amusement park opened in Tagaytay in 2013.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Sky_Ranch_Tagaytay.jpg/2560px-Sky_Ranch_Tagaytay.jpg', 10, 22),
(9, 'Baguio City Market', 16.41500000, 120.59560000, 'Magsaysay Ave Baguio 2600 Benguet Philippines', 'The Baguio City Market offers a wide array of locally sourced goods and products, usually from Benguet province, which includes colorful woven fabrics and hand-strung beads to primitive wood carvings, cut flowers, strawberries and \"Baguio\" vegetables.', 'https://i0.wp.com/shellwanders.com/wp-content/uploads/2023/05/Baguio-Public-Market.jpg?resize=845%2C564&ssl=1', 4, 19),
(10, 'Ili-Likha Artists Village', 16.41380000, 120.59740000, 'Baguio 2600 Benguet Philippines', 'Ili-Likha Artist Village is a whimsical, multi-level creative hub in Baguio City established by National Artist Kidlat Tahimik, constructed around actual trees using recycled materials like old bottles and broken tiles.\r\nIt serves as both an eco-friendly sanctuary and a food community, hosting various stalls that offer healthy, organic, and affordable meals amidst eclectic art installations.', 'https://www.coffeehan.com/wp-content/uploads/2021/12/ili-likha-1-scaled.jpg', 10, 20),
(11, 'Baguio Cathedral and Diocesan Shrine of Our Lady of the Atonement', 16.41250000, 120.59860000, '2600 Steps To Our Lady Of Atonement Cathedral Baguio Benguet Philippines', 'The Baguio Cathedral and Diocesan Shrine of Our Lady of the Atonement, is a Roman Catholic cathedral and the see of the Diocese of Baguio in the Philippines. It is located at Cathedral Loop adjacent to Session Road in Baguio.\r\n\r\nDedicated to the Blessed Virgin Mary under the title of Our Lady of Atonement, its distinctive exterior, twin spires and stained glass windows make it a popular tourist attraction in Baguio. It served as an evacuation center under the Japanese Occupation during the Second World War.', 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Baguio_Cathedral_2023-02-24.jpg', 5, 19),
(12, 'Tam-awan Village', 16.42970000, 120.57640000, 'Long Long Benguet Rd Baguio 2600 Benguet Philippines', 'Tam-awan Village in Pinsao Proper, Baguio City uniquely blends indigenous aesthetics and exquisite Cordilleran craftsmanship with an artist’s concept for a village adapting to Baguio setting.', 'https://tamawanvillage.com/wp-content/uploads/2021/08/tam-awan.jpg', 7, 20),
(13, 'Lion’s Head', 16.36750000, 120.60600000, 'Purok 7 104 Kennon Rd Baguio Benguet, Philippines', 'The Lion´s head is a statue along Kennon Road, a major highway in Luzon, Philippines. Located in Camp 6 near the Baguio–Tuba boundary, the Lion\'s Head measures 40 ft (12 m) in height', 'https://img.atlasobscura.com/84r8tkir4uctU0FM8SrcUqJuI65mkBlnBUFWNBPGCl0/rt:fit/h:400/q:81/sm:1/scp:1/ar:1/aHR0cHM6Ly9hdGxh/cy1kZXYuczMuYW1h/em9uYXdzLmNvbS91/cGxvYWRzL3BsYWNl/X2ltYWdlcy85M2Mz/Nzc3MC0xZGEyLTQy/ZmUtYmY1NC0zZjZj/YTQ2OTBiM2M3NTNl/ZmRmODlhZWVk', 0, 24);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role`, `created_at`) VALUES
(1, 'admin', '$2y$10$CV6eaCHOrlB8TQv/pPFGKuJO7Oif6Jmtb1YXZAxM5Dk94WgOahMwC', 'admin', '2026-01-17 23:56:17'),
(3, 'Jean', '$2y$10$91/SFO5gOVFMJguQyq5Ql.NcY/JvAbigwYQw33tefFmlniUi7PeBG', 'user', '2026-01-18 00:29:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
