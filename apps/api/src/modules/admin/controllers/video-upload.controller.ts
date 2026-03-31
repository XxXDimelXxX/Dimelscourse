import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ZodValidationPipe } from "../../../core/pipes/zod-validation.pipe";
import { S3Service } from "../../../core/services/s3.service";
import { LessonEntity } from "../../catalog/entities/lesson.entity";
import { Roles } from "../../identity-access/decorators/roles.decorator";
import { UserRole } from "../../identity-access/entities/user.entity";
import { AccessTokenGuard } from "../../identity-access/guards/access-token.guard";
import { RolesGuard } from "../../identity-access/guards/roles.guard";
import {
  ConfirmUploadDto,
  confirmUploadSchema,
  RequestUploadUrlDto,
  requestUploadUrlSchema,
} from "../dto/video-upload.dto";
import {
  RequestImageUploadUrlDto,
  requestImageUploadUrlSchema,
} from "../dto/image-upload.dto";

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
@Controller("admin/lessons")
export class VideoUploadController {
  constructor(
    @InjectRepository(LessonEntity)
    private readonly lessonsRepository: Repository<LessonEntity>,
    private readonly s3Service: S3Service,
  ) {}

  /**
   * Step 1: Admin requests a presigned PUT URL to upload video directly to S3.
   */
  @Post(":lessonId/video/upload-url")
  async requestUploadUrl(
    @Param("lessonId") lessonId: string,
    @Body(new ZodValidationPipe(requestUploadUrlSchema)) dto: RequestUploadUrlDto,
  ) {
    const lesson = await this.lessonsRepository.findOne({
      where: { id: lessonId },
      relations: { course: true },
    });

    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    const extension = dto.fileName.split(".").pop() ?? "mp4";
    const videoS3Key = this.s3Service.buildVideoKey(
      lesson.course.slug,
      lesson.id,
      extension,
    );

    const uploadUrl = await this.s3Service.getPresignedUploadUrl(
      videoS3Key,
      dto.contentType,
    );

    return { uploadUrl, videoS3Key };
  }

  /**
   * Step 2: After browser finishes uploading to S3, confirm and save metadata.
   */
  @Post(":lessonId/video/confirm")
  async confirmUpload(
    @Param("lessonId") lessonId: string,
    @Body(new ZodValidationPipe(confirmUploadSchema)) dto: ConfirmUploadDto,
  ) {
    const lesson = await this.lessonsRepository.findOne({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    // Delete old video if replacing
    if (lesson.videoS3Key && lesson.videoS3Key !== dto.videoS3Key) {
      await this.s3Service.deleteObject(lesson.videoS3Key);
    }

    lesson.videoS3Key = dto.videoS3Key;
    lesson.videoOriginalName = dto.originalName;
    lesson.videoSizeBytes = dto.fileSize;
    lesson.videoUrl = null; // Clear legacy field

    await this.lessonsRepository.save(lesson);

    return { success: true };
  }

  /**
   * Delete video from S3 and clear metadata.
   */
  @Delete(":lessonId/video")
  async deleteVideo(@Param("lessonId") lessonId: string) {
    const lesson = await this.lessonsRepository.findOne({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    if (lesson.videoS3Key) {
      await this.s3Service.deleteObject(lesson.videoS3Key);
    }

    lesson.videoS3Key = null;
    lesson.videoOriginalName = null;
    lesson.videoSizeBytes = null;
    lesson.videoUrl = null;

    await this.lessonsRepository.save(lesson);

    return { success: true };
  }

  /**
   * Generate a presigned PUT URL for uploading an image used in TipTap lesson content.
   */
  @Post(":lessonId/content/image-upload-url")
  async requestImageUploadUrl(
    @Param("lessonId") lessonId: string,
    @Body(new ZodValidationPipe(requestImageUploadUrlSchema))
    dto: RequestImageUploadUrlDto,
  ) {
    const lesson = await this.lessonsRepository.findOne({
      where: { id: lessonId },
      relations: { course: true },
    });

    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    const extension = dto.fileName.split(".").pop() ?? "jpg";
    const uniqueId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const imageKey = `content/${lesson.course.slug}/${lessonId}/${uniqueId}.${extension}`;

    const uploadUrl = await this.s3Service.getPresignedUploadUrl(
      imageKey,
      dto.contentType,
    );

    const imageUrl = await this.s3Service.getPresignedDownloadUrl(
      imageKey,
      86400, // 24 hours
    );

    return { uploadUrl, imageKey, imageUrl };
  }
}