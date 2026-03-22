import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogModule } from "./modules/catalog/catalog.module";
import { CommunityModule } from "./modules/community/community.module";
import { IdentityAccessModule } from "./modules/identity-access/identity-access.module";
import { LearningModule } from "./modules/learning/learning.module";
import { AdminModule } from "./modules/admin/admin.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { getTypeOrmConfig } from "./core/config";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: getTypeOrmConfig,
    }),
    IdentityAccessModule,
    CatalogModule,
    LearningModule,
    CommunityModule,
    PaymentsModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
