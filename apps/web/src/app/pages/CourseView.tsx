import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { PlayCircle, FileText, Download, ShoppingCart } from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import { LessonContent } from "../components/course/LessonContent";
import { CommentsSection } from "../components/course/CommentsSection";
import { CourseInfoSidebar } from "../components/course/CourseInfoSidebar";
import { LessonList } from "../components/course/LessonList";
import { useAuth } from "../context/AuthContext";
import { formatDurationMinutes, getErrorMessage } from "../lib/formatters";
import {
  completeLesson,
  fetchCourseComments,
  fetchCourseDetails,
  fetchCourseWorkspace,
  type CourseComment,
  type CourseDetailsResponse,
  type CourseWorkspaceResponse,
} from "../lib/lms-api";

export function CourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "lessons" | "resources">("lessons");
  const [courseDetails, setCourseDetails] = useState<CourseDetailsResponse | null>(null);
  const [courseWorkspace, setCourseWorkspace] = useState<CourseWorkspaceResponse | null>(null);
  const [comments, setComments] = useState<CourseComment[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompletingLesson, setIsCompletingLesson] = useState(false);

  const loadCourse = async (slug: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const [details, nextComments] = await Promise.all([
        fetchCourseDetails(slug),
        fetchCourseComments(slug),
      ]);

      setCourseDetails(details);
      setComments(nextComments);

      if (user) {
        try {
          const workspace = await fetchCourseWorkspace(slug);
          setCourseWorkspace(workspace);
        } catch {
          setCourseWorkspace(null);
        }
      } else {
        setCourseWorkspace(null);
      }

      const firstLessonId =
        details.modules
          .flatMap((module) => module.lessons)
          .sort((left, right) => left.position - right.position)[0]?.id ?? null;

      setActiveLessonId((current) => current ?? firstLessonId);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Не удалось загрузить курс"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!courseId) {
      navigate("/dashboard", { replace: true });
      return;
    }

    void loadCourse(courseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, navigate, user]);

  const course = courseWorkspace?.course ?? courseDetails;

  interface DisplayLesson {
    id: string;
    slug: string;
    title: string;
    summary: string | null;
    durationMinutes: number;
    durationLabel: string;
    position: number;
    completed: boolean;
    locked: boolean;
    completedAt?: string | null;
    videoUrl: string | null;
    content: string | null;
  }

  const modules = useMemo(() => {
    if (!course) {
      return [] as Array<{ id: string; title: string; position: number; lessons: DisplayLesson[] }>;
    }

    return course.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson): DisplayLesson => ({
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        summary: lesson.summary,
        durationMinutes: lesson.durationMinutes,
        durationLabel: formatDurationMinutes(lesson.durationMinutes),
        position: lesson.position,
        completed: "completed" in lesson ? lesson.completed : false,
        locked: "locked" in lesson ? lesson.locked : false,
        completedAt: "completedAt" in lesson ? lesson.completedAt : null,
        videoUrl: "videoUrl" in lesson ? lesson.videoUrl : null,
        content: "content" in lesson ? lesson.content : null,
      })),
    }));
  }, [course]);

  const allLessons = useMemo(
    () =>
      modules
        .flatMap((module) => module.lessons)
        .sort((left, right) => left.position - right.position),
    [modules],
  );

  const activeLesson =
    allLessons.find((lesson) => lesson.id === activeLessonId) ?? allLessons[0] ?? null;

  const progress = courseWorkspace?.enrollment ?? null;

  const handleCompleteLesson = async () => {
    if (!courseId || !user || !activeLesson || !courseWorkspace) {
      return;
    }

    try {
      setIsCompletingLesson(true);
      await completeLesson(courseId, activeLesson.id);
      await loadCourse(courseId);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Не удалось отметить урок"),
      );
    } finally {
      setIsCompletingLesson(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-16 rounded-xl bg-white border border-gray-100 animate-pulse" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[32rem] rounded-xl bg-white border border-gray-100 animate-pulse" />
            <div className="h-[32rem] rounded-xl bg-white border border-gray-100 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto rounded-xl border border-red-200 bg-red-50 px-6 py-5 text-red-700">
          {errorMessage ?? "Курс не найден"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        title={course.title}
        actions={
          progress ? (
            <button
              type="button"
              disabled={!activeLesson || isCompletingLesson}
              onClick={handleCompleteLesson}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-60"
            >
              {isCompletingLesson ? "Сохраняем..." : "Отметить урок"}
            </button>
          ) : (
            <Link
              to="/purchase"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
            >
              <ShoppingCart className="size-4" />
              Купить курс
            </Link>
          )
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
              {activeLesson?.videoUrl ? (
                <video
                  key={activeLesson.id}
                  src={activeLesson.videoUrl}
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-full object-contain"
                  playsInline
                />
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center size-20 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                    <PlayCircle className="size-10 text-white" />
                  </div>
                  <p className="text-white text-lg font-medium">
                    {activeLesson?.title ?? "Урок"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {activeLesson
                      ? formatDurationMinutes(activeLesson.durationMinutes)
                      : "Видео пока недоступно"}
                  </p>
                </div>
              )}
            </div>

            {activeLesson?.content && (
              <LessonContent content={activeLesson.content} />
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="border-b border-gray-200">
                <div className="flex gap-6 px-6">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-4 border-b-2 font-medium text-sm transition ${
                      activeTab === "overview"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Обзор
                  </button>
                  <button
                    onClick={() => setActiveTab("lessons")}
                    className={`py-4 border-b-2 font-medium text-sm transition ${
                      activeTab === "lessons"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Уроки
                  </button>
                  <button
                    onClick={() => setActiveTab("resources")}
                    className={`py-4 border-b-2 font-medium text-sm transition ${
                      activeTab === "resources"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Материалы
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">О курсе</h3>
                      <p className="text-gray-600">
                        {course.description ?? course.summary}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="rounded-lg border border-gray-200 p-4">
                        <div className="text-sm text-gray-500">Длительность</div>
                        <div className="mt-1 font-semibold text-gray-900">{course.duration}</div>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-4">
                        <div className="text-sm text-gray-500">Рейтинг</div>
                        <div className="mt-1 font-semibold text-gray-900">{course.rating} / 5.0</div>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-4">
                        <div className="text-sm text-gray-500">Студентов</div>
                        <div className="mt-1 font-semibold text-gray-900">{course.studentsCount.toLocaleString("ru-RU")}</div>
                      </div>
                    </div>

                    {course.instructor && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Преподаватель</h3>
                        <p className="text-gray-900 font-medium">{course.instructor.fullName}</p>
                        <p className="text-sm text-gray-500">{course.instructor.title}</p>
                        {course.instructor.bio && (
                          <p className="text-gray-600 mt-3">{course.instructor.bio}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "lessons" && (
                  <LessonList modules={modules} onSelectLesson={setActiveLessonId} />
                )}

                {activeTab === "resources" && (
                  <div className="space-y-3">
                    {course.resources.length ? (
                      course.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="size-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{resource.title}</p>
                              <p className="text-sm text-gray-500">
                                {resource.type.toUpperCase()} {resource.fileSizeLabel ? `• ${resource.fileSizeLabel}` : ""}
                              </p>
                            </div>
                          </div>
                          <a
                            href={resource.fileUrl ?? "#"}
                            className={`p-2 rounded-lg transition ${
                              resource.fileUrl ? "hover:bg-gray-200" : "opacity-40 pointer-events-none"
                            }`}
                          >
                            <Download className="size-5 text-gray-600" />
                          </a>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">Материалы пока не добавлены.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <CommentsSection
              courseSlug={courseId!}
              comments={comments}
              onCommentsUpdate={setComments}
              isAuthenticated={Boolean(user)}
              onError={setErrorMessage}
            />
          </div>

          <CourseInfoSidebar
            studentsCount={course.studentsCount}
            duration={course.duration}
            rating={course.rating}
            certificateAvailable={"certificateAvailable" in course && course.certificateAvailable}
            progress={progress}
          />
        </div>
      </div>
    </div>
  );
}
