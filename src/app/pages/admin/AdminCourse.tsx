import { useEffect, useMemo, useState } from "react";
import {
  Edit2,
  Save,
  X,
  BookOpen,
  PlayCircle,
} from "lucide-react";
import {
  fetchAdminCourse,
  updateAdminCourse,
  type AdminCourseResponse,
} from "../../lib/lms-api";

const COURSE_SLUG = "fullstack-web-dev";

export function AdminCourse() {
  const [isEditing, setIsEditing] = useState(false);
  const [course, setCourse] = useState<AdminCourseResponse | null>(null);
  const [formState, setFormState] = useState({
    title: "",
    instructorName: "",
    priceUsd: 0,
    subscriptionPriceUsd: 0,
    description: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void loadCourse();
  }, []);

  const loadCourse = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      const nextCourse = await fetchAdminCourse(COURSE_SLUG);
      setCourse(nextCourse);
      setFormState({
        title: nextCourse.title,
        instructorName: nextCourse.instructorName,
        priceUsd: nextCourse.priceUsd,
        subscriptionPriceUsd: nextCourse.subscriptionPriceUsd,
        description: nextCourse.description ?? "",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Не удалось загрузить курс",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const totalLessons = useMemo(
    () => course?.modules.reduce((acc, module) => acc + module.lessons.length, 0) ?? 0,
    [course],
  );

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      const updatedCourse = await updateAdminCourse(COURSE_SLUG, formState);
      setCourse(updatedCourse);
      setFormState({
        title: updatedCourse.title,
        instructorName: updatedCourse.instructorName,
        priceUsd: updatedCourse.priceUsd,
        subscriptionPriceUsd: updatedCourse.subscriptionPriceUsd,
        description: updatedCourse.description ?? "",
      });
      setIsEditing(false);
      setSuccessMessage("Изменения сохранены");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Не удалось сохранить курс",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-16 rounded-xl bg-white border border-gray-100 animate-pulse" />
        <div className="h-80 rounded-xl bg-white border border-gray-100 animate-pulse" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
        {errorMessage ?? "Курс не найден"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Управление курсом
          </h1>
          <p className="text-gray-600">
            Редактирование структуры и содержания курса
          </p>
        </div>
        <button
          onClick={() => {
            setIsEditing((value) => !value);
            setSuccessMessage(null);
          }}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            isEditing
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isEditing ? (
            <>
              <X className="size-4 inline mr-2" />
              Отменить
            </>
          ) : (
            <>
              <Edit2 className="size-4 inline mr-2" />
              Режим редактирования
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Информация о курсе
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название курса
            </label>
            <input
              type="text"
              value={formState.title}
              disabled={!isEditing}
              onChange={(event) =>
                setFormState((current) => ({ ...current, title: event.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Преподаватель
            </label>
            <input
              type="text"
              value={formState.instructorName}
              disabled={!isEditing}
              onChange={(event) =>
                setFormState((current) => ({ ...current, instructorName: event.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Цена (разовая)
            </label>
            <input
              type="number"
              value={formState.priceUsd}
              disabled={!isEditing}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  priceUsd: Number(event.target.value || 0),
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Цена (подписка/мес)
            </label>
            <input
              type="number"
              value={formState.subscriptionPriceUsd}
              disabled={!isEditing}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  subscriptionPriceUsd: Number(event.target.value || 0),
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание курса
            </label>
            <textarea
              value={formState.description}
              disabled={!isEditing}
              rows={3}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500 resize-none"
            />
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-60"
            >
              <Save className="size-4 inline mr-2" />
              {isSaving ? "Сохраняем..." : "Сохранить изменения"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormState({
                  title: course.title,
                  instructorName: course.instructorName,
                  priceUsd: course.priceUsd,
                  subscriptionPriceUsd: course.subscriptionPriceUsd,
                  description: course.description ?? "",
                });
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Отмена
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Структура курса
        </h2>

        <div className="space-y-4">
          {course.modules.map((module) => (
            <div
              key={module.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-gray-50 p-4 flex items-center gap-3 border-b border-gray-200">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="size-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {module.lessons.length} уроков
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-4 flex items-center gap-3 hover:bg-gray-50 transition"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <PlayCircle className="size-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {lesson.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {lesson.description}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {lesson.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Статистика курса
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {course.modules.length}
            </div>
            <div className="text-sm text-gray-600">Модулей в курсе</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {totalLessons}
            </div>
            <div className="text-sm text-gray-600">Всего уроков</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ~{course.duration}
            </div>
            <div className="text-sm text-gray-600">Длительность</div>
          </div>
        </div>
      </div>
    </div>
  );
}
