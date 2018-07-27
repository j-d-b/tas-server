-- generated with sequelize src/data/setup/setup-dev.js
DROP TABLE IF EXISTS `config`;
DROP TABLE IF EXISTS `appts`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `blocks`;
DROP TABLE IF EXISTS `blocks`;

CREATE TABLE IF NOT EXISTS `blocks` (
  `id` VARCHAR(255),
  `max_allowed_appts_per_hour` INTEGER NOT NULL,
  `curr_allowed_appts_per_hour` INTEGER NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `users` (
  `email` VARCHAR(255),
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` ENUM('CUSTOMER', 'OPERATOR', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  `confirmed` TINYINT(1) NOT NULL DEFAULT false,
  `email_verified` TINYINT(1) NOT NULL DEFAULT false,
  `company` VARCHAR(255),
  `mobile_number` VARCHAR(255),
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `appts` (
  `id` INTEGER auto_increment,
  `time_slot_hour` INTEGER NOT NULL,
  `time_slot_date` DATE NOT NULL,
  `type` ENUM('IMPORTFULL', 'IMPORTEMPTY', 'EXPORTFULL', 'EXPORTEMPTY') NOT NULL,
  `container_id` VARCHAR(255),
  `container_size` VARCHAR(255),
  `container_weight` INTEGER,
  `form_num_705` VARCHAR(255),
  `empty_for_city_form_num` VARCHAR(255),
  `booking_num` VARCHAR(255),
  `vessel_name` VARCHAR(255),
  `vessel_eta` DATETIME,
  `desintation_port` VARCHAR(255),
  `first_port_of_discharge` VARCHAR(255),
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `block` VARCHAR(255), `userEmail` VARCHAR(255),
  PRIMARY KEY (`id`), FOREIGN KEY (`block`) REFERENCES `blocks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`userEmail`) REFERENCES `users` (`email`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `config` (
  `id` INTEGER NOT NULL auto_increment,
  `total_allowed_appts_per_hour` INTEGER NOT NULL,
  `max_tfu_per_appt` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;


INSERT INTO `blocks` (`id`,`max_allowed_appts_per_hour`,`curr_allowed_appts_per_hour`,`createdAt`,`updatedAt`) VALUES ('A',3,1,'2018-07-27 19:15:33','2018-07-27 19:15:33');
INSERT INTO `blocks` (`id`,`max_allowed_appts_per_hour`,`curr_allowed_appts_per_hour`,`createdAt`,`updatedAt`) VALUES ('B',2,2,'2018-07-27 19:15:33','2018-07-27 19:15:33');
INSERT INTO `blocks` (`id`,`max_allowed_appts_per_hour`,`curr_allowed_appts_per_hour`,`createdAt`,`updatedAt`) VALUES ('C',5,5,'2018-07-27 19:15:33','2018-07-27 19:15:33');
INSERT INTO `users` (`email`,`password`,`name`,`role`,`confirmed`,`email_verified`,`company`,`created_at`,`updated_at`) VALUES ('robert@gmail.com','$2b$10$TdLKfK3ypYKE6KRKnUuWmu1vVrke9o7LbY2dvLJNyUf34kYleqOaG','Robert Frost','CUSTOMER',true,true,'Wingworks','2018-07-27 19:15:33','2018-07-27 19:15:33');
INSERT INTO `users` (`email`,`password`,`name`,`role`,`confirmed`,`email_verified`,`company`,`created_at`,`updated_at`) VALUES ('william@hotmail.com','$2b$10$mreEtTui92vgFwL3pURWQOAnbwwoWW4TT9Cq33J5SCiArGIZz.BS6','William Wood','CUSTOMER',true,true,'Wingworks','2018-07-27 19:15:33','2018-07-27 19:15:33');
INSERT INTO `users` (`email`,`password`,`name`,`role`,`confirmed`,`email_verified`,`company`,`created_at`,`updated_at`) VALUES ('sam@trees.net','$2b$10$HOnLP01M6F68l1F2EfRtLeaLIAq3z7UqOwK2OE4POY48HTosvbb8q','Samuel Gardner','OPERATOR',true,true,'TerminalTrue','2018-07-27 19:15:33','2018-07-27 19:15:33');
INSERT INTO `users` (`email`,`password`,`name`,`role`,`confirmed`,`email_verified`,`company`,`created_at`,`updated_at`) VALUES ('cory@mmt.net','$2b$10$O/KQv9KmG/xl6miT9vxJDu/OhTuOBYvJPZKhRlOW920o0T8i0wtmS','Cory Roberts','CUSTOMER',true,true,'Corigate Group','2018-07-27 19:15:33','2018-07-27 19:15:33');
INSERT INTO `users` (`email`,`password`,`name`,`role`,`confirmed`,`email_verified`,`company`,`created_at`,`updated_at`) VALUES ('jacob@jdbrady.info','$2b$10$9pNW8amWUnPCgC.lAZ/O6OG2H7geCWx81K6cKky.y6Sw/LrZhsXsO','Jacob Brady','ADMIN',true,true,'KCUS','2018-07-27 19:15:33','2018-07-27 19:15:33');
INSERT INTO `users` (`email`,`password`,`name`,`role`,`confirmed`,`email_verified`,`company`,`created_at`,`updated_at`) VALUES ('jbrady@kcus.org','$2b$10$iy2SL8juqYO4bNrhYOsJOuk/BsTbUbiWDzQ.bXaqwMHhp2UBTcyEW','Jacob Brady','OPERATOR',false,false,'KCUS','2018-07-27 19:15:33','2018-07-27 19:15:33');
INSERT INTO `appts` (`id`,`time_slot_hour`,`time_slot_date`,`type`,`container_id`,`container_size`,`container_weight`,`booking_num`,`vessel_name`,`vessel_eta`,`desintation_port`,`first_port_of_discharge`,`created_at`,`updated_at`,`userEmail`) VALUES (DEFAULT,20,'2018-07-27','EXPORTFULL','192fh1h2f','TWENTYFOOT',4000,1924192,'Blueberry','2018-10-10 04:00:00','String!','String!','2018-07-27 19:15:33','2018-07-27 19:15:33','robert@gmail.com');
INSERT INTO `appts` (`id`,`time_slot_hour`,`time_slot_date`,`type`,`container_id`,`container_size`,`created_at`,`updated_at`,`userEmail`) VALUES (DEFAULT,20,'2018-07-27','EXPORTEMPTY','9hsdf923','FOURTYFOOT','2018-07-27 19:15:33','2018-07-27 19:15:33','robert@gmail.com');
INSERT INTO `appts` (`id`,`time_slot_hour`,`time_slot_date`,`type`,`container_id`,`form_num_705`,`created_at`,`updated_at`,`block`,`userEmail`) VALUES (DEFAULT,20,'2018-07-27','IMPORTFULL','9f9h239fhsd','FORM239r0j23','2018-07-27 19:15:33','2018-07-27 19:15:33','A','william@hotmail.com');
INSERT INTO `appts` (`id`,`time_slot_hour`,`time_slot_date`,`type`,`container_id`,`container_size`,`created_at`,`updated_at`,`userEmail`) VALUES (DEFAULT,23,'2018-07-27','EXPORTEMPTY','jf21j1f3f2','TWENTYFOOT','2018-07-27 19:15:33','2018-07-27 19:15:33','william@hotmail.com');
INSERT INTO `appts` (`id`,`time_slot_hour`,`time_slot_date`,`type`,`container_size`,`empty_for_city_form_num`,`created_at`,`updated_at`,`userEmail`) VALUES (DEFAULT,23,'2018-07-27','IMPORTEMPTY','TWENTYFOOT','form2i38r923r','2018-07-27 19:15:33','2018-07-27 19:15:33','cory@mmt.net');
INSERT INTO `appts` (`id`,`time_slot_hour`,`time_slot_date`,`type`,`container_id`,`container_size`,`container_weight`,`booking_num`,`vessel_name`,`vessel_eta`,`desintation_port`,`first_port_of_discharge`,`created_at`,`updated_at`,`userEmail`) VALUES (DEFAULT,23,'2018-07-27','EXPORTFULL','2883hf8ttt','TWENTYFOOT',1222,293923,'String','2018-10-10 04:00:00','String','String','2018-07-27 19:15:33','2018-07-27 19:15:33','cory@mmt.net');
INSERT INTO `appts` (`id`,`time_slot_hour`,`time_slot_date`,`type`,`container_id`,`form_num_705`,`created_at`,`updated_at`,`block`,`userEmail`) VALUES (DEFAULT,18,'2018-07-27','IMPORTFULL','udfhd7f7d','FORMio2h38hf','2018-07-27 19:15:33','2018-07-27 19:15:33','A','cory@mmt.net');
INSERT INTO `config` (`id`,`total_allowed_appts_per_hour`,`max_tfu_per_appt`) VALUES (DEFAULT,5,40);
