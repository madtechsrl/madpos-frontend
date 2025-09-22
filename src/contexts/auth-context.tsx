// src/contexts/auth-context.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,  
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import type { CreateUserRequest, User } from "../types/User";
import { mapRoleToUuid, ROLES, type RoleUuid, type RoleKey } from "../types/roles";
import { loginAPI } from "../services/auth-service";
import { createUser } from "../services/user-service";
import axiosInstance from "../lib/api";
// import {
//   AxiosError,
//   AxiosHeaders,
//   type InternalAxiosRequestConfig,
//   type AxiosResponse,
// } from "axios";

// ---------- Helpers de rol ----------
const ROLE_UUIDS = Object.values(ROLES) as RoleUuid[];
const ROLE_KEYS = Object.keys(ROLES) as RoleKey[];

function isRoleUuid(v: string): v is RoleUuid {
  return (ROLE_UUIDS as string[]).includes(v);
}

function normalizeRoleUuid(input?: string): RoleUuid {
  if (!input) return ROLES.CASHIER;
  const mapped = mapRoleToUuid(input);
  if (typeof mapped === "string" && isRoleUuid(mapped)) return mapped;
  const upper = input.toUpperCase();
  if ((ROLE_KEYS as string[]).includes(upper)) return ROLES[upper as RoleKey];
  return ROLES.CASHIER;
}

// ---------- Tipos ----------
export interface AuthState {
  accessToken: string | null;
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: RoleUuid | null;
  token: string | null; // alias de compat
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  setToken: (token: string | null) => void;

  loginUser: (email: string, password: string) => void;
  register: (
    fullname: string,
    email: string,
    password: string,
    role: RoleUuid,
    enabled: boolean
  ) => Promise<boolean>;
  logout: () => void;

  hasPermission: (requiredRole: RoleUuid | RoleUuid[]) => boolean;
  getAccessToken: () => string | null;
};

// type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// interface RefreshBody {
//   accessToken: string;
// }
// interface ApiEnvelope<T> {
//   data: T;
//   message?: string;
// }
// interface ApiErrorResponse {
//   message?: string;
// }

// ---------- Contexto ----------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [auth, setAuth] = useState<AuthState>({ accessToken: null });
  const [token, setToken] = useState<string | null>(null); // alias de compat
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Carga inicial
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    try {
      if (storedUser && storedToken) {
        const parsed: User = JSON.parse(storedUser);
        const roleUuid = normalizeRoleUuid(parsed.role as string);
        setUser({ ...parsed, role: roleUuid });
        setAuth({ accessToken: storedToken });
        setToken(storedToken);
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout estable
  const logout = useCallback((): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAuth({ accessToken: null });
    delete axiosInstance.defaults.headers.common["Authorization"];
    document.cookie = "auth-token=; path=/; max-age=0";
    document.cookie = "user-role=; path=/; max-age=0";
    navigate("/");
  }, [navigate]);

  // ---- Función interna para REFRESH (no usa useAuth)


  // ---- Interceptores in-place (una sola vez)
  // const initializedRef = useRef(false);
  // const refreshPromiseRef = useRef<Promise<string> | null>(null);

  // useEffect(() => {
  //   if (initializedRef.current) return;
  //   initializedRef.current = true;

  //      axiosInstance.interceptors.response.use(
  //     (res: AxiosResponse) => res,
  //     (error: AxiosError<ApiErrorResponse | string>) => {
  //       const handle = async () => {
  //         const original = error.config as RetriableConfig | undefined;
  //         if (!error.response || !original) throw error;

  //         const status = error.response.status;
  //         const url = (original.url ?? "").toLowerCase();

  //         const isAuthEndpoint =
  //           url.includes("/v1/auth/sign-in") ||
  //           url.includes("/v1/auth/sign-out") ||
  //           url.includes("/v1/auth/refresh-token");

  //         const raw = error.response.data;
  //         const msg =
  //           typeof raw === "string"
  //             ? raw.toLowerCase()
  //             : (raw?.message ?? "").toLowerCase();

  //         const isTokenExpired500 =
  //           status === 500 &&
  //           (msg.includes("jwt expired") ||
  //             msg.includes("token expired") ||
  //             msg.includes("expired"));

  //         const isTokenStatus = status === 401 || status === 419 || status === 440 || status === 498;

  //         const shouldRefresh =
  //           !original._retry && !isAuthEndpoint && (isTokenStatus || isTokenExpired500);

  //         if (!shouldRefresh) throw error;

  //         original._retry = true;

  //         try {
  //           if (!refreshPromiseRef.current) {
  //             refreshPromiseRef.current = (async () => {
  //               const newToken = await refreshAccessToken();
  //               return newToken;
  //             })().finally(() => {
  //               refreshPromiseRef.current = null;
  //             });
  //           }

  //           const newToken = await refreshPromiseRef.current;

  //           const retryHeaders = (original.headers ?? new AxiosHeaders()) as AxiosHeaders;
  //           retryHeaders.set("Authorization", `Bearer ${newToken}`);
  //           original.headers = retryHeaders;

  //           return axiosInstance(original);
  //         } catch (e) {
  //           logout();
  //           throw e;
  //         }
  //       };

  //       return handle();
  //     }
  //   );
  // }, [auth.accessToken, refreshAccessToken, logout]);

  // Register
  const register = async (
    fullname: string,
    email: string,
    password: string,
    role: RoleUuid,
    enabled: boolean
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const payload: CreateUserRequest = { fullname, email, password, role, enabled };
      const createdUser = await createUser(payload);
      return !!createdUser;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  type LoginResponse = {
    accessToken: string;
    id: string;
    email: string;
    fullname: string;
    role: string;
    createdAt: string;
  };

  const loginUser = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = (await loginAPI(email, password)) as LoginResponse;

      const roleCode = normalizeRoleUuid(response.role);
      const accessToken = response.accessToken;

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        setAuth({ accessToken });
        setToken(accessToken);
      }

      const userObj: User = {
        id: response.id,
        fullname: response.fullname,
        email: response.email,
        password: "",
        role: roleCode,
        enabled: true,
        createdAt: response.createdAt ?? "",
        updatedAt: response.createdAt ?? "",
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
      navigate("/home");
    } catch (e) {
      console.error("Login error:", e);
      setIsLoading(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Permisos
  const hasPermission = (requireRole: RoleUuid | RoleUuid[]): boolean => {
    const current = user?.role ? normalizeRoleUuid(user.role) : null;
    if (!current) return false;
    return Array.isArray(requireRole)
      ? requireRole.includes(current)
      : current === requireRole;
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        user,
        isLoading,
        isAuthenticated: !!user,
        userRole: user?.role ? normalizeRoleUuid(user.role) : null,
        loginUser,
        logout,
        register,
        hasPermission,
        token: auth.accessToken,
        setToken,
        getAccessToken: () => auth.accessToken,
      }}
    >
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
