-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INVITED', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CheckedInMethod" AS ENUM ('GPS', 'SIGNATURE', 'OTP');

-- CreateEnum
CREATE TYPE "AdmissionStatus" AS ENUM ('ACTIVE', 'DISCHARGED');

-- CreateTable
CREATE TABLE "Provider" (
    "cuid" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "billing" VARCHAR(100),
    "number" VARCHAR(20),
    "contact1" VARCHAR(20),
    "contact2" VARCHAR(20),
    "address1" VARCHAR(255),
    "address2" VARCHAR(255),
    "state" VARCHAR(10),
    "country" VARCHAR(100),
    "city" VARCHAR(100),
    "zip" VARCHAR(10),
    "tpi" VARCHAR(100),
    "npi" VARCHAR(100),
    "taxId" VARCHAR(100),
    "phone" VARCHAR(100),
    "fax" VARCHAR(100),
    "email" VARCHAR(100),
    "logoId" TEXT,
    "theme" VARCHAR(100) DEFAULT '#2051E5',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "User" (
    "cuid" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "lastName" VARCHAR(100),
    "firstName" VARCHAR(100),
    "middleName" VARCHAR(100),
    "email" TEXT NOT NULL,
    "status" "UserStatus",
    "phone" VARCHAR(20),
    "zip" VARCHAR(10),
    "password" VARCHAR(100),
    "country" VARCHAR(100),
    "state" VARCHAR(100),
    "city" VARCHAR(100),
    "address" VARCHAR(255),
    "role" VARCHAR(100),
    "sssopId" VARCHAR(100),
    "gender" "Gender",
    "dob" TIMESTAMP(3),
    "invitedAt" TIMESTAMP(3),
    "activeAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profilePhotoId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "Patient" (
    "cuid" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    "middleName" VARCHAR(100),
    "email" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "gender" "Gender",
    "dob" TIMESTAMP(3),
    "race" VARCHAR(100),
    "country" VARCHAR(100),
    "state" VARCHAR(100),
    "city" VARCHAR(100),
    "zip" VARCHAR(10),
    "apartmentNumber" VARCHAR(100),
    "address" VARCHAR(255),
    "medicaidNumber" VARCHAR(100),
    "phone" VARCHAR(100),
    "ssnNumber" VARCHAR(100),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profilePhotoId" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "UserProvider" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(100) NOT NULL,
    "providerId" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientAdmission" (
    "cuid" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "patientId" TEXT,
    "status" "AdmissionStatus",
    "reason" VARCHAR(255),
    "admittedById" TEXT,
    "dischargedById" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientAdmission_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "Media" (
    "cuid" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "fileType" VARCHAR(100),
    "fileName" VARCHAR(100),
    "mediaId" TEXT NOT NULL,
    "src" VARCHAR(255),
    "alt" VARCHAR(255),
    "size" DOUBLE PRECISION,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Media_pkey" PRIMARY KEY ("cuid")
);

-- CreateTable
CREATE TABLE "Visit" (
    "cuid" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "patientId" TEXT,
    "providerId" TEXT NOT NULL,
    "caregiverId" TEXT,
    "checkedinMethod" VARCHAR(100),
    "patientSignatureId" TEXT,
    "caregiverSignatureId" TEXT,
    "visitDate" TIMESTAMP(3),
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "checkinAt" TIMESTAMP(3),
    "checkoutAt" TIMESTAMP(3),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "otp" VARCHAR(100),
    "otpExpiresAt" TIMESTAMP(3),
    "status" "VisitStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("cuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Provider_id_key" ON "Provider"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_id_key" ON "Patient"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PatientAdmission_id_key" ON "PatientAdmission"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Media_id_key" ON "Media"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Media_mediaId_key" ON "Media"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "Visit_id_key" ON "Visit"("id");

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Media"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profilePhotoId_fkey" FOREIGN KEY ("profilePhotoId") REFERENCES "Media"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_profilePhotoId_fkey" FOREIGN KEY ("profilePhotoId") REFERENCES "Media"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProvider" ADD CONSTRAINT "UserProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProvider" ADD CONSTRAINT "UserProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAdmission" ADD CONSTRAINT "PatientAdmission_admittedById_fkey" FOREIGN KEY ("admittedById") REFERENCES "User"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAdmission" ADD CONSTRAINT "PatientAdmission_dischargedById_fkey" FOREIGN KEY ("dischargedById") REFERENCES "User"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAdmission" ADD CONSTRAINT "PatientAdmission_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_patientSignatureId_fkey" FOREIGN KEY ("patientSignatureId") REFERENCES "Media"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_caregiverSignatureId_fkey" FOREIGN KEY ("caregiverSignatureId") REFERENCES "Media"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "User"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;
