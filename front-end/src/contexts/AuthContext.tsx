import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginRequest,
  saveAuth,
  getStoredToken,
  getStoredUser,
  clearAuth,
  type LoginResponse,
} from "@/services/api";

interface AuthUser {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);
  const [token, setToken] = useState<string | null>(getStoredToken);
  const navigate = useNavigate();

  const isAuthenticated = !!token && !!user;

  // Sync state if localStorage changes (e.g. another tab)
  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data: LoginResponse = await loginRequest(email, password);
    saveAuth(data.access_token, data.user);
    setToken(data.access_token);
    setUser(data.user);
    navigate("/");
  }, [navigate]);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
