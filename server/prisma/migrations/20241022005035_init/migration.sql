-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produto` VARCHAR(191) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `fornecedores` VARCHAR(191) NOT NULL,
    `responsavel` VARCHAR(191) NOT NULL,
    `enviarPara` VARCHAR(191) NOT NULL,
    `motivoCompra` VARCHAR(191) NOT NULL,
    `orcamentos` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
