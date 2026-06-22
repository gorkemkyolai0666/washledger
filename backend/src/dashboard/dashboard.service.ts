import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(laundromatId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      laundromat,
      totalMachines,
      operationalMachines,
      downMachines,
      totalCollections,
      openRepairOrders,
      urgentRepairOrders,
      pendingServiceSchedules,
      activePricingTiers,
      revenueTotals,
      recentCollections,
      recentRepairOrders,
      zones,
    ] = await Promise.all([
      this.prisma.laundromat.findUnique({ where: { id: laundromatId } }),
      this.prisma.machine.count({ where: { laundromatId } }),
      this.prisma.machine.count({ where: { laundromatId, status: 'operational' } }),
      this.prisma.machine.count({ where: { laundromatId, status: 'down' } }),
      this.prisma.collection.count({ where: { laundromatId } }),
      this.prisma.repairOrder.count({
        where: { laundromatId, status: { in: ['open', 'in_progress'] } },
      }),
      this.prisma.repairOrder.count({
        where: {
          laundromatId,
          status: { in: ['open', 'in_progress'] },
          priority: { in: ['high', 'urgent'] },
        },
      }),
      this.prisma.serviceSchedule.count({
        where: {
          laundromatId,
          status: { in: ['scheduled', 'overdue'] },
          scheduledAt: { lte: sevenDaysLater },
        },
      }),
      this.prisma.pricingTier.count({
        where: { laundromatId, status: 'active' },
      }),
      this.prisma.collection.aggregate({
        where: { laundromatId, collectedAt: { gte: today } },
        _sum: { coinAmount: true, cardAmount: true },
      }),
      this.prisma.collection.findMany({
        where: { laundromatId },
        include: {
          machine: { select: { number: true, zone: true, machineType: true } },
        },
        orderBy: { collectedAt: 'desc' },
        take: 5,
      }),
      this.prisma.repairOrder.findMany({
        where: { laundromatId, status: { in: ['open', 'in_progress'] } },
        include: {
          machine: { select: { number: true, zone: true } },
        },
        orderBy: { reportedAt: 'desc' },
        take: 5,
      }),
      this.prisma.machine.groupBy({
        by: ['zone'],
        where: { laundromatId },
        _count: { id: true },
      }),
    ]);

    const totalCapacity = laundromat?.totalMachines || totalMachines || 1;
    const machineUtilizationRate =
      totalMachines > 0 ? Math.round((operationalMachines / totalMachines) * 1000) / 10 : 0;

    const dailyRevenue =
      (revenueTotals._sum.coinAmount || 0) + (revenueTotals._sum.cardAmount || 0);

    const monthlyTrend = await this.getMonthlyTrend(laundromatId, sixMonthsAgo);

    return {
      totalMachines,
      operationalMachines,
      downMachines,
      totalCapacity,
      machineUtilizationRate,
      totalCollections,
      openRepairOrders,
      urgentRepairOrders,
      pendingServiceSchedules,
      activePricingTiers,
      dailyRevenue,
      recentCollections,
      recentRepairOrders,
      zones: zones.map((z) => ({
        zone: z.zone,
        machineCount: z._count.id,
      })),
      monthlyTrend,
    };
  }

  private async getMonthlyTrend(laundromatId: string, since: Date) {
    const collections = await this.prisma.collection.findMany({
      where: { laundromatId, collectedAt: { gte: since } },
      select: { collectedAt: true, coinAmount: true, cardAmount: true },
    });

    const months: Record<string, { collections: number; revenue: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { collections: 0, revenue: 0 };
    }

    collections.forEach((collection) => {
      const key = `${collection.collectedAt.getFullYear()}-${String(collection.collectedAt.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        months[key].collections++;
        months[key].revenue += collection.coinAmount + collection.cardAmount;
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  }
}
