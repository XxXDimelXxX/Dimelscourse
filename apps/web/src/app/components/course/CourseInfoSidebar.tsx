import { Link } from "react-router";
import { Users, Clock, Star, Award, ShoppingCart } from "lucide-react";

interface CourseInfoSidebarProps {
  studentsCount: number;
  duration: string;
  rating: number;
  certificateAvailable: boolean;
  progress: {
    progressPercent: number;
    completedLessons: number;
    totalLessons: number;
  } | null;
}

export function CourseInfoSidebar({
  studentsCount,
  duration,
  rating,
  certificateAvailable,
  progress,
}: CourseInfoSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Информация о курсе</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Студентов</p>
              <p className="font-semibold text-gray-900">
                {studentsCount.toLocaleString("ru-RU")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Длительность</p>
              <p className="font-semibold text-gray-900">{duration}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="size-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Рейтинг</p>
              <p className="font-semibold text-gray-900">{rating} / 5.0</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Сертификат</p>
              <p className="font-semibold text-gray-900">
                {certificateAvailable ? "Да" : "По завершении"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {progress ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ваш прогресс</h3>
          <div className="text-4xl font-bold text-blue-600 mb-2">{progress.progressPercent}%</div>
          <p className="text-sm text-gray-600 mb-4">
            {progress.completedLessons} из {progress.totalLessons} уроков завершено
          </p>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress.progressPercent}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-bold mb-3">Доступ еще не открыт</h3>
          <p className="text-blue-100 mb-4">
            После оплаты доступ к урокам откроется автоматически через payment webhook.
          </p>
          <Link
            to="/purchase"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium"
          >
            <ShoppingCart className="size-4" />
            Перейти к оплате
          </Link>
        </div>
      )}
    </div>
  );
}
