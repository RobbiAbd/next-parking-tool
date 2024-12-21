/*
  Warnings:

  - You are about to drop the `vehicle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `vehicle`;

-- CreateTable
CREATE TABLE `ParkingLot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `total_spaces` INTEGER NOT NULL,
    `occupied_spaces` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParkingCard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `license_plate` VARCHAR(191) NULL,
    `vehicle_type` VARCHAR(191) NULL,
    `barcode` VARCHAR(191) NOT NULL,
    `entry_time` DATETIME(3) NOT NULL,
    `exit_time` DATETIME(3) NULL,
    `fee_paid` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parking_card_id` INTEGER NOT NULL,
    `amount_paid` DOUBLE NOT NULL,
    `change_given` DOUBLE NOT NULL,
    `transaction_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_parking_card_id_fkey` FOREIGN KEY (`parking_card_id`) REFERENCES `ParkingCard`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
