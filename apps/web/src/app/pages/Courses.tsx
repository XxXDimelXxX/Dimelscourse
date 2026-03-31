import { useCallback, useMemo, useState } from "react";
import { Link, Navigate } from "react-router";
import { Search, BookOpen, Users, Star, SlidersHorizontal, Code2, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAsyncData } from "../hooks/useAsyncData";
import { fetchPublishedCourses, type CourseCard } from "../lib/lms-api";
import { levelLabel, levelBadgeClass } from "../lib/formatters";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?fit=max&fm=jpg&q=80&w=1080";

type SortOption = "newest" | "popular" | "price-asc" | "price-desc";

const sortFns: Record<SortOption, (a: CourseCard, b: CourseCard) => number> = {
  newest: () => 0, // API already returns newest first
  popular: (a, b) => b.studentsCount - a.studentsCount,
  "price-asc": (a, b) => a.priceUsd - b.priceUsd,
  "price-desc": (a, b) => b.priceUsd - a.priceUsd,
};

export function Courses() {
  const { user, logout } = useAuth();

  const fetcher = useCallback(() => fetchPublishedCourses(), []);
  const { data: courses, isLoading, error } = useAsyncData<CourseCard[]>(fetcher);

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const filtered = useMemo(() => {
    if (!courses) return [];

    let result = courses;

    // Search by title or author
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.instructorName?.toLowerCase().includes(q),
      );
    }

    // Filter by level
    if (levelFilter !== "all") {
      result = result.filter((c) => c.level === levelFilter);
    }

    // Sort
    const sortFn = sortFns[sort];
    if (sort !== "newest") {
      result = [...result].sort(sortFn);
    }

    return result;
  }, [courses, search, levelFilter, sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Code2 className="size-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dimel's School
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Мой дашборд</span>
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      {/* Title */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Каталог курсов
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Найдите курс, который подходит именно вам. Учитесь у практикующих
              разработчиков.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию или автору..."
              className="pl-10"
            />
          </div>

          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SlidersHorizontal className="size-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Уровень" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все уровни</SelectItem>
              <SelectItem value="beginner">Для начинающих</SelectItem>
              <SelectItem value="intermediate">Средний</SelectItem>
              <SelectItem value="advanced">Продвинутый</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Новые</SelectItem>
              <SelectItem value="popular">Популярные</SelectItem>
              <SelectItem value="price-asc">Сначала дешёвые</SelectItem>
              <SelectItem value="price-desc">Сначала дорогие</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[420px] rounded-xl border border-gray-200 bg-white animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Results count */}
        {courses && !isLoading && (
          <p className="text-sm text-gray-500 mb-4">
            {filtered.length === courses.length
              ? `${courses.length} курсов`
              : `Найдено ${filtered.length} из ${courses.length}`}
          </p>
        )}

        {/* Empty state */}
        {courses && !isLoading && filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 p-16 text-center">
            <BookOpen className="size-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Ничего не найдено
            </h3>
            <p className="text-gray-500">
              {search || levelFilter !== "all"
                ? "Попробуйте изменить параметры поиска"
                : "Курсы скоро появятся"}
            </p>
          </div>
        )}

        {/* Course grid */}
        {filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <CourseCardComponent key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCardComponent({ course }: { course: CourseCard }) {
  return (
    <Link
      to={`/course/${course.slug}`}
      className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-purple-200 transition group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={course.previewImageUrl ?? PLACEHOLDER_IMAGE}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div
          className={`absolute top-3 left-3 ${levelBadgeClass(course.level)} text-white px-3 py-1 rounded-full text-xs font-medium`}
        >
          {levelLabel(course.level)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {course.title}
        </h3>

        {course.instructorName && (
          <p className="text-sm text-purple-600 mb-2">{course.instructorName}</p>
        )}

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.summary}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          {course.rating > 0 && (
            <span className="flex items-center gap-1">
              <Star className="size-3.5 text-yellow-500 fill-yellow-500" />
              {Number(course.rating).toFixed(1)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {course.studentsCount}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="size-3.5" />
            {course.lessonCount} уроков
          </span>
          <span>{course.duration}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-xl font-bold text-gray-900">${course.priceUsd}</div>
          <span className="text-sm font-medium text-purple-600 group-hover:text-purple-700">
            Подробнее →
          </span>
        </div>
      </div>
    </Link>
  );
}
