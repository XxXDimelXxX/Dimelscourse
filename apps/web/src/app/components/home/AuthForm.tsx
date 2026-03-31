import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { getErrorMessage } from "../../lib/formatters";

interface AuthFormProps {
  isLoading: boolean;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
  onSuccess: () => void;
}

export function AuthForm({ isLoading, onLogin, onRegister, onSuccess }: AuthFormProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isLoginMode && password !== confirmPassword) {
      setErrorMessage("Пароли не совпадают");
      return;
    }

    try {
      setIsSubmitting(true);

      if (isLoginMode) {
        await onLogin(email, password);
      } else {
        await onRegister(displayName, email, password);
      }

      onSuccess();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Не удалось выполнить запрос"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setIsLoginMode(true)}
          className={`flex-1 py-2 px-4 rounded-md transition ${
            isLoginMode
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Вход
        </button>
        <button
          type="button"
          onClick={() => setIsLoginMode(false)}
          className={`flex-1 py-2 px-4 rounded-md transition ${
            !isLoginMode
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Регистрация
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLoginMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Ваше имя"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="••••••••"
          />
          <p className="mt-1 text-xs text-gray-500">Минимум 8 символов</p>
        </div>

        {!isLoginMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Подтвердите пароль
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>
        )}

        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <button
          type="button"
          disabled
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-400 cursor-not-allowed"
        >
          Google вход скоро появится
        </button>

        <p className="text-center text-xs text-gray-500">
          Аккаунт уже готов к нескольким способам входа: сейчас доступен `local`, позже подключим
          `google`.
        </p>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition flex items-center justify-center gap-2 group disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting || isLoading
            ? "Подождите..."
            : isLoginMode
              ? "Войти"
              : "Зарегистрироваться"}
          <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
        </button>
      </form>
    </div>
  );
}
