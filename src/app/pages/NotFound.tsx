import { Link } from "react-router";
import { Home, Search } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
          <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="size-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Страница не найдена
          </h1>
          <p className="text-gray-600 mb-8">
            Упс! Похоже, эта страница отправилась учить программирование и ещё не
            вернулась.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-medium"
        >
          <Home className="size-5" />
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
