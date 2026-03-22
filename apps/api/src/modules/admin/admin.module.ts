import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseEntity } from "../catalog/entities/course.entity";
import { InstructorEntity } from "../catalog/entities/instructor.entity";
import { UserEntity } from "../identity-access/entities/user.entity";
import { EnrollmentEntity } from "../learning/entities/enrollment.entity";
import { PaymentEntity } from "../payments/entities/payment.entity";
import { AdminController } from "./controllers/admin.controller";
import { AdminService } from "./services/admin.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      EnrollmentEntity,
      PaymentEntity,
      CourseEntity,
      InstructorEntity,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
