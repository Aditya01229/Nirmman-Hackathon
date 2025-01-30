-- CreateTable
CREATE TABLE "Counterbar" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Counterbar_pkey" PRIMARY KEY ("id")
);
