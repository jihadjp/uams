-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: uams
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `academic_calendars`
--

DROP TABLE IF EXISTS `academic_calendars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academic_calendars` (
  `id` varchar(36) NOT NULL,
  `academic_year` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `duration` varchar(100) NOT NULL,
  `semester_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK8lw7j2fwqdbg0h96ds5519od9` (`semester_id`),
  CONSTRAINT `FKmc767a38gnd1uykffnb44xisf` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_calendars`
--

LOCK TABLES `academic_calendars` WRITE;
/*!40000 ALTER TABLE `academic_calendars` DISABLE KEYS */;
/*!40000 ALTER TABLE `academic_calendars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` varchar(36) NOT NULL,
  `class_date` date NOT NULL,
  `marked_at` datetime(6) NOT NULL,
  `status` enum('ABSENT','LATE','PRESENT') NOT NULL,
  `enrollment_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK26qt0862y54h7t24ffrdm9yxy` (`enrollment_id`,`class_date`),
  CONSTRAINT `FKfpxtsy79idkv1ot8h4w34r624` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch_semester_fees`
--

DROP TABLE IF EXISTS `batch_semester_fees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_semester_fees` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `registration_fee` decimal(10,2) NOT NULL,
  `batch_id` varchar(36) NOT NULL,
  `semester_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKo5ify4jnmwn1hwfd537xtfaeb` (`batch_id`,`semester_id`),
  KEY `FKoa22wpel5nj20uf6ij7nwr52t` (`semester_id`),
  CONSTRAINT `FKi9hcpf0971iqod29ok6wb7nyt` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`),
  CONSTRAINT `FKoa22wpel5nj20uf6ij7nwr52t` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_semester_fees`
--

LOCK TABLES `batch_semester_fees` WRITE;
/*!40000 ALTER TABLE `batch_semester_fees` DISABLE KEYS */;
/*!40000 ALTER TABLE `batch_semester_fees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batches`
--

DROP TABLE IF EXISTS `batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batches` (
  `id` varchar(36) NOT NULL,
  `batch_initial` varchar(10) NOT NULL,
  `batch_number` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `program_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbg15o0b0sygsfvo1kxg56wfdg` (`program_id`),
  CONSTRAINT `FKbg15o0b0sygsfvo1kxg56wfdg` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batches`
--

LOCK TABLES `batches` WRITE;
/*!40000 ALTER TABLE `batches` DISABLE KEYS */;
INSERT INTO `batches` VALUES ('e0af691d-9985-4ac4-b123-136c614843f4','263','1','2026-08-07 13:32:33.459249','d272f8da-b5f9-4c99-8280-717d77e3056d');
/*!40000 ALTER TABLE `batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendar_events`
--

DROP TABLE IF EXISTS `calendar_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendar_events` (
  `id` varchar(36) NOT NULL,
  `date_value` varchar(100) DEFAULT NULL,
  `order_index` int NOT NULL,
  `title` varchar(150) NOT NULL,
  `calendar_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKi1bm4e18n012s5ii5o6ubytri` (`calendar_id`),
  CONSTRAINT `FKi1bm4e18n012s5ii5o6ubytri` FOREIGN KEY (`calendar_id`) REFERENCES `academic_calendars` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendar_events`
--

LOCK TABLES `calendar_events` WRITE;
/*!40000 ALTER TABLE `calendar_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `calendar_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `convocation_applications`
--

DROP TABLE IF EXISTS `convocation_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `convocation_applications` (
  `id` varchar(36) NOT NULL,
  `applied_at` datetime(6) NOT NULL,
  `cgpa` decimal(3,2) NOT NULL,
  `convocation_year` int NOT NULL,
  `credits_completed` decimal(5,2) NOT NULL,
  `fee_amount` decimal(10,2) NOT NULL,
  `gown_size` varchar(255) NOT NULL,
  `guest_count` int NOT NULL,
  `is_paid` bit(1) NOT NULL,
  `status` enum('APPROVED','PENDING','REJECTED','VERIFIED') NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `student_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8xmfxyaua3ecb74jdbtps9akh` (`student_id`),
  CONSTRAINT `FK8xmfxyaua3ecb74jdbtps9akh` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `convocation_applications`
--

LOCK TABLES `convocation_applications` WRITE;
/*!40000 ALTER TABLE `convocation_applications` DISABLE KEYS */;
/*!40000 ALTER TABLE `convocation_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_offerings`
--

DROP TABLE IF EXISTS `course_offerings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_offerings` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_results_approved` bit(1) NOT NULL,
  `schedule_info` varchar(255) DEFAULT NULL,
  `seat_limit` int NOT NULL,
  `batch_id` varchar(36) DEFAULT NULL,
  `course_id` varchar(36) NOT NULL,
  `faculty_id` varchar(36) NOT NULL,
  `section_id` varchar(36) DEFAULT NULL,
  `semester_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKneiyouykg665f171dkr2h7or3` (`course_id`),
  KEY `FKq8hyeiowuxn2gvbcv6gr9oc7j` (`faculty_id`),
  KEY `FK2knui1kj75fvy10lh2q7seair` (`semester_id`),
  CONSTRAINT `FK2knui1kj75fvy10lh2q7seair` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`),
  CONSTRAINT `FKneiyouykg665f171dkr2h7or3` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `FKq8hyeiowuxn2gvbcv6gr9oc7j` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_offerings`
--

LOCK TABLES `course_offerings` WRITE;
/*!40000 ALTER TABLE `course_offerings` DISABLE KEYS */;
INSERT INTO `course_offerings` VALUES ('61a8b339-faed-4c5f-90d8-b2fc9dc1bc29','2026-08-07 13:42:16.956415',_binary '\0','',40,'e0af691d-9985-4ac4-b123-136c614843f4','545d166a-0bb0-4a81-9806-49bec0de9f72','b5cd89d2-f95e-4fb3-b543-ae1d1621dd66','f7836a24-5195-4fbb-a260-b434a9f3612d','76d6db9b-6855-4af7-a8e0-5458950b9c9b'),('6d1ca77b-ce09-460f-85e9-850b4318b7b0','2026-08-07 13:42:34.115759',_binary '\0','',40,'e0af691d-9985-4ac4-b123-136c614843f4','55efad44-64f7-4444-aea7-57abd59dde84','b5cd89d2-f95e-4fb3-b543-ae1d1621dd66','f7836a24-5195-4fbb-a260-b434a9f3612d','76d6db9b-6855-4af7-a8e0-5458950b9c9b'),('7025a69d-48df-4386-bb10-7c26e3afcfdb','2026-08-07 13:42:25.281516',_binary '\0','',40,'e0af691d-9985-4ac4-b123-136c614843f4','55efad44-64f7-4444-aea7-57abd59dde84','b5cd89d2-f95e-4fb3-b543-ae1d1621dd66','d48362c0-d9f5-433d-8591-4d247ecd7243','76d6db9b-6855-4af7-a8e0-5458950b9c9b'),('ad9ee01c-ac07-486d-8570-945aa9ac2e40','2026-08-07 13:42:47.352053',_binary '\0','',40,'e0af691d-9985-4ac4-b123-136c614843f4','545d166a-0bb0-4a81-9806-49bec0de9f72','b5cd89d2-f95e-4fb3-b543-ae1d1621dd66','d48362c0-d9f5-433d-8591-4d247ecd7243','76d6db9b-6855-4af7-a8e0-5458950b9c9b'),('d03721d4-e04b-4f61-a2a3-75a8cfbb19f0','2026-08-07 13:41:57.575484',_binary '\0','',40,'e0af691d-9985-4ac4-b123-136c614843f4','906114de-308e-40db-a861-1e923c174d04','b5cd89d2-f95e-4fb3-b543-ae1d1621dd66','f7836a24-5195-4fbb-a260-b434a9f3612d','76d6db9b-6855-4af7-a8e0-5458950b9c9b'),('dd3fd2d9-1491-474e-a611-28e0a1e30dbd','2026-08-07 13:42:05.645437',_binary '\0','',40,'e0af691d-9985-4ac4-b123-136c614843f4','906114de-308e-40db-a861-1e923c174d04','b5cd89d2-f95e-4fb3-b543-ae1d1621dd66','d48362c0-d9f5-433d-8591-4d247ecd7243','76d6db9b-6855-4af7-a8e0-5458950b9c9b');
/*!40000 ALTER TABLE `course_offerings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` varchar(36) NOT NULL,
  `course_code` varchar(20) NOT NULL,
  `course_type` enum('LAB','PROJECT','RESEARCH','THEORY') NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `credit_hours` decimal(3,1) NOT NULL,
  `description` text,
  `is_active` bit(1) NOT NULL,
  `title` varchar(200) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `department_id` varchar(36) NOT NULL,
  `prerequisite_course_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKp02ts69sh53ptd62m3c67v0` (`course_code`),
  KEY `FKsv2mdywju86wq12x4did4xd78` (`department_id`),
  KEY `FKpbycw4nmbh42kmv1sc486vqxx` (`prerequisite_course_id`),
  CONSTRAINT `FKpbycw4nmbh42kmv1sc486vqxx` FOREIGN KEY (`prerequisite_course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `FKsv2mdywju86wq12x4did4xd78` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES ('545d166a-0bb0-4a81-9806-49bec0de9f72','CSE102','LAB','2026-08-07 13:33:47.220464',1.5,'',_binary '','Programming and Problem Solving Lab','2026-08-07 13:33:47.220464','a43bf5a2-6a99-421d-8394-d65e6ad0f92a',NULL),('55efad44-64f7-4444-aea7-57abd59dde84','CSE103','THEORY','2026-08-07 13:34:25.413341',3.0,'',_binary '','Mathematics 1','2026-08-07 13:34:25.413341','a43bf5a2-6a99-421d-8394-d65e6ad0f92a',NULL),('906114de-308e-40db-a861-1e923c174d04','CSE101','THEORY','2026-08-07 13:33:21.879305',3.0,'',_binary '','Programming and Problem Solving','2026-08-07 13:33:21.879305','a43bf5a2-6a99-421d-8394-d65e6ad0f92a',NULL);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` varchar(36) NOT NULL,
  `code` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `dept_number` varchar(5) NOT NULL,
  `faculty_division` varchar(150) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `head_faculty_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKl7tivi5261wxdnvo6cct9gg6t` (`code`),
  UNIQUE KEY `UK23h5x7nlkmvqfml3h8agrvcw6` (`dept_number`),
  UNIQUE KEY `UKdgxhg06iim33mopdtfrjopmvc` (`head_faculty_id`),
  CONSTRAINT `FKc074qmksk0c9b4tpww7ovil41` FOREIGN KEY (`head_faculty_id`) REFERENCES `faculty` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES ('a43bf5a2-6a99-421d-8394-d65e6ad0f92a','CSE','2026-08-07 13:32:11.294238','15',NULL,'Computer Science and Engineering',NULL);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_requests`
--

DROP TABLE IF EXISTS `document_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_requests` (
  `id` varchar(36) NOT NULL,
  `admin_note` text,
  `document_type` enum('MAIN_CERTIFICATE','MEDIUM_OF_INSTRUCTION','PROVISIONAL_CERTIFICATE','TESTIMONIAL','TRANSCRIPT') NOT NULL,
  `fee_amount` decimal(10,2) NOT NULL,
  `is_paid` bit(1) NOT NULL,
  `request_note` text,
  `requested_at` datetime(6) NOT NULL,
  `status` enum('COMPLETED','PENDING','PROCESSING','READY_FOR_PICKUP','REJECTED') NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `student_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7cj53l0vp6eda2v4ypqdo1apv` (`student_id`),
  CONSTRAINT `FK7cj53l0vp6eda2v4ypqdo1apv` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_requests`
--

LOCK TABLES `document_requests` WRITE;
/*!40000 ALTER TABLE `document_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `document_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `id` varchar(36) NOT NULL,
  `enrolled_at` datetime(6) NOT NULL,
  `enrollment_type` enum('IMPROVEMENT','REGULAR','RETAKE') NOT NULL,
  `status` enum('COMPLETED','DROPPED','REGISTERED') NOT NULL,
  `offering_id` varchar(36) NOT NULL,
  `student_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKm4kqtx8cs75xw54tdmwwhaoxq` (`student_id`,`offering_id`),
  KEY `FKbvbbj10qydqrxetoswx8njkh1` (`offering_id`),
  CONSTRAINT `FK8kf1u1857xgo56xbfmnif2c51` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `FKbvbbj10qydqrxetoswx8njkh1` FOREIGN KEY (`offering_id`) REFERENCES `course_offerings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES ('5635ca8b-7941-4e89-bcae-7573e5a4ac3d','2026-08-07 13:43:06.961466','REGULAR','REGISTERED','61a8b339-faed-4c5f-90d8-b2fc9dc1bc29','b6ad2a02-144a-4bcb-abfa-9786fe7947cd'),('91b2fe88-0f97-4c49-9ecd-a9dabb476462','2026-08-07 13:43:06.985472','REGULAR','REGISTERED','6d1ca77b-ce09-460f-85e9-850b4318b7b0','b6ad2a02-144a-4bcb-abfa-9786fe7947cd'),('fec76662-e909-4d1e-96ae-6e80a2aaf7fc','2026-08-07 13:43:07.003977','REGULAR','REGISTERED','d03721d4-e04b-4f61-a2a3-75a8cfbb19f0','b6ad2a02-144a-4bcb-abfa-9786fe7947cd');
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluations`
--

DROP TABLE IF EXISTS `evaluations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluations` (
  `id` varchar(36) NOT NULL,
  `comments` text,
  `created_at` datetime(6) NOT NULL,
  `q1` int NOT NULL,
  `q10` int NOT NULL,
  `q2` int NOT NULL,
  `q3` int NOT NULL,
  `q4` int NOT NULL,
  `q5` int NOT NULL,
  `q6` int NOT NULL,
  `q7` int NOT NULL,
  `q8` int NOT NULL,
  `q9` int NOT NULL,
  `offering_id` varchar(36) NOT NULL,
  `student_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKqh5w5kruosb87yjdjl5rx2r8f` (`student_id`,`offering_id`),
  KEY `FKkfrcuo4661ob6hlrmr780ons7` (`offering_id`),
  CONSTRAINT `FKkfrcuo4661ob6hlrmr780ons7` FOREIGN KEY (`offering_id`) REFERENCES `course_offerings` (`id`),
  CONSTRAINT `FKq5n8rc5wtf9ctx4lydiqfny6r` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluations`
--

LOCK TABLES `evaluations` WRITE;
/*!40000 ALTER TABLE `evaluations` DISABLE KEYS */;
/*!40000 ALTER TABLE `evaluations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exams` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `exam_date` date DEFAULT NULL,
  `exam_type` enum('ASSIGNMENT','ATTENDANCE','FINAL','LAB_EVALUATION','LAB_REPORT','MIDTERM','MIDTERM_IMPROVEMENT','PRESENTATION','PROJECT_SHOW','QUIZ') NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `total_marks` decimal(6,2) NOT NULL,
  `weight_percent` decimal(5,2) NOT NULL,
  `offering_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKo77furh890t8a92n495htu8cs` (`offering_id`),
  CONSTRAINT `FKo77furh890t8a92n495htu8cs` FOREIGN KEY (`offering_id`) REFERENCES `course_offerings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
INSERT INTO `exams` VALUES ('25629680-c240-4025-ad7f-72166d7fbbdf','2026-08-07 13:46:05.383943','2026-08-07','ATTENDANCE','Attendance',10.00,10.00,'61a8b339-faed-4c5f-90d8-b2fc9dc1bc29'),('28a43446-944b-4341-8a52-de1b8e07e6d0','2026-08-07 13:46:05.383943','2026-08-07','ATTENDANCE','Attendance',10.00,10.00,'61a8b339-faed-4c5f-90d8-b2fc9dc1bc29'),('37701af3-dd6c-409d-a3f8-7c32db683602','2026-08-07 13:46:05.387448','2026-08-07','LAB_REPORT','Lab Report',25.00,25.00,'61a8b339-faed-4c5f-90d8-b2fc9dc1bc29'),('38be5781-d8a7-418d-8c6a-939e2e5e7052','2026-08-07 13:46:05.387448','2026-08-07','LAB_REPORT','Lab Report',25.00,25.00,'61a8b339-faed-4c5f-90d8-b2fc9dc1bc29'),('4423e9e1-7d15-4d1d-8ed9-713e1b263a1b','2026-08-07 13:46:05.386941','2026-08-07','PROJECT_SHOW','Project Show',25.00,25.00,'61a8b339-faed-4c5f-90d8-b2fc9dc1bc29'),('5d451536-8f2b-40ea-b9de-3c1e243e45ef','2026-08-07 13:46:05.388456','2026-08-07','LAB_EVALUATION','Lab Final Evaluation',40.00,40.00,'61a8b339-faed-4c5f-90d8-b2fc9dc1bc29'),('5e2841ce-f99a-48d1-9953-d193546a0b7e','2026-08-07 13:46:05.388456','2026-08-07','LAB_EVALUATION','Lab Final Evaluation',40.00,40.00,'61a8b339-faed-4c5f-90d8-b2fc9dc1bc29'),('bc89d02c-b34c-4556-aca5-3dd595e6d586','2026-08-07 13:46:05.386941','2026-08-07','PROJECT_SHOW','Project Show',25.00,25.00,'61a8b339-faed-4c5f-90d8-b2fc9dc1bc29');
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculty`
--

DROP TABLE IF EXISTS `faculty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty` (
  `id` varchar(36) NOT NULL,
  `academic_status` varchar(50) NOT NULL,
  `administrative_position` varchar(100) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `designation` varchar(50) NOT NULL,
  `employee_id` varchar(30) NOT NULL,
  `joined_at` date DEFAULT NULL,
  `department_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKampa1e06lnexbipr83hut0t5g` (`employee_id`),
  UNIQUE KEY `UK3eea1r6n844u6vn4qae7dix4` (`user_id`),
  KEY `FKbcib0tg0bv7u4cwa1bfwyn6ud` (`department_id`),
  CONSTRAINT `FKbcib0tg0bv7u4cwa1bfwyn6ud` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `FKfakwwhqpm5bahy2do8t30j58r` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculty`
--

LOCK TABLES `faculty` WRITE;
/*!40000 ALTER TABLE `faculty` DISABLE KEYS */;
INSERT INTO `faculty` VALUES ('b5cd89d2-f95e-4fb3-b543-ae1d1621dd66','ACTIVE',NULL,'2026-08-07 13:40:19.522741','Associate Professor','15-001','2026-08-07','a43bf5a2-6a99-421d-8394-d65e6ad0f92a','be06ba11-f674-4ea7-aaf6-af8b6b35b24b');
/*!40000 ALTER TABLE `faculty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fees`
--

DROP TABLE IF EXISTS `fees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fees` (
  `id` varchar(36) NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `credit_fee` decimal(10,2) NOT NULL,
  `due_date` date DEFAULT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `registration_fee` decimal(10,2) NOT NULL,
  `semester_id` varchar(36) NOT NULL,
  `student_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKsh8u62ejo9bt2b9ifkdjybrv4` (`student_id`,`semester_id`),
  KEY `FKnjujmfpe1vlfabpgi6m9sb3o5` (`semester_id`),
  CONSTRAINT `FKh56p3es1h1lt6ge4cl3by4oko` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `FKnjujmfpe1vlfabpgi6m9sb3o5` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fees`
--

LOCK TABLES `fees` WRITE;
/*!40000 ALTER TABLE `fees` DISABLE KEYS */;
INSERT INTO `fees` VALUES ('7cdb1c30-230a-49b1-a7cb-2a848a62934a',0.00,'2026-08-07 13:43:06.983465',48750.00,NULL,NULL,0.00,'76d6db9b-6855-4af7-a8e0-5458950b9c9b','b6ad2a02-144a-4bcb-abfa-9786fe7947cd');
/*!40000 ALTER TABLE `fees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financial_aid_applications`
--

DROP TABLE IF EXISTS `financial_aid_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financial_aid_applications` (
  `id` varchar(36) NOT NULL,
  `admin_remarks` text,
  `applied_at` datetime(6) NOT NULL,
  `justification` text NOT NULL,
  `monthly_income` decimal(10,2) DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED','REVIEWING') NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `circular_id` varchar(36) NOT NULL,
  `student_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKq270vt76h35qdif4je89myykk` (`circular_id`),
  KEY `FK3kupd1vkqko8omlitpb0h7mdq` (`student_id`),
  CONSTRAINT `FK3kupd1vkqko8omlitpb0h7mdq` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `FKq270vt76h35qdif4je89myykk` FOREIGN KEY (`circular_id`) REFERENCES `financial_aid_circulars` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financial_aid_applications`
--

LOCK TABLES `financial_aid_applications` WRITE;
/*!40000 ALTER TABLE `financial_aid_applications` DISABLE KEYS */;
/*!40000 ALTER TABLE `financial_aid_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financial_aid_circulars`
--

DROP TABLE IF EXISTS `financial_aid_circulars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financial_aid_circulars` (
  `id` varchar(36) NOT NULL,
  `benefit_details` text,
  `created_at` datetime(6) NOT NULL,
  `deadline` date NOT NULL,
  `description` text NOT NULL,
  `eligibility_criteria` text,
  `is_active` bit(1) NOT NULL,
  `title` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financial_aid_circulars`
--

LOCK TABLES `financial_aid_circulars` WRITE;
/*!40000 ALTER TABLE `financial_aid_circulars` DISABLE KEYS */;
/*!40000 ALTER TABLE `financial_aid_circulars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grading_policies`
--

DROP TABLE IF EXISTS `grading_policies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grading_policies` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `grade` varchar(5) NOT NULL,
  `grade_point` decimal(3,2) NOT NULL,
  `max_marks` decimal(5,2) NOT NULL,
  `min_marks` decimal(5,2) NOT NULL,
  `remarks` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grading_policies`
--

LOCK TABLES `grading_policies` WRITE;
/*!40000 ALTER TABLE `grading_policies` DISABLE KEYS */;
/*!40000 ALTER TABLE `grading_policies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guardians`
--

DROP TABLE IF EXISTS `guardians`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guardians` (
  `id` varchar(36) NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  `other_relation` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `relation` enum('BROTHER','FATHER','MOTHER','OTHER','SISTER') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guardians`
--

LOCK TABLES `guardians` WRITE;
/*!40000 ALTER TABLE `guardians` DISABLE KEYS */;
/*!40000 ALTER TABLE `guardians` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notice_views`
--

DROP TABLE IF EXISTS `notice_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notice_views` (
  `id` varchar(36) NOT NULL,
  `viewed_at` datetime(6) NOT NULL,
  `notice_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKcmdx324o165eo8n2ceh9p9tdd` (`notice_id`,`user_id`),
  KEY `FKi51wsdgjj2dyty8kd04nl9adj` (`user_id`),
  CONSTRAINT `FK11wwi1hvjmfm4r81fk256im7r` FOREIGN KEY (`notice_id`) REFERENCES `notices` (`id`),
  CONSTRAINT `FKi51wsdgjj2dyty8kd04nl9adj` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice_views`
--

LOCK TABLES `notice_views` WRITE;
/*!40000 ALTER TABLE `notice_views` DISABLE KEYS */;
/*!40000 ALTER TABLE `notice_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notices` (
  `id` varchar(36) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `target_role` enum('ALL','FACULTY','REGISTRAR','STUDENT') NOT NULL,
  `title` varchar(200) NOT NULL,
  `department_id` varchar(36) DEFAULT NULL,
  `posted_by` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8dxs864xtu5y73id5vpqab38a` (`department_id`),
  KEY `FKp1mv54ngc0ukkblur0idpgdvk` (`posted_by`),
  CONSTRAINT `FK8dxs864xtu5y73id5vpqab38a` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `FKp1mv54ngc0ukkblur0idpgdvk` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programs` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `degree_level` varchar(30) NOT NULL,
  `duration_years` decimal(3,1) NOT NULL,
  `name` varchar(150) NOT NULL,
  `total_credits` decimal(5,2) NOT NULL,
  `department_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7xrusj91mbbujeaxtrrdowj7e` (`department_id`),
  CONSTRAINT `FK7xrusj91mbbujeaxtrrdowj7e` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programs`
--

LOCK TABLES `programs` WRITE;
/*!40000 ALTER TABLE `programs` DISABLE KEYS */;
INSERT INTO `programs` VALUES ('d272f8da-b5f9-4c99-8280-717d77e3056d','2026-08-07 13:32:20.977479','BACHELOR',4.0,'B.Sc in CSE',148.50,'a43bf5a2-6a99-421d-8394-d65e6ad0f92a');
/*!40000 ALTER TABLE `programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `results` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_final_result` bit(1) NOT NULL,
  `marks_obtained` decimal(6,2) DEFAULT NULL,
  `published_at` datetime(6) DEFAULT NULL,
  `enrollment_id` varchar(36) NOT NULL,
  `exam_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKa3j7v50vrt17tv9tut0mc5ikm` (`enrollment_id`),
  KEY `FKeow9kom5hrbhv6jhq82bqe68k` (`exam_id`),
  CONSTRAINT `FKa3j7v50vrt17tv9tut0mc5ikm` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`id`),
  CONSTRAINT `FKeow9kom5hrbhv6jhq82bqe68k` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `results`
--

LOCK TABLES `results` WRITE;
/*!40000 ALTER TABLE `results` DISABLE KEYS */;
/*!40000 ALTER TABLE `results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sections`
--

DROP TABLE IF EXISTS `sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sections` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `name` varchar(20) NOT NULL,
  `batch_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKl8nvaxhxbu7ebkdr2ujvtewdt` (`batch_id`),
  CONSTRAINT `FKl8nvaxhxbu7ebkdr2ujvtewdt` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sections`
--

LOCK TABLES `sections` WRITE;
/*!40000 ALTER TABLE `sections` DISABLE KEYS */;
INSERT INTO `sections` VALUES ('d48362c0-d9f5-433d-8591-4d247ecd7243','2026-08-07 13:32:41.423981','B','e0af691d-9985-4ac4-b123-136c614843f4'),('f7836a24-5195-4fbb-a260-b434a9f3612d','2026-08-07 13:32:39.006031','A','e0af691d-9985-4ac4-b123-136c614843f4');
/*!40000 ALTER TABLE `sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `semester_clearance`
--

DROP TABLE IF EXISTS `semester_clearance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `semester_clearance` (
  `id` varchar(36) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `final_exam_cleared` bit(1) NOT NULL,
  `midterm_cleared` bit(1) NOT NULL,
  `registration_cleared` bit(1) NOT NULL,
  `semester_id` varchar(36) NOT NULL,
  `student_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKkx9odh5nwx0rgxs5obo1ggtpm` (`student_id`,`semester_id`),
  KEY `FKnwauoamyb5da8vuudhm67x31m` (`semester_id`),
  CONSTRAINT `FKnwauoamyb5da8vuudhm67x31m` FOREIGN KEY (`semester_id`) REFERENCES `semesters` (`id`),
  CONSTRAINT `FKrye6jdsskx5pkyem6pug7xu0u` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `semester_clearance`
--

LOCK TABLES `semester_clearance` WRITE;
/*!40000 ALTER TABLE `semester_clearance` DISABLE KEYS */;
/*!40000 ALTER TABLE `semester_clearance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `semesters`
--

DROP TABLE IF EXISTS `semesters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `semesters` (
  `id` varchar(36) NOT NULL,
  `academic_year` int NOT NULL,
  `add_drop_deadline` date DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `end_date` date NOT NULL,
  `grade_deadline` date DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `registration_deadline` date NOT NULL,
  `start_date` date NOT NULL,
  `status` enum('COMPLETED','FINAL_EXAMS','GRADING','ONGOING','REGISTRATION','UPCOMING') NOT NULL,
  `term` enum('FALL','SPRING','SUMMER') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `semesters`
--

LOCK TABLES `semesters` WRITE;
/*!40000 ALTER TABLE `semesters` DISABLE KEYS */;
INSERT INTO `semesters` VALUES ('76d6db9b-6855-4af7-a8e0-5458950b9c9b',2026,NULL,'2026-08-07 13:31:37.383929','2026-12-31',NULL,'FALL 2026','2026-09-10','2026-09-13','REGISTRATION','FALL');
/*!40000 ALTER TABLE `semesters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` varchar(36) NOT NULL,
  `admitted_at` date NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `current_semester` int NOT NULL,
  `has_received_laptop` bit(1) NOT NULL,
  `is_registration_cleared` bit(1) NOT NULL,
  `registration_no` varchar(30) NOT NULL,
  `status` enum('ACTIVE','DROPPED','GRADUATED','SUSPENDED') NOT NULL,
  `student_id` varchar(30) NOT NULL,
  `advisor_id` varchar(36) DEFAULT NULL,
  `batch_id` varchar(36) DEFAULT NULL,
  `guardian_id` varchar(36) DEFAULT NULL,
  `program_id` varchar(36) NOT NULL,
  `section_id` varchar(36) DEFAULT NULL,
  `user_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKs9xpyxqkdt9ttcg87b2hatj7f` (`registration_no`),
  UNIQUE KEY `UK5mbus2m1tm2acucrp6t627jmx` (`student_id`),
  UNIQUE KEY `UKg4fwvutq09fjdlb4bb0byp7t` (`user_id`),
  UNIQUE KEY `UK16lwjhx26eqp1xqtbcth5k7xy` (`guardian_id`),
  KEY `FKlry49n3ubs99jd42gm4hbujmx` (`advisor_id`),
  KEY `FKosyri4p0rpereimcss9cm3cwv` (`program_id`),
  CONSTRAINT `FKdt1cjx5ve5bdabmuuf3ibrwaq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKlry49n3ubs99jd42gm4hbujmx` FOREIGN KEY (`advisor_id`) REFERENCES `faculty` (`id`),
  CONSTRAINT `FKosyri4p0rpereimcss9cm3cwv` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`),
  CONSTRAINT `FKqc9vci8boryais7q7is16ccwo` FOREIGN KEY (`guardian_id`) REFERENCES `guardians` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES ('b6ad2a02-144a-4bcb-abfa-9786fe7947cd','2026-08-07','2026-08-07 13:35:06.505829',1,_binary '\0',_binary '','263-15-001','ACTIVE','0263150050000001','b5cd89d2-f95e-4fb3-b543-ae1d1621dd66','e0af691d-9985-4ac4-b123-136c614843f4',NULL,'d272f8da-b5f9-4c99-8280-717d77e3056d','f7836a24-5195-4fbb-a260-b434a9f3612d','e33d8969-13a3-43b7-a572-52bc4fd85b0c');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `blood_group` varchar(5) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `is_verified` bit(1) NOT NULL,
  `must_change_password` bit(1) NOT NULL,
  `name` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_image` longtext,
  `role` enum('ADMIN','FACULTY','REGISTRAR','STUDENT') NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('2bc2e5d2-2d22-4245-9418-0fc0ec252583',NULL,'2026-08-07 13:30:39.790261',NULL,'registrar@rbu.edu.bd',NULL,_binary '',_binary '',_binary '\0','Academic Registrar','$2a$10$hiUJbnjmIOOXCtCufRG2Rehj2FZMCAnTLNVVsBWt9QrNhA1XiNJoe',NULL,NULL,'REGISTRAR','2026-08-07 13:30:39.790261'),('3207ed6f-8ca5-4c9b-b6aa-f635197ee161',NULL,'2026-08-07 13:30:39.589252',NULL,'admin2@rbu.edu.bd',NULL,_binary '',_binary '',_binary '\0','Team Member 2','$2a$10$viuBM2GHvRzslUxX.q4UEe8N7nFX.FWcYy6kPrwo2emmf4L2GIU.K',NULL,NULL,'ADMIN','2026-08-07 13:30:39.589252'),('6e41eb47-b1d0-4c24-9cd4-1a60710f744c',NULL,'2026-08-07 13:30:39.684781',NULL,'admin3@rbu.edu.bd',NULL,_binary '',_binary '',_binary '\0','Team Member 3','$2a$10$UbAme1v7.1SpabA0/wxe6OAjQ737wwse59sBpFJVevPH1JVD8Jf2G',NULL,NULL,'ADMIN','2026-08-07 13:30:39.684781'),('73dd833f-3117-4c8f-bbfc-f6d15d44f966','B+','2026-08-07 13:30:39.358634','2001-10-11','admin@rbu.edu.bd','Male',_binary '',_binary '',_binary '\0','System Admin','$2a$10$r4Gn1xv7MkZAkKGUaWQUNuEmdu5Ag2hFBGPbkNaNSqSbAdB6tz9L.','01565656656',NULL,'ADMIN','2026-08-07 13:37:45.817947'),('b3e197b7-8daf-460a-a02b-b5d26cac2cf9',NULL,'2026-08-07 13:30:39.481682',NULL,'admin1@rbu.edu.bd',NULL,_binary '',_binary '',_binary '\0','Team Member 1','$2a$10$rQc3RvR9xWihBbHLxl7E0emvGQdH1A6kTrgw9/aKJqqdbVQt00a52',NULL,NULL,'ADMIN','2026-08-07 13:30:39.482674'),('be06ba11-f674-4ea7-aaf6-af8b6b35b24b',NULL,'2026-08-07 13:40:19.518742',NULL,'sana.cse@rbu.edu.bd',NULL,_binary '',_binary '',_binary '\0','Dr. Sana Islam','$2a$10$2TxQkay8Be4WlEmyK0GpF.L/Y1WvAaIYgqj68wlGHmfjjHRMsbpAq','01711223379',NULL,'FACULTY','2026-08-07 13:40:52.579011'),('e33d8969-13a3-43b7-a572-52bc4fd85b0c','A-','2026-08-07 13:35:06.500828',NULL,'ratan@rbu.edu.bd','MALE',_binary '',_binary '',_binary '\0','Ratan','$2a$10$gEOlZS/r6xTpp40vgZJKEOrMacKyRn6bHHGhSHFd8aZsEh04op.zG','01711223379',NULL,'STUDENT','2026-08-07 13:36:19.413365');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-07 20:02:14
