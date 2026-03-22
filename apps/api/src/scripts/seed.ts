import "reflect-metadata";
import { seedDataSource } from "../core/database/seed-data-source";
import { CourseCommentEntity } from "../modules/community/entities/course-comment.entity";
import { CourseEntity, CourseLevel } from "../modules/catalog/entities/course.entity";
import { CourseModuleEntity } from "../modules/catalog/entities/course-module.entity";
import {
  CourseResourceEntity,
  ResourceType,
} from "../modules/catalog/entities/course-resource.entity";
import { InstructorEntity } from "../modules/catalog/entities/instructor.entity";
import { LessonEntity } from "../modules/catalog/entities/lesson.entity";
import { UserEntity, UserRole } from "../modules/identity-access/entities/user.entity";
import { AchievementEntity } from "../modules/learning/entities/achievement.entity";
import {
  ActivityLogEntity,
  ActivityType,
} from "../modules/learning/entities/activity-log.entity";
import {
  EnrollmentEntity,
  EnrollmentStatus,
} from "../modules/learning/entities/enrollment.entity";
import { LessonProgressEntity } from "../modules/learning/entities/lesson-progress.entity";
import { StudyPlanItemEntity } from "../modules/learning/entities/study-plan-item.entity";
import {
  PaymentEntity,
  PaymentStatus,
  PaymentType,
} from "../modules/payments/entities/payment.entity";

const COURSE_STRUCTURE = [
  {
    title: "Модуль 1: Основы HTML & CSS",
    lessons: [
      ["Введение в HTML", "Изучаем основы HTML: структура документа, основные теги, семантическая разметка.", 15, true],
      ["HTML теги и структура", "Углубленное изучение HTML тегов, создание правильной структуры страницы.", 20, false],
      ["CSS стили и селекторы", "Основы CSS: селекторы, каскадность и базовое стилирование.", 25, false],
      ["CSS Flexbox", "Современная верстка с Flexbox: выравнивание и распределение пространства.", 30, false],
    ],
  },
  {
    title: "Модуль 2: JavaScript Основы",
    lessons: [
      ["Переменные и типы данных", "Знакомство с JavaScript: переменные, примитивные типы и операторы.", 20, false],
      ["Функции в JavaScript", "Создание и использование функций, стрелочные функции и области видимости.", 25, false],
      ["Массивы и объекты", "Работа с массивами и объектами, методы массивов и деструктуризация.", 30, false],
      ["DOM манипуляции", "Взаимодействие с DOM и обработка событий.", 35, false],
    ],
  },
  {
    title: "Модуль 3: React Fundamentals",
    lessons: [
      ["Введение в React", "Что такое React, JSX и создание первого компонента.", 20, false],
      ["Компоненты и Props", "Создание переиспользуемых компонентов и передача данных через props.", 25, false],
      ["State и useState", "Управление состоянием компонента через useState.", 30, false],
      ["useEffect и Lifecycle", "Побочные эффекты и жизненный цикл компонента.", 35, false],
    ],
  },
  {
    title: "Модуль 4: Backend с Node.js",
    lessons: [
      ["Настройка Node.js", "Установка Node.js, npm и создание первого сервера.", 15, false],
      ["Express.js основы", "Создание REST API на Express.js.", 25, false],
      ["REST API создание", "Проектирование и создание RESTful API.", 30, false],
      ["База данных PostgreSQL", "Подключение PostgreSQL и базовые CRUD операции.", 40, false],
    ],
  },
] as const;

async function truncateTables(): Promise<void> {
  await seedDataSource.query(`
    TRUNCATE TABLE
      course_comments,
      activity_logs,
      achievements,
      study_plan_items,
      lesson_progress,
      enrollments,
      payments,
      course_resources,
      lessons,
      course_modules,
      courses,
      instructors,
      users
    RESTART IDENTITY CASCADE;
  `);
}

