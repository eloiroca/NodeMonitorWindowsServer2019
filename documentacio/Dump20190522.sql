-- MySQL dump 10.13  Distrib 5.7.26, for Linux (x86_64)
--
-- Host: localhost    Database: monitornodeserver
-- ------------------------------------------------------
-- Server version	5.7.26-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comandesproductes`
--

DROP TABLE IF EXISTS `comandesproductes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comandesproductes` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `id_comanda` int(11) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `preu` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comandesproductes`
--

LOCK TABLES `comandesproductes` WRITE;
/*!40000 ALTER TABLE `comandesproductes` DISABLE KEYS */;
INSERT INTO `comandesproductes` VALUES (6,2510208,NULL,'Polo Blak','39.95'),(7,2510208,NULL,'Vaqueros','94.95');
/*!40000 ALTER TABLE `comandesproductes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comandesvenda`
--

DROP TABLE IF EXISTS `comandesvenda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comandesvenda` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `id_comanda` int(11) DEFAULT NULL,
  `id_usuari` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `cognoms` varchar(255) DEFAULT NULL,
  `nif` varchar(255) DEFAULT NULL,
  `genere` varchar(255) DEFAULT NULL,
  `poblacio` varchar(255) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `estat` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comandesvenda`
--

LOCK TABLES `comandesvenda` WRITE;
/*!40000 ALTER TABLE `comandesvenda` DISABLE KEYS */;
INSERT INTO `comandesvenda` VALUES (10,2510208,'11','Eloi','Roca Plana','78101987J','Hombre','Les Borges Blanques','mIUEkNQRDvm9C3cYiM6WlmvyLFb0AYstnb5ql0Tp.jpeg','pendent');
/*!40000 ALTER TABLE `comandesvenda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuaris`
--

DROP TABLE IF EXISTS `usuaris`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuaris` (
  `id` int(11) DEFAULT NULL,
  `uidNumber` int(11) DEFAULT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `displayName` varchar(255) DEFAULT NULL,
  `contrasenya` varchar(255) DEFAULT NULL,
  `grup` varchar(255) DEFAULT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `initials` varchar(255) DEFAULT NULL,
  `homeDirectory` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuaris`
--

LOCK TABLES `usuaris` WRITE;
/*!40000 ALTER TABLE `usuaris` DISABLE KEYS */;
INSERT INTO `usuaris` VALUES (NULL,1000,'eroca','Eloi Roca Plana','$2b$10$gqApLT1c.2befLZ8T3HEgeRFtCitxVdIZumze8QxN/l7bdtXYxIm2','informatic','eloi@identityeye.com','ER','/home/eroca');
/*!40000 ALTER TABLE `usuaris` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-05-22  0:06:51
