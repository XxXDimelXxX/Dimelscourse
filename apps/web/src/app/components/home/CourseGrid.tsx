import { Link } from "react-router";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { levelBadgeClass, levelLabel } from "../../lib/formatters";
import type { CourseCard } from "../../lib/lms-api";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?fit=max&fm=jpg&q=80&w=1080";

interface CourseGridProps {
  courses: CourseCard[];
  isLoading: boolean;
  error: string | null;
}

export function CourseGrid({ courses, isLoading, error }: CourseGridProps) {
  return (
    <section id="courses" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Программа MVP</h2>
          <p className="text-xl text-gray-600">
            Один курс, понятная покупка и быстрый путь к обучению
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-96 rounded-xl border border-gray-200 bg-gray-50 animate-pulse"
              />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
            В базе пока нет опубликованных курсов.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition group"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={course.previewImageUrl ?? PLACEHOLDER_IMAGE}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div
                    className={`absolute top-4 left-4 ${levelBadgeClass(course.level)} text-white px-3 py-1 rounded-full text-sm font-medium`}
                  >
                    {levelLabel(course.level)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.summary}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
                    <span>{course.lessonCount} уроков</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">${course.priceUsd}</div>
                      <div className="text-sm text-gray-500">
                        или ${course.subscriptionPriceUsd}/мес
                      </div>
                    </div>
                    <Link
                      to={`/course/${course.slug}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
