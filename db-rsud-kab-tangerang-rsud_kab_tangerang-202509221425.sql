-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: rsud_kab_tangerang
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `doklin`
--

DROP TABLE IF EXISTS `doklin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doklin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doklin_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doklin`
--

LOCK TABLES `doklin` WRITE;
/*!40000 ALTER TABLE `doklin` DISABLE KEYS */;
INSERT INTO `doklin` VALUES (1,'DEMOGRAFI','Data Demografi','Dokumen berisi data demografi pasien'),(2,'CPPT','CPPT','Catatan Perkembangan Pasien Terintegrasi'),(3,'RESUME_RJ','Resume Medis Rawat Jalan','Ringkasan medis pasien rawat jalan'),(4,'RESUME_RI','Ringkasan Pasien Pulang Rawat Inap','Ringkasan medis pasien pulang rawat inap'),(5,'RESUME_IGD','Ringkasan Pasien Pulang Gawat Darurat','Ringkasan medis pasien IGD'),(6,'GENERAL_DOC','General Document','Dokumen umum pasien'),(7,'ASESMEN_AWAL','Asesmen Awal','Asesmen awal pasien'),(8,'PENGKAJIAN_TERMINAL','Pengkajian Keperawatan Terminal','Pengkajian pasien terminal oleh perawat'),(9,'ASESMEN_TERMINAL','Asesmen Terminal','Asesmen terminal pasien'),(10,'SGA','Subjective Global Assessment','Penilaian status gizi subjektif'),(11,'OBS_IGD','Observasi Gawat Darurat','Observasi pasien di IGD'),(12,'KEMOTERAPI','Kemoterapi','Dokumen tindakan kemoterapi'),(13,'MORNING_REPORT','Morning Report','Laporan visit pagi dokter'),(14,'CHECKLIST_PULANG','Check List Pulang','Checklist pasien saat pulang'),(15,'VAKSIN_COVID19','Vaksinisasi Covid-19','Dokumen vaksinasi Covid-19 pasien'),(16,'KEMATIAN','Kematian','Dokumen kematian pasien'),(17,'SURAT_MASUK_RS','Surat Permintaan Masuk Rumah Sakit','Surat permintaan masuk rumah sakit'),(18,'OPERASI','Operasi','Laporan operasi pasien'),(19,'ASESMEN_NYERI','Asesmen Nyeri','Penilaian tingkat nyeri pasien'),(20,'RIWAYAT_INTERVENSI','Riwayat Intervensi','Riwayat intervensi medis pasien'),(21,'ASESMEN_JATUH','Asesmen Jatuh','Penilaian risiko jatuh pasien'),(22,'EWS','EWS','Early Warning Score'),(23,'PEWS','PEWS','Pediatric Early Warning Score'),(24,'MEOWS','MEOWS','Modified Early Obstetric Warning Score'),(25,'NEWS','NEWS','National Early Warning Score'),(26,'GIZI','Gizi','Dokumen asesmen gizi pasien'),(27,'HEMODIALISIS','Hemodialisis','Dokumen tindakan hemodialisis'),(28,'POC','Plan Of Care','Rencana perawatan pasien'),(29,'REHAB_MEDIK','Rehabilitasi Medik','Dokumen rehabilitasi medik'),(30,'TRANSFER_PATIENT','Transfer Patient','Dokumen transfer pasien'),(31,'RADIOLOGY','Radiology / Hasil Radiologi','Hasil pemeriksaan radiologi pasien'),(32,'LABORATORY','Laboratory / Hasil Laboratorium','Hasil pemeriksaan laboratorium pasien'),(33,'MICROBIOLOGY','Microbiology','Hasil pemeriksaan mikrobiologi pasien'),(34,'PATHOLOGY','Pathology Anatomi','Hasil pemeriksaan PA'),(35,'PRESCRIPTION','Prescription / Hasil Obat','Resep / obat pasien'),(36,'KONSUL','Konsul','Dokumen konsultasi pasien'),(37,'INTAKE_OUTPUT','Intake Output','Catatan intake dan output pasien'),(38,'MESO','Meso','Dokumen tindakan meso'),(39,'REKON_OBAT','Rekonsiliasi Obat','Rekonsiliasi obat pasien'),(40,'PRMRJ','PRMRJ','Dokumen PRMRJ'),(41,'SKRINING','Skrining Pasien','Dokumen skrining awal pasien'),(42,'MEDICO_LEGAL','Medico Legal','Dokumen medico legal'),(43,'MPP','MPP','Manajemen Pelayanan Pasien'),(44,'RUJUK_KELUAR','Rujuk Keluar','Dokumen rujuk keluar pasien'),(45,'TINDAKAN_BIDAN','Laporan Tindakan Kebidanan','Laporan tindakan kebidanan'),(46,'KARDEX','Kardex','Kardex perawatan pasien'),(47,'BUKTI_PELAYANAN','Bukti Pelayanan Pasien','Bukti pelayanan pasien'),(48,'USG','Ekspertise USG','Hasil pemeriksaan USG'),(49,'JANTUNG','Pemeriksaan Jantung','Hasil pemeriksaan jantung'),(50,'CONSENT','General Consent & Informed Consent','Persetujuan umum & informed consent'),(51,'SURAT_KONTROL','Surat Kontrol','Surat kontrol pasien'),(52,'SURAT_RUJUK_BALIK','Surat Rujuk Balik','Surat rujuk balik pasien'),(53,'KLAIM_REHAB','Klaim Rehabilitasi Medik','Dokumen klaim rehabilitasi medik'),(54,'ANESTESI_SEDASI','Anestesi Sedasi','Dokumen anestesi & sedasi'),(55,'DL_CATHETER','Laporan Pemasangan Catheter Double Lumen','Dokumen pemasangan catheter double lumen'),(56,'REQ_TRANSFUSI','Permintaan Transfusi Darah','Permintaan transfusi darah'),(57,'RESEP_KACAMATA','Resep Kacamata','Resep kacamata pasien'),(58,'TRIAGE_MATERNAL','Triage Maternal','Dokumen triage maternal'),(59,'ASESMEN_REHAB','Asesmen Rehab Komprehensif KFR','Asesmen rehabilitasi komprehensif KFR'),(60,'PARTOGRAF','Partograf','Partograf pasien maternal'),(61,'REAKSI_TRANSFUSI','Reaksi Transfusi Darah','Dokumen reaksi transfusi darah');
/*!40000 ALTER TABLE `doklin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitals`
--

DROP TABLE IF EXISTS `hospitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospitals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hospital_code` varchar(255) NOT NULL,
  `hospital_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hospitals_unique` (`hospital_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitals`
--

LOCK TABLES `hospitals` WRITE;
/*!40000 ALTER TABLE `hospitals` DISABLE KEYS */;
INSERT INTO `hospitals` VALUES (1,'rstangerang','RSUD Tangerang');
/*!40000 ALTER TABLE `hospitals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meta_data`
--

DROP TABLE IF EXISTS `meta_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meta_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tanggalScan` date DEFAULT NULL,
  `norm` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `namaPasien` varchar(100) DEFAULT NULL,
  `tglLahir` datetime DEFAULT NULL,
  `jenisDokumen` varchar(100) DEFAULT NULL,
  `kategori` varchar(100) DEFAULT NULL,
  `layanan` varchar(100) DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `file_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_date_string` datetime DEFAULT CURRENT_TIMESTAMP,
  `doklin_code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `noBox` varchar(255) DEFAULT NULL,
  `tanggalKunjungan` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_meta_data_doklin` (`doklin_code`),
  FULLTEXT KEY `idx_meta` (`norm`,`namaPasien`,`jenisDokumen`,`layanan`,`title`,`kategori`),
  FULLTEXT KEY `ft_index_meta` (`title`,`norm`,`namaPasien`,`doklin_code`),
  CONSTRAINT `fk_meta_data_doklin` FOREIGN KEY (`doklin_code`) REFERENCES `doklin` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meta_data`
--

LOCK TABLES `meta_data` WRITE;
/*!40000 ALTER TABLE `meta_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `meta_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userrole`
--

DROP TABLE IF EXISTS `userrole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userrole` (
  `roleId` int NOT NULL AUTO_INCREMENT,
  `roleName` varchar(50) DEFAULT NULL,
  `roleDescription` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userrole`
--

LOCK TABLES `userrole` WRITE;
/*!40000 ALTER TABLE `userrole` DISABLE KEYS */;
INSERT INTO `userrole` VALUES (1,'ADMIN','All Access','2025-08-21 10:27:08'),(2,'USERS','LIMITED ACCESS','2025-08-21 10:27:23');
/*!40000 ALTER TABLE `userrole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `hospital_code` varchar(255) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  KEY `users_userrole_FK` (`roleId`),
  KEY `users_hospitals_FK` (`hospital_code`),
  CONSTRAINT `users_hospitals_FK` FOREIGN KEY (`hospital_code`) REFERENCES `hospitals` (`hospital_code`),
  CONSTRAINT `users_userrole_FK` FOREIGN KEY (`roleId`) REFERENCES `userrole` (`roleId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'romirahman','$argon2id$v=19$m=65536,t=4,p=2$h1WxFLd1ty4kuTTyCi3JLQ$EdiIuVTo8ODRL5s5mwzlrkhrGqUyKYojfCjLQP4QZ4w',1,'2025-08-28 09:30:44','rstangerang','Alih Media Tangerang'),(2,'admin','$argon2id$v=19$m=65536,t=4,p=2$ZiFhhHTWuvjCclAB+kkEbw$2rsRtHUtHzCFQKbTiPKAJuHBkpYbCJtzj+4nHhl9h3E',1,'2025-09-22 14:01:26',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'rsud_kab_tangerang'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-22 14:25:38
