import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceScheduleDto, UpdateServiceScheduleDto } from './dto/service-schedule.dto';

@Injectable()
export class ServiceSchedulesService {
  constructor(private prisma: PrismaService) {}

  async list(laundromatId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { laundromatId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.serviceSchedule.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.serviceSchedule.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(laundromatId: string, id: string) {
    const schedule = await this.prisma.serviceSchedule.findFirst({
      where: { id, laundromatId },
    });
    if (!schedule) throw new NotFoundException('Service schedule not found');
    return schedule;
  }

  async create(laundromatId: string, dto: CreateServiceScheduleDto) {
    return this.prisma.serviceSchedule.create({
      data: {
        ...dto,
        laundromatId,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  async update(laundromatId: string, id: string, dto: UpdateServiceScheduleDto) {
    await this.get(laundromatId, id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.scheduledAt) data.scheduledAt = new Date(dto.scheduledAt);
    return this.prisma.serviceSchedule.update({ where: { id }, data });
  }

  async remove(laundromatId: string, id: string) {
    await this.get(laundromatId, id);
    return this.prisma.serviceSchedule.delete({ where: { id } });
  }
}
