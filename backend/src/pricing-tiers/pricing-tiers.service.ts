import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePricingTierDto, UpdatePricingTierDto } from './dto/pricing-tier.dto';

@Injectable()
export class PricingTiersService {
  constructor(private prisma: PrismaService) {}

  async list(laundromatId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { laundromatId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.pricingTier.findMany({
        where,
        orderBy: [{ tierCategory: 'asc' }, { basePrice: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.pricingTier.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(laundromatId: string, id: string) {
    const tier = await this.prisma.pricingTier.findFirst({
      where: { id, laundromatId },
    });
    if (!tier) throw new NotFoundException('Pricing tier not found');
    return tier;
  }

  async create(laundromatId: string, dto: CreatePricingTierDto) {
    return this.prisma.pricingTier.create({ data: { ...dto, laundromatId } });
  }

  async update(laundromatId: string, id: string, dto: UpdatePricingTierDto) {
    await this.get(laundromatId, id);
    return this.prisma.pricingTier.update({ where: { id }, data: dto });
  }

  async remove(laundromatId: string, id: string) {
    await this.get(laundromatId, id);
    return this.prisma.pricingTier.delete({ where: { id } });
  }
}
