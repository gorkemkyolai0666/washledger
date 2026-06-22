import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const laundromat = await this.prisma.laundromat.create({
      data: {
        name: dto.laundromatName,
        phone: dto.phone,
        city: dto.city,
        state: dto.state,
        users: {
          create: {
            email: dto.email,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: 'owner',
          },
        },
      },
      include: { users: true },
    });

    const user = laundromat.users[0];
    const token = this.generateToken(user.id, user.email, laundromat.id);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      laundromat: {
        id: laundromat.id,
        name: laundromat.name,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { laundromat: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email, user.laundromatId);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      laundromat: {
        id: user.laundromat.id,
        name: user.laundromat.name,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { laundromat: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      laundromat: {
        id: user.laundromat.id,
        name: user.laundromat.name,
        phone: user.laundromat.phone,
        city: user.laundromat.city,
        state: user.laundromat.state,
        totalMachines: user.laundromat.totalMachines,
      },
    };
  }

  private generateToken(userId: string, email: string, laundromatId: string): string {
    return this.jwtService.sign({ sub: userId, email, laundromatId });
  }
}
