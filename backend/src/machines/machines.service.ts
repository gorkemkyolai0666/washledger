import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMachineDto, UpdateMachineDto } from './dto/machine.dto';

@Injectable()
export class MachinesService {
  constructor(private prisma: PrismaService) {}

  async list(laundromatId: string, params: { page?: number; status?: string; zone?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { laundromatId };
    if (params.status) where.status = params.status;
    if (params.zone) where.zone = params.zone;

    const [data, total] = await Promise.all([
      this.prisma.machine.findMany({
        where,
        orderBy: [{ zone: 'asc' }, { number: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          repairOrders: {
            where: { status: { in: ['open', 'in_progress'] } },
            take: 1,
            orderBy: { reportedAt: 'desc' },
          },
        },
      }),
      this.prisma.machine.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(laundromatId: string, id: string) {
    const machine = await this.prisma.machine.findFirst({
      where: { id, laundromatId },
      include: {
        repairOrders: { orderBy: { reportedAt: 'desc' }, take: 5 },
        collections: { orderBy: { collectedAt: 'desc' }, take: 5 },
      },
    });
    if (!machine) throw new NotFoundException('Machine not found');
    return machine;
  }

  async create(laundromatId: string, dto: CreateMachineDto) {
    return this.prisma.machine.create({ data: { ...dto, laundromatId } });
  }

  async update(laundromatId: string, id: string, dto: UpdateMachineDto) {
    await this.get(laundromatId, id);
    return this.prisma.machine.update({ where: { id }, data: dto });
  }

  async remove(laundromatId: string, id: string) {
    await this.get(laundromatId, id);
    return this.prisma.machine.delete({ where: { id } });
  }
}