async function run(): Promise<void> {
  await seedDataSource.initialize();
  await seedDataSource.synchronize();
  await truncateTables();

  const usersRepository = seedDataSource.getRepository(UserEntity);
  const instructorsRepository = seedDataSource.getRepository(InstructorEntity);
  const coursesRepository = seedDataSource.getRepository(CourseEntity);
  const courseModulesRepository = seedDataSource.getRepository(CourseModuleEntity);
  const lessonsRepository = seedDataSource.getRepository(LessonEntity);
  const resourcesRepository = seedDataSource.getRepository(CourseResourceEntity);
  const enrollmentsRepository = seedDataSource.getRepository(EnrollmentEntity);
  const lessonProgressRepository = seedDataSource.getRepository(LessonProgressEntity);
  const achievementsRepository = seedDataSource.getRepository(AchievementEntity);
  const activityRepository = seedDataSource.getRepository(ActivityLogEntity);
  const studyPlanRepository = seedDataSource.getRepository(StudyPlanItemEntity);
  const commentsRepository = seedDataSource.getRepository(CourseCommentEntity);
  const paymentsRepository = seedDataSource.getRepository(PaymentEntity);

  const [studentUser, enrolledStudent, adminUser] = await usersRepository.save([
    usersRepository.create({
      email: "student@email.com",
      passwordHash: "hashed:password",
      displayName: "Иван Петров",
      role: UserRole.STUDENT,
      isActive: true,
      avatarUrl: null,
    }),
    usersRepository.create({
      email: "alexey@example.com",
      passwordHash: "hashed:password",
      displayName: "Алексей Морозов",
      role: UserRole.STUDENT,
      isActive: true,
      avatarUrl: null,
    }),
    usersRepository.create({
      email: "admin@test.com",
      passwordHash: "hashed:admin123",
      displayName: "Администратор",
      role: UserRole.ADMIN,
      isActive: true,
      avatarUrl: null,
    }),
  ]);

  const instructor = await instructorsRepository.save(
    instructorsRepository.create({
      fullName: "Дмитрий Иванов",
      title: "Senior Full Stack Developer",
      bio: "Практикующий инженер с 10+ летним опытом в веб-разработке и запуске образовательных продуктов.",
      avatarUrl: null,
      yearsOfExperience: 10,
    }),
  );

  const course = await coursesRepository.save(
    coursesRepository.create({
      slug: "fullstack-web-dev",
      title: "Full Stack Web Development",
      summary: "Полный курс по созданию современных веб-приложений с React и Node.js.",
      description:
        "Полный курс по созданию современных веб-приложений с React и Node.js. От основ до продвинутых концепций за 6 месяцев.",
      level: CourseLevel.INTERMEDIATE,
      priceUsd: 299,
      subscriptionPriceUsd: 59,
      durationLabel: "6 месяцев",
      lessonCount: 16,
      rating: "4.80",
      studentsCount: 5420,
      isPublished: true,
      certificateAvailable: true,
      previewImageUrl:
        "https://images.unsplash.com/photo-1763568258299-0bac211f204e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      instructorId: instructor.id,
    }),
  );

  const modules: CourseModuleEntity[] = [];

  for (const [index, moduleData] of COURSE_STRUCTURE.entries()) {
    modules.push(
      await courseModulesRepository.save(
        courseModulesRepository.create({
          courseId: course.id,
          title: moduleData.title,
          position: index + 1,
        }),
      ),
    );
  }

  const lessons: LessonEntity[] = [];
  let globalPosition = 1;

  for (const [moduleIndex, moduleData] of COURSE_STRUCTURE.entries()) {
    for (const [lessonIndex, lessonData] of moduleData.lessons.entries()) {
      const [title, summary, durationMinutes, isPreview] = lessonData;
      lessons.push(
        await lessonsRepository.save(
          lessonsRepository.create({
            courseId: course.id,
            courseModuleId: modules[moduleIndex].id,
            title,
            slug: `fullstack-web-dev-${globalPosition}`,
            summary,
            durationMinutes,
            position: globalPosition,
            videoUrl: null,
            isPreview,
            isLockedByDefault: lessonIndex > 0,
          }),
        ),
      );
      globalPosition += 1;
    }
  }

  await resourcesRepository.save([
    resourcesRepository.create({
      courseId: course.id,
      title: "Чеклист по HTML и CSS",
      description: "Быстрый PDF для повторения тем первого модуля.",
      type: ResourceType.PDF,
      fileUrl: "https://example.com/resources/html-css-checklist.pdf",
      fileSizeLabel: "1.2 MB",
      position: 1,
    }),
    resourcesRepository.create({
      courseId: course.id,
      title: "Starter kit для React",
      description: "Архив с шаблоном проекта для практики.",
      type: ResourceType.ZIP,
      fileUrl: "https://example.com/resources/react-starter.zip",
      fileSizeLabel: "8.4 MB",
      position: 2,
    }),
    resourcesRepository.create({
      courseId: course.id,
      title: "Плейлист по деплою",
      description: "Ссылки на дополнительные материалы по запуску проекта.",
      type: ResourceType.LINK,
      fileUrl: "https://example.com/resources/deploy-playlist",
      fileSizeLabel: null,
      position: 3,
    }),
  ]);

  const enrollment = await enrollmentsRepository.save(
    enrollmentsRepository.create({
      userId: enrolledStudent.id,
      courseId: course.id,
      status: EnrollmentStatus.ACTIVE,
      progressPercent: 25,
      completedLessons: 4,
      totalLessons: lessons.length,
      nextLessonTitle: lessons[4]?.title ?? null,
      timeLeftLabel: "В процессе",
      completedAt: null,
      lastActivityAt: new Date("2026-03-22T11:15:00.000Z"),
    }),
  );

  await lessonProgressRepository.save(
    lessons.slice(0, 4).map((lesson, index) =>
      lessonProgressRepository.create({
        enrollmentId: enrollment.id,
        lessonId: lesson.id,
        isCompleted: true,
        startedAt: new Date(`2026-03-${10 + index}T09:00:00.000Z`),
        completedAt: new Date(`2026-03-${10 + index}T09:30:00.000Z`),
        watchSeconds: lesson.durationMinutes * 60,
      }),
    ),
  );

  await achievementsRepository.save([
    achievementsRepository.create({
      userId: enrolledStudent.id,
      code: "first_lesson",
      title: "Первый урок",
      description: "Начал обучение и завершил первый урок курса.",
      icon: "🚀",
      unlockedAt: new Date("2026-03-10T09:30:00.000Z"),
    }),
    achievementsRepository.create({
      userId: enrolledStudent.id,
      code: "html_css_block",
      title: "HTML & CSS Ready",
      description: "Завершил первый модуль курса.",
      icon: "🔥",
      unlockedAt: new Date("2026-03-13T09:30:00.000Z"),
    }),
  ]);

  await activityRepository.save([
    activityRepository.create({
      userId: enrolledStudent.id,
      courseId: course.id,
      type: ActivityType.LESSON_COMPLETED,
      title: "Урок завершен",
      description: "Завершен урок «CSS Flexbox».",
      createdAt: new Date("2026-03-13T09:30:00.000Z"),
    }),
    activityRepository.create({
      userId: enrolledStudent.id,
      courseId: course.id,
      type: ActivityType.RESOURCE_DOWNLOADED,
      title: "Материал скачан",
      description: "Скачан Starter kit для React.",
      createdAt: new Date("2026-03-15T12:00:00.000Z"),
    }),
  ]);

  await studyPlanRepository.save([
    studyPlanRepository.create({
      userId: enrolledStudent.id,
      courseId: course.id,
      weekday: "Пн",
      dayOfMonth: 24,
      title: "Практика по JavaScript",
      timeRangeLabel: "19:00 - 20:30",
    }),
    studyPlanRepository.create({
      userId: enrolledStudent.id,
      courseId: course.id,
      weekday: "Ср",
      dayOfMonth: 26,
      title: "React блок",
      timeRangeLabel: "19:30 - 21:00",
    }),
  ]);

  await commentsRepository.save([
    commentsRepository.create({
      courseId: course.id,
      authorId: enrolledStudent.id,
      body: "Очень нравится подача материала, особенно первый модуль.",
    }),
    commentsRepository.create({
      courseId: course.id,
      authorId: adminUser.id,
      body: "Следующий блок будет дополнен примерами по деплою и продакшен-пайплайну.",
    }),
  ]);

  await paymentsRepository.save([
    paymentsRepository.create({
      userId: enrolledStudent.id,
      courseId: course.id,
      type: PaymentType.ONE_TIME,
      status: PaymentStatus.SUCCESS,
      amountUsd: 299,
      currency: "USD",
      provider: "demo-gateway",
      transactionId: "txn_seed_success_1",
      paymentMethodLabel: "Visa •••• 4242",
      accessGranted: true,
      accessGrantedAt: new Date("2026-03-09T09:00:00.000Z"),
    }),
    paymentsRepository.create({
      userId: studentUser.id,
      courseId: course.id,
      type: PaymentType.SUBSCRIPTION,
      status: PaymentStatus.PENDING,
      amountUsd: 59,
      currency: "USD",
      provider: "demo-gateway",
      transactionId: "txn_seed_pending_1",
      paymentMethodLabel: "MasterCard •••• 5555",
      accessGranted: false,
    }),
    paymentsRepository.create({
      userId: studentUser.id,
      courseId: course.id,
      type: PaymentType.ONE_TIME,
      status: PaymentStatus.FAILED,
      amountUsd: 299,
      currency: "USD",
      provider: "demo-gateway",
      transactionId: "txn_seed_failed_1",
      paymentMethodLabel: "Visa •••• 1111",
      accessGranted: false,
      failureReason: "Недостаточно средств",
    }),
  ]);

  console.log("Seed completed successfully");
  await seedDataSource.destroy();
}

run().catch(async (error) => {
  console.error("Seed failed", error);
  if (seedDataSource.isInitialized) {
    await seedDataSource.destroy();
  }
  process.exitCode = 1;
});
