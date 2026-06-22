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
import { MachinesService } from './machines.service';
import { CreateMachineDto, UpdateMachineDto } from './dto/machine.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('machines')
@UseGuards(JwtAuthGuard)
export class MachinesController {
  constructor(private machinesService: MachinesService) {}

  @Get()
  list(
    @Request() req: { user: { laundromatId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('zone') zone?: string,
  ) {
    return this.machinesService.list(req.user.laundromatId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      zone,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { laundromatId: string } }, @Param('id') id: string) {
    return this.machinesService.get(req.user.laundromatId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { laundromatId: string } },
    @Body() dto: CreateMachineDto,
  ) {
    return this.machinesService.create(req.user.laundromatId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { laundromatId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateMachineDto,
  ) {
    return this.machinesService.update(req.user.laundromatId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { laundromatId: string } }, @Param('id') id: string) {
    return this.machinesService.remove(req.user.laundromatId, id);
  }
}
