import { Controller, Get, Param, Patch } from "@nestjs/common";
import { CompleteLessonUseCase } from "../application/complete-lesson.use-case";
import { GetStudentCourseUseCase } from "../application/get-student-course.use-case";
import { GetStudentDashboardUseCase } from "../application/get-student-dashboard.use-case";

const DEMO_STUDENT_ID = "student-1";

@Controller("me")
export class StudentLearningController {
  constructor(
    private readonly getStudentDashboardUseCase: GetStudentDashboardUseCase,
    private readonly getStudentCourseUseCase: GetStudentCourseUseCase,
    private readonly completeLessonUseCase: CompleteLessonUseCase,
  ) {}

  @Get("dashboard")
  dashboard() {
    return this.getStudentDashboardUseCase.execute(DEMO_STUDENT_ID);
  }

  @Get("courses/:courseSlug")
  course(@Param("courseSlug") courseSlug: string) {
    return this.getStudentCourseUseCase.execute(DEMO_STUDENT_ID, courseSlug);
  }

  @Patch("courses/:courseSlug/lessons/:lessonId/complete")
  completeLesson(
    @Param("courseSlug") courseSlug: string,
    @Param("lessonId") lessonId: string,
  ) {
    return this.completeLessonUseCase.execute(
      DEMO_STUDENT_ID,
      courseSlug,
      lessonId,
    );
  }
}
