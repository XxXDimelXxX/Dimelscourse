import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CourseEntity } from "../../catalog/entities/course.entity";
import { UserEntity } from "../../identity-access/entities/user.entity";
import { CreateCourseCommentDto } from "../dto/create-course-comment.dto";
import { CourseCommentEntity } from "../entities/course-comment.entity";

@Injectable()
export class CourseCommentsService {
  constructor(
    @InjectRepository(CourseCommentEntity)
    private readonly commentsRepository: Repository<CourseCommentEntity>,
    @InjectRepository(CourseEntity)
    private readonly coursesRepository: Repository<CourseEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async listForCourse(courseSlug: string) {
    const course = await this.coursesRepository.findOne({
      where: { slug: courseSlug },
    });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    const comments = await this.commentsRepository.find({
      where: { courseId: course.id },
      relations: { author: true },
      order: { createdAt: "DESC" },
    });

    return comments.map((comment) => ({
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt,
      author: {
        id: comment.author.id,
        displayName: comment.author.displayName,
        avatarUrl: comment.author.avatarUrl,
      },
    }));
  }

  async createForCourse(courseSlug: string, dto: CreateCourseCommentDto) {
    const [course, author] = await Promise.all([
      this.coursesRepository.findOne({
        where: { slug: courseSlug },
      }),
      this.usersRepository.findOne({
        where: { id: dto.userId },
      }),
    ]);

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    if (!author) {
      throw new NotFoundException("Author not found");
    }

    const comment = this.commentsRepository.create({
      courseId: course.id,
      authorId: author.id,
      body: dto.body.trim(),
    });

    const saved = await this.commentsRepository.save(comment);

    return {
      id: saved.id,
      courseId: saved.courseId,
      authorId: saved.authorId,
      body: saved.body,
      createdAt: saved.createdAt,
    };
  }
}
