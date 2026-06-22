import { Module } from '@nestjs/common';
import { LaundromatController } from './laundromat.controller';
import { LaundromatService } from './laundromat.service';

@Module({
  controllers: [LaundromatController],
  providers: [LaundromatService],
})
export class LaundromatModule {}
