import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { Plus, BookOpen, Eye, EyeOff, Users } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { CreateCourseModal } from "../../components/admin/CreateCourseModal";
import { useAsyncData } from "../../hooks/useAsyncData";
import { fetchAdminCourses, type AdminCourseListItem } from "../../lib/lms-api";

const levelLabels: Record<string, string> = {
  beginner: "Начинающий",
  intermediate: "Средний",
  advanced: "Продвинутый",
};

export function AdminCoursesList() {
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  const fetcher = useCallback(() => fetchAdminCourses(), []);
  const { data: courses, isLoading, error, reload } = useAsyncData<AdminCourseListItem[]>(fetcher);

  const handleCreated = (slug: string) => {
    reload();
    navigate(`/admin/courses/${slug}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Мои курсы</h1>
          <p className="text-gray-500 mt-1">
            Управление курсами и контентом
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="size-4 mr-2" />
          Создать курс
        </Button>
      </div>

      {isLoading && (
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      )}

      {courses && courses.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <BookOpen className="size-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Нет курсов
          </h3>
          <p className="text-gray-500 mb-4">
            Создайте свой первый курс, чтобы начать
          </p>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="size-4 mr-2" />
            Создать курс
          </Button>
        </div>
      )}

      {courses && courses.length > 0 && (
        <div className="grid gap-4">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => navigate(`/admin/courses/${course.slug}`)}
            />
          ))}
        </div>
      )}

      <CreateCourseModal
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreated={handleCreated}
      />
    </div>
  );
}

function CourseCard({
  course,
  onClick,
}: {
  course: AdminCourseListItem;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {course.title}
            </h3>
            {course.isPublished ? (
              <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                <Eye className="size-3 mr-1" />
                Опубликован
              </Badge>
            ) : (
              <Badge variant="secondary">
                <EyeOff className="size-3 mr-1" />
                Черновик
              </Badge>
            )}
          </div>
          <p className="text-gray-500 text-sm line-clamp-1 mb-3">
            {course.summary}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen className="size-4" />
              {course.lessonCount} уроков
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-4" />
              {course.studentsCount} студентов
            </span>
            <span>
              {levelLabels[course.level] ?? course.level}
            </span>
            {course.priceUsd > 0 && (
              <span className="font-medium text-gray-700">
                ${course.priceUsd}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
