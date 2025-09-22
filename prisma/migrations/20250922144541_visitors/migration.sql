-- CreateTable
CREATE TABLE "public"."Visitors" (
    "id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Visitors_pkey" PRIMARY KEY ("id")
);
