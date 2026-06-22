import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { RepairPriority, RepairStatus } from '@prisma/client';

export class CreateRepairOrderDto {
  @IsUUID()
  machineId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  reportedAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsEnum(RepairPriority)
  priority?: RepairPriority;

  @IsOptional()
  @IsEnum(RepairStatus)
  status?: RepairStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateRepairOrderDto {
  @IsOptional()
  @IsUUID()
  machineId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  reportedAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsEnum(RepairPriority)
  priority?: RepairPriority;

  @IsOptional()
  @IsEnum(RepairStatus)
  status?: RepairStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
