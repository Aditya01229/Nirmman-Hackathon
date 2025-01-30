/*
  Warnings:

  - You are about to drop the `AboutUs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Campaign` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contactform` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Counterbar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Gallery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UpcomingWork` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AboutUs";

-- DropTable
DROP TABLE "Campaign";

-- DropTable
DROP TABLE "Contactform";

-- DropTable
DROP TABLE "Counterbar";

-- DropTable
DROP TABLE "Gallery";

-- DropTable
DROP TABLE "UpcomingWork";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Shop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phn_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrintFile" (
    "id" SERIAL NOT NULL,
    "cloud_address" TEXT NOT NULL,
    "copies" INTEGER NOT NULL,
    "color" BOOLEAN NOT NULL DEFAULT false,
    "front_back" BOOLEAN NOT NULL DEFAULT false,
    "printRequestId" INTEGER NOT NULL,

    CONSTRAINT "PrintFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrintRequest" (
    "id" SERIAL NOT NULL,
    "shopId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "PrintRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrintFile" ADD CONSTRAINT "PrintFile_printRequestId_fkey" FOREIGN KEY ("printRequestId") REFERENCES "PrintRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintRequest" ADD CONSTRAINT "PrintRequest_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
