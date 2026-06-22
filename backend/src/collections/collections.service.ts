import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  async list(laundromatId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { laundromatId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.collection.findMany({
        where,
        orderBy: { collectedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          machine: { select: { id: true, number: true, zone: true, machineType: true } },
        },
      }),
      this.prisma.collection.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(laundromatId: string, id: string) {
    const collection = await this.prisma.collection.findFirst({
      where: { id, laundromatId },
      include: { machine: true },
    });
    if (!collection) throw new NotFoundException('Collection not found');
    return collection;
  }

  async create(laundromatId: string, dto: CreateCollectionDto) {
    return this.prisma.collection.create({
      data: {
        ...dto,
        laundromatId,
        collectedAt: dto.collectedAt ? new Date(dto.collectedAt) : new Date(),
      },
      include: { machine: true },
    });
  }

  async update(laundromatId: string, id: string, dto: UpdateCollectionDto) {
    await this.get(laundromatId, id);
    const data = { ...dto };
    if (dto.collectedAt) {
      (data as { collectedAt?: Date }).collectedAt = new Date(dto.collectedAt);
    }
    return this.prisma.collection.update({
      where: { id },
      data,
      include: { machine: true },
    });
  }

  async remove(laundromatId: string, id: string) {
    await this.get(laundromatId, id);
    return this.prisma.collection.delete({ where: { id } });
  }
}
