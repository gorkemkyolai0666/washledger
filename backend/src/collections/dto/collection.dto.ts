import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { CollectionStatus } from '@prisma/client';

export class CreateCollectionDto {
  @IsUUID()
  machineId: string;

  @IsOptional()
  @IsDateString()
  collectedAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  coinAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cardAmount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  cycleCount?: number;

  @IsOptional()
  @IsEnum(CollectionStatus)
  status?: CollectionStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateCollectionDto {
  @IsOptional()
  @IsUUID()
  machineId?: string;

  @IsOptional()
  @IsDateString()
  collectedAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  coinAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cardAmount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  cycleCount?: number;

  @IsOptional()
  @IsEnum(CollectionStatus)
  status?: CollectionStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
