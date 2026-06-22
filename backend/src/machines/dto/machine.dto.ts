import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { MachineStatus, MachineType, PaymentType } from '@prisma/client';

export class CreateMachineDto {
  @IsString()
  number: string;

  @IsString()
  zone: string;

  @IsOptional()
  @IsEnum(MachineType)
  machineType?: MachineType;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacityLbs?: number;

  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsEnum(MachineStatus)
  status?: MachineStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateMachineDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsEnum(MachineType)
  machineType?: MachineType;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacityLbs?: number;

  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsEnum(MachineStatus)
  status?: MachineStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
