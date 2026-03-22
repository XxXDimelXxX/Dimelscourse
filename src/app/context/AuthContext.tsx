import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "student" | "admin" | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hasAccess: boolean; // доступ к курсу
  currentLesson: number; // индекс текущего урока
  completedLessons: number[]; // массив индексов завершенных уроков
  progress: number; // процент прогресса
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (name: string, email: string, password: string) => void;
  grantAccess: () => void; // выдача доступа после оплаты
  completeLesson: (lessonIndex: number) => void;
  updateCurrentLesson: (lessonIndex: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Проверяем localStorage для персистентности
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return null;
  });

  const login = (email: string, password: string) => {
    // Mock login - в реальности здесь будет API вызов
    // Для демо: admin@test.com = admin, остальные = student
    const isAdmin = email === "admin@test.com";
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
      role: isAdmin ? "admin" : "student",
      hasAccess: isAdmin, // админ всегда имеет доступ
      currentLesson: 0,
      completedLessons: [],
      progress: 0,
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const register = (name: string, email: string, password: string) => {
    // Mock register
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: "student",
      hasAccess: false, // по умолчанию нет доступа
      currentLesson: 0,
      completedLessons: [],
      progress: 0,
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const grantAccess = () => {
    if (user) {
      const updatedUser = { ...user, hasAccess: true };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const completeLesson = (lessonIndex: number) => {
    if (user && !user.completedLessons.includes(lessonIndex)) {
      const completedLessons = [...user.completedLessons, lessonIndex];
      const totalLessons = 16; // всего уроков в курсе
      const progress = Math.round((completedLessons.length / totalLessons) * 100);
      
      const updatedUser = {
        ...user,
        completedLessons,
        progress,
        currentLesson: lessonIndex + 1, // переходим к следующему
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const updateCurrentLesson = (lessonIndex: number) => {
    if (user) {
      const updatedUser = { ...user, currentLesson: lessonIndex };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        grantAccess,
        completeLesson,
        updateCurrentLesson,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
