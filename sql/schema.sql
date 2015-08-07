-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 27, 2015 at 02:00 AM
-- Server version: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `tpb-scrape`
--
CREATE DATABASE IF NOT EXISTS `tpb-scrape` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `tpb-scrape`;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE IF NOT EXISTS `items` (
  `id` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `cat` int(3) DEFAULT NULL,
  `fileAmount` int(25) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `tagId` int(11) DEFAULT NULL,
  `info` varchar(100) DEFAULT NULL,
  `uploadDate` varchar(25) DEFAULT NULL,
  `leechers` int(25) DEFAULT NULL,
  `seeders` int(25) DEFAULT NULL,
  `infoHash` varchar(40) DEFAULT NULL,
  `magnetLink` varchar(2000) DEFAULT NULL,
  `discription` varchar(1000) DEFAULT NULL,
  `commentId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `scraper`
--

DROP TABLE IF EXISTS `scraper`;
CREATE TABLE IF NOT EXISTS `scraper` (
  `id` int(11) NOT NULL,
  `scrape_date` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `items`
--
ALTER TABLE `items`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scraper`
--
ALTER TABLE `scraper`
 ADD UNIQUE KEY `id` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
