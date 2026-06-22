import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { LaundromatService } from './laundromat.service';
import { UpdateLaundromatDto } from './dto/update-laundromat.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('laundromat')
@UseGuards(JwtAuthGuard)
export class LaundromatController {
  constructor(private laundromatService: LaundromatService) {}

  @Get()
  get(@Request() req: { user: { laundromatId: string } }) {
    return this.laundromatService.get(req.user.laundromatId);
  }

  @Patch()
  update(
    @Request() req: { user: { laundromatId: string } },
    @Body() dto: UpdateLaundromatDto,
  ) {
    return this.laundromatService.update(req.user.laundromatId, dto);
  }
}
