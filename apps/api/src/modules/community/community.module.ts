import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseEntity } from "../catalog/entities/course.entity";
import { IdentityAccessModule } from "../identity-access/identity-access.module";
import { UserEntity } from "../identity-access/entities/user.entity";
import { CourseCommentsController } from "./controllers/course-comments.controller";
import { CourseCommentEntity } from "./entities/course-comment.entity";
import { CourseCommentsService } from "./services/course-comments.service";

@Module({
  imports: [
    IdentityAccessModule,
    TypeOrmModule.forFeature([CourseCommentEntity, CourseEntity, UserEntity]),
  ],
  controllers: [CourseCommentsController],
  providers: [CourseCommentsService],
  exports: [TypeOrmModule, CourseCommentsService],
})
export class CommunityModule {}
