DROP DATABASE IF EXISTS `DataBase`;
CREATE DATABASE `DataBase` DEFAULT CHARACTER SET utf8 ;
USE `DataBase`;

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `username` varchar(20) NOT NULL,
  `email` varchar(50) DEFAULT NULL UNIQUE,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  `subscription` DATE DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `match`;

CREATE TABLE `match` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `player` VARCHAR(20) NOT NULL,
  `mode` VARCHAR(50) NOT NULL,
  `level` INT DEFAULT 1,
  `points` VARCHAR(50) DEFAULT NULL,
  `date` DATETIME DEFAULT NULL,
  `victory` BOOLEAN DEFAULT FALSE NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`player`) REFERENCES `user` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


