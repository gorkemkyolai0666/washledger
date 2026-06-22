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
import { ServiceSchedulesService } from './service-schedules.service';
import { CreateServiceScheduleDto, UpdateServiceScheduleDto } from './dto/service-schedule.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('service-schedules')
@UseGuards(JwtAuthGuard)
export class ServiceSchedulesController {
  constructor(private serviceSchedulesService: ServiceSchedulesService) {}

  @Get()
  list(
    @Request() req: { user: { laundromatId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.serviceSchedulesService.list(req.user.laundromatId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { laundromatId: string } }, @Param('id') id: string) {
    return this.serviceSchedulesService.get(req.user.laundromatId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { laundromatId: string } },
    @Body() dto: CreateServiceScheduleDto,
  ) {
    return this.serviceSchedulesService.create(req.user.laundromatId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { laundromatId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateServiceScheduleDto,
  ) {
    return this.serviceSchedulesService.update(req.user.laundromatId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { laundromatId: string } }, @Param('id') id: string) {
    return this.serviceSchedulesService.remove(req.user.laundromatId, id);
  }
}
