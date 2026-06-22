import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PricingCategory, PricingStatus } from '@prisma/client';

export class CreatePricingTierDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(PricingCategory)
  tierCategory?: PricingCategory;

  @IsOptional()
  @IsEnum(PricingStatus)
  status?: PricingStatus;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMultiplier?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePricingTierDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(PricingCategory)
  tierCategory?: PricingCategory;

  @IsOptional()
  @IsEnum(PricingStatus)
  status?: PricingStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMultiplier?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
