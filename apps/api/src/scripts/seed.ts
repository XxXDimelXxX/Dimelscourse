import "reflect-metadata";
import { seedDataSource } from "../core/database/seed-data-source";
import {
  CourseLevel,
  CourseEntity,
} from "../modules/catalog/entities/course.entity";
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
import { CourseCommentEntity } from "../modules/community/entities/course-comment.entity";

async function truncateTables(): Promise<void> {
  await seedDataSource.query(`
    TRUNCATE TABLE
      course_comments,
      activity_logs,
      achievements,
      study_plan_items,
      lesson_progress,
      enrollments,
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

  const [studentUser, secondStudentUser, adminUser] = await usersRepository.save([
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
      email: "admin@dimelschool.com",
      passwordHash: "hashed:admin123",
      displayName: "Администратор",
      role: UserRole.ADMIN,
      isActive: true,
      avatarUrl: null,
    }),
  ]);

  const [fullstackInstructor, pythonInstructor, dataInstructor] =
    await instructorsRepository.save([
      instructorsRepository.create({
        fullName: "Дмитрий Иванов",
        title: "Senior Full Stack Developer",
        bio: "Практикующий инженер с 10+ летним опытом в веб-разработке и командной работе над коммерческими продуктами.",
        avatarUrl: null,
        yearsOfExperience: 10,
      }),
      instructorsRepository.create({
        fullName: "Анна Смирнова",
        title: "Python Mentor",
        bio: "Помогает новичкам мягко войти в разработку, объясняя сложные темы простым языком.",
        avatarUrl: null,
        yearsOfExperience: 8,
      }),
      instructorsRepository.create({
        fullName: "Петр Козлов",
        title: "Data Science Lead",
        bio: "Специалист по аналитике и ML, работал с продуктовыми командами и учебными программами.",
        avatarUrl: null,
        yearsOfExperience: 12,
      }),
    ]);

  const [fullstackCourse, pythonCourse, dataScienceCourse] = await coursesRepository.save([
    coursesRepository.create({
      slug: "fullstack",
      title: "Full Stack Web Development",
      summary: "Полный курс по созданию современных веб-приложений с React и Node.js.",
      description:
        "Вы изучите клиентскую и серверную разработку, научитесь проектировать API и доводить продукт до продакшена.",
      level: CourseLevel.INTERMEDIATE,
      priceUsd: 299,
      durationLabel: "6 месяцев",
      lessonCount: 8,
      rating: "4.80",
      studentsCount: 5420,
      isPublished: true,
      certificateAvailable: true,
      previewImageUrl:
        "https://images.unsplash.com/photo-1763568258299-0bac211f204e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      instructorId: fullstackInstructor.id,
    }),
    coursesRepository.create({
      slug: "python",
      title: "Python для начинающих",
      summary: "Изучи основы программирования на самом популярном языке.",
      description:
        "Курс помогает начать карьеру в IT с нуля через практические упражнения и понятную теорию.",
      level: CourseLevel.BEGINNER,
      priceUsd: 149,
      durationLabel: "3 месяца",
      lessonCount: 4,
      rating: "4.90",
      studentsCount: 8230,
      isPublished: true,
      certificateAvailable: true,
      previewImageUrl:
        "https://images.unsplash.com/photo-1759884248009-92c5e957708e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      instructorId: pythonInstructor.id,
    }),
    coursesRepository.create({
      slug: "datascience",
      title: "Data Science & ML",
      summary: "Освой анализ данных и машинное обучение от профессионалов.",
      description:
        "Продвинутый трек по pandas, статистике, моделям машинного обучения и практике на реальных данных.",
      level: CourseLevel.ADVANCED,
      priceUsd: 399,
      durationLabel: "8 месяцев",
      lessonCount: 4,
      rating: "4.70",
      studentsCount: 3120,
      isPublished: true,
      certificateAvailable: true,
      previewImageUrl:
        "https://images.unsplash.com/photo-1660810731526-0720827cbd38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      instructorId: dataInstructor.id,
    }),
  ]);

  const [
    fullstackModuleOne,
    fullstackModuleTwo,
    pythonModuleOne,
    dataModuleOne,
  ] = await courseModulesRepository.save([
    courseModulesRepository.create({
      courseId: fullstackCourse.id,
      title: "Модуль 1: Основы HTML & CSS",
      position: 1,
    }),
    courseModulesRepository.create({
      courseId: fullstackCourse.id,
      title: "Модуль 2: JavaScript и React",
      position: 2,
    }),
    courseModulesRepository.create({
      courseId: pythonCourse.id,
      title: "Модуль 1: Основы Python",
      position: 1,
    }),
    courseModulesRepository.create({
      courseId: dataScienceCourse.id,
      title: "Модуль 1: Введение в Data Science",
      position: 1,
    }),
  ]);

  const lessons = await lessonsRepository.save([
    lessonsRepository.create({
      courseId: fullstackCourse.id,
      courseModuleId: fullstackModuleOne.id,
      title: "Введение в HTML",
      slug: "fullstack-html-intro",
      summary: "Разбираем структуру HTML-документа и базовые теги.",
      durationMinutes: 15,
      position: 1,
      videoUrl: null,
      isPreview: true,
      isLockedByDefault: false,
    }),
    lessonsRepository.create({
      courseId: fullstackCourse.id,
      courseModuleId: fullstackModuleOne.id,
      title: "HTML теги и структура",
      slug: "fullstack-html-structure",
      summary: "Практика правильной разметки страницы.",
      durationMinutes: 20,
      position: 2,
      videoUrl: null,
      isPreview: false,
      isLockedByDefault: false,
    }),
    lessonsRepository.create({
      courseId: fullstackCourse.id,
      courseModuleId: fullstackModuleOne.id,
      title: "CSS стили и селекторы",
      slug: "fullstack-css-selectors",
      summary: "Подключаем стили и осваиваем селекторы.",
      durationMinutes: 25,
      position: 3,
      videoUrl: null,
      isPreview: false,
      isLockedByDefault: false,
    }),
    lessonsRepository.create({
      courseId: fullstackCourse.id,
      courseModuleId: fullstackModuleOne.id,
      title: "CSS Flexbox",
      slug: "fullstack-css-flexbox",
      summary: "Выстраиваем адаптивные layout-ы через Flexbox.",
      durationMinutes: 30,
      position: 4,
      videoUrl: null,
      isPreview: false,
      isLockedByDefault: false,
    }),
    lessonsRepository.create({
      courseId: fullstackCourse.id,
      courseModuleId: fullstackModuleTwo.id,
      title: "Переменные и типы данных",
      slug: "fullstack-js-types",
      summary: "Базовые типы данных и переменные в JavaScript.",
      durationMinutes: 20,
      position: 5,
      videoUrl: null,
      isPreview: false,
      isLockedByDefault: false,
    }),
    lessonsRepository.create({
      courseId: fullstackCourse.id,
      courseModuleId: fullstackModuleTwo.id,
      title: "Функции в JavaScript",
      slug: "fullstack-js-functions",
      summary: "Функции, аргументы и возвращаемые значения.",
      durationMinutes: 25,
      position: 6,
      videoUrl: null,
      isPreview: false,
      isLockedByDefault: false,
    }),
    lessonsRepository.create({
      courseId: fullstackCourse.id,
      courseModuleId: fullstackModuleTwo.id,
      title: "Массивы и объекты",
      slug: "fullstack-js-arrays-objects",
      summary: "Работаем со структурами данных в JavaScript.",
      durationMinutes: 30,
      position: 7,
      videoUrl: null,
      isPreview: false,
      isLockedByDefault: false,
    }),
    lessonsRepository.create({
      courseId: fullstackCourse.id,
      courseModuleId: fullstackModuleTwo.id,
      title: "Введение в React",
      slug: "fullstack-react-intro",
      summary: "Первый взгляд на компонентный подход и JSX.",
      durationMinutes: 35,
      position: 8,
      videoUrl: null,
      isPreview: false,
      isLockedByDefault: true,
    }),
    lessonsRepository.create({
      courseId: pythonCourse.id,
      courseModuleId: pythonModuleOne.id,
      title: "Установка Python",
      slug: "python-installation",
      summary: "Готовим локальную среду и первый запуск Python.",
      durationMinutes: 10,
      position: 1,
      videoUrl: null,
      isPreview: true,
      isLockedByDefault: false,
    }),
    lessonsRepository.create({
      courseId: pythonCourse.id,
      courseModuleId: pythonModuleOne.id,
      title: "Первая программа",
      slug: "python-first-program",
      summary: "Пишем первый скрипт и разбираем print.",
      durationMinutes: 15,
      position: 2,
      videoUrl: null,
      isPreview: false,
      isLockedByDefault: false,
    }),
    lessonsRepository.create({
      courseId: pythonCourse.id,
      courseModuleId: pythonModuleOne.id,
      title: "Переменные и типы",
      slug: "python-types",
      summary: "Строки, числа, списки и словари.",
      durationMinutes: 20,
      position: 3,
      videoUrl: null,
      isPreview: false,
      isLockedByDefault: false,
    }),
    lessonsRepository.create({
      courseId: pythonCourse.id,
      courseModuleId: pythonModuleOne.id,
      title: "Условия и циклы",
      slug: "python-conditionals-loops",
      summary: "Учимся управлять потоком выполнения программы.",
      durationMinutes: 25,
      position: 4,
      videoUrl: null,
      isPreview: false,
      isLockedByDefault: false,
    }),
    lessonsRepository.create({
      courseId: dataScienceCourse.id,
      courseModuleId: dataModuleOne.id,
      title: "Что такое Data Science",
      slug: "ds-what-is-data-science",
      summary: "Понимаем роль аналитика и ML-инженера в команде.",
      durationMinutes: 20,
      position: 1,
      videoUrl: null,
      isPreview: true,
      isLockedByDefault: false,
    }),
    lessonsRepository.create({
      courseId: dataScienceCourse.id,
      courseModuleId: dataModuleOne.id,
      title: "Инструменты аналитика",
      slug: "ds-analyst-toolkit",
      summary: "NumPy, pandas и визуализация данных.",
      durationMinutes: 25,
      position: 2,
      videoUrl: null,
      isPreview: false,
      isLockedByDefault: false,
    }),
    lessonsRepository.create({
      courseId: dataScienceCourse.id,
      courseModuleId: dataModuleOne.id,
      title: "Pandas: обработка данных",
      slug: "ds-pandas-data-cleaning",
      summary: "Чистим и подготавливаем данные для анализа.",
      durationMinutes: 35,
      position: 3,
      videoUrl: null,
      isPreview: false,
      isLockedByDefault: false,
    }),
    lessonsRepository.create({
      courseId: dataScienceCourse.id,
      courseModuleId: dataModuleOne.id,
      title: "Первый ML пайплайн",
      slug: "ds-first-ml-pipeline",
      summary: "Собираем полный цикл от датасета до модели.",
      durationMinutes: 40,
      position: 4,
      videoUrl: null,
      isPreview: false,
      isLockedByDefault: true,
    }),
  ]);

  await resourcesRepository.save([
    resourcesRepository.create({
      courseId: fullstackCourse.id,
      title: "Конспект модуля 1",
      description: "PDF с основными тезисами по HTML и CSS.",
      type: ResourceType.PDF,
      fileUrl: "https://example.com/resources/fullstack-module-1.pdf",
      fileSizeLabel: "2.4 MB",
      position: 1,
    }),
    resourcesRepository.create({
      courseId: fullstackCourse.id,
      title: "Примеры кода",
      description: "Архив с практическими примерами из уроков.",
      type: ResourceType.ZIP,
      fileUrl: "https://example.com/resources/fullstack-examples.zip",
      fileSizeLabel: "1.8 MB",
      position: 2,
    }),
    resourcesRepository.create({
      courseId: pythonCourse.id,
      title: "Шпаргалка по Python",
      description: "Краткий PDF по синтаксису и основным конструкциям.",
      type: ResourceType.PDF,
      fileUrl: "https://example.com/resources/python-cheatsheet.pdf",
      fileSizeLabel: "1.2 MB",
      position: 1,
    }),
    resourcesRepository.create({
      courseId: dataScienceCourse.id,
      title: "Dataset для практики",
      description: "CSV-файл для самостоятельной отработки pandas.",
      type: ResourceType.LINK,
      fileUrl: "https://example.com/resources/datascience-dataset.csv",
      fileSizeLabel: null,
      position: 1,
    }),
  ]);

  const [fullstackEnrollment, pythonEnrollment, dataEnrollment] =
    await enrollmentsRepository.save([
      enrollmentsRepository.create({
        userId: studentUser.id,
        courseId: fullstackCourse.id,
        status: EnrollmentStatus.ACTIVE,
        progressPercent: 63,
        completedLessons: 5,
        totalLessons: 8,
        nextLessonTitle: "Функции в JavaScript",
        timeLeftLabel: "2 месяца",
        completedAt: null,
        lastActivityAt: new Date(),
      }),
      enrollmentsRepository.create({
        userId: studentUser.id,
        courseId: pythonCourse.id,
        status: EnrollmentStatus.COMPLETED,
        progressPercent: 100,
        completedLessons: 4,
        totalLessons: 4,
        nextLessonTitle: "Курс завершен",
        timeLeftLabel: "Завершен",
        completedAt: new Date(),
        lastActivityAt: new Date(),
      }),
      enrollmentsRepository.create({
        userId: studentUser.id,
        courseId: dataScienceCourse.id,
        status: EnrollmentStatus.ACTIVE,
        progressPercent: 25,
        completedLessons: 1,
        totalLessons: 4,
        nextLessonTitle: "Инструменты аналитика",
        timeLeftLabel: "6 месяцев",
        completedAt: null,
        lastActivityAt: new Date(),
      }),
    ]);

  const fullstackLessons = lessons.filter((lesson) => lesson.courseId === fullstackCourse.id);
  const pythonLessons = lessons.filter((lesson) => lesson.courseId === pythonCourse.id);
  const dataScienceLessons = lessons.filter((lesson) => lesson.courseId === dataScienceCourse.id);

  await lessonProgressRepository.save([
    ...fullstackLessons.map((lesson, index) =>
      lessonProgressRepository.create({
        enrollmentId: fullstackEnrollment.id,
        lessonId: lesson.id,
        isCompleted: index < 5,
        startedAt: new Date(),
        completedAt: index < 5 ? new Date() : null,
        watchSeconds: index < 5 ? lesson.durationMinutes * 60 : 0,
      }),
    ),
    ...pythonLessons.map((lesson) =>
      lessonProgressRepository.create({
        enrollmentId: pythonEnrollment.id,
        lessonId: lesson.id,
        isCompleted: true,
        startedAt: new Date(),
        completedAt: new Date(),
        watchSeconds: lesson.durationMinutes * 60,
      }),
    ),
    ...dataScienceLessons.map((lesson, index) =>
      lessonProgressRepository.create({
        enrollmentId: dataEnrollment.id,
        lessonId: lesson.id,
        isCompleted: index === 0,
        startedAt: new Date(),
        completedAt: index === 0 ? new Date() : null,
        watchSeconds: index === 0 ? lesson.durationMinutes * 60 : 0,
      }),
    ),
  ]);

  await achievementsRepository.save([
    achievementsRepository.create({
      userId: studentUser.id,
      title: "Первый курс",
      description: "Завершил первый курс",
      icon: "🏆",
      code: "first-course",
    }),
    achievementsRepository.create({
      userId: studentUser.id,
      title: "Неделя подряд",
      description: "7 дней активности",
      icon: "🔥",
      code: "weekly-streak",
    }),
    achievementsRepository.create({
      userId: studentUser.id,
      title: "100 уроков",
      description: "Пройдено 100 уроков",
      icon: "⭐",
      code: "one-hundred-lessons",
    }),
    achievementsRepository.create({
      userId: studentUser.id,
      title: "Отличник",
      description: "Все тесты на 90%+",
      icon: "💎",
      code: "high-score",
    }),
  ]);

  await activityRepository.save([
    activityRepository.create({
      userId: studentUser.id,
      courseId: fullstackCourse.id,
      type: ActivityType.LESSON_COMPLETED,
      title: 'Урок завершен: "CSS Flexbox"',
      description: "Завершен практический блок по layout-системам.",
    }),
    activityRepository.create({
      userId: studentUser.id,
      courseId: fullstackCourse.id,
      type: ActivityType.ACHIEVEMENT_UNLOCKED,
      title: 'Получено достижение: "100 уроков"',
      description: "Вы достигли отметки в 100 завершенных уроков.",
    }),
    activityRepository.create({
      userId: studentUser.id,
      courseId: dataScienceCourse.id,
      type: ActivityType.ENROLLED,
      title: 'Запись на курс: "Data Science & ML"',
      description: "Студент начал новый продвинутый трек.",
    }),
  ]);

  await studyPlanRepository.save([
    studyPlanRepository.create({
      userId: studentUser.id,
      courseId: fullstackCourse.id,
      weekday: "ПН",
      dayOfMonth: 17,
      title: "React Advanced Patterns",
      timeRangeLabel: "14:00 - 16:00",
    }),
    studyPlanRepository.create({
      userId: studentUser.id,
      courseId: dataScienceCourse.id,
      weekday: "СР",
      dayOfMonth: 19,
      title: "Node.js Backend",
      timeRangeLabel: "15:00 - 17:00",
    }),
  ]);

  await commentsRepository.save([
    commentsRepository.create({
      courseId: fullstackCourse.id,
      authorId: secondStudentUser.id,
      body: "Отличный курс! Все очень понятно объясняется. Особенно понравился модуль про React.",
    }),
    commentsRepository.create({
      courseId: fullstackCourse.id,
      authorId: studentUser.id,
      body: "Спасибо за курс! Уже использую эти знания в своем pet-проекте.",
    }),
    commentsRepository.create({
      courseId: pythonCourse.id,
      authorId: secondStudentUser.id,
      body: "Хороший старт для тех, кто вообще не писал код раньше.",
    }),
  ]);

  console.log("Seed completed successfully.");
  console.log(`Student login: ${studentUser.email} / password`);
  console.log(`Admin login: ${adminUser.email} / admin123`);

  await seedDataSource.destroy();
}

void run().catch(async (error) => {
  console.error("Seed failed:", error);

  if (seedDataSource.isInitialized) {
    await seedDataSource.destroy();
  }

  process.exit(1);
});
