import { Module } from "@nestjs/common";
import { CatalogModule } from "./services/catalog/catalog.module";
import { IdentityAccessModule } from "./services/identity-access/identity-access.module";
import { LearningModule } from "./services/learning/learning.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [IdentityAccessModule, CatalogModule, LearningModule],
  controllers: [HealthController],
})
export class AppModule {}
