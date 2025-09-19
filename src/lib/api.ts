// src/lib/api.ts
import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8184";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshBody {
  accessToken: string;
}
interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

const AUTH_ENDPOINTS = [
  "/v1/auth/sign-in",
  "/v1/auth/sign-out",
  "/v1/auth/refresh-token",
];

let refreshPromise: Promise<string> | null = null;

// --- Request: inyecta Authorization si hay token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // asegúrate de no pisar headers previos
    const headers = (config.headers ?? new AxiosHeaders()) as AxiosHeaders;
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
   
  }
  return config;
});
// ⬇️ Define el callback de sincronización en el módulo
let onAccessTokenRefresh: ((token: string) => void) | null = null;
// --- Response: intenta refresh en 401/419/440/498

export const setAccessTokenRefreshHandler = (handler: ((token: string) => void) | null) => {
  onAccessTokenRefresh = handler;
};

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = (originalRequest.url || "").toLowerCase();

    // No refrescar sobre endpoints de auth
    const isAuthEndpoint = AUTH_ENDPOINTS.some((p) => url.includes(p));

    // Estados típicos de token expirado
    const shouldTryRefresh =
      [401, 419, 440, 498].includes(status) &&
      !originalRequest._retry &&
      !isAuthEndpoint;

    if (!shouldTryRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = (async (): Promise<string> => {
          const res = await axiosInstance.get<
            ApiEnvelope<RefreshBody> | RefreshBody
          >("/v1/auth/refresh-token", { withCredentials: true });

          // soporta { data: { accessToken } } y { accessToken }
          const payload =
            (res.data as ApiEnvelope<RefreshBody>)?.data ??
            (res.data as RefreshBody);

          const newAccessToken = payload?.accessToken;
          if (!newAccessToken) {
            throw new Error("No new access token received");
          }

          // Persistimos y seteamos default header
          localStorage.setItem("token", newAccessToken);
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          if(onAccessTokenRefresh){
            onAccessTokenRefresh(newAccessToken)
          }
          return newAccessToken;
        })().finally(() => {
          refreshPromise = null;
        });
      }

      const token = await refreshPromise;

      // Reintenta con el token nuevo
    const retryHeaders = (originalRequest.headers ?? new AxiosHeaders()) as AxiosHeaders;
    retryHeaders.set("Authorization", `Bearer ${token}`)
    originalRequest.headers = retryHeaders;

      return axiosInstance(originalRequest);
    } catch (refreshErr) {
      console.error("Token refresh failed", refreshErr);
      // Limpieza + redirección (opcional: aquí podrías llamar a un logout() central)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
      return Promise.reject(refreshErr);
    }
  }
);

export default axiosInstance;