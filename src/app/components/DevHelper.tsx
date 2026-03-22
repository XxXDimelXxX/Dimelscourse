import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Settings, X } from "lucide-react";

/**
 * Development helper component
 * Показывает текущее состояние пользователя и быстрые действия для тестирования
 * Удалить в продакшене!
 */
export function DevHelper() {
  const { user, grantAccess, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Скрыть в продакшене
  if (import.meta.env.PROD) {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 size-12 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition flex items-center justify-center z-50"
        title="Dev Helper"
      >
        <Settings className="size-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Dev Helper</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="size-4" />
        </button>
      </div>

      {user ? (
        <div className="space-y-3">
          <div className="text-sm">
            <div className="font-medium text-gray-700">User Info:</div>
            <div className="bg-gray-50 rounded p-2 mt-1 space-y-1 text-xs">
              <div>
                <span className="text-gray-500">Email:</span> {user.email}
              </div>
              <div>
                <span className="text-gray-500">Role:</span> {user.role}
              </div>
              <div>
                <span className="text-gray-500">Has Access:</span>{" "}
                {user.hasAccess ? "✅ Yes" : "❌ No"}
              </div>
              <div>
                <span className="text-gray-500">Progress:</span> {user.progress}%
              </div>
              <div>
                <span className="text-gray-500">Completed Lessons:</span>{" "}
                {user.completedLessons.length}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium text-gray-700 text-sm">Quick Actions:</div>
            {!user.hasAccess && (
              <button
                onClick={grantAccess}
                className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
              >
                Grant Course Access
              </button>
            )}
            <button
              onClick={logout}
              className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
            >
              Logout
            </button>
          </div>

          <div className="pt-3 border-t border-gray-200 text-xs text-gray-500">
            <div className="font-medium mb-1">Test Accounts:</div>
            <div>Admin: admin@test.com</div>
            <div>Student: user@test.com</div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-600">
          Not logged in. Go to home page to login.
        </div>
      )}
    </div>
  );
}
