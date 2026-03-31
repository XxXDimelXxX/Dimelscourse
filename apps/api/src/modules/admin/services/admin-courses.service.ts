import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CourseEntity, CourseLevel } from "../../catalog/entities/course.entity";
import { CourseModuleEntity } from "../../catalog/entities/course-module.entity";
import { LessonEntity } from "../../catalog/entities/lesson.entity";
import { InstructorEntity } from "../../catalog/entities/instructor.entity";
import { UserRole } from "../../identity-access/entities/user.entity";
import { getSortedModules } from "../../../core/utils/course.utils";
import { S3Service } from "../../../core/services/s3.service";
import { CreateCourseDto } from "../dto/create-course.dto";
import { UpdateCourseMetaDto } from "../dto/update-course-meta.dto";
import { CreateModuleDto } from "../dto/create-module.dto";
import { UpdateModuleDto } from "../dto/update-module.dto";
import { CreateLessonDto } from "../dto/create-lesson.dto";
import { UpdateLessonDto } from "../dto/update-lesson.dto";

@Injectable()
export class AdminCoursesService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepo: Repository<CourseEntity>,
    @InjectRepository(CourseModuleEntity)
    private readonly moduleRepo: Repository<CourseModuleEntity>,
    @InjectRepository(LessonEntity)
    private readonly lessonRepo: Repository<LessonEntity>,
    @InjectRepository(InstructorEntity)
    private readonly instructorRepo: Repository<InstructorEntity>,
    private readonly s3Service: S3Service,
  ) {}

  // ── Ownership helpers ──

  private assertOwnership(
    course: CourseEntity,
    userId: string,
    role: UserRole,
  ): void {
    if (role === UserRole.SUPERADMIN) return;
    if (course.createdById !== userId) {
      throw new ForbiddenException("Access denied");
    }
  }

  private buildOwnershipWhere(userId: string, role: UserRole) {
    if (role === UserRole.SUPERADMIN) return {};
    return { createdById: userId };
  }

  private async findCourseOrFail(
    slug: string,
    userId: string,
    role: UserRole,
  ): Promise<CourseEntity> {
    const course = await this.courseRepo.findOne({ where: { slug } });
    if (!course) throw new NotFoundException("Course not found");
    this.assertOwnership(course, userId, role);
    return course;
  }

  // ── Course CRUD ──

  async listCourses(userId: string, role: UserRole) {
    const courses = await this.courseRepo.find({
      where: this.buildOwnershipWhere(userId, role),
      order: { createdAt: "DESC" },
      relations: ["instructor"],
    });

    return courses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      summary: c.summary,
      level: c.level,
      priceUsd: c.priceUsd,
      isPublished: c.isPublished,
      previewImageUrl: c.previewImageUrl,
      lessonCount: c.lessonCount,
      studentsCount: c.studentsCount,
      instructorName: c.instructor?.fullName ?? null,
      createdAt: c.createdAt,
    }));
  }

  async createCourse(userId: string, dto: CreateCourseDto) {
    const existing = await this.courseRepo.findOne({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ForbiddenException("Course with this slug already exists");
    }

    const course = this.courseRepo.create({
      slug: dto.slug,
      title: dto.title,
      summary: dto.summary,
      level: dto.level as CourseLevel,
      priceUsd: dto.priceUsd,
      durationLabel: "0 ч",
      createdById: userId,
      isPublished: false,
    });

    const saved = await this.courseRepo.save(course);

    return {
      id: saved.id,
      slug: saved.slug,
      title: saved.title,
      summary: saved.summary,
      level: saved.level,
      priceUsd: saved.priceUsd,
      isPublished: saved.isPublished,
      previewImageUrl: saved.previewImageUrl,
      lessonCount: saved.lessonCount,
      studentsCount: saved.studentsCount,
      instructorName: null,
      createdAt: saved.createdAt,
    };
  }

  async getCourseBySlug(slug: string, userId: string, role: UserRole) {
    const course = await this.courseRepo.findOne({
      where: { slug },
      relations: ["instructor"],
    });
    if (!course) throw new NotFoundException("Course not found");
    this.assertOwnership(course, userId, role);

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      summary: course.summary,
      description: course.description,
      level: course.level,
      priceUsd: course.priceUsd,
      isPublished: course.isPublished,
      previewImageUrl: course.previewImageUrl,
      instructorName: course.instructor?.fullName ?? null,
      createdById: course.createdById,
    };
  }

  async updateCourse(
    slug: string,
    dto: UpdateCourseMetaDto,
    userId: string,
    role: UserRole,
  ) {
    const course = await this.courseRepo.findOne({
      where: { slug },
      relations: ["instructor"],
    });
    if (!course) throw new NotFoundException("Course not found");
    this.assertOwnership(course, userId, role);

    if (dto.title !== undefined) course.title = dto.title;
    if (dto.summary !== undefined) course.summary = dto.summary;
    if (dto.description !== undefined) course.description = dto.description;
    if (dto.level !== undefined) course.level = dto.level as CourseLevel;
    if (dto.priceUsd !== undefined) course.priceUsd = Math.max(0, Math.round(dto.priceUsd));
    if (dto.previewImageUrl !== undefined) course.previewImageUrl = dto.previewImageUrl;
    if (dto.isPublished !== undefined) course.isPublished = dto.isPublished;

    if (dto.instructorName !== undefined) {
      if (course.instructor) {
        course.instructor.fullName = dto.instructorName;
        await this.instructorRepo.save(course.instructor);
      } else {
        const instructor = this.instructorRepo.create({
          fullName: dto.instructorName,
          title: "",
        });
        const saved = await this.instructorRepo.save(instructor);
        course.instructorId = saved.id;
      }
    }

    await this.courseRepo.save(course);
    return this.getCourseBySlug(slug, userId, role);
  }

  // ── Structure ──

  async getCourseStructure(slug: string, userId: string, role: UserRole) {
    const course = await this.courseRepo.findOne({
      where: { slug },
      relations: ["courseModules", "courseModules.lessons"],
    });
    if (!course) throw new NotFoundException("Course not found");
    this.assertOwnership(course, userId, role);

    const sortedModules = getSortedModules(course.courseModules);

    return {
      courseId: course.id,
      courseSlug: course.slug,
      modules: sortedModules.map((m) => ({
        id: m.id,
        title: m.title,
        position: m.position,
        lessons: (m.lessons ?? [])
          .sort((a, b) => a.position - b.position)
          .map((l) => ({
            id: l.id,
            title: l.title,
            slug: l.slug,
            summary: l.summary,
            durationMinutes: l.durationMinutes,
            position: l.position,
            isPreview: l.isPreview,
            isLockedByDefault: l.isLockedByDefault,
            isDraft: l.isDraft,
            hasVideo: Boolean(l.videoS3Key),
            videoOriginalName: l.videoOriginalName,
            hasContent: Boolean(l.content),
          })),
      })),
    };
  }

  // ── Module CRUD ──

  async createModule(
    slug: string,
    dto: CreateModuleDto,
    userId: string,
    role: UserRole,
  ) {
    const course = await this.findCourseOrFail(slug, userId, role);

    const maxPosition = await this.moduleRepo
      .createQueryBuilder("m")
      .select("COALESCE(MAX(m.position), 0)", "max")
      .where("m.course_id = :courseId", { courseId: course.id })
      .getRawOne();

    const mod = this.moduleRepo.create({
      courseId: course.id,
      title: dto.title,
      position: (maxPosition?.max ?? 0) + 1,
    });

    const saved = await this.moduleRepo.save(mod);
    return { id: saved.id, title: saved.title, position: saved.position, lessons: [] };
  }

  async updateModule(
    slug: string,
    moduleId: string,
    dto: UpdateModuleDto,
    userId: string,
    role: UserRole,
  ) {
    await this.findCourseOrFail(slug, userId, role);

    const mod = await this.moduleRepo.findOne({ where: { id: moduleId } });
    if (!mod) throw new NotFoundException("Module not found");

    mod.title = dto.title;
    const saved = await this.moduleRepo.save(mod);
    return { id: saved.id, title: saved.title, position: saved.position };
  }

  async deleteModule(
    slug: string,
    moduleId: string,
    userId: string,
    role: UserRole,
  ) {
    const course = await this.findCourseOrFail(slug, userId, role);

    const mod = await this.moduleRepo.findOne({
      where: { id: moduleId },
      relations: ["lessons"],
    });
    if (!mod) throw new NotFoundException("Module not found");

    // Clean up S3 videos for all lessons in this module
    for (const lesson of mod.lessons ?? []) {
      if (lesson.videoS3Key) {
        await this.s3Service.deleteObject(lesson.videoS3Key);
      }
    }

    await this.moduleRepo.remove(mod);
    await this.normalizeModulePositions(course.id);
    await this.updateCourseLessonCount(course.id);
  }

  async reorderModule(
    slug: string,
    moduleId: string,
    direction: "up" | "down",
    userId: string,
    role: UserRole,
  ) {
    const course = await this.findCourseOrFail(slug, userId, role);

    const modules = await this.moduleRepo.find({
      where: { courseId: course.id },
      order: { position: "ASC" },
    });

    const idx = modules.findIndex((m) => m.id === moduleId);
    if (idx === -1) throw new NotFoundException("Module not found");

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= modules.length) return;

    const tempPos = modules[idx].position;
    modules[idx].position = modules[swapIdx].position;
    modules[swapIdx].position = tempPos;

    await this.moduleRepo.save([modules[idx], modules[swapIdx]]);
  }

  // ── Lesson CRUD ──

  async createLesson(
    slug: string,
    moduleId: string,
    dto: CreateLessonDto,
    userId: string,
    role: UserRole,
  ) {
    const course = await this.findCourseOrFail(slug, userId, role);

    const mod = await this.moduleRepo.findOne({ where: { id: moduleId } });
    if (!mod) throw new NotFoundException("Module not found");

    const maxPosition = await this.lessonRepo
      .createQueryBuilder("l")
      .select("COALESCE(MAX(l.position), 0)", "max")
      .where("l.course_module_id = :moduleId", { moduleId })
      .getRawOne();

    const lessonSlug = `${slug}-${Date.now().toString(36)}`;

    const lesson = this.lessonRepo.create({
      courseId: course.id,
      courseModuleId: moduleId,
      title: dto.title,
      slug: lessonSlug,
      summary: dto.summary ?? null,
      durationMinutes: dto.durationMinutes,
      position: (maxPosition?.max ?? 0) + 1,
      isPreview: dto.isPreview,
      isLockedByDefault: dto.isLockedByDefault,
      isDraft: dto.isDraft,
    });

    const saved = await this.lessonRepo.save(lesson);
    await this.updateCourseLessonCount(course.id);

    return {
      id: saved.id,
      title: saved.title,
      slug: saved.slug,
      summary: saved.summary,
      durationMinutes: saved.durationMinutes,
      position: saved.position,
      isPreview: saved.isPreview,
      isLockedByDefault: saved.isLockedByDefault,
      isDraft: saved.isDraft,
      hasVideo: false,
      videoOriginalName: null,
      hasContent: false,
    };
  }

  async updateLesson(
    slug: string,
    lessonId: string,
    dto: UpdateLessonDto,
    userId: string,
    role: UserRole,
  ) {
    await this.findCourseOrFail(slug, userId, role);

    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException("Lesson not found");

    if (dto.title !== undefined) lesson.title = dto.title;
    if (dto.summary !== undefined) lesson.summary = dto.summary;
    if (dto.durationMinutes !== undefined) lesson.durationMinutes = dto.durationMinutes;
    if (dto.isPreview !== undefined) lesson.isPreview = dto.isPreview;
    if (dto.isLockedByDefault !== undefined) lesson.isLockedByDefault = dto.isLockedByDefault;
    if (dto.isDraft !== undefined) lesson.isDraft = dto.isDraft;
    if (dto.content !== undefined) lesson.content = dto.content;

    const saved = await this.lessonRepo.save(lesson);

    return {
      id: saved.id,
      title: saved.title,
      slug: saved.slug,
      summary: saved.summary,
      durationMinutes: saved.durationMinutes,
      position: saved.position,
      isPreview: saved.isPreview,
      isLockedByDefault: saved.isLockedByDefault,
      isDraft: saved.isDraft,
      hasVideo: Boolean(saved.videoS3Key),
      videoOriginalName: saved.videoOriginalName,
      hasContent: Boolean(saved.content),
      content: saved.content,
    };
  }

  async deleteLesson(
    slug: string,
    lessonId: string,
    userId: string,
    role: UserRole,
  ) {
    const course = await this.findCourseOrFail(slug, userId, role);

    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException("Lesson not found");

    if (lesson.videoS3Key) {
      await this.s3Service.deleteObject(lesson.videoS3Key);
    }

    const moduleId = lesson.courseModuleId;
    await this.lessonRepo.remove(lesson);
    await this.normalizeLessonPositions(moduleId);
    await this.updateCourseLessonCount(course.id);
  }

  async reorderLesson(
    slug: string,
    lessonId: string,
    direction: "up" | "down",
    userId: string,
    role: UserRole,
  ) {
    await this.findCourseOrFail(slug, userId, role);

    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException("Lesson not found");

    const lessons = await this.lessonRepo.find({
      where: { courseModuleId: lesson.courseModuleId },
      order: { position: "ASC" },
    });

    const idx = lessons.findIndex((l) => l.id === lessonId);
    if (idx === -1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= lessons.length) return;

    const tempPos = lessons[idx].position;
    lessons[idx].position = lessons[swapIdx].position;
    lessons[swapIdx].position = tempPos;

    await this.lessonRepo.save([lessons[idx], lessons[swapIdx]]);
  }

  // ── Helpers ──

  private async normalizeModulePositions(courseId: string) {
    const modules = await this.moduleRepo.find({
      where: { courseId },
      order: { position: "ASC" },
    });
    for (let i = 0; i < modules.length; i++) {
      modules[i].position = i + 1;
    }
    if (modules.length > 0) {
      await this.moduleRepo.save(modules);
    }
  }

  private async normalizeLessonPositions(moduleId: string) {
    const lessons = await this.lessonRepo.find({
      where: { courseModuleId: moduleId },
      order: { position: "ASC" },
    });
    for (let i = 0; i < lessons.length; i++) {
      lessons[i].position = i + 1;
    }
    if (lessons.length > 0) {
      await this.lessonRepo.save(lessons);
    }
  }

  private async updateCourseLessonCount(courseId: string) {
    const count = await this.lessonRepo.count({ where: { courseId } });
    await this.courseRepo.update(courseId, { lessonCount: count });
  }
}
