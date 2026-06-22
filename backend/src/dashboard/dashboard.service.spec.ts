import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockPrisma = {
    laundromat: { findUnique: jest.fn() },
    machine: { count: jest.fn(), groupBy: jest.fn() },
    collection: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    repairOrder: { count: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
    serviceSchedule: { count: jest.fn() },
    pricingTier: { count: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should return dashboard stats', async () => {
    mockPrisma.laundromat.findUnique.mockResolvedValue({ totalMachines: 48 });
    mockPrisma.machine.count.mockResolvedValue(10);
    mockPrisma.collection.count.mockResolvedValue(8);
    mockPrisma.repairOrder.count.mockResolvedValue(5);
    mockPrisma.collection.aggregate.mockResolvedValue({
      _sum: { coinAmount: 120, cardAmount: 80 },
    });
    mockPrisma.collection.findMany.mockResolvedValue([]);
    mockPrisma.repairOrder.findMany.mockResolvedValue([]);
    mockPrisma.serviceSchedule.count.mockResolvedValue(2);
    mockPrisma.pricingTier.count.mockResolvedValue(4);
    mockPrisma.machine.groupBy.mockResolvedValue([
      { zone: 'Front Row', _count: { id: 5 } },
    ]);

    const stats = await service.getStats('laundromat-1');

    expect(stats).toHaveProperty('machineUtilizationRate');
    expect(stats).toHaveProperty('dailyRevenue', 200);
    expect(stats).toHaveProperty('zones');
    expect(stats).toHaveProperty('urgentRepairOrders');
    expect(stats).toHaveProperty('pendingServiceSchedules');
    expect(stats).toHaveProperty('activePricingTiers');
  });
});
