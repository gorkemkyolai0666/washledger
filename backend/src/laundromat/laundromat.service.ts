import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLaundromatDto } from './dto/update-laundromat.dto';

@Injectable()
export class LaundromatService {
  constructor(private prisma: PrismaService) {}

  async get(laundromatId: string) {
    const laundromat = await this.prisma.laundromat.findUnique({
      where: { id: laundromatId },
    });
    if (!laundromat) throw new NotFoundException('Laundromat not found');
    return laundromat;
  }

  async update(laundromatId: string, dto: UpdateLaundromatDto) {
    await this.get(laundromatId);
    return this.prisma.laundromat.update({ where: { id: laundromatId }, data: dto });
  }
}
