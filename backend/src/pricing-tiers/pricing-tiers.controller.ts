import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { PricingTiersService } from './pricing-tiers.service';
import { CreatePricingTierDto, UpdatePricingTierDto } from './dto/pricing-tier.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pricing-tiers')
@UseGuards(JwtAuthGuard)
export class PricingTiersController {
  constructor(private pricingTiersService: PricingTiersService) {}

  @Get()
  list(
    @Request() req: { user: { laundromatId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.pricingTiersService.list(req.user.laundromatId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { laundromatId: string } }, @Param('id') id: string) {
    return this.pricingTiersService.get(req.user.laundromatId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { laundromatId: string } },
    @Body() dto: CreatePricingTierDto,
  ) {
    return this.pricingTiersService.create(req.user.laundromatId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { laundromatId: string } },
    @Param('id') id: string,
    @Body() dto: UpdatePricingTierDto,
  ) {
    return this.pricingTiersService.update(req.user.laundromatId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { laundromatId: string } }, @Param('id') id: string) {
    return this.pricingTiersService.remove(req.user.laundromatId, id);
  }
}
