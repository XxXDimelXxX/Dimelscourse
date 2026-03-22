import { createContext, useContext, useState, ReactNode } from "react";
import {
  clearAuthSession,
  getAuthSession,
  loginUser,
  registerUser,
  saveAuthSession,
  type AuthUser,
} from "../lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getAuthSession()?.user ?? null);

  const login = async (email: string, password: string) => {
    const session = await loginUser({ email, password });
    saveAuthSession(session);
    setUser(session.user);
  };

  const register = async (name: string, email: string, password: string) => {
    await registerUser({
      email,
      displayName: name,
      password,
    });
  };

  const logout = () => {
    clearAuthSession();
    setUser(null);
  };

  const refreshUser = () => {
    setUser(getAuthSession()?.user ?? null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        refreshUser,
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
