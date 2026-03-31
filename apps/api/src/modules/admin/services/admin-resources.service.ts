import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CourseResourceEntity, ResourceType } from "../../catalog/entities/course-resource.entity";
import { LessonEntity } from "../../catalog/entities/lesson.entity";
import { S3Service } from "../../../core/services/s3.service";
import { CreateResourceDto } from "../dto/create-resource.dto";
import { UpdateResourceDto } from "../dto/update-resource.dto";
import { RequestResourceUploadUrlDto } from "../dto/resource-upload.dto";
import { ConfirmResourceUploadDto } from "../dto/resource-upload.dto";

@Injectable()
export class AdminResourcesService {
  constructor(
    @InjectRepository(CourseResourceEntity)
    private readonly resourceRepo: Repository<CourseResourceEntity>,
    @InjectRepository(LessonEntity)
    private readonly lessonRepo: Repository<LessonEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async getLessonResources(lessonId: string) {
    const resources = await this.resourceRepo.find({
      where: { lessonId },
      order: { position: "ASC" },
    });

    return resources.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      type: r.type,
      fileUrl: r.fileUrl,
      fileS3Key: r.fileS3Key,
      fileOriginalName: r.fileOriginalName,
      fileSizeLabel: r.fileSizeLabel,
      position: r.position,
    }));
  }

  async createResource(lessonId: string, dto: CreateResourceDto) {
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException("Lesson not found");

    const maxPosition = await this.resourceRepo
      .createQueryBuilder("r")
      .select("COALESCE(MAX(r.position), 0)", "max")
      .where("r.lesson_id = :lessonId", { lessonId })
      .getRawOne();

    const resource = this.resourceRepo.create({
      lessonId,
      courseId: lesson.courseId,
      title: dto.title,
      description: dto.description ?? null,
      type: dto.type as ResourceType,
      fileUrl: dto.fileUrl ?? null,
      position: (maxPosition?.max ?? 0) + 1,
    });

    const saved = await this.resourceRepo.save(resource);

    return {
      id: saved.id,
      title: saved.title,
      description: saved.description,
      type: saved.type,
      fileUrl: saved.fileUrl,
      fileS3Key: saved.fileS3Key,
      fileOriginalName: saved.fileOriginalName,
      fileSizeLabel: saved.fileSizeLabel,
      position: saved.position,
    };
  }

  async updateResource(resourceId: string, dto: UpdateResourceDto) {
    const resource = await this.resourceRepo.findOne({
      where: { id: resourceId },
    });
    if (!resource) throw new NotFoundException("Resource not found");

    if (dto.title !== undefined) resource.title = dto.title;
    if (dto.description !== undefined) resource.description = dto.description;
    if (dto.type !== undefined) resource.type = dto.type as ResourceType;
    if (dto.fileUrl !== undefined) resource.fileUrl = dto.fileUrl;

    const saved = await this.resourceRepo.save(resource);

    return {
      id: saved.id,
      title: saved.title,
      description: saved.description,
      type: saved.type,
      fileUrl: saved.fileUrl,
      fileS3Key: saved.fileS3Key,
      fileOriginalName: saved.fileOriginalName,
      fileSizeLabel: saved.fileSizeLabel,
      position: saved.position,
    };
  }

  async deleteResource(resourceId: string) {
    const resource = await this.resourceRepo.findOne({
      where: { id: resourceId },
    });
    if (!resource) throw new NotFoundException("Resource not found");

    if (resource.fileS3Key) {
      await this.s3Service.deleteObject(resource.fileS3Key);
    }

    await this.resourceRepo.remove(resource);
  }

  async requestUploadUrl(lessonId: string, dto: RequestResourceUploadUrlDto) {
    const lesson = await this.lessonRepo.findOne({
      where: { id: lessonId },
      relations: ["course"],
    });
    if (!lesson) throw new NotFoundException("Lesson not found");

    const extension = dto.fileName.split(".").pop() ?? "bin";
    const uniqueId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const key = `resources/${lesson.course.slug}/${lessonId}/${uniqueId}.${extension}`;

    const uploadUrl = await this.s3Service.getPresignedUploadUrl(key, dto.contentType);

    return { uploadUrl, s3Key: key };
  }

  async confirmUpload(dto: ConfirmResourceUploadDto) {
    const resource = await this.resourceRepo.findOne({
      where: { id: dto.resourceId },
    });
    if (!resource) throw new NotFoundException("Resource not found");

    // Delete old file if different key
    if (resource.fileS3Key && resource.fileS3Key !== dto.s3Key) {
      await this.s3Service.deleteObject(resource.fileS3Key);
    }

    resource.fileS3Key = dto.s3Key;
    resource.fileOriginalName = dto.originalName;
    resource.fileSizeBytes = dto.fileSize;
    resource.fileSizeLabel = this.formatFileSize(dto.fileSize);
    resource.fileUrl = null; // Clear external URL in favor of S3

    await this.resourceRepo.save(resource);
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
