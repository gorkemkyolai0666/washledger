-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'manager', 'attendant');

-- CreateEnum
CREATE TYPE "MachineType" AS ENUM ('washer', 'dryer', 'combo', 'fold_station');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('coin', 'card', 'both');

-- CreateEnum
CREATE TYPE "MachineStatus" AS ENUM ('operational', 'down', 'maintenance', 'retired');

-- CreateEnum
CREATE TYPE "CollectionStatus" AS ENUM ('recorded', 'verified', 'disputed');

-- CreateEnum
CREATE TYPE "RepairPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "RepairStatus" AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('vent_cleaning', 'belt_replacement', 'drum_service', 'motor_repair', 'plumbing', 'electrical', 'other');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "PricingCategory" AS ENUM ('wash_small', 'wash_large', 'wash_extra_large', 'dry_low', 'dry_high', 'combo', 'other');

-- CreateEnum
CREATE TYPE "PricingStatus" AS ENUM ('active', 'upcoming', 'archived');

-- CreateTable
CREATE TABLE "laundromats" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "total_machines" INTEGER NOT NULL DEFAULT 48,
    "timezone" TEXT NOT NULL DEFAULT 'America/Chicago',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "laundromats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'owner',
    "laundromat_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machines" (
    "id" TEXT NOT NULL,
    "laundromat_id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "machine_type" "MachineType" NOT NULL DEFAULT 'washer',
    "capacity_lbs" INTEGER NOT NULL DEFAULT 20,
    "payment_type" "PaymentType" NOT NULL DEFAULT 'both',
    "brand" TEXT,
    "status" "MachineStatus" NOT NULL DEFAULT 'operational',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "laundromat_id" TEXT NOT NULL,
    "machine_id" TEXT NOT NULL,
    "collected_at" TIMESTAMP(3) NOT NULL,
    "coin_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "card_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cycle_count" INTEGER NOT NULL DEFAULT 0,
    "status" "CollectionStatus" NOT NULL DEFAULT 'recorded',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repair_orders" (
    "id" TEXT NOT NULL,
    "laundromat_id" TEXT NOT NULL,
    "machine_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reported_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "priority" "RepairPriority" NOT NULL DEFAULT 'medium',
    "status" "RepairStatus" NOT NULL DEFAULT 'open',
    "cost" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repair_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_schedules" (
    "id" TEXT NOT NULL,
    "laundromat_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "ServiceCategory" NOT NULL DEFAULT 'other',
    "zone" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_tiers" (
    "id" TEXT NOT NULL,
    "laundromat_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tier_category" "PricingCategory" NOT NULL DEFAULT 'wash_small',
    "status" "PricingStatus" NOT NULL DEFAULT 'active',
    "base_price" DOUBLE PRECISION NOT NULL,
    "price_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "machines_laundromat_id_status_idx" ON "machines"("laundromat_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "machines_laundromat_id_number_key" ON "machines"("laundromat_id", "number");

-- CreateIndex
CREATE INDEX "collections_laundromat_id_collected_at_idx" ON "collections"("laundromat_id", "collected_at");

-- CreateIndex
CREATE INDEX "collections_laundromat_id_status_idx" ON "collections"("laundromat_id", "status");

-- CreateIndex
CREATE INDEX "repair_orders_laundromat_id_status_idx" ON "repair_orders"("laundromat_id", "status");

-- CreateIndex
CREATE INDEX "repair_orders_laundromat_id_priority_idx" ON "repair_orders"("laundromat_id", "priority");

-- CreateIndex
CREATE INDEX "service_schedules_laundromat_id_scheduled_at_idx" ON "service_schedules"("laundromat_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "pricing_tiers_laundromat_id_tier_category_idx" ON "pricing_tiers"("laundromat_id", "tier_category");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_laundromat_id_fkey" FOREIGN KEY ("laundromat_id") REFERENCES "laundromats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_laundromat_id_fkey" FOREIGN KEY ("laundromat_id") REFERENCES "laundromats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_laundromat_id_fkey" FOREIGN KEY ("laundromat_id") REFERENCES "laundromats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_orders" ADD CONSTRAINT "repair_orders_laundromat_id_fkey" FOREIGN KEY ("laundromat_id") REFERENCES "laundromats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_orders" ADD CONSTRAINT "repair_orders_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_schedules" ADD CONSTRAINT "service_schedules_laundromat_id_fkey" FOREIGN KEY ("laundromat_id") REFERENCES "laundromats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing_tiers" ADD CONSTRAINT "pricing_tiers_laundromat_id_fkey" FOREIGN KEY ("laundromat_id") REFERENCES "laundromats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

