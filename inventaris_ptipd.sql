-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 30, 2023 at 09:12 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventaris_ptipd`
--

-- --------------------------------------------------------

--
-- Table structure for table `barang_pendukung`
--

CREATE TABLE `barang_pendukung` (
  `id` int(11) NOT NULL,
  `nama_barang` varchar(255) NOT NULL,
  `id_tipe_barang` int(11) NOT NULL,
  `id_merk` int(11) NOT NULL,
  `kondisi` varchar(255) NOT NULL,
  `keterangan` text NOT NULL,
  `id_ruangan` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jadwal_maintenance`
--

CREATE TABLE `jadwal_maintenance` (
  `id` int(11) NOT NULL,
  `id_ruangan` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_berakhir` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `komputer`
--

CREATE TABLE `komputer` (
  `id` int(11) NOT NULL,
  `id_merk` int(11) NOT NULL,
  `id_tipe` int(11) NOT NULL,
  `spek` varchar(255) NOT NULL,
  `jenis` varchar(255) DEFAULT NULL,
  `kondisi` varchar(50) NOT NULL,
  `id_ruangan` int(11) NOT NULL,
  `urutan_meja` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `merk`
--

CREATE TABLE `merk` (
  `id` int(11) NOT NULL,
  `nama_merk` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `merk`
--

INSERT INTO `merk` (`id`, `nama_merk`, `created_at`, `updated_at`) VALUES
(1000, 'Nvidia', '2023-10-30 01:16:12', '2023-10-30 01:16:12'),
(1001, 'Sony', '2023-10-30 01:16:12', '2023-10-30 01:16:12'),
(1002, 'Asus', '2023-10-30 01:16:12', '2023-10-30 01:16:12'),
(1003, 'Dell', '2023-10-30 01:16:12', '2023-10-30 01:16:12'),
(1004, 'Hp', '2023-10-30 01:16:12', '2023-10-30 01:16:12'),
(1005, 'Lenovo', '2023-10-30 01:16:12', '2023-10-30 01:16:12'),
(1006, 'Xiaomi', '2023-10-30 01:16:12', '2023-10-30 01:16:12'),
(1007, 'Canon', '2023-10-30 01:16:12', '2023-10-30 01:16:12'),
(1008, 'Huawei', '2023-11-04 11:10:25', '2023-11-04 11:10:25'),
(1009, 'Huawei', '2023-11-07 01:08:02', '2023-11-07 01:08:02');

-- --------------------------------------------------------

--
-- Table structure for table `peminjaman_barang`
--

CREATE TABLE `peminjaman_barang` (
  `id` int(11) NOT NULL,
  `peminjam` varchar(255) DEFAULT NULL,
  `instansi` varchar(255) NOT NULL,
  `id_komputer` int(11) DEFAULT NULL,
  `tgl_peminjaman` date NOT NULL,
  `tgl_kembali` date NOT NULL,
  `status_peminjaman` varchar(255) NOT NULL,
  `nama_file` varchar(255) DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `peminjaman_ruangan`
--

CREATE TABLE `peminjaman_ruangan` (
  `id` int(11) NOT NULL,
  `nama_peminjam` varchar(255) DEFAULT NULL,
  `id_ruangan` int(11) NOT NULL,
  `kegiatan` text NOT NULL,
  `instansi` varchar(255) DEFAULT NULL,
  `jenis_kegiatan` varchar(255) DEFAULT NULL,
  `tanggal_peminjaman` date NOT NULL,
  `tanggal_kembali` date NOT NULL,
  `status_peminjaman` varchar(255) NOT NULL,
  `nama_file` varchar(255) DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `perbaikan_komputer`
--

CREATE TABLE `perbaikan_komputer` (
  `id` int(11) NOT NULL,
  `id_komputer` int(11) NOT NULL,
  `jenis_perbaikan` varchar(255) NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_berakhir` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ruangan`
--

CREATE TABLE `ruangan` (
  `id` int(11) NOT NULL,
  `nama_ruangan` varchar(255) NOT NULL,
  `jumlah_komputer_laptop` int(11) NOT NULL,
  `penanggung_jawab` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tipe_barang`
--

CREATE TABLE `tipe_barang` (
  `id` int(11) NOT NULL,
  `tipe_barang` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tipe_barang`
--

INSERT INTO `tipe_barang` (`id`, `tipe_barang`, `created_at`, `updated_at`) VALUES
(5000, 'Laptop', '2023-10-30 01:16:37', '2023-10-30 01:16:37'),
(5001, 'Komputer', '2023-10-30 01:16:37', '2023-10-30 01:16:37'),
(5003, 'Printer', '2023-10-30 01:16:37', '2023-10-30 01:16:37');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_verified` char(6) NOT NULL,
  `verification_token` varchar(255) NOT NULL,
  `instansi` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `email`, `password`, `is_verified`, `verification_token`, `instansi`, `name`, `role`, `created_at`, `updated_at`) VALUES
(10, 'hafidgamers11@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$o15x2EppjxCsvv1JeZx+kA$7Fmb3myzGCZ2d65UhL5mIMEoEpDOl5KeEuXQp8YxxDY', '1', '575ufywgcdcxbmnqujsxlk', 'UINSGD', 'Hafid Al Azhar', 'admin', '2023-11-07 05:28:12', '2023-11-07 05:40:04'),
(13, 'hafidalazhar@protonmail.com', '$argon2id$v=19$m=65536,t=3,p=4$LqQziSX6JIknokBKf6h+cw$u9UcLQPIqIK6ZEhU6bz3eGPVTixkIq7SPLs+QTAof4s', '1', 'uk5a7oa338f2iiegdndse2', 'PTIPD', 'Hafid Al Azhar', 'user', '2023-11-13 05:47:09', '2023-11-13 05:47:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barang_pendukung`
--
ALTER TABLE `barang_pendukung`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tipe_barang` (`id_tipe_barang`),
  ADD KEY `id_merk` (`id_merk`),
  ADD KEY `barang_pendukung_ibfk_3` (`id_ruangan`);

--
-- Indexes for table `jadwal_maintenance`
--
ALTER TABLE `jadwal_maintenance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_ruangan` (`id_ruangan`);

--
-- Indexes for table `komputer`
--
ALTER TABLE `komputer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_merk` (`id_merk`),
  ADD KEY `id_ruangan` (`id_ruangan`),
  ADD KEY `FK_tipebarang` (`id_tipe`);

--
-- Indexes for table `merk`
--
ALTER TABLE `merk`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `peminjaman_barang`
--
ALTER TABLE `peminjaman_barang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `peminjaman_barang_komputer` (`id_komputer`);

--
-- Indexes for table `peminjaman_ruangan`
--
ALTER TABLE `peminjaman_ruangan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_ruangan` (`id_ruangan`);

--
-- Indexes for table `perbaikan_komputer`
--
ALTER TABLE `perbaikan_komputer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_komputer` (`id_komputer`);

--
-- Indexes for table `ruangan`
--
ALTER TABLE `ruangan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tipe_barang`
--
ALTER TABLE `tipe_barang`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barang_pendukung`
--
ALTER TABLE `barang_pendukung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6002;

--
-- AUTO_INCREMENT for table `jadwal_maintenance`
--
ALTER TABLE `jadwal_maintenance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8004;

--
-- AUTO_INCREMENT for table `komputer`
--
ALTER TABLE `komputer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3022;

--
-- AUTO_INCREMENT for table `merk`
--
ALTER TABLE `merk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1011;

--
-- AUTO_INCREMENT for table `peminjaman_barang`
--
ALTER TABLE `peminjaman_barang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7026;

--
-- AUTO_INCREMENT for table `peminjaman_ruangan`
--
ALTER TABLE `peminjaman_ruangan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4026;

--
-- AUTO_INCREMENT for table `perbaikan_komputer`
--
ALTER TABLE `perbaikan_komputer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9002;

--
-- AUTO_INCREMENT for table `ruangan`
--
ALTER TABLE `ruangan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2010;

--
-- AUTO_INCREMENT for table `tipe_barang`
--
ALTER TABLE `tipe_barang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5004;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `barang_pendukung`
--
ALTER TABLE `barang_pendukung`
  ADD CONSTRAINT `barang_pendukung_ibfk_1` FOREIGN KEY (`id_tipe_barang`) REFERENCES `tipe_barang` (`id`),
  ADD CONSTRAINT `barang_pendukung_ibfk_2` FOREIGN KEY (`id_merk`) REFERENCES `merk` (`id`),
  ADD CONSTRAINT `barang_pendukung_ibfk_3` FOREIGN KEY (`id_ruangan`) REFERENCES `ruangan` (`id`);

--
-- Constraints for table `jadwal_maintenance`
--
ALTER TABLE `jadwal_maintenance`
  ADD CONSTRAINT `jadwal_maintenance_ibfk_1` FOREIGN KEY (`id_ruangan`) REFERENCES `ruangan` (`id`);

--
-- Constraints for table `komputer`
--
ALTER TABLE `komputer`
  ADD CONSTRAINT `FK_tipebarang` FOREIGN KEY (`id_tipe`) REFERENCES `tipe_barang` (`id`),
  ADD CONSTRAINT `komputer_ibfk_1` FOREIGN KEY (`id_merk`) REFERENCES `merk` (`id`),
  ADD CONSTRAINT `komputer_ibfk_2` FOREIGN KEY (`id_ruangan`) REFERENCES `ruangan` (`id`);

--
-- Constraints for table `peminjaman_barang`
--
ALTER TABLE `peminjaman_barang`
  ADD CONSTRAINT `peminjaman_barang_komputer` FOREIGN KEY (`id_komputer`) REFERENCES `komputer` (`id`);

--
-- Constraints for table `peminjaman_ruangan`
--
ALTER TABLE `peminjaman_ruangan`
  ADD CONSTRAINT `peminjaman_ruangan_ibfk_1` FOREIGN KEY (`id_ruangan`) REFERENCES `ruangan` (`id`);

--
-- Constraints for table `perbaikan_komputer`
--
ALTER TABLE `perbaikan_komputer`
  ADD CONSTRAINT `perbaikan_komputer_ibfk_1` FOREIGN KEY (`id_komputer`) REFERENCES `komputer` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
