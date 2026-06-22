import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRepairOrderDto, UpdateRepairOrderDto } from './dto/repair-order.dto';

@Injectable()
export class RepairOrdersService {
  constructor(private prisma: PrismaService) {}

  async list(
    laundromatId: string,
    params: { page?: number; status?: string; priority?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { laundromatId };
    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;

    const [data, total] = await Promise.all([
      this.prisma.repairOrder.findMany({
        where,
        orderBy: [{ priority: 'desc' }, { reportedAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          machine: { select: { id: true, number: true, zone: true, machineType: true } },
        },
      }),
      this.prisma.repairOrder.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async urgent(laundromatId: string) {
    return this.prisma.repairOrder.findMany({
      where: {
        laundromatId,
        status: { in: ['open', 'in_progress'] },
        priority: { in: ['high', 'urgent'] },
      },
      include: {
        machine: { select: { id: true, number: true, zone: true } },
      },
      orderBy: { reportedAt: 'asc' },
      take: 10,
    });
  }

  async get(laundromatId: string, id: string) {
    const order = await this.prisma.repairOrder.findFirst({
      where: { id, laundromatId },
      include: { machine: true },
    });
    if (!order) throw new NotFoundException('Repair order not found');
    return order;
  }

  async create(laundromatId: string, dto: CreateRepairOrderDto) {
    return this.prisma.repairOrder.create({
      data: {
        ...dto,
        laundromatId,
        reportedAt: dto.reportedAt ? new Date(dto.reportedAt) : new Date(),
        completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
      },
      include: { machine: true },
    });
  }

  async update(laundromatId: string, id: string, dto: UpdateRepairOrderDto) {
    await this.get(laundromatId, id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.reportedAt) data.reportedAt = new Date(dto.reportedAt);
    if (dto.completedAt) data.completedAt = new Date(dto.completedAt);
    return this.prisma.repairOrder.update({
      where: { id },
      data,
      include: { machine: true },
    });
  }

  async remove(laundromatId: string, id: string) {
    await this.get(laundromatId, id);
    return this.prisma.repairOrder.delete({ where: { id } });
  }
}
