import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateLaundromatDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalMachines?: number;

  @IsOptional()
  @IsString()
  timezone?: string;
}
