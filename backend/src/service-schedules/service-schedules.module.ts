import { Module } from '@nestjs/common';
import { ServiceSchedulesController } from './service-schedules.controller';
import { ServiceSchedulesService } from './service-schedules.service';

@Module({
  controllers: [ServiceSchedulesController],
  providers: [ServiceSchedulesService],
})
export class ServiceSchedulesModule {}
