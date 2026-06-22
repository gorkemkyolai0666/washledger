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
import { RepairOrdersService } from './repair-orders.service';
import { CreateRepairOrderDto, UpdateRepairOrderDto } from './dto/repair-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('repair-orders')
@UseGuards(JwtAuthGuard)
export class RepairOrdersController {
  constructor(private repairOrdersService: RepairOrdersService) {}

  @Get()
  list(
    @Request() req: { user: { laundromatId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.repairOrdersService.list(req.user.laundromatId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      priority,
    });
  }

  @Get('urgent')
  urgent(@Request() req: { user: { laundromatId: string } }) {
    return this.repairOrdersService.urgent(req.user.laundromatId);
  }

  @Get(':id')
  get(@Request() req: { user: { laundromatId: string } }, @Param('id') id: string) {
    return this.repairOrdersService.get(req.user.laundromatId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { laundromatId: string } },
    @Body() dto: CreateRepairOrderDto,
  ) {
    return this.repairOrdersService.create(req.user.laundromatId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { laundromatId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateRepairOrderDto,
  ) {
    return this.repairOrdersService.update(req.user.laundromatId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { laundromatId: string } }, @Param('id') id: string) {
    return this.repairOrdersService.remove(req.user.laundromatId, id);
  }
}
