-- generated with sqeuelize src/data/setup/setup-prod.js
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
