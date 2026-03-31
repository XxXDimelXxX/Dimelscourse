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
import { CurrentUser } from "../../identity-access/decorators/current-user.decorator";
import { AuthenticatedUser } from "../../identity-access/interfaces/authenticated-user.interface";
import { UserRole } from "../../identity-access/entities/user.entity";
import { ZodValidationPipe } from "../../../core/pipes/zod-validation.pipe";
import { AdminCoursesService } from "../services/admin-courses.service";
import { createCourseSchema, CreateCourseDto } from "../dto/create-course.dto";
import { updateCourseMetaSchema, UpdateCourseMetaDto } from "../dto/update-course-meta.dto";
import { createModuleSchema, CreateModuleDto } from "../dto/create-module.dto";
import { updateModuleSchema, UpdateModuleDto } from "../dto/update-module.dto";
import { reorderSchema, ReorderDto } from "../dto/reorder.dto";
import { createLessonSchema, CreateLessonDto } from "../dto/create-lesson.dto";
import { updateLessonSchema, UpdateLessonDto } from "../dto/update-lesson.dto";

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
@Controller("admin/courses")
export class AdminCoursesController {
  constructor(private readonly coursesService: AdminCoursesService) {}

  // ── Course CRUD ──

  @Get()
  listCourses(@CurrentUser() user: AuthenticatedUser) {
    return this.coursesService.listCourses(user.id, user.role);
  }

  @Post()
  createCourse(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createCourseSchema)) dto: CreateCourseDto,
  ) {
    return this.coursesService.createCourse(user.id, dto);
  }

  @Get(":slug")
  getCourse(
    @Param("slug") slug: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.coursesService.getCourseBySlug(slug, user.id, user.role);
  }

  @Patch(":slug")
  updateCourse(
    @Param("slug") slug: string,
    @Body(new ZodValidationPipe(updateCourseMetaSchema)) dto: UpdateCourseMetaDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.coursesService.updateCourse(slug, dto, user.id, user.role);
  }

  // ── Structure ──

  @Get(":slug/structure")
  getStructure(
    @Param("slug") slug: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.coursesService.getCourseStructure(slug, user.id, user.role);
  }

  // ── Module CRUD ──

  @Post(":slug/modules")
  createModule(
    @Param("slug") slug: string,
    @Body(new ZodValidationPipe(createModuleSchema)) dto: CreateModuleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.coursesService.createModule(slug, dto, user.id, user.role);
  }

  @Patch(":slug/modules/:moduleId")
  updateModule(
    @Param("slug") slug: string,
    @Param("moduleId") moduleId: string,
    @Body(new ZodValidationPipe(updateModuleSchema)) dto: UpdateModuleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.coursesService.updateModule(slug, moduleId, dto, user.id, user.role);
  }

  @Delete(":slug/modules/:moduleId")
  deleteModule(
    @Param("slug") slug: string,
    @Param("moduleId") moduleId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.coursesService.deleteModule(slug, moduleId, user.id, user.role);
  }

  @Patch(":slug/modules/:moduleId/reorder")
  reorderModule(
    @Param("slug") slug: string,
    @Param("moduleId") moduleId: string,
    @Body(new ZodValidationPipe(reorderSchema)) dto: ReorderDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.coursesService.reorderModule(slug, moduleId, dto.direction, user.id, user.role);
  }

  // ── Lesson CRUD ──

  @Post(":slug/modules/:moduleId/lessons")
  createLesson(
    @Param("slug") slug: string,
    @Param("moduleId") moduleId: string,
    @Body(new ZodValidationPipe(createLessonSchema)) dto: CreateLessonDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.coursesService.createLesson(slug, moduleId, dto, user.id, user.role);
  }

  @Patch(":slug/lessons/:lessonId")
  updateLesson(
    @Param("slug") slug: string,
    @Param("lessonId") lessonId: string,
    @Body(new ZodValidationPipe(updateLessonSchema)) dto: UpdateLessonDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.coursesService.updateLesson(slug, lessonId, dto, user.id, user.role);
  }

  @Delete(":slug/lessons/:lessonId")
  deleteLesson(
    @Param("slug") slug: string,
    @Param("lessonId") lessonId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.coursesService.deleteLesson(slug, lessonId, user.id, user.role);
  }

  @Patch(":slug/lessons/:lessonId/reorder")
  reorderLesson(
    @Param("slug") slug: string,
    @Param("lessonId") lessonId: string,
    @Body(new ZodValidationPipe(reorderSchema)) dto: ReorderDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.coursesService.reorderLesson(slug, lessonId, dto.direction, user.id, user.role);
  }
}
