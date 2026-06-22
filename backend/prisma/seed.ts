import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const LAUNDROMAT_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.laundromat.upsert({
    where: { id: LAUNDROMAT_ID },
    update: {},
    create: {
      id: LAUNDROMAT_ID,
      name: 'SparkleCoin Laundry',
      phone: '+13125550142',
      address: '2847 W Fullerton Ave',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60647',
      totalMachines: 48,
      timezone: 'America/Chicago',
      users: {
        create: {
          email: 'demo@sparklecoinlaundry.com',
          passwordHash,
          firstName: 'Jordan',
          lastName: 'Kim',
          role: 'owner',
        },
      },
    },
  });

  const machineData = [
    { id: '00000000-0000-0000-0000-000000000101', number: 'W1', zone: 'Front Row', machineType: 'washer' as const, capacityLbs: 20, paymentType: 'both' as const, brand: 'Speed Queen', status: 'operational' as const },
    { id: '00000000-0000-0000-0000-000000000102', number: 'W2', zone: 'Front Row', machineType: 'washer' as const, capacityLbs: 40, paymentType: 'both' as const, brand: 'Speed Queen', status: 'operational' as const },
    { id: '00000000-0000-0000-0000-000000000103', number: 'W3', zone: 'Back Row', machineType: 'washer' as const, capacityLbs: 60, paymentType: 'coin' as const, brand: 'Dexter', status: 'maintenance' as const },
    { id: '00000000-0000-0000-0000-000000000104', number: 'D1', zone: 'Front Row', machineType: 'dryer' as const, capacityLbs: 30, paymentType: 'both' as const, brand: 'Huebsch', status: 'operational' as const },
    { id: '00000000-0000-0000-0000-000000000105', number: 'D2', zone: 'Back Row', machineType: 'dryer' as const, capacityLbs: 30, paymentType: 'card' as const, brand: 'Huebsch', status: 'down' as const },
    { id: '00000000-0000-0000-0000-000000000106', number: 'C1', zone: 'Express Lane', machineType: 'combo' as const, capacityLbs: 18, paymentType: 'both' as const, brand: 'Electrolux', status: 'operational' as const },
  ];

  const machines = [];
  for (const m of machineData) {
    const machine = await prisma.machine.upsert({
      where: { id: m.id },
      update: {},
      create: { ...m, laundromatId: LAUNDROMAT_ID },
    });
    machines.push(machine);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.collection.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      laundromatId: LAUNDROMAT_ID,
      machineId: machines[0].id,
      collectedAt: yesterday,
      coinAmount: 42.50,
      cardAmount: 18.75,
      cycleCount: 28,
      status: 'verified',
    },
  });

  await prisma.collection.upsert({
    where: { id: '00000000-0000-0000-0000-000000000202' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000202',
      laundromatId: LAUNDROMAT_ID,
      machineId: machines[1].id,
      collectedAt: yesterday,
      coinAmount: 65.00,
      cardAmount: 32.00,
      cycleCount: 35,
      status: 'verified',
    },
  });

  const reportedAt = new Date();
  reportedAt.setDate(reportedAt.getDate() - 2);

  await prisma.repairOrder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000301' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000301',
      laundromatId: LAUNDROMAT_ID,
      machineId: machines[4].id,
      title: 'Drum motor failure — Dryer D2',
      description: 'Motor overheating after 15 min cycle',
      reportedAt,
      priority: 'urgent',
      status: 'open',
      cost: 285,
    },
  });

  await prisma.repairOrder.upsert({
    where: { id: '00000000-0000-0000-0000-000000000302' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000302',
      laundromatId: LAUNDROMAT_ID,
      machineId: machines[2].id,
      title: 'Belt replacement — Washer W3',
      description: 'Drive belt worn, scheduled service',
      reportedAt,
      priority: 'medium',
      status: 'in_progress',
    },
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  await prisma.serviceSchedule.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      laundromatId: LAUNDROMAT_ID,
      title: 'Dryer vent cleaning — Back Row',
      description: 'Annual lint trap and vent duct cleaning',
      category: 'vent_cleaning',
      zone: 'Back Row',
      scheduledAt: nextWeek,
      status: 'scheduled',
    },
  });

  await prisma.serviceSchedule.upsert({
    where: { id: '00000000-0000-0000-0000-000000000402' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000402',
      laundromatId: LAUNDROMAT_ID,
      title: 'Coin mechanism calibration',
      description: 'Quarter acceptor calibration for coin-only machines',
      category: 'electrical',
      zone: 'Back Row',
      scheduledAt: nextWeek,
      status: 'scheduled',
    },
  });

  const pricingData = [
    { id: '00000000-0000-0000-0000-000000000501', title: 'Small Wash (20 lb)', tierCategory: 'wash_small' as const, basePrice: 3.50, status: 'active' as const },
    { id: '00000000-0000-0000-0000-000000000502', title: 'Large Wash (40 lb)', tierCategory: 'wash_large' as const, basePrice: 5.75, status: 'active' as const },
    { id: '00000000-0000-0000-0000-000000000503', title: 'High Heat Dry (30 min)', tierCategory: 'dry_high' as const, basePrice: 2.25, status: 'active' as const },
    { id: '00000000-0000-0000-0000-000000000504', title: 'Combo Express', tierCategory: 'combo' as const, basePrice: 8.00, status: 'active' as const },
  ];

  for (const p of pricingData) {
    await prisma.pricingTier.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, laundromatId: LAUNDROMAT_ID },
    });
  }

  console.log('WashLedger seed completed');
  console.log('Demo: demo@sparklecoinlaundry.com / demo123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
