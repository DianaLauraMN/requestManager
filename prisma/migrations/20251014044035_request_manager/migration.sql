-- CreateEnum
CREATE TYPE "EventRequestStatus" AS ENUM ('ACCEPTED', 'DECLINED', 'PENDING');

-- CreateTable
CREATE TABLE "EventRequest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "status" "EventRequestStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventRequest_email_key" ON "EventRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EventRequest_tel_key" ON "EventRequest"("tel");
