-- MySQL dump 10.13  Distrib 9.3.0, for Linux (x86_64)
--
-- Host: localhost    Database: db_usuarios
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` varchar(36) NOT NULL,
  `creation_user` varchar(50) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `creation_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `name` varchar(100) NOT NULL,
  `description` varchar(250) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_648e3f5447f725579d7d4ffdfb` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES ('4bf537a0-e05b-4365-8589-eb407329eb92','admin','admin',NULL,NULL,0,'admin','admin'),('660f8bcc-ae0a-4f9d-a30f-4d1fff1ff731','admin','admin',NULL,NULL,0,'cliente','cliente');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` varchar(36) NOT NULL,
  `creation_user` varchar(50) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `creation_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `user_id` varchar(255) NOT NULL,
  `role_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_87b8888186ca9769c960e926870` (`user_id`),
  KEY `FK_b23c65e50a758245a33ee35fda1` (`role_id`),
  CONSTRAINT `FK_87b8888186ca9769c960e926870` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_b23c65e50a758245a33ee35fda1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES ('738b097b-ff53-4181-b91e-03439fd5fe96','892d1263-02f4-4934-9618-25029d92ec67','892d1263-02f4-4934-9618-25029d92ec67','2025-06-13 17:14:34','2025-06-13 17:14:34',0,'892d1263-02f4-4934-9618-25029d92ec67','660f8bcc-ae0a-4f9d-a30f-4d1fff1ff731'),('bf78d7a9-deec-4145-ac74-f7a5a7dac1ac','da7444bf-9b81-4b9f-bc0f-0808d2efddbc','da7444bf-9b81-4b9f-bc0f-0808d2efddbc','2025-06-11 22:21:31','2025-06-11 22:21:31',0,'da7444bf-9b81-4b9f-bc0f-0808d2efddbc','4bf537a0-e05b-4365-8589-eb407329eb92');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `creation_user` varchar(50) DEFAULT NULL,
  `update_user` varchar(50) DEFAULT NULL,
  `creation_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `email` varchar(70) NOT NULL,
  `password` varchar(600) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('30c831bf-1eee-4d1f-a438-df54cd3f295c','da7444bf-9b81-4b9f-bc0f-0808d2efddbc','da7444bf-9b81-4b9f-bc0f-0808d2efddbc','2025-06-18 15:16:11','2025-06-18 15:16:11',0,'cliente3@gmail.com','$2b$10$05OrpZVlHDVMUh09BYDRPuYoDDRFjkaez7dm4zvc9QFboMpNhlffe'),('81e5259f-3ce1-4edb-90e3-91425929c1c5','da7444bf-9b81-4b9f-bc0f-0808d2efddbc','da7444bf-9b81-4b9f-bc0f-0808d2efddbc','2025-06-13 17:15:02','2025-06-13 17:15:02',0,'cliente2@gmail.com','$2b$10$KVtI7uicWs5./sMmMTG/l.fyiMVnG3j7tKJT1XiBPlTDyUSblzpbe'),('892d1263-02f4-4934-9618-25029d92ec67','da7444bf-9b81-4b9f-bc0f-0808d2efddbc','da7444bf-9b81-4b9f-bc0f-0808d2efddbc','2025-06-13 17:12:00','2025-06-13 17:12:00',0,'cliente1@gmail.com','$2b$10$T71Uqx9KyF7eIB01yauo4.rCfOykfsJL5QMPcVva8QSmh87.2ddre'),('da7444bf-9b81-4b9f-bc0f-0808d2efddbc',NULL,NULL,'2025-06-11 22:18:17','2025-06-11 22:18:17',0,'daniel@gmail.com','$2b$10$hQLukFm1iTxsdkX/wO3G8ubdbuLznN0R7QTZZ54vEVvriYQapuVde');
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

-- Dump completed on 2025-06-18 20:11:45
