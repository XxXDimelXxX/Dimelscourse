import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AccessTokenGuard } from "../../identity-access/guards/access-token.guard";
import { RolesGuard } from "../../identity-access/guards/roles.guard";
import { Roles } from "../../identity-access/decorators/roles.decorator";
import { UserRole } from "../../identity-access/entities/user.entity";
import { ZodValidationPipe } from "../../../core/pipes/zod-validation.pipe";
import { AdminResourcesService } from "../services/admin-resources.service";
import { createResourceSchema, CreateResourceDto } from "../dto/create-resource.dto";
import { updateResourceSchema, UpdateResourceDto } from "../dto/update-resource.dto";
import {
  requestResourceUploadUrlSchema,
  RequestResourceUploadUrlDto,
  confirmResourceUploadSchema,
  ConfirmResourceUploadDto,
} from "../dto/resource-upload.dto";

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
@Controller("admin")
export class AdminResourcesController {
  constructor(private readonly resourcesService: AdminResourcesService) {}

  @Get("lessons/:lessonId/resources")
  getLessonResources(@Param("lessonId") lessonId: string) {
    return this.resourcesService.getLessonResources(lessonId);
  }

  @Post("lessons/:lessonId/resources")
  createResource(
    @Param("lessonId") lessonId: string,
    @Body(new ZodValidationPipe(createResourceSchema)) dto: CreateResourceDto,
  ) {
    return this.resourcesService.createResource(lessonId, dto);
  }

  @Patch("resources/:resourceId")
  updateResource(
    @Param("resourceId") resourceId: string,
    @Body(new ZodValidationPipe(updateResourceSchema)) dto: UpdateResourceDto,
  ) {
    return this.resourcesService.updateResource(resourceId, dto);
  }

  @Delete("resources/:resourceId")
  deleteResource(@Param("resourceId") resourceId: string) {
    return this.resourcesService.deleteResource(resourceId);
  }

  @Post("lessons/:lessonId/resource/upload-url")
  requestUploadUrl(
    @Param("lessonId") lessonId: string,
    @Body(new ZodValidationPipe(requestResourceUploadUrlSchema))
    dto: RequestResourceUploadUrlDto,
  ) {
    return this.resourcesService.requestUploadUrl(lessonId, dto);
  }

  @Post("lessons/:lessonId/resource/confirm")
  confirmUpload(
    @Body(new ZodValidationPipe(confirmResourceUploadSchema))
    dto: ConfirmResourceUploadDto,
  ) {
    return this.resourcesService.confirmUpload(dto);
  }
}
