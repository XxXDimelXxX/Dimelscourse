import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  fetchCurrentUser,
  getAuthSession,
  loginUser,
  logoutUser,
  patchStoredAuthUser,
  refreshAuthSession,
  registerUser,
  saveAuthSession,
  type AuthUser,
} from "../lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getAuthSession()?.user ?? null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void bootstrapAuth();
  }, []);

  const bootstrapAuth = async () => {
    const session = getAuthSession();

    if (!session) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await fetchCurrentUser();
      patchStoredAuthUser(currentUser);
      setUser(currentUser);
    } catch {
      const refreshedSession = await refreshAuthSession();
      setUser(refreshedSession?.user ?? null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const session = await loginUser({
      email: email.trim().toLowerCase(),
      password,
    });
    saveAuthSession(session);
    setUser(session.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const session = await registerUser({
      email: email.trim().toLowerCase(),
      displayName: name,
      password,
    });
    saveAuthSession(session);
    setUser(session.user);
  };

  const logout = () => {
    void logoutUser();
    setUser(null);
  };

  const refreshUser = async () => {
    const currentUser = await fetchCurrentUser();
    patchStoredAuthUser(currentUser);
    setUser(currentUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
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
