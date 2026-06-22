import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ServiceCategory, ServiceStatus } from '@prisma/client';

export class CreateServiceScheduleDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ServiceCategory)
  category?: ServiceCategory;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;
}

export class UpdateServiceScheduleDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ServiceCategory)
  category?: ServiceCategory;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;
}
