import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { LaundromatModule } from './laundromat/laundromat.module';
import { MachinesModule } from './machines/machines.module';
import { CollectionsModule } from './collections/collections.module';
import { RepairOrdersModule } from './repair-orders/repair-orders.module';
import { ServiceSchedulesModule } from './service-schedules/service-schedules.module';
import { PricingTiersModule } from './pricing-tiers/pricing-tiers.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    LaundromatModule,
    MachinesModule,
    CollectionsModule,
    RepairOrdersModule,
    ServiceSchedulesModule,
    PricingTiersModule,
    DashboardModule,
  ],
})
export class AppModule {}
