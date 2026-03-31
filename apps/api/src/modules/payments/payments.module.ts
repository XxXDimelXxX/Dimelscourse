import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseEntity } from "../catalog/entities/course.entity";
import { IdentityAccessModule } from "../identity-access/identity-access.module";
import { UserEntity } from "../identity-access/entities/user.entity";
import { LearningModule } from "../learning/learning.module";
import { EnrollmentEntity } from "../learning/entities/enrollment.entity";
import { PaymentWebhookController } from "./controllers/payment-webhook.controller";
import { PaymentsController } from "./controllers/payments.controller";
import { PaymentEntity } from "./entities/payment.entity";
import { PaymentsService } from "./services/payments.service";

@Module({
  imports: [
    IdentityAccessModule,
    LearningModule,
    TypeOrmModule.forFeature([
      PaymentEntity,
      UserEntity,
      CourseEntity,
      EnrollmentEntity,
    ]),
  ],
  controllers: [PaymentsController, PaymentWebhookController],
  providers: [PaymentsService],
  exports: [TypeOrmModule, PaymentsService],
})
export class PaymentsModule {}
