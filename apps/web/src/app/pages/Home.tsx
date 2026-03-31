import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BookOpen, Code2, Users, Award, CheckCircle } from "lucide-react";
import { PublicHeader } from "../components/PublicHeader";
import { AuthForm } from "../components/home/AuthForm";
import { CourseGrid } from "../components/home/CourseGrid";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/formatters";
import { fetchPublishedCourses, type CourseCard } from "../lib/lms-api";

export function Home() {
  const { user, isLoading, login, register } = useAuth();
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user) {
      navigate("/dashboard", { replace: true });
      return;
    }

    void loadCourses();
  }, [isLoading, navigate, user]);

  const loadCourses = async () => {
    try {
      setIsLoadingCourses(true);
      setCoursesError(null);
      const nextCourses = await fetchPublishedCourses();
      setCourses(nextCourses);
    } catch (error) {
      setCoursesError(getErrorMessage(error, "Не удалось загрузить курсы"));
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Show nothing while auth is bootstrapping to prevent flash of login form
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Code2 className="size-10 text-blue-600 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <PublicHeader />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              🚀 Начни карьеру в IT
            </div>
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              Освой программирование с нуля
            </h2>
            <p className="text-xl text-gray-600">
              Практические курсы по веб-разработке, созданные экспертами индустрии. Получи
              востребованную профессию за 6 месяцев.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen className="size-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">1 основной курс</div>
                  <div className="text-sm text-gray-600">MVP без лишнего шума</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="size-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">10,000+ студентов</div>
                  <div className="text-sm text-gray-600">Активное сообщество</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <Award className="size-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Сертификаты</div>
                  <div className="text-sm text-gray-600">После завершения</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="size-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="size-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Поддержка 24/7</div>
                  <div className="text-sm text-gray-600">Менторы онлайн</div>
                </div>
              </div>
            </div>
          </div>

          <AuthForm
            isLoading={isLoading}
            onLogin={login}
            onRegister={register}
            onSuccess={() => navigate("/dashboard")}
          />
        </div>
      </section>

      <CourseGrid courses={courses} isLoading={isLoadingCourses} error={coursesError} />
    </div>
  );
}
